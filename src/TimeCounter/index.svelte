<script>
  import moment from "moment";

  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import Group from "./Group.svelte";
  import Item from "./Item.svelte";
  import Timer from "./Timer.svelte";
  import { time } from "../stores.js";

  // -----------------------
  // Properties
  // -----------------------
  let className = "";
  export { className as class };
  export let positiveClass;
  export let negativeClass;
  export let title = null;
  export let date = null;
  export let onUpdate = null;

  // -----------------------
  // Internal
  // -----------------------
  const duration = {
    years: writable(0),
    months: writable(0),
    days: writable(0),
    hours: writable(0),
    minutes: writable(0),
    seconds: writable(0)
  };

  const stores = Object.keys(duration).map(key => duration[key]);

  let inFuture = true;
  let validComponentsCount = 0;
  let unsunscribe;

  $: {
    timeTick(date);
  }

  // -----------------------
  // Internal
  // -----------------------
  function timeTick(date, now) {
    now = moment(now);
    inFuture = date.isAfter(now);

    let newDuration;
    if (inFuture) {
      newDuration = moment.duration(date.diff(now));
    } else {
      newDuration = moment.duration(now.diff(date));
    }

    const components = [
      newDuration.years(),
      newDuration.months(),
      newDuration.days(),
      newDuration.hours(),
      newDuration.minutes(),
      newDuration.seconds()
    ];

    while (components.length > 1 && components[0] == 0) components.shift();
    validComponentsCount = components.length;
    const validComponentOffset = stores.length - validComponentsCount;

    for (let i = 0; i < validComponentsCount; i += 1) {
      stores[validComponentOffset + i].set(components[i]);
    }

    if (typeof onUpdate === "function") {
      onUpdate(now, date, inFuture, components, validComponentsCount);
    }
  }

  // -----------------------
  // Lifecycle
  // -----------------------
  onMount(() => {
    unsunscribe = time.subscribe(now => timeTick(date, now));
    return () => unsunscribe();
  });
</script>

<div on:click on:touchstart>
  <div class="counter counter--{validComponentsCount}">
    <div class="flex adjust-end items-center">
      <slot name="action" {inFuture} />
      {#if title}
        <p class="flex-1 my-1 text-lg">{title}</p>
      {/if}
      <p class="my-1 inline-block text-sm">{moment(date).format('L')}</p>
    </div>

    <!-- NOTE: probably should be split into separate svelte files -->
    {#if date}
      <div class={`${className} ${inFuture ? positiveClass : negativeClass}`}>
        {#if validComponentsCount === 6}
          <Group type="h">
            <Item
              ratio={40}
              style={{ 'font-size': '7em', 'font-weight': 'medium' }}
              value={duration.years}
              label="years" />
            <Group type="v" ratio={60}>
              <Group type="h" ratio={60} style={{ 'font-size': '3em' }}>
                <Item value={duration.months} label="months" />
                <Item value={duration.days} label="days" />
              </Group>
              <Group type="h" ratio={40} style={{ 'font-size': '1.6em' }}>
                <Item value={duration.hours} label="hours" />
                <Item value={duration.minutes} label="minutes" />
                <Item value={duration.seconds} label="seconds" />
              </Group>
            </Group>
          </Group>
        {:else if validComponentsCount === 5}
          <Group type="v">
            <Group type="h" ratio={50} style={{ 'font-size': '3em' }}>
              <Item value={duration.months} label="months" />
              <Item value={duration.days} label="days" />
            </Group>
            <Group type="h" ratio={50} style={{ 'font-size': '2em' }}>
              <Item value={duration.hours} label="hours" />
              <Item value={duration.minutes} label="minutes" />
              <Item value={duration.seconds} label="seconds" />
            </Group>
          </Group>
        {:else if validComponentsCount === 4}
          <Group type="h" style={{ 'font-size': '3em' }}>
            <Item
              value={duration.days}
              label="days"
              style={{ 'font-size': '1.2em' }} />
            <Item value={duration.hours} label="hours" />
            <Item value={duration.minutes} label="minutes" />
            <Item value={duration.seconds} label="seconds" />
          </Group>
        {:else if validComponentsCount === 3}
          <Group type="h" style={{ 'font-size': '3em' }}>
            <Item
              value={duration.hours}
              label="hours"
              style={{ 'font-size': '1.2em' }} />
            <Item value={duration.minutes} label="minutes" />
            <Item value={duration.seconds} label="seconds" />
          </Group>
        {:else if validComponentsCount === 2}
          <Group type="h" style={{ 'font-size': '3em' }}>
            <Item
              value={duration.minutes}
              label="minutes"
              style={{ 'font-size': '1.2em' }} />
            <Item value={duration.seconds} label="seconds" />
          </Group>
        {:else}
          <Group type="h">
            <Item
              value={duration.seconds}
              label="seconds"
              style={{ 'font-size': '3em' }} />
          </Group>
        {/if}
      </div>
    {/if}

  </div>
</div>
