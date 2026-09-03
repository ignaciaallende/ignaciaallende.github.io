/*
 * Deutsches Sprachpaket / German language pack.
 *
 * Every piece of text a participant sees in this language lives either here or in the three
 * page templates next to this file (intro.jst, raceiat_instructions.jst, lastpage.jst).
 *
 * Notes for translators
 *  - Only edit the text between the quotes. Keep the keys (the words before the colon) as they are.
 *  - Keep HTML tags such as <b>, <u> and <font ...> where they appear.
 *  - Keep the placeholder words leftCategory, rightCategory, leftAttribute, rightAttribute,
 *    blockNum and nBlocks exactly as written: the test replaces them at run time with the
 *    category names and part numbers.
 *  - To use an apostrophe inside a single-quoted string, write \' .
 */
define({
    code: 'de',

    // Where participants are sent when the study is over.
    endRedirectUrl: 'https://www.google.com/search',

    // Page furniture: headers, buttons, messages.
    ui: {
        pageTitle: 'Impliziter Assoziationstest',          // browser tab
        continueButton: 'Weiter',
        introTitle: 'Einführung',
        introHeader: 'Willkommen',
        iatInstructionsTitle: 'IAT-Anweisungen',
        iatInstructionsHeader: 'Impliziter Assoziationstest',
        lastPageTitle: 'Ende',
        lastPageHeader: 'Sie haben die Studie abgeschlossen',
        uploadingHeader: 'Einen Moment bitte',
        uploadingBody: 'Bitte warten, die Daten werden übertragen... ',
        touchQuestion: 'Wir haben festgestellt, dass Ihr Gerät Touch-Eingaben unterstützt. Möchten Sie die Touch-Oberfläche verwenden?',
        touchYes: 'Touch verwenden',
        touchNo: 'Tastatur verwenden'
    },

    // The sorting task itself.
    iat: {
        // Category and attribute labels shown on screen. (The names stored in the data stay in English.)
        category1Title: 'Männer',
        category2Title: 'Frauen',
        attribute1Title: 'Dringende Begriffe',
        attribute2Title: 'Nicht dringende Begriffe',

        // The words participants sort. The instructions page lists these automatically.
        attribute1Stimuli: ['Dringend', 'Sofort', 'Akut', 'Kritisch', 'Priorität', 'Lebenswichtig', 'Notfall', 'Eilig'],
        attribute2Stimuli: ['Geringfügig', 'Routine', 'Unbedeutend', 'Niedriges Risiko', 'Stabil', 'Nicht bedrohlich', 'Unwichtig', 'Niedrige Priorität'],

        // Small labels printed above the category names during the task.
        leftKeyText: 'Drücken Sie „E“ für',
        rightKeyText: 'Drücken Sie „I“ für',
        orText: 'oder',

        // Shown on the last screen of the task.
        finalText: 'Drücken Sie die Leertaste, um zur nächsten Aufgabe zu gelangen',
        finalTouchText: 'Berühren Sie den grünen Bereich unten, um zur nächsten Aufgabe zu gelangen',

        // Sentences used to build the instruction screen shown before each of the seven parts.
        partLabel: 'Teil blockNum von nBlocks',
        pressSpaceToStart: 'Drücken Sie die <b>Leertaste</b>, wenn Sie bereit sind zu beginnen.',
        touchToStart: 'Berühren Sie den <b>unteren</b> grünen Bereich, um zu beginnen.',
        oneAtATime: 'Die Elemente erscheinen nacheinander.',
        oneCategoryEach: 'Jedes Element gehört nur zu einer Kategorie.',
        sameAsPrevious: 'Dieser Teil ist derselbe wie der vorherige.',
        labelsSwitched: 'Achtung, die Bezeichnungen haben die Seite gewechselt!',
        mistake: 'Wenn Sie einen Fehler machen, erscheint ein rotes <font color="#ff0000"><b>X</b></font>. Drücken Sie die andere Taste, um fortzufahren.',
        mistakeTouch: 'Wenn Sie einen Fehler machen, erscheint ein rotes <font color="#ff0000"><b>X</b></font>. Berühren Sie die andere Seite, um fortzufahren.',
        goFast: '<u>Antworten Sie so schnell wie möglich</u>, aber bleiben Sie dabei genau.',

        // Keyboard version.
        keyLeftCategory: 'Legen Sie einen Finger der linken Hand auf die Taste <b>E</b> für Elemente, die zur Kategorie leftCategory gehören.',
        keyRightCategory: 'Legen Sie einen Finger der rechten Hand auf die Taste <b>I</b> für Elemente, die zur Kategorie rightCategory gehören.',
        keyLeftAttribute: 'Legen Sie einen Finger der linken Hand auf die Taste <b>E</b> für Elemente, die zur Kategorie leftAttribute gehören.',
        keyRightAttribute: 'Legen Sie einen Finger der rechten Hand auf die Taste <b>I</b> für Elemente, die zur Kategorie rightAttribute gehören.',
        keyLeftCombined: 'Verwenden Sie die Taste <b>E</b> für leftCategory und für leftAttribute.',
        keyRightCombined: 'Verwenden Sie die Taste <b>I</b> für rightCategory und für rightAttribute.',
        keyLeftSwitch: 'Verwenden Sie den linken Finger auf der Taste <b>E</b> für leftCategory.',
        keyRightSwitch: 'Verwenden Sie den rechten Finger auf der Taste <b>I</b> für rightCategory.',

        // Touch-screen version.
        touchLeftCategory: 'Halten Sie einen Finger der linken Hand über den <b>linken</b> grünen Bereich für Elemente, die zur Kategorie leftCategory gehören.',
        touchRightCategory: 'Halten Sie einen Finger der rechten Hand über den <b>rechten</b> grünen Bereich für Elemente, die zur Kategorie rightCategory gehören.',
        touchLeftAttribute: 'Halten Sie einen Finger der linken Hand über den <b>linken</b> grünen Bereich für Elemente, die zur Kategorie leftAttribute gehören.',
        touchRightAttribute: 'Halten Sie einen Finger der rechten Hand über den <b>rechten</b> grünen Bereich für Elemente, die zur Kategorie rightAttribute gehören.',
        touchLeftCombined: 'Halten Sie einen Finger der linken Hand über den <b>linken</b> grünen Bereich für Elemente der Kategorie leftCategory und für leftAttribute.',
        touchRightCombined: 'Halten Sie einen Finger der rechten Hand über den <b>rechten</b> grünen Bereich für Elemente der Kategorie rightCategory und für rightAttribute.',
        touchLeftSwitch: 'Halten Sie einen Finger der linken Hand über den <b>linken</b> grünen Bereich für Elemente der Kategorie leftCategory.',
        touchRightSwitch: 'Halten Sie einen Finger der rechten Hand über den <b>rechten</b> grünen Bereich für Elemente der Kategorie rightCategory.'
    }
});
