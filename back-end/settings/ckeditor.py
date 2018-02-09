CKEDITOR_UPLOAD_PATH = 'uploads/'
CKEDITOR_IMAGE_BACKEND = 'pillow'
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': [
            ['Format'],
            ['Bold', 'Italic', 'Strike', 'Subscript', 'Superscript',
                '-', 'RemoveFormat'],
            ['NumberedList', 'BulletedList'],
            ['Link', 'Unlink'],
            ['Image', 'Table', 'Blockquote'],
            ['Replace'],
            ['ShowBlocks'],
            ['Source']
        ],
        'startupOutlineBlocks': True
    }
}

#[ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ],
#[ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ],
#[ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ],
#[ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
#    'HiddenField' ],
#[ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ],
#[ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
#    '-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ],
#[ 'Link','Unlink','Anchor' ],
#[ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak' ],
#[ 'Styles','Format','Font','FontSize' ],
#[ 'TextColor','BGColor' ],
#[ 'Maximize', 'ShowBlocks','-','About' ],
