export const getCurrentDateTime = (): string => {
    const date = new Date();
    
    const dateOptions: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Europe/Helsinki"
    }

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Europe/Helsinki"
    }

    const formattedDate = new Intl.DateTimeFormat("fi-FI", dateOptions).format(date);
    const formattedTime = new Intl.DateTimeFormat("fi-FI", timeOptions).format(date);

    return `${formattedDate} ${formattedTime}`;
}
