import moment from 'moment';
import { DATE_FORMAT } from 'shared/constants';

/**
 * @description This function return the date string with the format used throughout the whole app
 * @param String {date} the date string without the proper format
 * @returns string
 */
export const formatDate = (date: moment.MomentInput) => moment(date).format(DATE_FORMAT);
