export function formatDate(date: Date): string {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const dateInSeconds = Math.floor(date.getTime() / 1000);

  const difference = nowInSeconds - dateInSeconds;
  let output = ``;
  if (difference < 60) {
    // Less than a minute has passed:
    // output = `${difference} ${difference === 1 ? "second" : "seconds"} ago`;
    output = "less than a minute ago";
  } else if (difference < 3600) {
    // Less than an hour has passed:
    output = `${Math.floor(difference / 60)} ${
      Math.floor(difference / 60) === 1 ? "minute" : "minutes"
    } ago`;
  } else if (difference < 86400) {
    // Less than a day has passed:
    output = `${Math.floor(difference / 3600)} ${
      Math.floor(difference / 3600) === 1 ? "hour" : "hours"
    } ago`;
  } else if (difference < 2620800) {
    // Less than a month has passed:
    output = `${Math.floor(difference / 86400)} ${
      Math.floor(difference / 86400) === 1 ? "day" : "days"
    } ago`;
  } else if (difference < 31449600) {
    // Less than a year has passed:
    output = `${Math.floor(difference / 2620800)} ${
      Math.floor(difference / 2620800) === 1 ? "month" : "months"
    } ago`;
  } else {
    // More than a year has passed:
    output = `${Math.floor(difference / 31449600)} ${
      Math.floor(difference / 31449600) === 1 ? "year" : "years"
    } ago`;
  }

  return output;
}
