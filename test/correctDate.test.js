import moment from "moment";
import { getDateOrClosest } from "utils/date";

const dateArray = moment => [moment.year(), moment.month(), moment.date()];

test("Get correct day #1", () => {
  const date = getDateOrClosest(2020, 1, 30);
  const expectedDate = moment([2020, 1, 29]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Get correct day #2", () => {
  const date = getDateOrClosest(2020, 1, 130);
  const expectedDate = moment([2020, 1, 29]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Get correct day #3", () => {
  const date = getDateOrClosest(2020, 0, -1);
  const expectedDate = moment([2019, 11, 30]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});

test("Get date as it is", () => {
  const date = getDateOrClosest(2020, 1, 130);
  const expectedDate = moment([2020, 1, 29]);
  expect(dateArray(date)).toStrictEqual(dateArray(expectedDate));
});
