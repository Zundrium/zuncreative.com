type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: string | Date, dateStyle: DateStyle = 'long', locales = 'en') {
    const dateToFormat = typeof date === 'string' ? new Date(date.replaceAll('-', '/')) : date;
    const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
    const formattedDate = dateFormatter.format(dateToFormat);

    // Capitalize the first letter of the month
    return formattedDate.replace(/\b\p{L}/u, (char) => char.toUpperCase());
}

export function formatDateToISO8601(date: string) {
    return date + 'T00:00:00+01:00';
}
