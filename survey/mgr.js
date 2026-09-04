/*
 * Survey manager, shared by every language.
 *
 * The entry page (en/index.html, de/index.html, no/index.html) sets
 *     window.piGlobal = { lang: '<code>', surveyBase: '<absolute URL of this folder>' }
 * before starting MinnoJS. Everything language-specific comes from
 * lang/<code>/strings.js and the three page templates in that folder.
 */
var surveyGlobal = window.piGlobal || {};
var lang = surveyGlobal.lang || 'en';
var surveyBase = surveyGlobal.surveyBase || './';

define(['managerAPI',
        'https://cdn.jsdelivr.net/gh/minnojs/minno-datapipe@1.*/datapipe.min.js',
        surveyBase + 'lang/' + lang + '/strings.js'],
function(Manager, datapipe, T){

    var urlParams = new URLSearchParams(window.location.search);
    var pid = urlParams.get('pid');

    var API = new Manager();

    // One DataPipe experiment for all languages; `lang` is added to every uploaded row
    // (URL parameters such as pid are added automatically as well).
    init_data_pipe(API, 'jCtvm15Eh4HY', {file_type:'csv', params:{lang: lang}});

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

        // This task waits until the data are sent to the server.
        uploading: uploading_task({header: T.ui.uploadingHeader, body: T.ui.uploadingBody})
    });

    API.addSequence([
        // Minno's touch detection: on touch devices it asks whether to use the touch interface.
        { type: 'isTouch', text: T.ui.touchQuestion, yesText: T.ui.touchYes, noText: T.ui.touchNo },

        { type: 'post', path: ['$isTouch', 'redcap_pid'] },

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

        {inherit: 'uploading'},
        {inherit: 'lastpage'},

        // The withdrawal answer is only known now: post it and wait for the upload before leaving.
        { type: 'post', name: 'withdraw', path: ['withdraw_choice'] },
        {inherit: 'uploading'},

        {inherit: 'redirect'}
    ]);

    return API.script;
});
