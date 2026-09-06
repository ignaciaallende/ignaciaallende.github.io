/*
 * Survey manager, shared by every language.
 *
 * The entry page (en/index.html, de/index.html, no/index.html) sets
 *     window.piGlobal = { lang: '<code>', surveyBase: '<absolute URL of this folder>' }
 * before starting MinnoJS. Everything language-specific comes from
 * lang/<code>/strings.js and the three page templates in that folder.
 *
 * Data goes to the study's REDCap through the small forwarding program in worker/.
 * See worker/README.md for how to set that up.
 */
var surveyGlobal = window.piGlobal || {};
var lang = surveyGlobal.lang || 'en';
var surveyBase = surveyGlobal.surveyBase || './';

// ---------------------------------------------------------------------------------------
// SETTINGS YOU NEED TO CHANGE
//
// 1. UPLOAD_ENDPOINT_LIVE: the address of your deployed forwarding program. `npx wrangler
//    deploy` prints it. Until you have deployed it, the survey cannot save any data.
// 2. CONTACT_EMAIL: shown to a participant if their data could not be saved.
// ---------------------------------------------------------------------------------------
var UPLOAD_ENDPOINT_LIVE = 'https://iat-redcap-bridge.CHANGE-ME.workers.dev/iat';
var CONTACT_EMAIL = 'CHANGE-ME@georgeinstitute.org.au';

// When testing on your own machine the survey talks to worker/mock_server.py instead.
var isLocal = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
var UPLOAD_ENDPOINT = isLocal ? 'http://127.0.0.1:8787/iat' : UPLOAD_ENDPOINT_LIVE;

// Must match the check the forwarding program makes, so a link that would fail at upload
// time is caught on the very first screen instead.
var PID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

