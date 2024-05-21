'use client';

import {useEffect, useState} from 'react';
import {useFormElement} from '@/Theme/Midone';
import {useConfig} from '@/lib/config';
import axios from '@/lib/axios';
import {default as DropzoneMain} from "dropzone";
DropzoneMain.autoDiscover = false;

const Dropzone = (props) => {
    let {refItem, className, uploadDir, deleteUrl, uploadUrl} = props;
    let {maxFiles, maxFilesize, acceptType, maxImageWidth, maxImageHeight, minImageWidth, minImageHeight} = props;

    let Element = useFormElement(props);
    let {id, label, helpDiv, divError, requiredDiv, defaultValue} = Element.init("Dropzone");
    let [run, setRun] = useState(false)
    let [mockFiles, setMockFiles] = useState([]);
    let [myDropzone, setMyDropzone] = useState()

    const {laraDomain} = useConfig();

    const getLangVars = () =>{
        let langs = {
            dictDefaultMessage: 'رها کردن فایل جهت آپلود',
            dictFallbackMessage: 'مرورگر شما، عمل کشیدن و رها کردن عکس را پشتیبانی نمی کند!!',
            dictFallbackText: 'Please use the fallback form below to upload your files like in the olden days.',
            dictFileTooBig: 'حجم فایل از حدمجاز بیشتر می باشد ({{filesize}}MiB). حداکثر حجم فایل: {{maxFilesize}}MiB.',
            dictInvalidFileType: 'آپلود فایل از این نوع مجاز نمی باشد.',
            dictResponseError: 'سرور پاسخی با کد {{statusCode}} ارسال کرده است.',
            dictCancelUpload: 'لغو آپلود',
            dictCancelUploadConfirmation: 'آیا از کنسل شدن آپلود مطمئن هستید?',
            dictRemoveFile: 'حذف فایل',
            dictMaxFilesExceeded: 'شما نمی توانید فایل های بیشتری آپلود نمایید.',
        };
        return langs;
    }    

    const getDropzoneConfig = ()=>{
        // let langs = getLangVars();
        var djsConfig = {
            autoProcessQueue: true,
            maxFiles: maxFiles,
            maxFilesize: maxFilesize,
            // addRemoveLinks: true,
            addRemoveLinks: true,
            acceptedFiles: acceptType,
            // ...langs,
            init: function () {
                this.on('success', function(file, responseText) {
                    file.previewTemplate.setAttribute('id',responseText);
                    window.$(".dz-remove").attr('href', "#");
                });
                this.on('error', function(file, response) {
                    window?.$(file.previewElement).find('.dz-error-message').text('server upload error!!');
                });
                this.on('thumbnail', function(file) {
                    if (file.rejectDimensions !== undefined || file.acceptDimensions !== undefined) {
                        if (maxImageWidth != undefined && maxImageWidth != '' && (file.width > maxImageWidth || file.height > maxImageHeight)) {
                            file.rejectMaxDimensions()
                        }
                        else if (minImageWidth != undefined && minImageWidth != '' && (file.width < minImageWidth || file.height < minImageHeight)) {
                            file.rejectMinDimensions()
                        }
                        else {
                            file.acceptDimensions();
                        }
                    }
                });
            },
        }
  
        return djsConfig;
    }

    const getFileName = (fileName)=>{
        let files;
  
        if(typeof fileName == 'string'){
            fileName = fileName.replace(/###/g, '');
            files = fileName.split('/');
        }
        else{
            files = fileName?.name?.split('/');
        }
  
        return files?.[files.length - 1];
    }

    const getfilesize = (url) =>{
        
    }

    const processDefaultValue = ()=>{
        let vals = '';
        if(defaultValue != undefined && defaultValue != ''){
            // For Array type
            if(typeof defaultValue != 'string'){
                // Like [file1, file2, ...]
                if(typeof defaultValue[0] == "string"){
                    vals = defaultValue.join('###');
                    if(vals != '') vals = vals + '###';
                }
                // Like [{url, extension}, {url, extension}, ...]
                else{
                    defaultValue.forEach((item)=>{
                        if(item.url != undefined && item.name == undefined)
                            vals += item.url+'.'+item.extension+'###';
                        else
                            vals += getFileName(item)+'###';
                    });
                }
                
            }
            // For String type Like file.png
            else{
                vals = defaultValue;
            }
        }
        return {vals};
    }

    const changeDropzone = (value)=>{
        let files = value.split('###');
        files.forEach(element => {
            if(element != ""){
                let name = getFileName(element), path = uploadDir?uploadDir:"";
                path = laraDomain+"/"+path+name;
                let size = element?.size;
                if(element?.size == undefined) {
                    size = getfilesize(path);
                }
                
                var mockFile = {name: name, size: size};
                if(mockFiles.indexOf(mockFile.name) == -1){
                    mockFiles.push(mockFile.name);
                    myDropzone.options.addedfile.call(myDropzone, mockFile);
                    myDropzone.options.thumbnail.call(myDropzone, mockFile, path);
                }
            }
        });
        
    }

    const getEventHandler = () =>{
        var eventHandlers = {
            success:(file)=>{
                state.value += file.xhr.response+"###";
                setState({...state, value: state.value});
            },            
            maxfilesexceeded:(file)=>{
                this.removeFile(this.files[0])
            },
            removedfile: async (file) => {
                let path = '';
                if(file.xhr != null){
                    path = file.xhr.response;
                }
                else{
                    path = file.name;
                }
                window.$(file.previewElement).remove();
                state.value = state.value.replace(path+'###', '', 'g');
                await axios.get(laraDomain+deleteUrl+path);
                
                setState({value: state.value});
            }
        }
  
        return eventHandlers;
    }

    let [state, setState] = useState({
        value: "",
        key: 0,
    });    

    useEffect(()=>{
        let {vals} = processDefaultValue();
        if(!run){
            let djsConfig = getDropzoneConfig();
            djsConfig.url = laraDomain+uploadUrl;
            state.vals = vals;
            let eventHandlers = getEventHandler();
            let dropzoneObj = new DropzoneMain("#dropzone-"+id, {...djsConfig, ...eventHandlers});
            setMyDropzone(dropzoneObj);
        }
        run = true;
    }, []);

    useEffect(()=>{
        let {vals} = processDefaultValue();
        setState({value:vals, key: Math.random()});
        changeDropzone(vals);
    }, [defaultValue]);

    return (
        <div className={className?className:" mb-3 col-span-6"}>
            <label htmlFor={id} className="form-label font-bold">{label} {requiredDiv}</label>
                <div className="dropzone dz-clickable" id={"dropzone-"+id}>
                    <div className="dz-default dz-message" dataDzMessage="">
                        <span>Drop files here to upload</span>
                    </div>
                </div>
                <input type='hidden' 
                        id={id}
                        ref={Element.createRef(refItem)} 
                        defaultValue={state?.value}
                    />
                {helpDiv}
                {divError}
        </div>
      );

}

export {Dropzone};
