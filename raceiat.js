define(['pipAPI','https://cdn.jsdelivr.net/gh/baranan/minno-tasks@0.*/IAT/iat10.js'], function(APIConstructor, iatExtension){
    let API = new APIConstructor();
    let global = API.getGlobal();

    return iatExtension({
        category1 : {
            name : global.blackLabels, //Will appear in the data.
            title : {
                media : {word : global.blackLabels}, //Name of the category presented in the task.
                css : {color:'#31940F','font-size':'1.8em'}, //Style of the category title.
                height : 4 //Used to position the "Or" in the combined block.
            }, 
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {image: 'bm1_nc.jpg'},
                {image: 'bm2_nc.jpg'},
                {image: 'bm3_nc.jpg'},
                {image: 'bf1_nc.jpg'},
                {image: 'bf2_nc.jpg'},                 
                {image: 'bf3_nc.jpg'}     
            ],
            //Stimulus css (style)
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },    
        category2 : {
            name : global.whiteLabels, //Will appear in the data.
            title : {
                media : {word : global.whiteLabels}, //Name of the category presented in the task.
                css : {color:'#31940F','font-size':'1.8em'}, //Style of the category title.
                height : 4 //Used to position the "Or" in the combined block.
            }, 
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {image: 'wm1_nc.jpg'},
                {image: 'wm2_nc.jpg'},
                {image: 'wm3_nc.jpg'},
                {image: 'wf1_nc.jpg'},
                {image: 'wf2_nc.jpg'},
                {image: 'wf3_nc.jpg'}
            ],
            //Stimulus css (style)
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },
        attribute1 : {
            name : 'Urgent words',
            title : {
                media : {word : 'Urgent words'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4 //Used to position the "Or" in the combined block.
            },
            stimulusMedia : [ 
                {word: 'Urgent',
                {word: 'Acute',
                {word: 'Critical',
                {word: 'Imperative',
                {word: 'Pressing',
                {word: 'Emergency',
                {word: 'Vital'
            ],
            //Stimulus css
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        attribute2 : {
            name : 'Non-urgent words',
            title : {
                media : {word : 'Non-urgent words'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4 //Used to position the "Or" in the combined block.
            },
            stimulusMedia : [
                {word: 'Minor',
                {word: 'Trivial',
                {word: 'Routine',
                {word: 'Low-risk',
                {word: 'Stable',
                {word: 'Unimportant'
            ],
            //Stimulus css
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        base_url : {//Where are your images at?
            image : global.baseURL
        },
        isTouch : global.$isTouch
    });
});

