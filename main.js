/*jshint esversion:6*/
/* B O I L E R   P L A T E */
var _=document,l=localStorage;

/* E L E M E N T S */
var titleText=_.getElementById('title'),
    titleElement=_.getElementsByClassName('title')[0],
    modeRange=_.getElementById('mode'),
    editorElement=_.getElementById('editor'),
    useSameWindow=_.getElementById('UseSameWindow');

/* A C E   E D I T O R */
var editor = ace.edit("editor"),session = editor.getSession();
editor.setShowPrintMargin(false);
ace.require("ace/ext/language_tools");
editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
function setTheme(theme){
    editor.setTheme("ace/theme/"+theme);
}
function setEditorMode(mode){
    session.setMode("ace/mode/"+mode);
}
function setFontSize(size){
    editorElement.style.fontSize=size+'px';
}
/* S E T T I N G S   A N D   L O C A L   S T O R A G E */
var settings={
    speech:!1,
    mode:'html',
    theme:'monokai',
    focusOnReturn:!1,
    useSameWindow:!0,
    shortcut: true
},
    mode = {
    html(){
        return editor.getValue();
    },
    javascript(){
        return '<script>'+editor.getValue()+'</script>';
    },
    marcus(){
        return '_=>{};';
    },
},
    textData={
        html:`<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <title></title>
    <style media="screen">
    </style>
</head>
<body>
    <script type="text/javascript">
    </script>
</body>
</html>`,
        javascript:'"Hello World!";',
    };
var get = {
    /*
    [Local Storage]-->{Objects}
    */
    settings(){
        if(l.getItem('settingsSaved')){
            settings=JSON.parse(l.getItem('settings'));
        }
    },
    data(){
        if(l.getItem('dataSaved')){
            textData=JSON.parse(l.getItem('textData'));
        }
    },
    all(){
        this.data();
        this.settings();
    }
};
var apply = {
    /*
    {Objects}--><DOM>
    */
    settings(){
        setEditorMode(settings.mode);
        setTheme(settings.theme);
        modeRange.value=settings.mode=='html'?0:5;
    },
    textData(){
        editor.setValue(textData[settings.mode],-1);
    },
    all(){
        this.textData();
        this.settings();
    }
};
var read = {
        /*
        <DOM>-->{Objects}
        */
        textData(){
            textData[settings.mode]=editor.getValue();
        },
        settings(){
            if(+modeRange.value>2)settings.mode='javascript';else settings.mode='html';
            settings.useSameWindow=useSameWindow.checked;
        }
};
var save = {
    /*
    {Objects}-->[Local Storage]
    */
    settings(){
        localStorage.setItem('settingsSaved','('); //Infuriating innit?
        localStorage.setItem("settings",JSON.stringify(settings));
    },
    textData(){
        localStorage.setItem('dataSaved','if{'); //This one's even worse
        localStorage.setItem("textData",JSON.stringify(textData));
    },
    all(){
        this.settings();
        this.textData();
    }
};
get.all();
apply.all();
function readSaveTextData(){
    read.textData();
    save.textData();
}
function toggleMenu(element){
    if(element.checked){
        //Open the menu
        titleElement.style.height='70%';
    }else{
        //Close the menu
        read.settings();
        save.all();
        apply.all();
        titleElement.style.height='50%';
        setTimeout(editor.resize.bind(editor), 350);
    }
}
var htmlWindow;
function testCode(){
        htmlWindow&&settings.useSameWindow&&!htmlWindow.closed&&!htmlWindow.focus()||[htmlWindow&&htmlWindow.close(),htmlWindow=open()];
        var code=editor.getValue();
    if(code){
        htmlWindow.document.open();
        htmlWindow.document.write(mode[settings.mode]());
        htmlWindow.document.close();
    }else{
        htmlWindow.location='/dogrolld';
    }
}
var localsArray=['settingsSaved',"settings",'dataSaved',"textData"];
function removeLocals(){
    for(var removing of localsArray){
        localStorage.removeItem(removing);
    }
}

document.addEventListener('keydown', function (e) {
    if (settings.shortcut&&e.key==='Enter'&&e.ctrlKey) {
        testCode();
    }
});

setInterval(readSaveTextData,123);
