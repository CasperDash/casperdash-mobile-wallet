/**
 * Return formatted date.
 * @param {String} dateString - Date.
 * @param {Object} options - Format options.
 * @param {String} locales - Locales.
 * @return {String} Formatted date.
 */
export const toFormattedDate = (
  dateString: string,
  locales?: string,
  options: any = { dateStyle: 'short', timeStyle: 'medium', hour12: false },
) => {
  let date = new Date(dateString);

  if (!(date instanceof Date)) {
    date = new Date();
  }
  return new Intl.DateTimeFormat(locales, options).format(date);
};
