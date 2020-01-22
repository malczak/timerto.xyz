<script>
  import moment from "moment";
  import { onMount, createEventDispatcher } from "svelte";
  import Switch from "app/components/Switch";
  import ComponentsPicker from "./ComponentsPicker";
  import PatternInput from "./PatternInput";
  import { getDateOrClosest, parseDate } from "app/utils/date";

  // -----------------------
  // Properties
  // -----------------------
  export let title = "";
  export let date = moment();

  // -----------------------
  // Internal
  // -----------------------
  const dispatcher = createEventDispatcher();

  let dateComponents = { day: 0, month: 0, year: 0 };
  let isUsingDatePattern = false;
  let wildcardPattern = [false, false, false];

  $: {
    let m;
    try {
      m = parseDate(date);
    } catch (e) {
      m = moment();
    }

    dateComponents = {
      day: m.date(),
      month: m.month(),
      year: m.year()
    };
  }

  function isPatternSwitchEnabled(wildcardPattern, index) {
    const allOtherEnabled = wildcardPattern
      .filter((_, idx) => idx != index)
      .every(value => value);
    return !allOtherEnabled;
  }

  function getMinDate() {
    return moment
      .utc()
      .subtract(80, "year")
      .startOf("year")
      .toDate();
  }

  function getMaxDate() {
    return moment
      .utc()
      .add(80, "year")
      .startOf("year")
      .toDate();
  }

  function getDatePattern(wildcardPattern, dateComponents) {
    console.log("getDatePattern", wildcardPattern, dateComponents);
    const components = ["day", "month", "year"];
    return wildcardPattern
      .map((flag, index) => (flag ? "*" : dateComponents[components[index]]))
      .join("|");
  }

  function getPatternFromDate(dateComponents, wildcardPattern) {
    const p = Object.keys(dateComponents).reduce((accum, key, index) => {
      accum[key] = wildcardPattern[index] ? "*" : dateComponents[key];
      return accum;
    }, {});
    console.log("getPatternFromDate", p);
    return p;
  }

  function getDateFromDate() {
    return getDateOrClosest(
      dateComponents.year,
      dateComponents.month,
      dateComponents.day
    );
  }

  function updateDate(newDate) {
    console.group("updateDate");
    console.log("dateComponents", dateComponents);
    console.log("newDate", newDate);
    const newComponents = Object.keys(newDate).reduce((accum, key) => {
      const value = newDate[key];
      if (value !== "*") {
        const numberValue = parseInt(value);
        if (!isNaN(numberValue)) {
          accum[key] = numberValue;
        }
      }
      return accum;
    }, {});
    console.log("newComponents", newComponents);
    dateComponents = {
      ...dateComponents,
      ...newComponents
    };
    console.log("dateComponents", dateComponents);
    console.groupEnd();
    dispatcher("change", {
      date: getDatePattern(wildcardPattern, dateComponents)
    });
  }

  function updateDateFromDate(dateComponents) {
    dateComponents = moment(dateComponents);
    updateDate({
      day: dateComponents.date(),
      month: dateComponents.month(),
      year: dateComponents.year()
    });
  }

  function updateDateFromPattern(pattern) {
    console.log(">>>>", pattern);
    updateDate(pattern);
  }

  function updateDatePattern(index) {
    wildcardPattern[index] = !wildcardPattern[index];
    isUsingDatePattern = wildcardPattern.some(value => value);
    if (isUsingDatePattern) {
      updateDateFromPattern(
        getPatternFromDate(dateComponents, wildcardPattern)
      );
    } else {
      updateDateFromDate(getDateFromDate(dateComponents));
    }
    console.log(wildcardPattern, dateComponents);
  }

  // -----------------------
  // Lifecycle
  // -----------------------
  onMount(() => {
    const now = moment();
    updateDate({ day: now.date(), month: now.month(), year: now.year() });
  });
</script>

{#if !isUsingDatePattern}
  <ComponentsPicker
    class="w-full mb-1"
    {title}
    minDate={getMinDate()}
    maxDate={getMaxDate()}
    value={dateComponents}
    on:change={evt => updateDateFromDate(evt.detail.date)} />
{:else}
  <PatternInput
    class="w-full mb-1"
    title="Recurring event (date pattern)"
    minDate={getMinDate()}
    maxDate={getMaxDate()}
    pattern={getPatternFromDate(dateComponents, wildcardPattern)}
    on:change={evt => updateDateFromPattern(evt.detail.date)} />
{/if}

<div class="flex flex-row w-full mb-4 text-center">
  <div class="flex justify-center items-center text-xs w-3/12 mr-2">
    <Switch
      disabled={!isPatternSwitchEnabled(wildcardPattern, 0)}
      on:change={() => updateDatePattern(0)} />
    <span class="ml-1">Any</span>
  </div>

  <div class="flex justify-center items-center text-xs w-6/12 mr-2">
    <Switch
      disabled={!isPatternSwitchEnabled(wildcardPattern, 1)}
      on:change={() => updateDatePattern(1)} />
    <span class="ml-1">Any</span>
  </div>

  <div class="flex justify-center items-center text-xs w-3/12">
    <Switch
      disabled={!isPatternSwitchEnabled(wildcardPattern, 2)}
      on:change={() => updateDatePattern(2)} />
    <span class="ml-1">Any</span>
  </div>

</div>
