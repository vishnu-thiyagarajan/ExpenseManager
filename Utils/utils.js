export const getStartEndOfWeek = () => {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay(); 
    const last = first + 6;
    const firstday = new Date(curr.setDate(first));
    const lastday = new Date(curr.setDate(last));
    return {'startOfWeek' : firstday.getTime(), 'endOfWeek' : lastday.getTime()}
}

export const timeStampToDate = (timestamp) =>{
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-IN', {year: '2-digit', month: '2-digit', day: '2-digit' });
    return formattedDate;
}

export const oneWeekInTimestamp = 518400000;
