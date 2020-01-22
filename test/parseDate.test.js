import moment from "moment";
import { parseDate, getMatchingDates } from "utils/date";

const dateArray = moment => [moment.year(), moment.month(), moment.date()];

test("Parse simple date", () => {
  // Parse as 12 Jan 2020
  const date = parseDate("12|0|2020");
  const expectedDate = moment([2020, 0, 12]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Parse unix timestamp", () => {
  // Parse as unix timestamp of 12 Jan 2020
  const expectedDate = moment([2020, 0, 12]);
  const date = parseDate(expectedDate.unix());
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Day pattern date - #|N|N", () => {
  // Should resolve to next day 13 Jan 2020
  const now = moment([2020, 0, 12]);
  const date = parseDate("*|0|2020", now);
  const expectedDate = moment([2020, 0, 13]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Day month pattern date - #|#|N", () => {
  // Should resolve to next day 1 Feb 2020
  const now = moment([2020, 0, 31]);
  const date = parseDate("*|*|2020", now);
  const expectedDate = moment([2020, 1, 1]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Day year pattern date - #|N|#", () => {
  // Should resolve to next day 29 Feb 2020
  const now = moment([2020, 1, 28]);
  const date = parseDate("*|1|*", now);
  const expectedDate = moment([2020, 1, 29]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Day year pattern date (leap year) - #|N|#", () => {
  // Should resolve to next day 29 Feb 2020
  const now = moment([2019, 1, 28]);
  const date = parseDate("*|1|*", now);
  const expectedDate = moment([2020, 1, 1]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Year pattern date in future - N|N|#", () => {
  // Should resolve to next day 29 Feb 2020
  const now = moment([2019, 1, 28]);
  const date = parseDate("4|3|*", now);
  const expectedDate = moment([2019, 3, 4]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Year pattern date already passed - N|N|#", () => {
  // Should resolve to next day 29 Feb 2020
  const now = moment([2019, 5, 28]);
  const date = parseDate("4|3|*", now);
  const expectedDate = moment([2020, 3, 4]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Year end pattern date", () => {
  // Should resolve to next years Jan - 26 Jan 2021
  const now = moment([2020, 11, 26]);
  const date = parseDate("24|*|*", now);
  const expectedDate = moment([2021, 0, 24]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Find all dates matching pattern (year restriction)", () => {
  // should match all months 22nd Jan-Dec 2030
  const now = moment([2020, 0, 1]);
  const expectedDates = new Array(12)
    .fill(0)
    .map((_, index) => moment([2030, index, 22]));
  const dates = getMatchingDates("22|*|2030", 30, now);
  expect(dates).toHaveLength(12);
  expect(dates.map(dateArray)).toStrictEqual(expectedDates.map(dateArray));
});

test("Unresorvable day pattern date - #|N|N", () => {
  // Cannot be resolved as already at last date
  const now = moment([2019, 3, 30]);
  expect(() => {
    parseDate("*|3|2019", now);
  }).toThrow();
});

test("Unresorvable month pattern date - N|#|N", () => {
  // Cannot be resolved as already at last date
  const now = moment([2019, 12, 2]);
  expect(() => {
    parseDate("3|*|2019", now);
  }).toThrow();
});

test("Unresorvable pattern date", () => {
  // This pattern cannot be resolved
  const now = moment([2020, 1, 12]);
  expect(() => {
    parseDate("*|0|2020", now);
  }).toThrow();
});
