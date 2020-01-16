<script>
  import moment from "moment";
  import { onMount } from "svelte";
  import { readable } from "svelte/store";

  import Group from "app/TimeCounter/Group.svelte";
  import StaticItem from "app/TimeCounter/StaticItem.svelte";

  // -----------------------
  // Properties
  // -----------------------
  let className;
  export { className as class };
  export let title;
  export let date;

  // -----------------------
  // Internal
  // -----------------------
  const Ratios = { m: 26, d: 26, y: 48 };
  const FormatLabels = { m: "month", d: "day", y: "year" };

  let components = null;

  const splitFormat = format => format.replace(/[^0-9mdy]/gi, "$").split("$");

  // -----------------------
  // Lifecycle
  // -----------------------

  onMount(() => {
    const format = "L";

    let values = splitFormat(date.format(format));
    let formats = splitFormat(
      moment
        .localeData()
        .longDateFormat(format)
        .replace(/[mdy]+/gi, match => match[0].toLowerCase())
    );

    components = values.map((value, index) => ({
      value,
      label: FormatLabels[formats[index]],
      ratio: Ratios[formats[index]]
    }));
  });
</script>

<div class="counter counter--3" on:click on:touchstart>
  <div class="flex adjust-end items-center">
    <p class="flex-1 my-1 text-lg">{title}</p>
    <p class="my-1 inline-block text-sm">{date.format('L')}</p>
  </div>
  <div class={className}>
    <Group type="h" style={{ 'font-size': '3em' }}>
      {#each components || [] as component}
        <StaticItem
          value={component.value}
          label={component.label}
          ratio={component.ratio} />
      {/each}
    </Group>
  </div>
  <slot />
</div>
