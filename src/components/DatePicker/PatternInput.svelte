<script>
  import moment from "moment";
  import { onMount, createEventDispatcher } from "svelte";

  import Dropdown from "app/components/Dropdown";
  import { mapMonthsToOptions, mapDaysToOptions, getYears } from "./helpers";
  import { WildcardSymbol, YearAgnosticMonthDaysCount } from "app/utils/date";

  // -----------------------
  // Properties
  // -----------------------
  let className;
  export let title;
  export let minDate;
  export let maxDate;
  export let pattern;
  export { className as class };

  // -----------------------
  // Internal
  // -----------------------

  const dispatcher = createEventDispatcher();

  let state = { day: 0, month: 0, year: 0 };

  // NOTE: without this state in not propagated with initial property value
  //   $: updateDateFromValue(value);
  $: {
    setStateFromPattern(pattern);
  }

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
      state = newState;
      callback && callback(state);
    }
  }

  function getDatePattern() {
    return { ...state };
  }

  function setStateFromPattern(pattern) {
    console.log(pattern);
    const change = {};
    const components = ["day", "month", "year"];
    components.map(component => {
      const value = pattern[component];
      change[component] =
        value === WildcardSymbol
          ? WildcardSymbol
          : parseInt(value) || parseInt(state[component]) || 0;
    });
    setState(change);
  }

  function componentIsWildcard(key) {
    return state[key] === WildcardSymbol;
  }

  function callIfNotWildcard(key, callback) {
    if (componentIsWildcard(key)) {
      return [{ label: "Any", value: WildcardSymbol }];
    } else {
      return callback();
    }
  }

  function getValidDays() {
    return callIfNotWildcard("day", () => {
      const monthNumberOfDays = componentIsWildcard("month")
        ? 31
        : YearAgnosticMonthDaysCount[state.month];
      return mapDaysToOptions(
        new Array(monthNumberOfDays).fill(0).map((_, index) => index + 1)
      );
    });
  }

  function getValidMonths() {
    return callIfNotWildcard("month", () =>
      mapMonthsToOptions(moment.months(true))
    );
  }

  function getValidYears() {
    return callIfNotWildcard("year", () =>
      getYears(minDate, maxDate).map(year => ({ label: year, value: year }))
    );
  }

  function onChange() {
    const date = getDatePattern();
    dispatcher("change", { date });
  }

  // -----------------------
  // Lifecycle
  // -----------------------
  onMount(() => {
    setStateFromPattern(pattern);
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
      options={getValidDays(state)}
      selectedValue={state.day.toString()}
      on:change={evt => setState({ day: parseInt(evt.target.value) }, onChange)} />

    <Dropdown
      class="relative w-6/12 mr-2"
      options={getValidMonths(state)}
      selectedValue={state.month.toString()}
      on:change={evt => setState({ month: parseInt(evt.target.value) }, onChange)} />

    <Dropdown
      class="relative w-3/12"
      options={getValidYears(state)}
      selectedValue={state.year.toString()}
      on:change={evt => setState({ year: parseInt(evt.target.value) }, onChange)} />
  </div>
</div>
