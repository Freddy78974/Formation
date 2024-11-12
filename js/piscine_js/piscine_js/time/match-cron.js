function matchCron(cron, date) {
    const cronSplit = cron.split(' ');
    if (cronSplit.length != 5) {
        return false;
    }

    const min = cronSplit[0];
    const hour = cronSplit[1];
    const dayMonth = cronSplit[2];
    const month = cronSplit[3];
    const dayWeek = cronSplit[4];

    // console.log(date.getMonth())
    // console.log(date.getMinutes(), " != ", Number(min), " && ", min, " != '*' && (", Number(min), " < 0 || ", Number(min), " > 60)")
    let check = true;
    if ((date.getMinutes() != Number(min) && min != '*') || (Number(min) < 0 || Number(min) > 60)) {
        check = false;
    }
    if ((date.getHours() != Number(hour) && hour != '*') || (Number(hour) < 0 || Number(hour) > 23)) {
        check = false;
    }
    if ((date.getDate() != Number(dayMonth) && dayMonth != '*') || (Number(dayMonth) < 1 || Number(dayMonth) > 31)) {
        check = false;
    }
    if ((date.getMonth()+1 != Number(month) && month != '*') || (Number(month) < 1 || Number(month) > 12)) {
        check = false;
    }
    if ((date.getDay() != Number(dayWeek) && dayWeek != '*') || (Number(dayWeek) < 1 || Number(dayWeek) > 7)) {
        check = false;
    }


    if (check) {
        return true;
    }
    return false;
}