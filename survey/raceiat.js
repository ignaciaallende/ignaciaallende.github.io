/*
 * IAT configuration, shared by every language.
 *
 * All visible text comes from the language pack chosen by the entry page (global.t).
 * The `name` fields are what gets written to the data and deliberately stay in English
 * so the datasets of all languages can be compared directly.
 */
var iatBase = (window.piGlobal && window.piGlobal.surveyBase) || './';

define(['pipAPI', iatBase + 'iat10.js'], function(APIConstructor, iatExtension){
    var API = new APIConstructor();
    var global = API.getGlobal();
    var T = global.t.iat;

    var CATEGORY_COLOUR = '#336600';
    var ATTRIBUTE_COLOUR = '#0000ff';

    // Colour the placeholders that the engine later replaces with the category names.
    function colour(text) {
        return text
            .replace(/leftCategory|rightCategory/g, function(m){ return '<font color="' + CATEGORY_COLOUR + '">' + m + '</font>'; })
            .replace(/leftAttribute|rightAttribute/g, function(m){ return '<font color="' + ATTRIBUTE_COLOUR + '">' + m + '</font>'; });
    }

    // Instruction screen shown before each part (keyboard). An empty string makes a blank line.
    function keyboardScreen(lines) {
        return '<div>' +
            '<p align="center" style="font-size:20px; font-family:arial; color:#000000"><u>' + T.partLabel + '</u><br/><br/></p>' +
            '<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial; color:#000000">' +
            colour(lines.join('<br/>')) + '<br/><br/></p>' +
            '<p align="center" style="color:#000000">' + T.pressSpaceToStart + '</p>' +
            '</div>';
    }

    // The same for touch screens.
    function touchScreen(lines) {
        return '<div>' +
            '<p align="center"><u>' + T.partLabel + '</u></p>' +
            '<p align="left" style="margin-left:5px"><br/>' + colour(lines.join('<br/>')) + '</p>' +
            '<p align="center">' + T.touchToStart + '</p>' +
            '</div>';
    }

    function words(list) {
        return list.map(function(w){ return {word: w}; });
    }

    function photos(prefix) {
        return [1, 2, 3, 4, 5, 6].map(function(i){ return {image: prefix + i + '.jpg'}; });
    }

    var categoryTitleCss  = {color:'#31940F', 'font-size':'1.8em'};
    var categoryStimCss   = {color:'#31940F', 'font-size':'2.3em'};
    var attributeTitleCss = {color:'#0000FF', 'font-size':'1.8em'};
    var attributeStimCss  = {color:'#0000FF', 'font-size':'2.3em'};

    return iatExtension({
        category1 : {
            name : 'Men', // Will appear in the data.
            title : { media : {word : T.category1Title}, css : categoryTitleCss, height : 4 },
            stimulusMedia : photos('man'),
            stimulusCss : categoryStimCss
        },

        category2 : {
            name : 'Women', // Will appear in the data.
            title : { media : {word : T.category2Title}, css : categoryTitleCss, height : 4 },
            stimulusMedia : photos('woman'),
            stimulusCss : categoryStimCss
        },

        attribute1 : {
            name : 'Urgent words', // Will appear in the data.
            title : { media : {word : T.attribute1Title}, css : attributeTitleCss, height : 4 },
            stimulusMedia : words(T.attribute1Stimuli),
            stimulusCss : attributeStimCss
        },

        attribute2 : {
            name : 'Non-urgent words', // Will appear in the data.
            title : { media : {word : T.attribute2Title}, css : attributeTitleCss, height : 4 },
            stimulusMedia : words(T.attribute2Stimuli),
            stimulusCss : attributeStimCss
        },

        base_url : {
            image : global.baseURL
        },

        isTouch : global.$isTouch,

        // Labels around the category names during the task.
        leftKeyText : T.leftKeyText,
        rightKeyText : T.rightKeyText,
        orText : T.orText,

        // Reminder printed at the bottom of the screen during the task.
        remindErrorText : '<p align="center" style="font-size:1em; font-family:arial; color:#000000">' + T.mistake + '</p>',
        remindErrorTextTouch : '<p align="center" style="font-size:1.4em; font-family:arial; color:#000000">' + T.mistakeTouch + '</p>',

        // Last screen of the task.
        finalText : T.finalText,
        finalTouchText : T.finalTouchText,

        // Instruction screens for the seven parts (the engine reuses the first/second combined
        // screens for the third/fourth combined blocks).
        instCategoriesPractice : keyboardScreen([T.keyLeftCategory, T.keyRightCategory, T.oneAtATime, '', T.mistake, T.goFast]),
        instCategoriesPracticeTouch : touchScreen([T.touchLeftCategory, T.touchRightCategory, T.oneAtATime, '', T.mistakeTouch + ' ' + T.goFast]),

        instAttributePractice : keyboardScreen([T.keyLeftAttribute, T.keyRightAttribute, '', T.mistake, T.goFast]),
        instAttributePracticeTouch : touchScreen([T.touchLeftAttribute, T.touchRightAttribute, T.oneAtATime, '', T.mistakeTouch + ' ' + T.goFast]),

        instFirstCombined : keyboardScreen([T.keyLeftCombined, T.keyRightCombined, T.oneCategoryEach, '', T.mistake, T.goFast]),
        instFirstCombinedTouch : touchScreen([T.touchLeftCombined, T.touchRightCombined, T.mistakeTouch + ' ' + T.goFast]),

        instSecondCombined : keyboardScreen([T.sameAsPrevious, T.keyLeftCombined, T.keyRightCombined, T.oneCategoryEach, '', T.goFast]),
        instSecondCombinedTouch : touchScreen([T.touchLeftCombined, T.touchRightCombined, '', T.goFast]),

        instSwitchCategories : keyboardScreen(['<b>' + T.labelsSwitched + '</b>', T.keyLeftSwitch, T.keyRightSwitch, '', T.goFast]),
        instSwitchCategoriesTouch : touchScreen([T.labelsSwitched, T.touchLeftSwitch, T.touchRightSwitch, T.oneAtATime, '', T.mistakeTouch + ' ' + T.goFast])
    });
});
