const dateUtils = (t) => {
    const dateFormatter = new Intl.DateTimeFormat('id', { dateStyle: 'full', timeStyle: 'long' });
    let localDate = new Date(t) ;    
    let time
    try{
        localDate.setHours(localDate.getHours() + (localDate.getTimezoneOffset()/60));
        time = dateFormatter.format(localDate);    
    } catch {
        localDate = new Date()
        time = dateFormatter.format(localDate);
    }

    return time;
}

const dateUtilsArray = (t) => {
    t = new Date(...t);
    const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeStyle: 'long' });
    let localDate = new Date(t) ;
    localDate.setHours(localDate.getHours() + (localDate.getTimezoneOffset()/60));
    const time = dateFormatter.format(localDate);
    return time;
}

const calculateDate = (startDate, endDate) => {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    const elapsedDate = newEndDate.getTime() + newStartDate.getTime();
    return elapsedDate / (1000 * 3600 * 24);
};

const getIndoMonth = (month) => {
    const monthValidate = (month < 1 || month > 12) ? 1 : month;
    const monthList = [
        'Januari', 
        'Februari', 
        'Maret', 
        'April', 
        'Mei', 
        'Juni', 
        'Juli', 
        'Agustus', 
        'September', 
        'Oktober',
        'November',
        'Desember'];
    return monthList[monthValidate-1];
}

export {
    dateUtils, 
    dateUtilsArray,
    calculateDate,
    getIndoMonth
}