<script>
  import Group from "./Group.svelte";
  import Item from "./Item.svelte";

  export let duration = null;
  export let componentsCount = 0;
</script>

{#if duration}
  {#if componentsCount === 6}
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
  {:else if componentsCount === 5}
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
  {:else if componentsCount === 4}
    <Group type="h" style={{ 'font-size': '3em' }}>
      <Item
        value={duration.days}
        label="days"
        style={{ 'font-size': '1.2em' }} />
      <Item value={duration.hours} label="hours" />
      <Item value={duration.minutes} label="minutes" />
      <Item value={duration.seconds} label="seconds" />
    </Group>
  {:else if componentsCount === 3}
    <Group type="h" style={{ 'font-size': '3em' }}>
      <Item
        value={duration.hours}
        label="hours"
        style={{ 'font-size': '1.2em' }} />
      <Item value={duration.minutes} label="minutes" />
      <Item value={duration.seconds} label="seconds" />
    </Group>
  {:else if componentsCount === 2}
    <Group type="h" style={{ 'font-size': '3em' }}>
      <Item
        value={duration.minutes}
        label="minutes"
        style={{ 'font-size': '1.2em' }} />
      <Item value={duration.seconds} label="seconds" />
    </Group>
  {:else if componentsCount === 1}
    <Group type="h" style={{ 'font-size': '3em' }}>
      <Item
        value={duration.seconds}
        label="seconds"
        style={{ 'font-size': '1.2em' }} />
    </Group>
  {/if}
{/if}