define(['managerAPI',
        surveyBase + 'upload.js',
        surveyBase + 'lang/' + lang + '/strings.js'],
function(Manager, upload, T){

    var urlParams = new URLSearchParams(window.location.search);
    var pid = urlParams.get('pid');
    var pidIsUsable = !!pid && PID_PATTERN.test(pid);

    var API = new Manager();

    upload.init(API, {
        endpoint: UPLOAD_ENDPOINT,
        params: {lang: lang},           // added to every uploaded row
        tasks: {                        // which tasks upload, and as what
            raceiat: 'trials',
            withdraw: 'withdraw'
        }
    });

    API.setName('mgr');
    API.addSettings('skip', true);
    API.addSettings('title', T.ui.pageTitle);

    API.addGlobal({
        raceiat: {},
        lang: lang,
        t: T,                                   // the language pack; templates read it as global.t
        baseURL: surveyBase + 'images/',        // photos shown on the instructions page
        redcap_pid: pid
    });

    API.addTasksSet({
        instructions: [{
            type: 'message',
            buttonText: T.ui.continueButton
        }],

        intro: [{
            inherit: 'instructions',
            name: 'intro',
            templateUrl: 'lang/' + lang + '/intro.jst',
            title: T.ui.introTitle,
            header: T.ui.introHeader
        }],

        raceiat_instructions: [{
            inherit: 'instructions',
            name: 'raceiat_instructions',
            templateUrl: 'lang/' + lang + '/raceiat_instructions.jst',
            title: T.ui.iatInstructionsTitle,
            header: T.ui.iatInstructionsHeader
        }],

        raceiat: [{
            type: 'time',
            name: 'raceiat',
            scriptUrl: 'raceiat.js'
        }],

        lastpage: [{
            type: 'message',
            name: 'lastpage',
            templateUrl: 'lang/' + lang + '/lastpage.jst',
            title: T.ui.lastPageTitle,
            header: T.ui.lastPageHeader
            // The template binds the withdrawal radios to global.withdraw_choice (ng-model) and keeps
            // the Finish button disabled until one is chosen; the post task below uploads the answer.
        }],

        // Where participants go at the end of the study (set per language in strings.js).
        redirect: [{
            type: 'redirect', name: 'redirecting', url: T.endRedirectUrl
        }],

        // "Please wait" pages, one for each of the two uploads.
        uploading: upload.uploadingTask({
            name: 'uploading',
            expects: 'trials',
            title: T.ui.uploadingTitle,
            header: T.ui.uploadingHeader,
            body: T.ui.uploadingBody
        }),

        uploadingWithdraw: upload.uploadingTask({
            name: 'uploadingWithdraw',
            expects: 'withdraw',
            title: T.ui.uploadingTitle,
            header: T.ui.uploadingHeader,
            body: T.ui.uploadingBody
        }),

        // Shown only if the data could not be saved. It has no "continue" button, so the study
        // stops here rather than sending the participant on as though all were well.
        uploadProblem: upload.failureTask({
            title: T.ui.uploadFailedTitle,
            header: T.ui.uploadFailedHeader,
            body: T.ui.uploadFailedBody,
            contactHelp: T.ui.uploadFailedContact,
            contactEmail: CONTACT_EMAIL,
            downloadText: T.ui.uploadFailedDownload
        }),

        // Shown instead of the survey when the link has no usable participant code.
        blocked: upload.blockedTask({
            title: T.ui.missingPidTitle,
            header: T.ui.missingPidHeader,
            body: T.ui.missingPidBody
        })
    });

    // A link without a usable ?pid= cannot be filed against anyone, so say so immediately
    // rather than after a ten-minute task.
    if (!pidIsUsable) {
        API.addSequence([{inherit: 'blocked'}]);
        return API.script;
    }

    API.addSequence([
        // Minno's touch detection: on touch devices it asks whether to use the touch interface.
        { type: 'isTouch', text: T.ui.touchQuestion, yesText: T.ui.touchYes, noText: T.ui.touchNo },

        // apply touch only styles
        {
            mixer:'branch',
            conditions: {compare:'global.$isTouch', to: true},
            data: [
                {
                    type: 'injectStyle',
                    css: [
                        '* {color:red}',
                        '[piq-page] {background-color: #fff; border: 1px solid transparent; border-radius: 4px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); margin-bottom: 20px; border-color: #bce8f1;}',
                        '[piq-page] > ol {margin: 15px;}',
                        '[piq-page] > .btn-group {margin: 0px 15px 15px 15px;}',
                        '.container {padding:5px;}',
                        '[pi-quest]::before, [pi-quest]::after {content: " ";display: table;}',
                        '[pi-quest]::after {clear: both;}',
                        '[pi-quest] h3 { border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 10px 15px; color: inherit; font-size: 2em; margin-bottom: 20px; margin-top: 0;background-color: #d9edf7;border-color: #bce8f1;color: #31708f;}',
                        '[pi-quest] .form-group > label {font-size:1.2em; font-weight:normal;}',

                        '[pi-quest] .btn-toolbar {margin:15px;float:none !important; text-align:center;position:relative;}',
                        '[pi-quest] [ng-click="decline($event)"] {position:absolute;right:0;bottom:0}',
                        '[pi-quest] [ng-click="submit()"] {width:30%;line-height: 1.3333333;border-radius: 6px;}',
                        // larger screens
                        '@media (min-width: 480px) {',
                        ' [pi-quest] [ng-click="submit()"] {width:30%;padding: 10px 16px;font-size: 1.6em;}',
                        '}',
                        // phones and smaller screens
                        '@media (max-width: 480px) {',
                        ' [pi-quest] [ng-click="submit()"] {padding: 8px 13px;font-size: 1.2em;}',
                        ' [pi-quest] [ng-click="decline($event)"] {font-size: 0.9em;padding:3px 6px;}',
                        '}'
                    ]
                }
            ]
        },

        {inherit: 'intro'},

        // IAT instructions followed by the IAT
        {
            mixer: 'wrapper',
            data: [
                {inherit: 'raceiat_instructions'},
                {inherit: 'raceiat'}
            ]
        },

        // Upload the trial data, and stop here if it could not be saved.
        {inherit: 'uploading'},
        {
            mixer: 'branch',
            conditions: {compare: 'global.uploadResults.trials', to: 'failed'},
            data: [{inherit: 'uploadProblem'}]
        },

        {inherit: 'lastpage'},

        // The withdrawal answer is only known now: upload it and wait before leaving.
        { type: 'post', name: 'withdraw', path: ['withdraw_choice'] },
        {inherit: 'uploadingWithdraw'},
        {
            mixer: 'branch',
            conditions: {compare: 'global.uploadResults.withdraw', to: 'failed'},
            data: [{inherit: 'uploadProblem'}]
        },

        {inherit: 'redirect'}
    ]);

    return API.script;
});
