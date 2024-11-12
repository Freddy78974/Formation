function isFriday(date) {
    if (date.getDay() === 5) {
        return true;
    } 
    return false;
}

//----------------------------------------------------------------

function isWeekend(date) {
    if (date.getDay() === 6 || date.getDay() === 7) {
        return true;
    }
    return false;
}

//----------------------------------------------------------------

function isLeapYear(date) {
    if (date.getYear()%4 === 0) {
        return true;
    }
    return false;
}

//----------------------------------------------------------------

function isLastDayOfMonth(date) {
    date.setDate(date.getDate()+1)
    if (date.getDate() === 1) {
        return true;
    }
    return false;
}