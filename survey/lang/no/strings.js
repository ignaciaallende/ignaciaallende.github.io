/*
 * Norsk språkpakke (bokmål) / Norwegian language pack.
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
    code: 'no',

    // Where participants are sent when the study is over.
    endRedirectUrl: 'https://www.google.com/search',

    // Page furniture: headers, buttons, messages.
    ui: {
        pageTitle: 'Implisitt assosiasjonstest',           // browser tab
        continueButton: 'Fortsett',
        introTitle: 'Introduksjon',
        introHeader: 'Velkommen',
        iatInstructionsTitle: 'IAT-instruksjoner',
        iatInstructionsHeader: 'Implisitt assosiasjonstest',
        lastPageTitle: 'Slutt',
        lastPageHeader: 'Du har fullført studien',
        uploadingHeader: 'Et øyeblikk',
        uploadingBody: 'Vent litt, sender data... ',
        touchQuestion: 'Vi har oppdaget at enheten din støtter berøring. Vil du bruke berøringsgrensesnittet?',
        touchYes: 'Bruk berøring',
        touchNo: 'Bruk tastatur'
    },

    // The sorting task itself.
    iat: {
        // Category and attribute labels shown on screen. (The names stored in the data stay in English.)
        category1Title: 'Menn',
        category2Title: 'Kvinner',
        attribute1Title: 'Hastende ord',
        attribute2Title: 'Ikke-hastende ord',

        // The words participants sort. The instructions page lists these automatically.
        attribute1Stimuli: ['Haster', 'Umiddelbart', 'Akutt', 'Kritisk', 'Prioritet', 'Livsviktig', 'Nødsituasjon', 'Presserende'],
        attribute2Stimuli: ['Lite alvorlig', 'Rutine', 'Trivielt', 'Lav risiko', 'Stabil', 'Ufarlig', 'Uviktig', 'Lav prioritet'],

        // Small labels printed above the category names during the task.
        leftKeyText: 'Trykk «E» for',
        rightKeyText: 'Trykk «I» for',
        orText: 'eller',

        // Shown on the last screen of the task.
        finalText: 'Trykk på mellomromstasten for å gå videre til neste oppgave',
        finalTouchText: 'Trykk på det grønne feltet nederst for å gå videre til neste oppgave',

        // Sentences used to build the instruction screen shown before each of the seven parts.
        partLabel: 'Del blockNum av nBlocks',
        pressSpaceToStart: 'Trykk på <b>mellomromstasten</b> når du er klar til å starte.',
        touchToStart: 'Trykk på det <b>nederste</b> grønne feltet for å starte.',
        oneAtATime: 'Elementene vises ett om gangen.',
        oneCategoryEach: 'Hvert element hører til bare én kategori.',
        sameAsPrevious: 'Dette er det samme som forrige del.',
        labelsSwitched: 'Vær oppmerksom: merkelappene har byttet plass!',
        mistake: 'Hvis du gjør en feil, vises en rød <font color="#ff0000"><b>X</b></font>. Trykk på den andre tasten for å fortsette.',
        mistakeTouch: 'Hvis du gjør en feil, vises en rød <font color="#ff0000"><b>X</b></font>. Trykk på den andre siden for å fortsette.',
        goFast: '<u>Vær så rask du kan</u>, men svar riktig.',

        // Keyboard version.
        keyLeftCategory: 'Legg en finger på venstre hånd på <b>E</b>-tasten for elementer som hører til kategorien leftCategory.',
        keyRightCategory: 'Legg en finger på høyre hånd på <b>I</b>-tasten for elementer som hører til kategorien rightCategory.',
        keyLeftAttribute: 'Legg en finger på venstre hånd på <b>E</b>-tasten for elementer som hører til kategorien leftAttribute.',
        keyRightAttribute: 'Legg en finger på høyre hånd på <b>I</b>-tasten for elementer som hører til kategorien rightAttribute.',
        keyLeftCombined: 'Bruk <b>E</b>-tasten for leftCategory og for leftAttribute.',
        keyRightCombined: 'Bruk <b>I</b>-tasten for rightCategory og for rightAttribute.',
        keyLeftSwitch: 'Bruk venstre finger på <b>E</b>-tasten for leftCategory.',
        keyRightSwitch: 'Bruk høyre finger på <b>I</b>-tasten for rightCategory.',

        // Touch-screen version.
        touchLeftCategory: 'Hold en finger på venstre hånd over det <b>venstre</b> grønne feltet for elementer som hører til kategorien leftCategory.',
        touchRightCategory: 'Hold en finger på høyre hånd over det <b>høyre</b> grønne feltet for elementer som hører til kategorien rightCategory.',
        touchLeftAttribute: 'Hold en finger på venstre hånd over det <b>venstre</b> grønne feltet for elementer som hører til kategorien leftAttribute.',
        touchRightAttribute: 'Hold en finger på høyre hånd over det <b>høyre</b> grønne feltet for elementer som hører til kategorien rightAttribute.',
        touchLeftCombined: 'Hold en finger på venstre hånd over det <b>venstre</b> grønne feltet for elementer fra leftCategory og for leftAttribute.',
        touchRightCombined: 'Hold en finger på høyre hånd over det <b>høyre</b> grønne feltet for elementer fra rightCategory og for rightAttribute.',
        touchLeftSwitch: 'Hold en finger på venstre hånd over det <b>venstre</b> grønne feltet for elementer fra leftCategory.',
        touchRightSwitch: 'Hold en finger på høyre hånd over det <b>høyre</b> grønne feltet for elementer fra rightCategory.'
    }
});
