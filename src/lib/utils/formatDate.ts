type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: string, dateStyle: DateStyle = 'long', locales = 'nl') {
    const dateToFormat = new Date(date.replaceAll('-', '/'));
    const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
    const formattedDate = dateFormatter.format(dateToFormat);

    // Capitalize the first letter of the month
    return formattedDate.replace(/\b\p{L}/u, (char) => char.toUpperCase());
}

export function formatDateToISO8601(date: string) {
    return date + 'T00:00:00+01:00';
}
