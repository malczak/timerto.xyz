<script>
  import cn from "clsx";
  import moment from "moment";
  import { onMount, createEventDispatcher } from "svelte";
  import Dropdown from "./Dropdown.svelte";

  // -----------------------
  // Props
  // -----------------------
  let className;
  export let title;
  export let minDate;
  export let maxDate;
  export let value;
  export { className as class };

  // -----------------------
  // Internal
  // -----------------------
  const dispatcher = createEventDispatcher();

  // -----------------------
  // Methods
  // -----------------------

  let state = { day: 0, month: 0, year: 0 };

  // NOTE: without this state in not propagated with initial property value
  $: updateDateFromValue(value);

  function setState(change, callback) {
    const newState = { ...state, ...change };

    // NOTE: this component need an update - it a mixture of managed and unmanaged
    // only if there are any changes
    const changed = Object.keys(state).reduce((changed, key) => {
      return changed || state[key] !== newState[key];
    }, false);

    if (changed) {
      state = newState;
      callback && callback(state);
    }
  }

  function getDate() {
    const { year, month, day } = state;
    return moment.utc([year, month, day]);
  }

  function getDateInDay() {
    const { year, month, day } = state;
    const date = moment([year, month, day]);
    const now = moment();
    return (date.unix() > now.unix()
      ? date.startOf("day")
      : date.endOf("day")
    ).utc();
  }

  function getYearSpan() {
    return {
      min: moment.utc(minDate),
      max: moment.utc(maxDate)
    };
  }

  function isValid(m1, m2, yearSpan = undefined) {
    yearSpan = yearSpan || getYearSpan();
    return (
      m1 &&
      m2 &&
      m1.isValid() &&
      m2.isValid() &&
      m2.isAfter(yearSpan.min) &&
      m1.isBefore(yearSpan.max)
    );
  }

  function getValidMonths() {
    let months = moment.months(true);
    const { year } = state;
    if (year) {
      const yearSpan = getYearSpan();
      return months.filter((_, index) => {
        let m = moment.utc([year, index, 1]);
        return isValid(
          m.clone().startOf("month"),
          m.clone().endOf("month"),
          yearSpan
        );
      });
    }
    return months;
  }

  function getValidDays() {
    const days = new Array(32).fill(0).map((_, index) => index + 1);
    const { year, month } = state;
    if (year && month != null) {
      const yearSpan = getYearSpan();
      return days.filter(day => {
        let m = moment.utc([year, month, day]);
        return isValid(
          m.clone().startOf("day"),
          m.clone().endOf("day"),
          yearSpan
        );
      });
    }
    return days;
  }

  function getYears() {
    const yearSpan = getYearSpan();
    const minYear = yearSpan.min.year();
    return new Array(yearSpan.max.year() - yearSpan.min.year() + 1)
      .fill(0)
      .map((_, index) => minYear + index)
      .map(year => year.toString());
  }

  function onYearChange() {
    const m = getDate();
    if (!isValid(m, m)) {
      setState({ month: 0 }, onMonthChange);
    } else {
      onMonthChange();
    }
  }

  function onMonthChange() {
    const m = getDate();
    if (!isValid(m, m)) {
      setState({ day: 1 }, onDateChange);
    } else {
      onDateChange();
    }
  }

  function onDateChange() {
    const m = getDate();
    if (isValid(m, m)) {
      dispatcher("change", { date: getDateInDay().toDate() });
    }
  }

  function mapMonthsToOptions(months) {
    return months.map((month, index) => ({
      label: month[0].toUpperCase() + month.substr(1),
      value: index.toString()
    }));
  }

  function mapDaysToOptions(days) {
    return days.map(day => ({
      label: day.toString(),
      value: day.toString()
    }));
  }

  function updateDateFromValue(value) {
    const m = moment(value);
    if (m.isValid()) {
      setState({ year: m.year(), month: m.month(), day: m.date() });
    }
  }

  // -----------------------
  // Lifecycle
  // -----------------------
  onMount(() => {
    updateDateFromValue(value);
  });
</script>

<div class={cn('datepicker', className)}>
  <label
    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
    htmlFor="date-picker">
    {title}
  </label>
  <div id="date-picker" class="flex flex-row">
    <Dropdown
      class="relative w-3/12 mr-2"
      options={mapDaysToOptions(getValidDays(state))}
      selectedValue={state.day.toString()}
      on:change={evt => setState({ day: parseInt(evt.target.value) }, onDateChange)} />

    <Dropdown
      class="relative w-6/12 mr-2"
      options={mapMonthsToOptions(getValidMonths(state))}
      selectedValue={state.month.toString()}
      on:change={evt => setState({ month: parseInt(evt.target.value) }, onMonthChange)} />

    <Dropdown
      class="relative w-3/12"
      options={getYears().map(year => ({ label: year, value: year }))}
      selectedValue={state.year.toString()}
      on:change={evt => setState({ year: parseInt(evt.target.value) }, onYearChange)} />
  </div>
</div>
