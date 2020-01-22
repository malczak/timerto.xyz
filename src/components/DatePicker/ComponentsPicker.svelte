<script>
  import moment from "moment";
  import { onMount, createEventDispatcher } from "svelte";
  import Dropdown from "app/components/Dropdown.svelte";
  import {
    mapMonthsToOptions,
    mapDaysToOptions,
    getYearSpan,
    getYears
  } from "./helpers";
  import { correctDate } from "app/utils/date";

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

  let state = { day: 0, month: 0, year: 0 };

  // NOTE: without this state in not propagated with initial property value
  $: updateDateFromValue(value);

  // -----------------------
  // Methods
  // -----------------------

  function setState(change, callback) {
    const newState = { ...state, ...change };

    // NOTE: this component need an update - it a mixture of managed and unmanaged
    // only if there are any changes
    const changed = Object.keys(state).reduce((changed, key) => {
      return changed || state[key] !== newState[key];
    }, false);

    if (changed) {
      state = correctDate(newState);
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

  function isValid(m1, m2, yearSpan = undefined) {
    yearSpan = yearSpan || getYearSpan(minDate, maxDate);
    return (
      m1 &&
      m2 &&
      m1.isValid() &&
      m2.isValid() &&
      m2.isAfter(yearSpan.min) &&
      m1.isBefore(yearSpan.max)
    );
  }

  function getValidMonths(state) {
    let months = moment.months(true);
    const { year } = state;
    if (year) {
      const yearSpan = getYearSpan(minDate, maxDate);
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

  function getValidDays(state) {
    const days = new Array(32).fill(0).map((_, index) => index + 1);
    const { year, month } = state;
    if (year && month != null) {
      const yearSpan = getYearSpan(minDate, maxDate);
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

  function getValidYears() {
    return getYears(minDate, maxDate);
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

<div class="datepicker {className}">
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
      options={getValidYears().map(year => ({ label: year, value: year }))}
      selectedValue={state.year.toString()}
      on:change={evt => setState({ year: parseInt(evt.target.value) }, onYearChange)} />
  </div>
</div>
