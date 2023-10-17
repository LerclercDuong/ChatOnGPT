export default function timeFormat(time){
    const timestamp = new Date(time);

    const options = {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    };

    const formattedTimestamp = timestamp.toLocaleString("en-GB", options);
    return formattedTimestamp;
}