import { formatISO, set } from "date-fns";

// use it to give higher order to the records that are created with same dates but the newer created should higher
export default function toExactDate(date: Date) {
  const currentDate = new Date();

  const exactDate = set(date, {
    hours: currentDate.getHours(),
    minutes: currentDate.getMinutes(),
    seconds: currentDate.getSeconds(),
    milliseconds: currentDate.getMilliseconds(),
  });

  return formatISO(exactDate);
}
