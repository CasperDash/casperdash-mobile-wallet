import { MOTE_RATE } from '../constants/key';
import { Config } from 'utils';

/**
 * Return formatted number.
 * @param {Number} num - Number.
 * @param {Object} options - Format options.
 * @param {String} locales - Locales.
 * @return {String} Formatted number.
 */
export const toFormattedNumber = (num = 0, options = {}, locales = Config.defaultLocale) => {
  const number = new Intl.NumberFormat(locales, {
    maximumFractionDigits: 4,
    ...options,
  });
  return number.format(num) || '0';
};

/**
 * Return formatted number by currency.
 * @param {Number} num - Number.
 * @param {Object} options - Format options.
 * @param {String} locales - Locales.
 * @return {String} Formatted number by currency.
 */
export const toFormattedCurrency = (num = 0, options = {}, locales = Config.defaultLocale) => {
  const defaultOpt = {
    style: 'currency',
    currency: 'USD',
  };
  return new Intl.NumberFormat(locales, { ...defaultOpt, ...options }).format(num);
};

/**
 * Return formatted date.
 * @param {String} dateString - Date.
 * @param {Object} options - Format options.
 * @param {String} locales - Locales.
 * @return {String} Formatted date.
 */
export const toFormattedDate = (
  dateString: string,
  options: any = { dateStyle: 'short', timeStyle: 'medium', hour12: false },
  locales = Config.defaultLocale,
) => {
  let date = new Date(dateString);

  if (!(date instanceof Date)) {
    date = new Date();
  }
  return new Intl.DateTimeFormat(locales, options).format(date);
};

/**
 * Return - if NaN
 * @param {number} value
 */
export const displayNaN = (value: number) => {
  return Number.isNaN(value) || isNaN(value) ? '-' : value;
};

/**
 * Get end string by number or regex
 * @param {string} fullString
 * @param {number} end
 */
export const getEndString = (fullString: string, end: any) => {
  if (typeof fullString !== 'string') {
    return fullString;
  }
  if (typeof end === 'string') {
    return end;
  } else if (typeof end === 'number') {
    return fullString.slice(-Math.abs(end));
  } else if (end instanceof RegExp) {
    const match = fullString.match(end);
    if (!match) {
      return '';
    }
    const index = match.index;
    return fullString.slice(index);
  }
};

/**
 * get display value from mote
 * @param {number} mote
 * @param {object} options
 */
export const toDisplayValueFromMote = (mote: number, options: any) => {
  return toFormattedNumber(mote / MOTE_RATE, options);
};

/**
 * It takes a value and an options object, and returns the value formatted according to the format
 * specified in the options object
 * @param {any} value - the value to be formatted
 * @param {any} options - {
 */
export const getValueByFormat = (value: any, options: any) => {
  const { format, ...formatOptions } = options;
  switch (format) {
    case 'currency':
      return toFormattedCurrency(value, formatOptions);
    case 'number':
      return toFormattedNumber(value, formatOptions);
    case 'date':
      return toFormattedDate(value, formatOptions);
    case 'mote':
      return toDisplayValueFromMote(value, options);
    case 'percentage':
      // value store in blockchain is int, the percentage is already multiplied by 100
      return toFormattedNumber(value / 100, {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    default:
      return value;
  }
};

/**
 * It replaces all Vietnamese characters with their non-accented counterparts
 * @param {string} str - The string to be converted.
 */
export const nonAccentText = (str: string) => {
  if (str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    str = str.replace(/[^0-9a-z_\-\s#*./(\\)]/gi, '');
  }
  return str;
};
