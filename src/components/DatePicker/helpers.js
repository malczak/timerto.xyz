import moment from "moment";

export function mapMonthsToOptions(months) {
  return months.map((month, index) => ({
    label: month[0].toUpperCase() + month.substr(1),
    value: index.toString()
  }));
}

export function mapDaysToOptions(days) {
  return days.map(day => ({
    label: day.toString(),
    value: day.toString()
  }));
}

export function getYearSpan(minDate, maxDate) {
  return {
    min: moment.utc(minDate),
    max: moment.utc(maxDate)
  };
}

export function getYears(minDate, maxDate) {
  const yearSpan = getYearSpan(minDate, maxDate);
  const minYear = yearSpan.min.year();
  return new Array(yearSpan.max.year() - yearSpan.min.year() + 1)
    .fill(0)
    .map((_, index) => minYear + index)
    .map(year => year.toString());
}
