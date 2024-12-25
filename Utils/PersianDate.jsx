class PersianDate extends Date {
    constructor(...args) {
        super(...args);
    }

    toLocaleDateString = () => super.toLocaleDateString('fa-IR-u-nu-latn');
    getParts = () => super.toLocaleDateString().split("/")
    getDay = () => super.getDay() === 6 ? 0 : super.getDay() + 1
    getDate = () => this.getParts()[2];
    getMonth = () => this.getParts()[1] - 1;
    getYear = () => this.getParts()[0];
    getMonthName = () => super.toLocaleDateString("fa-IR", { month: 'long' });
    getDayName = () => super.toLocaleDateString("fa-IR", { weekday: 'long' });
}

// usage
/*
let date = new PersianDate();
date.getYear()      // 1399
date.getMonth()     // 1
date.getDate()      // 23
date.getDay()       // 0
date.getDayName()   // شنبه
date.getMonthName() // اردیبهشت

date.getHours()     // 18
date.getMinutes()   // 59
date.getSeconds()   // 30

date.setTime(1469854231000);
date.getYear()      // 1395
date.getMonthName() // مرداد
*/

// https://stackoverflow.com/questions/35570884/how-to-change-gregorian-date-to-persian-date-in-javascript