const Week = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday",
   
};

function sunnySunday(date) {
    let time = date.getTime() + 62135596800000; //equivalent to DateTime.MinValue UTC
    return Week[(time / (24*3600*1000)) % 6];
}