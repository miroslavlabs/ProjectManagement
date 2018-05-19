export var conf = {};

conf.toolbarGroups = [
     { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
     { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
     { name: 'styles', groups: [ 'styles' ] },
     { name: 'colors', groups: [ 'colors' ] },
     { name: 'forms', groups: [ 'forms' ] },
     { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
     { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
     { name: 'links', groups: [ 'links' ] },
     { name: 'insert', groups: [ 'insert' ] },
     { name: 'tools', groups: [ 'tools' ] },
     { name: 'others', groups: [ 'others' ] },
     { name: 'about', groups: [ 'about' ] },
     { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] }
    ];
   
conf.removeButtons = 'Cut,Undo,Copy,Paste,PasteText,PasteFromWord,Redo,Source,Save,Templates,NewPage,Preview,Print,Replace,SelectAll,Scayt,Form,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,CreateDiv,BidiLtr,BidiRtl,Language,About,Maximize,ShowBlocks,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Anchor,Format,Styles,Flash';

conf.extraPlugins = 'divarea';
conf.uiColor = '#ffffff';