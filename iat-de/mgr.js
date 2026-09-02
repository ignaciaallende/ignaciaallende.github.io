define(['managerAPI',
        'https://cdn.jsdelivr.net/gh/minnojs/minno-datapipe@1.*/datapipe.min.js'],
function(Manager){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pid = urlParams.get('pid');

    var API = new Manager();

    init_data_pipe(API, 'jCtvm15Eh4HY', {file_type:'csv'});

    API.setName('mgr');
    API.addSettings('skip',true);

    let raceSet = API.shuffle(['a','b'])[0];
    let blackLabels = [];
    let whiteLabels = [];

    if (raceSet == 'a') {
        blackLabels.push('Afroamerikaner');
        whiteLabels.push('Amerikaner europäischer Herkunft');
    } else {
        blackLabels.push('Schwarze Menschen');
        whiteLabels.push('Weiße Menschen');
    }

    API.addGlobal({
        raceiat:{},
        baseURL: './images/',
        redcap_pid: pid,
        raceSet:raceSet,
        blackLabels:blackLabels,
        whiteLabels:whiteLabels,

        posWords : API.shuffle([
            'Liebe', 'Freude', 'Freund', 'Vergnügen',
            'Bewundern', 'Fröhlich', 'Freundschaft', 'Glücklich',
            'Lächelnd', 'Schätzen', 'Ausgezeichnet', 'Froh',
            'Freudig', 'Spektakulär', 'Ansprechend', 'Entzücken',
            'Begeisterung', 'Lachend', 'Attraktiv', 'Erfreulich',
            'Fabelhaft', 'Großartig', 'Angenehm', 'Schön',
            'Fantastisch', 'Glücklich', 'Liebenswert', 'Hervorragend',
            'Feiern', 'Genießen', 'Prächtig', 'Triumph'
        ]),

        negWords : API.shuffle([
            'Missbrauch', 'Trauer', 'Gift', 'Traurigkeit',
            'Schmerz', 'Verachten', 'Versagen', 'Widerlich',
            'Wütend', 'Hassen', 'Schrecklich', 'Negativ',
            'Hässlich', 'Schmutzig', 'Ekelhaft', 'Böse',
            'Verdorben', 'Nerven', 'Katastrophe', 'Entsetzlich',
            'Verachtung', 'Furchtbar', 'Ekel', 'Hass',
            'Demütigen', 'Egoistisch', 'Tragisch', 'Lästig',
            'Feindseligkeit', 'Verletzend', 'Abstoßend', 'Igitt'
        ])
    });

    API.addTasksSet({

        instructions: [{
            type: 'message',
            buttonText: 'Weiter'
        }],

        intro: [{
            inherit: 'instructions',
            name: 'intro',
            templateUrl: 'intro.jst',
            title: 'Einführung',
            header: 'Willkommen'
        }],

        raceiat_instructions: [{
            inherit: 'instructions',
            name: 'raceiat_instructions',
            templateUrl: 'raceiat_instructions.jst',
            title: 'IAT-Anweisungen',
            header: 'Impliziter Assoziationstest'
        }],

        raceiat: [{
            type: 'time',
            name: 'raceiat',
            scriptUrl: 'raceiat.js'
        }],

        lastpage: [{
            type: 'message',
            name: 'lastpage',
            templateUrl: 'lastpage.jst',
            title: 'Ende',
            header: 'Sie haben die Studie abgeschlossen',

            onEnd: function(){

                var selected = document.querySelector('input[name="withdraw"]:checked');

                if(!selected){
                    alert('Bitte wählen Sie eine Option aus, bevor Sie fortfahren.');
                    return false;
                }

                this.global.withdraw_choice = selected.value;
            }
        }],

        redirect: [{
            type:'redirect',
            name:'redirecting',
            url:'https://www.google.com/search'
        }],

        uploading: uploading_task({
            header: 'Einen Moment bitte',
            body: 'Bitte warten, die Daten werden übertragen...'
        })
    });

    API.addSequence([

        { type: 'isTouch' },

        {
            type: 'post',
            path: ['$isTouch', 'redcap_pid', 'raceSet', 'blackLabels', 'whiteLabels', 'withdraw_choice']
        },

        {
            mixer:'branch',
            conditions: {compare:'global.$isTouch', to: true},
            data: [{
                type: 'injectStyle',
                css: [
                    '* {color:red}',
                    '[piq-page] {background-color: #fff; border: 1px solid transparent; border-radius: 4px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); margin-bottom: 20px; border-color: #bce8f1;}',
                    '[piq-page] > ol {margin: 15px;}',
                    '[piq-page] > .btn-group {margin: 0px 15px 15px 15px;}',
                    '.container {padding:5px;}',
                    '[pi-quest]::before, [pi-quest]::after {content: " ";display: table;}',
                    '[pi-quest]::after {clear: both;}',
                    '[pi-quest] h3 { border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 10px 15px; color: inherit; font-size: 2em; margin-bottom: 20px; margin-top: 0; background-color: #d9edf7; border-color: #bce8f1; color: #31708f;}',
                    '[pi-quest] .form-group > label {font-size:1.2em; font-weight:normal;}',
                    '[pi-quest] .btn-toolbar {margin:15px; float:none !important; text-align:center; position:relative;}',
                    '[pi-quest] [ng-click="decline($event)"] {position:absolute; right:0; bottom:0}',
                    '[pi-quest] [ng-click="submit()"] {width:30%; line-height:1.3333333; border-radius:6px;}',

                    '@media (min-width: 480px) {',
                    ' [pi-quest] [ng-click="submit()"] {width:30%; padding:10px 16px; font-size:1.6em;}',
                    '}',

                    '@media (max-width: 480px) {',
                    ' [pi-quest] [ng-click="submit()"] {padding:8px 13px; font-size:1.2em;}',
                    ' [pi-quest] [ng-click="decline($event)"] {font-size:0.9em; padding:3px 6px;}',
                    '}'
                ]
            }]
        },

        {inherit: 'intro'},

        {
            mixer: 'wrapper',
            data: [
                {inherit: 'raceiat_instructions'},
                {inherit: 'raceiat'}
            ]
        },

        {inherit: 'uploading'},
        {inherit: 'lastpage'},
        {inherit: 'redirect'}
    ]);

    return API.script;
});
