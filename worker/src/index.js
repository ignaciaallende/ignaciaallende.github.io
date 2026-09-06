/*
 * The middleman between the survey and REDCap.
 *
 * The survey runs in the participant's browser, so it cannot hold the REDCap API token —
 * anyone taking the survey could read it and get into the project. Instead the survey POSTs
 * its data here, and this Worker adds the token and passes the data to REDCap. The token is
 * stored as a Cloudflare secret and never reaches the browser.
 *
 * See README.md in this folder for setup.
 *
 * This endpoint is reachable by anyone, as any endpoint a browser can use must be. The checks
 * below keep the damage to "someone could add junk rows"; the important protection is that the
 * REDCap token belongs to an account with import rights only, so it cannot read data back out.
 */

// These must match the field names in your REDCap project.
const FIELDS = {
    dataFile:    'iat_data_file',
    dScore:      'iat_d_score',
    feedback:    'iat_feedback',
    block3Cond:  'iat_block3cond',
    lang:        'iat_lang',
    isTouch:     'iat_is_touch',
    sessionId:   'iat_session_id',
    completedAt: 'iat_completed_at',
    withdraw:    'iat_withdraw'
};

// Only these pages may send data here.
const ALLOWED_ORIGINS = [
    'https://ignaciaallende.github.io',
    'http://localhost:8000',
    'http://127.0.0.1:8000'
];

const LANGS = ['en', 'de', 'no'];
const PID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const SESSION_PATTERN = /^[A-Za-z0-9]{1,40}$/;
const MAX_BODY_BYTES = 2 * 1024 * 1024;

export default {
    async fetch(request, env) {
        const cors = corsHeadersFor(request.headers.get('Origin'));

        if (request.method === 'OPTIONS') {
            return cors
                ? new Response(null, {status: 204, headers: cors})
                : new Response(null, {status: 403});
        }
        if (!cors) return reply({error: 'origin_not_allowed'}, 403, {});
        if (request.method !== 'POST') return reply({error: 'method_not_allowed'}, 405, cors);
        if (new URL(request.url).pathname !== '/iat') return reply({error: 'not_found'}, 404, cors);

        const declared = Number(request.headers.get('Content-Length') || 0);
        if (declared > MAX_BODY_BYTES) return reply({error: 'too_large'}, 413, cors);

        const raw = await request.text();
        if (raw.length > MAX_BODY_BYTES) return reply({error: 'too_large'}, 413, cors);

        let body;
        try {
            body = JSON.parse(raw);
        } catch (e) {
            return reply({error: 'invalid_json'}, 400, cors);
        }

        const problem = validate(body);
        if (problem) return reply({error: problem}, 400, cors);

        // Lets the whole chain be tested before a REDCap token exists.
        if (env.DRY_RUN === 'true') {
            return reply({ok: true, dryRun: true, kind: body.kind}, 200, cors);
        }

        try {
            await sendToRedcap(body, env);
        } catch (e) {
            // Deliberately vague: REDCap's own error text never goes back to the browser.
            console.log('REDCap import failed:', e && e.message);
            return reply({error: 'redcap_failed'}, 502, cors);
        }

        return reply({ok: true, kind: body.kind}, 200, cors);
    }
};

function corsHeadersFor(origin) {
    if (!origin || ALLOWED_ORIGINS.indexOf(origin) === -1) return null;
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin'
    };
}

function reply(payload, status, cors) {
    return new Response(JSON.stringify(payload), {
        status: status,
        headers: Object.assign({'Content-Type': 'application/json'}, cors)
    });
}

// Everything is checked before REDCap is contacted at all.
function validate(body) {
    if (!body || typeof body !== 'object') return 'invalid_body';
    if (body.kind !== 'trials' && body.kind !== 'withdraw') return 'invalid_kind';
    if (typeof body.pid !== 'string' || !PID_PATTERN.test(body.pid)) return 'invalid_pid';
    if (LANGS.indexOf(body.lang) === -1) return 'invalid_lang';
    if (typeof body.sessionId !== 'string' || !SESSION_PATTERN.test(body.sessionId)) return 'invalid_session';
    if (body.summary && typeof body.summary !== 'object') return 'invalid_summary';

    if (body.kind === 'trials') {
        if (typeof body.csv !== 'string' || body.csv.length === 0) return 'missing_csv';
    }
    if (body.kind === 'withdraw') {
        const choice = body.summary && body.summary.withdraw_choice;
        if (choice !== 'yes' && choice !== 'no') return 'invalid_withdraw';
    }
    return null;
}

async function sendToRedcap(body, env) {
    const summary = body.summary || {};
    const record = {};
    record[env.REDCAP_RECORD_ID_FIELD || 'record_id'] = body.pid;

    // Longitudinal projects need the event name on every write.
    if (env.REDCAP_EVENT) record.redcap_event_name = env.REDCAP_EVENT;

    if (body.kind === 'withdraw') {
        record[FIELDS.withdraw] = summary.withdraw_choice;
        await importRecord(record, env);
        return;
    }

    record[FIELDS.lang] = body.lang;
    record[FIELDS.sessionId] = body.sessionId;
    record[FIELDS.dScore] = str(summary.d);
    record[FIELDS.feedback] = str(summary.feedback);
    record[FIELDS.block3Cond] = str(summary.block3Cond);
    record[FIELDS.isTouch] = summary.isTouch ? '1' : '0';
    record[FIELDS.completedAt] = str(summary.completedAt);

    // The record import runs first because it creates the record if it does not yet exist;
    // attaching a file to a record that does not exist fails.
    await importRecord(record, env);
    await importFile(body, env);
}

function str(value) {
    return (value === undefined || value === null) ? '' : String(value);
}

async function importRecord(record, env) {
    const form = new URLSearchParams();
    form.set('token', env.REDCAP_API_TOKEN);
    form.set('content', 'record');
    form.set('action', 'import');
    form.set('format', 'json');
    form.set('type', 'flat');
    form.set('overwriteBehavior', 'normal');
    form.set('returnContent', 'count');
    form.set('returnFormat', 'json');
    form.set('data', JSON.stringify([record]));

    const response = await fetch(env.REDCAP_API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: form.toString()
    });

    if (!response.ok) {
        throw new Error('record import returned ' + response.status + ': ' + (await response.text()).slice(0, 300));
    }
}

async function importFile(body, env) {
    const form = new FormData();
    form.set('token', env.REDCAP_API_TOKEN);
    form.set('content', 'file');
    form.set('action', 'import');
    form.set('record', body.pid);
    form.set('field', FIELDS.dataFile);
    form.set('returnFormat', 'json');
    if (env.REDCAP_EVENT) form.set('event', env.REDCAP_EVENT);

    const filename = 'iat_' + body.pid + '_' + body.lang + '_' + body.sessionId + '.csv';
    form.set('file', new File([body.csv], filename, {type: 'text/csv'}));

    const response = await fetch(env.REDCAP_API_URL, {method: 'POST', body: form});

    if (!response.ok) {
        throw new Error('file import returned ' + response.status + ': ' + (await response.text()).slice(0, 300));
    }
}
