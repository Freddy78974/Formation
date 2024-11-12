function isValid(date) {
    
    return (!isNaN(date) && new Date(date).toString()!= 'Invalid Date');
}

//--------------------------------

function isAfter(Date, date) {
    if (Date > date) {
        return true;
    }
    return false;
}

//--------------------------------

function isBefore(Date, date) {
    if (Date < date) {
        return true;
    }
    return false;
}

//--------------------------------

function isFuture(date) {
    if (isValid(date) && new Date()< date) {
        return true;
    }
    return false;
}

//--------------------------------

function isPast(date) {
    if (isValid(date) && new Date()> date) {
        return true;
    }
    return false;
}