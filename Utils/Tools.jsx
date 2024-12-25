'use client'
import moment from 'moment-jalaali';
import { useLang } from "@/lib/lang";

class Tools{
    static getArray(obj){
        return Tools.isArray(obj)? obj : [];
    }

    static getObj(obj, message='')
    {
        if(obj==null || obj==undefined || obj=='')
        {
            return  message;
        }
        else
        {
            return  obj;
        }
    }

    static getValue(obj, path, returnIfNull=null) {
        let result = obj;

        let paths = path?path.split('.'):[];
        paths.shift();

        paths.forEach((slice)=>{
            if(result!=null && result[slice] != undefined){
                result = result[slice];
            }
            else{
                result = returnIfNull;
            }
        });
        return result;
    }

    static inArray(search, array=[]){
        let find = false;
        array.forEach((item)=> {
            if(search == item) find = true
        });
        return find;
    }

    static isArray(obj){
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    static isString(obj){
        if (typeof obj === 'string' || obj instanceof String)
            return true;
        else
            return false;
    }

    static numbersEnToFa(num){
        let numbers = {'0':'۰', '1':'۱', '2':'۲', '3':'۳', '4':'٤',
                        '5':'۵', '6':'۶', '7':'۷', '8':'۸', '9':'۹'};

        if(num != undefined)
        if(Tools.isString(num)){
            Object.keys(numbers).forEach((key, index) => {
                num = num.replace(key, numbers[key]);
            });
        }
        else if(Tools.isArray(num)){
            for(let i=0; i< num.length; i++){
                if(num[i] != undefined)
                Object.keys(numbers).forEach((key, index) => {
                    num[i] = num[i].replace(key, numbers[key]);
                });
            }
        }

        return num;
    }

    static numbersFaToEn(num){
        let numbers = {'۰':'0', '۱':'1', '۲':'2', '۳':'3', '٤':'4',
                        '۵':'5', '۶':'6', '۷':'7', '۸':'8', '۹':'9'};

        if(num != undefined)
        if(Tools.isString(num)){
            Object.keys(numbers).forEach((key, index) => {
                num = num.replace(key, numbers[key]);
            });
        }
        else if(Tools.isArray(num)){
            for(let i=0; i< num.length; i++){
                if(num[i] != undefined)
                Object.keys(numbers).forEach((key, index) => {
                    num[i] = num[i].replace(key, numbers[key]);
                });
            }
        }
        return num;
    }

    static getLastRouteId(props){
        let routeVar = props.match.params;
        let param = Object.keys(routeVar)[Object.keys(routeVar).length-1];
        let id = routeVar[param];
        return id;
    }

    static base64Encode(s) {
        return btoa(unescape(encodeURIComponent(s)));
    }

    static  base64Decode(s) {
        return decodeURIComponent(escape(atob(s)));
    }

    static boolean(val){
        var falsy = /^(?:f(?:alse)?|no?|0+)$/i;
        Boolean.parse = function(val) {
            return !falsy.test(val) && !!val;
        };
        return Boolean.parse(val);
    }

    static getAsCurrency(value){
        if(!value)
        return null;
        let val = value.toString().replace(/,/g, ''),
        result = val,
        i = 0,
        number = '';

        while(result > 0){
            i++;
            let n = result % 10;
            result = (result - n) / 10;
            number = n + number;
            if(i % 3 == 0 && result > 0){
                number = ',' + number;
            }
        }
        return number;
    }

    static compareDateWithToday(targetDate) {
        const today = new Date();
        const target = new Date(targetDate);

        // Compare years
        if (target.getFullYear() < today.getFullYear()) {
            return 'before';
        } else if (target.getFullYear() > today.getFullYear()) {
            return 'after';
        }

        // Compare months
        if (target.getMonth() < today.getMonth()) {
            return 'before';
        } else if (target.getMonth() > today.getMonth()) {
            return 'after';
        }

        // Compare days
        if (target.getDate() < today.getDate()) {
            return 'before';
        } else if (target.getDate() > today.getDate()) {
            return 'after';
        }

        // Dates are equal
        return 'same';
        // Example usage of the function
        // const targetDate = '2024-05-20'; // Enter your target date here
        // console.log(compareDates(targetDate));
    }

    static formatDate(dateString) {
        if (!dateString) {
            return "Invalid date!";
        }
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dateParts = dateString.split("-");
        const year = dateParts[0];
        const month = months[parseInt(dateParts[1]) - 1];
        const day = parseInt(dateParts[2]);

        return `${day} ${month}, ${year}`;
    }
    static formatDateSh(dateString, str="-") {
        if (!dateString) {
            return "Invalid date!";
        }
        const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
        const dateParts = dateString.split(str);
        const year = dateParts[0];
        const month = months[parseInt(dateParts[1]) - 1];
        const day = parseInt(dateParts[2]);

        return `${day} ${month}, ${year}`;
    }

    // Function to convert Gregorian date to Jalali date in "سال ماه روز" format
    static toJalaliDateString(gregorianDate) {
        if (!gregorianDate) return ''; // Handle null or undefined input
        // console.log(gregorianDate);

        // Define possible input formats
        const inputFormats = [
            'YYYY-MM-DDTHH:mm:ss', // With time
            'YYYY-MM-DD', // Without time
            'DD-MM-YYYY HH:mm', // Custom format with time
            'DD-MM-YYYY', // Custom format without time
            'DD.MM.YYYY HH:mm', // Custom format with time (عبادی اضافه کرده جهت نیاز به فرمت ک در مدل هست)
        ];

        let momentDate = null;

        // Iterate over input formats to find a valid moment date
        for (let format of inputFormats) {
            momentDate = moment(gregorianDate, format, true);
            if (momentDate.isValid()) {
                break;
            }
        }

        // Check if a valid moment date was found
        if (!momentDate || !momentDate.isValid()) {
            return ''; // Return empty string for invalid dates
        }

    // Format for Jalali date
    let jalaliFormat = 'jYYYY/jMM/jDD';
    if (momentDate.format('HH:mm:ss') !== '00:00:00') {
        jalaliFormat += ' HH:mm'; // Add time if not midnight
    }

    // Convert to Jalali date format
    const jalaliDate = momentDate.format(jalaliFormat);
    return jalaliDate;
}

    // Function to Scroll In Page
    static scrollPage(toBottom = false, position = "") {
        (toBottom)?
            position = position != "" ? position : document.body.scrollHeight
        :
            position = position != "" ? position : 250;
            
        typeof window !== "undefined" && window?.$('html,body').animate({ scrollTop: position }, "slow");
    };

    // Function to Get & Display of gender
    static displayGender( gender="", genderId=1 ) {
        const { Lang,local } = useLang();

        return(
            gender?
                gender?.["title_"+local] + ((genderId == 1)? Lang(["public.y"," "]) : "")
            :
                ""
        );
    };
}

export {Tools};
