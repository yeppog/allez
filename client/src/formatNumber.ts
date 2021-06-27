const minuteInMili = 60000;
const hourInMili = 3.6e6;
const dayInMili = 8.64e7;
const weekInMili = 6.048e8;
const monthInMili = 2.628e9;
const yearInMili = 3.154e10;

export const formatTimeToString = (date: number) => {
  if (date < 60000) {
    return 'Now';
  } else if (date < hourInMili) {
    return date / minuteInMili < 2
      ? (date / minuteInMili).toFixed().toString() + ' minute ago'
      : (date / minuteInMili).toFixed().toString() + ' minutes ago';
  } else if (date < dayInMili) {
    return date / hourInMili < 2
      ? (date / hourInMili).toFixed().toString() + ' hour ago'
      : (date / hourInMili).toFixed().toString() + ' hours ago';
  } else if (date < weekInMili) {
    return date / dayInMili < 2
      ? (date / dayInMili).toFixed().toString() + ' day ago'
      : (date / dayInMili).toFixed().toString() + ' days ago';
  } else if (date < monthInMili) {
    return date / weekInMili < 2
      ? (date / weekInMili).toFixed().toString() + ' week ago'
      : (date / weekInMili).toFixed().toString() + ' weeks ago';
  } else if (date < yearInMili) {
    return date / monthInMili < 2
      ? (date / monthInMili).toFixed().toString() + ' month ago'
      : (date / monthInMili).toFixed().toString() + ' months ago';
  } else {
    return date / yearInMili < 2
      ? (date / yearInMili).toFixed().toString() + ' year ago'
      : (date / yearInMili).toFixed().toString() + ' years ago';
  }
};

export const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 100000) % 10 === 0
      ? (num / 1000000).toFixed().toString() + 'm'
      : (num / 1000000).toFixed(1).toString() + 'm';
  } else if (num >= 1000) {
    return (num / 100) % 10 === 0
      ? (num / 1000).toFixed().toString() + 'k'
      : (num / 1000).toFixed(1).toString() + 'k';
  } else {
    return num.toString();
  }
};
