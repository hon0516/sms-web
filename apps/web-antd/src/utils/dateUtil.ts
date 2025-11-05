/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD ';
const DATE_HMS = 'HH:mm:ss ';

export function formatToDateTime(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToDate(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format);
}
export function formatToHMS(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_HMS,
): string {
  return dayjs(date).format(format);
}
export function formatWeekday() {
  let days: any = new Date().getDay();
  switch (days) {
    case 0: {
      days = '星期日';
      break;
    }
    case 1: {
      days = '星期一';
      break;
    }
    case 2: {
      days = '星期二';
      break;
    }
    case 3: {
      days = '星期三';
      break;
    }
    case 4: {
      days = '星期四';
      break;
    }
    case 5: {
      days = '星期五';
      break;
    }
    case 6: {
      days = '星期六';
      break;
    }
  }
  return days;
}
export const dateUtil = dayjs;
