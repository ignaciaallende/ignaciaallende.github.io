/*
 * English language pack.
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
    code: 'en',

    // Where participants are sent when the study is over.
    endRedirectUrl: 'https://www.google.com/search',

    // Page furniture: headers, buttons, messages.
    ui: {
        pageTitle: 'Implicit Association Test',            // browser tab
        continueButton: 'Continue',
        introTitle: 'Intro',
        introHeader: 'Welcome',
        iatInstructionsTitle: 'IAT Instructions',
        iatInstructionsHeader: 'Implicit Association Test',
        lastPageTitle: 'End',
        lastPageHeader: 'You have completed the study',
        uploadingHeader: 'just a moment',
        uploadingBody: 'Please wait, sending data... ',
        touchQuestion: 'We\'ve detected that you are using a device capable of touch interactions. Would you like to use the touch interface?',
        touchYes: 'Use touch',
        touchNo: 'Use keyboard'
    },

    // The sorting task itself.
    iat: {
        // Category and attribute labels shown on screen. (The names stored in the data stay in English.)
        category1Title: 'Men',
        category2Title: 'Women',
        attribute1Title: 'Urgent words',
        attribute2Title: 'Non-urgent words',

        // The words participants sort. The instructions page lists these automatically.
        attribute1Stimuli: ['Urgent', 'Immediate', 'Acute', 'Critical', 'Priority', 'Vital', 'Emergency', 'Pressing'],
        attribute2Stimuli: ['Minor', 'Routine', 'Trivial', 'Low-risk', 'Stable', 'Nonthreatening', 'Unimportant', 'Low-priority'],

        // Small labels printed above the category names during the task.
        leftKeyText: 'Press "E" for',
        rightKeyText: 'Press "I" for',
        orText: 'or',

        // Shown on the last screen of the task.
        finalText: 'Press space to continue to the next task',
        finalTouchText: 'Touch the bottom green area to continue to the next task',

        // Sentences used to build the instruction screen shown before each of the seven parts.
        partLabel: 'Part blockNum of nBlocks',
        pressSpaceToStart: 'Press the <b>space bar</b> when you are ready to start.',
        touchToStart: 'Touch the <b>lower</b> green area to start.',
        oneAtATime: 'Items will appear one at a time.',
        oneCategoryEach: 'Each item belongs to only one category.',
        sameAsPrevious: 'This is the same as the previous part.',
        labelsSwitched: 'Watch out, the labels have changed position!',
        mistake: 'If you make a mistake, a red <font color="#ff0000"><b>X</b></font> will appear. Press the other key to continue.',
        mistakeTouch: 'If you make a mistake, a red <font color="#ff0000"><b>X</b></font> will appear. Touch the other side to continue.',
        goFast: '<u>Go as fast as you can</u> while being accurate.',

        // Keyboard version.
        keyLeftCategory: 'Put a left finger on the <b>E</b> key for items that belong to the category leftCategory.',
        keyRightCategory: 'Put a right finger on the <b>I</b> key for items that belong to the category rightCategory.',
        keyLeftAttribute: 'Put a left finger on the <b>E</b> key for items that belong to the category leftAttribute.',
        keyRightAttribute: 'Put a right finger on the <b>I</b> key for items that belong to the category rightAttribute.',
        keyLeftCombined: 'Use the <b>E</b> key for leftCategory and for leftAttribute.',
        keyRightCombined: 'Use the <b>I</b> key for rightCategory and for rightAttribute.',
        keyLeftSwitch: 'Use the left finger on the <b>E</b> key for leftCategory.',
        keyRightSwitch: 'Use the right finger on the <b>I</b> key for rightCategory.',

        // Touch-screen version.
        touchLeftCategory: 'Put a left finger over the <b>left</b> green area for items that belong to the category leftCategory.',
        touchRightCategory: 'Put a right finger over the <b>right</b> green area for items that belong to the category rightCategory.',
        touchLeftAttribute: 'Put a left finger over the <b>left</b> green area for items that belong to the category leftAttribute.',
        touchRightAttribute: 'Put a right finger over the <b>right</b> green area for items that belong to the category rightAttribute.',
        touchLeftCombined: 'Put a left finger over the <b>left</b> green area for leftCategory items and for leftAttribute.',
        touchRightCombined: 'Put a right finger over the <b>right</b> green area for rightCategory items and for rightAttribute.',
        touchLeftSwitch: 'Put a left finger over the <b>left</b> green area for leftCategory items.',
        touchRightSwitch: 'Put a right finger over the <b>right</b> green area for rightCategory items.'
    }
});
