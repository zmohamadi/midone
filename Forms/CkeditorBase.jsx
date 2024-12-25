'use client';

import { useFormElement } from './Element';
import { useState, useEffect } from 'react';

import dynamic from "next/dynamic";
const CKEditorMain = dynamic(() => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor), {ssr: false});
import ClassicEditor from './ckeditorMin';
import { useConfig } from "@/lib/config";

export const CKEditor = (props)=>{
    let {refItem, dir, height, font, className} = props;
    let Element = useFormElement(props);
    let {id, label, helpDiv, divError, requiredDiv, defaultValue } = Element.init();

    if(!dir) dir = 'rtl';
    if(!height) height = 500;
    if(!font) font = 'IRANSans';

    let [state, setState] = useState({
        value: defaultValue,
        editor: '',
    });    

    useEffect(()=>{
        setState({...state, value: defaultValue});
    }, [refItem[0].state.info]);

    const custom_config = {
        extraPlugins: [MyCustomUploadAdapterPlugin],
        allowedContent: 'p b i; a[!href] table',
        image: {
            toolbar: [
                'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
                '|',
                'imageResize',
                '|',
                'imageTextAlternative'
            ],
            styles: [
                'alignLeft', 'alignCenter', 'alignRight'
            ],
            resizeOptions: [
                {
                    name: 'imageResize:original',
                    label: 'Original',
                    value: null
                },
                {
                    name: 'imageResize:50',
                    label: '50%',
                    value: '50'
                },
                {
                    name: 'imageResize:75',
                    label: '75%',
                    value: '75'
                }
            ],
        },
        toolbar: [
            'undo', 'redo', '|',
            {
                label: 'Basic styles',
                withText: true,
                icon: '<svg viewBox="0 0 68 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M43.71 11.025a11.508 11.508 0 0 0-1.213 5.159c0 6.42 5.244 11.625 11.713 11.625.083 0 .167 0 .25-.002v16.282a5.464 5.464 0 0 1-2.756 4.739L30.986 60.7a5.548 5.548 0 0 1-5.512 0L4.756 48.828A5.464 5.464 0 0 1 2 44.089V20.344c0-1.955 1.05-3.76 2.756-4.738L25.474 3.733a5.548 5.548 0 0 1 5.512 0l12.724 7.292z" fill="#FFF"/><path d="M45.684 8.79a12.604 12.604 0 0 0-1.329 5.65c0 7.032 5.744 12.733 12.829 12.733.091 0 .183-.001.274-.003v17.834a5.987 5.987 0 0 1-3.019 5.19L31.747 63.196a6.076 6.076 0 0 1-6.037 0L3.02 50.193A5.984 5.984 0 0 1 0 45.003V18.997c0-2.14 1.15-4.119 3.019-5.19L25.71.804a6.076 6.076 0 0 1 6.037 0L45.684 8.79zm-29.44 11.89c-.834 0-1.51.671-1.51 1.498v.715c0 .828.676 1.498 1.51 1.498h25.489c.833 0 1.51-.67 1.51-1.498v-.715c0-.827-.677-1.498-1.51-1.498h-25.49.001zm0 9.227c-.834 0-1.51.671-1.51 1.498v.715c0 .828.676 1.498 1.51 1.498h18.479c.833 0 1.509-.67 1.509-1.498v-.715c0-.827-.676-1.498-1.51-1.498H16.244zm0 9.227c-.834 0-1.51.671-1.51 1.498v.715c0 .828.676 1.498 1.51 1.498h25.489c.833 0 1.51-.67 1.51-1.498v-.715c0-.827-.677-1.498-1.51-1.498h-25.49.001zm41.191-14.459c-5.835 0-10.565-4.695-10.565-10.486 0-5.792 4.73-10.487 10.565-10.487C63.27 3.703 68 8.398 68 14.19c0 5.791-4.73 10.486-10.565 10.486v-.001z" fill="#1EBC61" fill-rule="nonzero"/><path d="M60.857 15.995c0-.467-.084-.875-.251-1.225a2.547 2.547 0 0 0-.686-.88 2.888 2.888 0 0 0-1.026-.531 4.418 4.418 0 0 0-1.259-.175c-.134 0-.283.006-.447.018-.15.01-.3.034-.446.07l.075-1.4h3.587v-1.8h-5.462l-.214 5.06c.319-.116.682-.21 1.089-.28.406-.071.77-.107 1.088-.107.218 0 .437.021.655.063.218.041.413.114.585.218s.313.244.422.419c.109.175.163.391.163.65 0 .424-.132.745-.396.961a1.434 1.434 0 0 1-.938.325c-.352 0-.656-.1-.912-.3-.256-.2-.43-.453-.523-.762l-1.925.588c.1.35.258.664.472.943.214.279.47.514.767.706.298.191.63.339.995.443.365.104.749.156 1.151.156.437 0 .86-.064 1.272-.193.41-.13.778-.323 1.1-.581a2.8 2.8 0 0 0 .775-.981c.193-.396.29-.864.29-1.405h-.001z" fill="#FFF" fill-rule="nonzero"/></g></svg>',
                items: [ 'indent', 'outdent','heading', 'alignment','bold', 'italic', 'underline', 'subscript', 'subscript', 'blockQuote']
            }, '|',
            {
                label: 'Fonts',
                icon: 'text',
                withText: true,
                // items: [ 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor' ]
                items: [  'fontSize', 'fontColor', 'fontBackgroundColor', 'codeBlock' ]
            }, '|',
            {
                // This dropdown has the icon disabled and a text label instead.
                label: 'Lists',
                withText: true,
                icon: 'threeVerticalDots',
                items: [ 'bulletedList', 'numberedList' ]
            }, '|',
            {
                // A "plus" sign icon works best for content insertion tools.
                label: 'Insert',
                withText: true,
                icon: 'plus',
                items: [ 'link', 'insertTable', 'uploadImage',  'mediaEmbed']
            }, '|',
            
        ],        
        toolbar1: {
            items: [
                'heading',
                'fontFamily',
                'fontSize',
                'alignment',
                'bold',
                'italic',
                'underline',
                'highlight',
                'fontColor',
                'direction',
                'fontBackgroundColor',
                '|',
                'link',
                'bulletedList',
                'numberedList',
                'subscript',
                'superscript',
                '|',
                'indent',
                'outdent',
                'specialCharacters',
                'removeFormat',
                'strikethrough',
                'horizontalLine',
                '|',
                'imageUpload',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'undo',
                'redo',
                'exportPdf',
                'MathType',
                'ChemType'
            ]
        },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        },
        language: 'en'
    }
    if(!ClassicEditor) 
        return <>Loading!!</>
    else
    return <>
        <div className={className?className:' mb-3 col-span-12'} >
            <label htmlFor={id} className='form-label font-bold'>{label} {requiredDiv}</label>
                <input type="hidden" id={id} value={state.value} ref={Element.createRef(refItem)} />
                <CKEditorMain
                    editor={ ClassicEditor }
                    config={ custom_config }
                    data={state.value}
                    onBlur={ ( event, editor ) => {
                        if(editor)
                        setState({...state, value: editor?.data.get()})
                    } }
                    onReady={ ( editor ) => editor && setState({...state, editor }) }                   
                />
            {helpDiv}
            {divError}
        </div>
    </>
}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader)
    }
}

class MyUploadAdapter {
    constructor(props) {
        let {laraAdmin, laraDomain} = useConfig();
        this.loader = props;
        this.url = laraDomain+laraAdmin + '/ckupload/.-media-files' // Your API endpoint
    }

    upload() {
        return new Promise((resolve, reject) => {
            this._initRequest();
            this._initListeners(resolve, reject);
            this._sendRequest();
        });
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        xhr.open('POST', this.url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
        // xhr.setRequestHeader('Authorization', getToken())
    }

    _initListeners(resolve, reject) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${loader.file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            resolve({
                default: response.fileUrl
            });
        });

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    _sendRequest() {
        const data = new FormData();

        this.loader.file.then(result => {
                data.append('file', result); // `file` is a key in form-data, to upload the image or others
                this.xhr.send(data);
            }
        )
    }

}
