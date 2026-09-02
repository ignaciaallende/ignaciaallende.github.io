define(['pipAPI','https://cdn.jsdelivr.net/gh/baranan/minno-tasks@0.*/IAT/iat10.js'], function(APIConstructor, iatExtension){
    let API = new APIConstructor();
    let global = API.getGlobal();

    return iatExtension({

        category1 : {
            name : 'Men', // Saved in data
            title : {
                media : {word : 'Männer'},
                css : {color:'#31940F','font-size':'1.8em'},
                height : 4
            },
            stimulusMedia : [
                {image: 'man1.jpg'},
                {image: 'man2.jpg'},
                {image: 'man3.jpg'},
                {image: 'man4.jpg'},
                {image: 'man5.jpg'},
                {image: 'man6.jpg'}
            ],
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },

        category2 : {
            name : 'Women', // Saved in data
            title : {
                media : {word : 'Frauen'},
                css : {color:'#31940F','font-size':'1.8em'},
                height : 4
            },
            stimulusMedia : [
                {image: 'woman1.jpg'},
                {image: 'woman2.jpg'},
                {image: 'woman3.jpg'},
                {image: 'woman4.jpg'},
                {image: 'woman5.jpg'},
                {image: 'woman6.jpg'}
            ],
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },

        attribute1 : {
            name : 'Urgent words', // Saved in data
            title : {
                media : {word : 'Dringende Begriffe'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4
            },
            stimulusMedia : [
                {word: 'Dringend'},
                {word: 'Sofort'},
                {word: 'Akut'},
                {word: 'Kritisch'},
                {word: 'Priorität'},
                {word: 'Lebenswichtig'},
                {word: 'Notfall'},
                {word: 'Eilig'}
            ],
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },

        attribute2 : {
            name : 'Non-urgent words', // Saved in data
            title : {
                media : {word : 'Nicht dringende Begriffe'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4
            },
            stimulusMedia : [
                {word: 'Geringfügig'},
                {word: 'Routine'},
                {word: 'Unbedeutend'},
                {word: 'Niedriges Risiko'},
                {word: 'Stabil'},
                {word: 'Nicht bedrohlich'},
                {word: 'Unwichtig'},
                {word: 'Niedrige Priorität'}
            ],
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },

        base_url : {
            image : './images/'
        },

        isTouch : global.$isTouch
    });
});
