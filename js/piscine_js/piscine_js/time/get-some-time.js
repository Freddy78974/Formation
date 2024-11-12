// function firstDayWeek(week, year) {
//     let date;
//     let assemblage;
//     const oneWeek = (24*60*60*1000*7);
//     if (week === 1) {
//         date = new Date(`${year}-01-01`)
//         console.log("if",date)
//         console.log(date.getMonth())
//         if (date.getMonth() === 0) {
//             let days = date.getDay()-2
//             let month = date.getMonth()+1
//             console.log("days",days)
//             assemblage = String(days).padStart(2, '0') + '-' + String(month).padStart(2,'0')+ '-' + String(year)
//     } else {
//         let days = date.getDay()
//         let month = date.getMonth()+1
//         console.log("dayselse",days)
//         assemblage = String(days).padStart(2, '0') + '-' + String(month).padStart(2,'0')+ '-' + String(year)
//     }
// } else {
//     date = new Date(new Date(year).setMilliseconds(oneWeek*(week-1)))
//     console.log("else",date)
//     let days = date.getDay()
//     let month = date.getMonth()+1
//     console.log("else1",days)
//     assemblage = String(days).padStart(2, '0') + '-' + String(month).padStart(2,'0')+ '-' + String(year)
// }
    
//     // console.log("ok",assemblage)
//     return assemblage
// }



function firstDayWeek(week, year){
    
    let firstDayOfYear = new Date(`${year}-01-01`)
    
    if (week >1){
        
        firstDayOfYear.setDate((week - 1) * 7 )
        
        firstDayOfYear.setDate(firstDayOfYear.getDate() - firstDayOfYear.getDay()+1)
        
        let formattedDate = `${String(firstDayOfYear.getDate()).padStart(2, '0')}-${String(firstDayOfYear.getMonth() + 1).padStart(2, '0')}-${String(firstDayOfYear.getFullYear()).padStart(4,'0')}`
        
        return formattedDate
    }
    let formattedDate = `${String(firstDayOfYear.getDate()).padStart(2, '0')}-${String(firstDayOfYear.getMonth() + 1).padStart(2, '0')}-${String(firstDayOfYear.getFullYear()).padStart(4,'0')}`
    
    return formattedDate
}
console.log(firstDayWeek(1, '1000'), '01-01-1000')
console.log(firstDayWeek(52, '1000'), '22-12-1000')