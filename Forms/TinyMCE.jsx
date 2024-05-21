'use client';

import {useFormElement} from './Element';
import {useState, useEffect} from 'react';
import tinymce from 'tinymce';

// Default icons are required for TinyMCE 5.3 or above
// import 'tinymce/icons/default';

// A theme is also required
// import 'tinymce/themes/silver';

// import 'tinymce/skins/ui/oxide/skin.min.css';
// import 'tinymce/skins/ui/oxide/content.min.css';
// import 'tinymce/skins/ui/oxide-dark/skin.min.css';
// import 'tinymce/skins/ui/oxide-dark/content.min.css';

// Any plugins you want to use has to be imported
// import 'tinymce/plugins/paste';
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/code';
// import 'tinymce/plugins/paste';
// import 'tinymce/plugins/table';
// import 'tinymce/plugins/media';
// import 'tinymce/plugins/image';
// import 'tinymce/plugins/directionality';
// import 'tinymce/plugins/media';
// import 'tinymce/plugins/imagetools';
// import 'tinymce/plugins/lists';
// import tinymce from 'tinymce';

const TinyMCE = (props)=>{
    let {refItem, dir, height, font, className} = props;
    let Element = useFormElement(props);
    let {id, rand, label, helpDiv, divError, requiredDiv, defaultValue } = Element.init();

    if(!dir) dir = 'rtl';
    if(!height) height = 500;
    if(!font) font = 'IRANSans';

    let [state, setState] = useState({
        value: defaultValue,
    });

    useEffect(()=>{
        setState({...state, value: defaultValue});
    }, [refItem[0].state.info]);

    useEffect(()=>{
        tinymce.init({
            selector: '#'+id,
            height: height,
            skin: false,
            // skin: 'oxide',
            menubar: false,
            statusbar: false,
            images_upload_url: '/mastership/tinyUpload/.-media-products',
            images_upload_base_path: '/',
            file_browser_callback_types: 'image media',
            media_live_embeds: true,
            // automatic_uploads: false,
            directionality: dir,
            content_css: '/saba/css/sanegar/tiny.css',
            video_template_callback: function(data) {
                return `<video style='background:#222' width='' + data.width + '' height='' + data.height + '"' + (data.poster ? ' poster='' + data.poster + '"' : '') + ' controls='controls'>\n' + '<source src='' + data.source + ''' + (data.sourcemime ? ' type='' + data.sourcemime + ''' : '') + ' />\n' + (data.altsource ? '<source src='' + data.altsource + ''' + (data.altsourcemime ? ' type='' + data.altsourcemime + ''' : '') + ' />\n' : '') + '</video>`;
            },
            content_style: `body { font-family: '${font}'; }`,
            plugins: ['paste', 'link', 'directionality', 'image', 'table', 'code', 'media', 'imagetools', 'lists'],
            toolbar:
                    `undo redo | formatselect | bold italic backcolor forecolor |
                    ltr rtl | alignleft aligncenter alignright alignjustify |
                    link image imagetools media table |
                    bullist numlist | outdent indent | removeformat | code`
        });
    }, []);

    return  <div className={'card mb-4 editor-card '+className}>
            <label className='form-group has-float-label'>
                <div className='card-body'>
                    <textarea 
                        id={id} 
                        defaultValue={defaultValue} 
                        data-type='tinyMCE' 
                        // ref='item'
                        >                        
                    </textarea>
                </div>
                <span>
                    {requiredDiv}
                    {label}
                    {helpDiv}
                </span>
            </label>
            {divError}
        </div>
}

export {TinyMCE};
