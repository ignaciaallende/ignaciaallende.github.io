define(['pipAPI','https://cdn.jsdelivr.net/gh/baranan/minno-tasks@0.*/IAT/iat10.js'], function(APIConstructor, iatExtension){
    let API = new APIConstructor();
    let global = API.getGlobal();

    return iatExtension({
        category1 : {
            name : 'Men', // Will appear in the data.
            title : {
                media : {word : 'Men'}, // Name of the category presented in the task.
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
            name : 'Women', // Will appear in the data.
            title : {
                media : {word : 'Women'},
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
            name : 'Urgent words',
            title : {
                media : {word : 'Urgent words'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4
            },
            stimulusMedia : [
                {word: 'Urgent'},
                {word: 'Immediate'},
                {word: 'Now'},
                {word: 'Critical'},
                {word: 'Priority'},
                {word: 'ASAP'},
                {word: 'Emergency'},
                {word: 'Pressing'}
            ],
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },

        attribute2 : {
            name : 'Non-urgent words',
            title : {
                media : {word : 'Non-urgent words'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4
            },
            stimulusMedia : [
                {word: 'Later'},
                {word: 'Routine'},
                {word: 'Flexible'},
                {word: 'Anytime'},
                {word: 'Optional'},
                {word: 'Scheduled'},
                {word: 'Eventually'},
                {word: 'Low-priority'}
            ],
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },

        base_url : {
            image : global.baseURL
        },

        isTouch : global.$isTouch
    });
});
