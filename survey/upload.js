/*
 * Sends the survey's data to the REDCap bridge (the small program in worker/).
 *
 * This replaces minno-datapipe, which uploaded to OSF via DataPipe. OSF Projects are being
 * retired (read-only from 19 February 2027), so the data now goes to the study's REDCap.
 *
 * Nothing secret lives here. This file runs in the participant's browser, so anyone can read
 * it; the REDCap token is held by the bridge, which the browser only ever talks to over HTTPS.
 *
 * Two uploads happen per participant:
 *   'trials'   - the full trial-by-trial CSV plus a few summary values, after the IAT
 *   'withdraw' - the answer to the withdrawal question, after the final page
 */
define([], function () {

    function init(API, options) {
        var endpoint = options.endpoint;
        var params = options.params || {};
        var uploadFor = options.tasks || {};          // {minno task name: 'trials' | 'withdraw'}
        var attempts = options.attempts || 3;

        var urlParams = new URLSearchParams(window.location.search);
        var sessionId = Date.now().toString(16) + Math.floor(Math.random() * 10000).toString(16);
        var global = API.getGlobal();

        global.sessionId = sessionId;
        // kind -> 'sent' | 'failed'. Deliberately NOT named after any task: minno keeps its
        // own slot at global.<task name>, which would overwrite a flag sharing that name.
        global.uploadResults = {};

        // Lets the failure page offer the participant a copy of their own data.
        window.__iatDownloadData = function () {
            var pending = global.pendingDownload;
            if (!pending) return;
            var url = URL.createObjectURL(new Blob([pending.csv], {type: 'text/csv'}));
            var link = document.createElement('a');
            link.href = url;
            link.download = pending.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        };

        API.addSettings('logger', {
            onRow: function (name, row, settings, meta) {
                if (name === API.script.name) {
                    meta.logs = [];
                    meta.type = 'anonymous manager';
                    return;
                }
                meta.type = 'task';
                row.sessionId = sessionId;
                urlParams.forEach(function (value, key) { row[key] = value; });
                for (var key in params) row[key] = params[key];
                if (!meta.logs) meta.logs = [];
                meta.logs.push(row);
            },

            onEnd: function (name, rows, meta) { return meta.logs; },

            serialize: function (name, rows) { return rows; },

            send: function (name, rows, settings, meta) {
                if (!meta || meta.type !== 'task') return;
                var kind = uploadFor[name];
                if (!kind || !rows || !rows.length) return;
                return send(kind, rows);
            }
        });

        function send(kind, rows) {
            var payload = {
                kind: kind,
                pid: global.redcap_pid,
                lang: global.lang,
                sessionId: sessionId,
                summary: {}
            };

            if (kind === 'withdraw') {
                payload.summary.withdraw_choice = global.withdraw_choice;
            } else {
                payload.csv = toCsv(rows);
                payload.summary = {
                    d: lastValue(rows, 'd'),
                    feedback: lastValue(rows, 'feedback'),
                    block3Cond: lastValue(rows, 'block3Cond'),
                    isTouch: !!global.$isTouch,
                    completedAt: new Date().toISOString()
                };
                global.pendingDownload = {
                    filename: 'iat_' + payload.pid + '_' + payload.lang + '_' + sessionId + '.csv',
                    csv: payload.csv
                };
            }

            return post(payload, attempts).then(
                function () { global.uploadResults[kind] = 'sent'; },
                function (error) {
                    global.uploadResults[kind] = 'failed';
                    global.uploadError = String(error && error.message || error);
                }
            );
        }

        function post(payload, left) {
            return fetch(endpoint, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            }).then(
                function (response) {
                    if (response.ok) return true;
                    // A 4xx means this request is wrong and will stay wrong; only retry 5xx.
                    if (response.status < 500 || left <= 1) throw new Error('HTTP ' + response.status);
                    return again(payload, left);
                },
                function (networkError) {
                    if (left <= 1) throw networkError;
                    return again(payload, left);
                }
            );
        }

        function again(payload, left) {
            var wait = (attempts - left + 1) * 1000;
            return new Promise(function (resolve) { setTimeout(resolve, wait); })
                .then(function () { return post(payload, left - 1); });
        }
    }

    /**
     * The "please wait" page. It watches for the upload to finish and then moves on by itself;
     * whether the upload succeeded is decided by the page that follows.
     * `expects` is the upload it should wait for ('trials' or 'withdraw').
     */
    function uploadingTask(options) {
        var expects = options.expects ? "'" + options.expects + "'" : 'null';

        var watcher =
            '<% (function () {' +
            '    var expects = ' + expects + ';' +
            '    var giveUpAt = Date.now() + 60000;' +
            '    function check() {' +
            '        var button = document.getElementById("upload_next");' +
            '        var done = !expects || global.uploadResults[expects];' +
            '        if (button && !done && Date.now() > giveUpAt) {' +
            '            global.uploadResults[expects] = "failed";' +
            '            done = true;' +
            '        }' +
            '        if (button && done) { button.click(); return; }' +
            '        setTimeout(check, 300);' +
            '    }' +
            '    check();' +
            '}()); %>';

        return [{
            type: 'message',
            name: options.name || 'uploading',
            title: options.title || '',
            buttonHide: true,
            template: watcher + panel(options.header) +
                '<div class="panel-body"><p class="lead">' + options.body + '</p>' +
                '<div class="text-center proceed" hidden style="margin: 30px auto 10px;">' +
                '<button pi-message-done type="button" id="upload_next" class="btn btn-primary"></button>' +
                '</div></div>'
        }];
    }

    /**
     * Shown only when the upload could not be saved. It ends the study rather than sending the
     * participant on, and offers them a copy of their data so nothing is silently lost.
     */
    function failureTask(options) {
        var contact = options.contactEmail
            ? '<p>' + options.contactHelp + ' <a href="mailto:' + options.contactEmail + '">' +
              options.contactEmail + '</a></p>'
            : '';

        return [{
            type: 'message',
            name: options.name || 'uploadProblem',
            title: options.title || '',
            last: true,
            buttonHide: true,
            template: panel(options.header) +
                '<div class="panel-body"><p class="lead">' + options.body + '</p>' +
                contact +
                '<div class="text-center" style="margin: 30px auto 10px;">' +
                '<button type="button" class="btn btn-primary" onclick="window.__iatDownloadData()">' +
                options.downloadText + '</button></div></div>'
        }];
    }

    /** A dead end for a participant whose link is missing its `pid`. */
    function blockedTask(options) {
        return [{
            type: 'message',
            name: options.name || 'blocked',
            title: options.title || '',
            last: true,
            buttonHide: true,
            template: panel(options.header) +
                '<div class="panel-body"><p class="lead">' + options.body + '</p></div>'
        }];
    }

    function panel(header) {
        return '<div class="panel panel-info" style="margin-top:1em">' +
            '<div class="panel-heading"><h1 class="panel-title" style="font-size:2em">' +
            header + '</h1></div></div>';
    }

    /* ---- turning minno's log rows into a CSV ------------------------------------------- */

    /**
     * Nested values become dotted column names, e.g. {data:{score:1}} -> "data.score".
     * A "0" key is left out of the name, so minno's single-item arrays give "stimuli"
     * rather than "stimuli.0". This matches the column names DataPipe produced, so
     * analysis scripts written for that output still work.
     */
    function flatten(value, prefix, out) {
        if (value === null || value === undefined || typeof value !== 'object') {
            out[prefix] = value;
            return;
        }
        for (var key in value) {
            var name = (key === '0') ? prefix : (prefix ? prefix + '.' + key : key);
            flatten(value[key], name, out);
        }
    }

    function cell(value) {
        if (value === undefined || value === null) return '';
        var text = String(value);
        return /[",\n\r]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
    }

    function toCsv(rows) {
        var columns = [];
        var seen = {};

        var flatRows = rows.map(function (row) {
            var flat = {};
            flatten(row, '', flat);
            for (var key in flat) {
                if (!seen[key]) { seen[key] = true; columns.push(key); }
            }
            return flat;
        });

        var lines = [columns.map(cell).join(',')];
        flatRows.forEach(function (row) {
            lines.push(columns.map(function (column) { return cell(row[column]); }).join(','));
        });
        return lines.join('\n');
    }

    /** The IAT writes its score onto the last rows only, so search from the end. */
    function lastValue(rows, key) {
        for (var i = rows.length - 1; i >= 0; i--) {
            if (rows[i][key] !== undefined && rows[i][key] !== '') return rows[i][key];
        }
        return '';
    }

    return {
        init: init,
        uploadingTask: uploadingTask,
        failureTask: failureTask,
        blockedTask: blockedTask,
        toCsv: toCsv          // exposed so it can be tested on its own
    };
});
