"use client";

export function date(dateTimeRegister){
  const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
  ]; 
  let dateTime = new Date(dateTimeRegister);
  let year = dateTime.getFullYear();
  let month = dateTime.getMonth();
  let day = dateTime.getDate();
  let monthName = months[month];
  let dateRegister = day+" "+monthName+" "+year;
    return dateRegister;
};
