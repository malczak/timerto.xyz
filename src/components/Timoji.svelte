<script>
  import { onMount } from "svelte";
  // -----------------------
  // Properties
  // -----------------------
  let className;
  export { className as class };

  // -----------------------
  // Internal
  // -----------------------
  const timeMojis = [
    "🕛",
    "🕧",
    "🕐",
    "🕜",
    "🕑",
    "🕝",
    "🕒",
    "🕞",
    "🕓",
    "🕟",
    "🕔",
    "🕠",
    "🕕",
    "🕡",
    "🕖",
    "🕢",
    "🕗",
    "🕣",
    "🕘",
    "🕤",
    "🕙",
    "🕥",
    "🕚",
    "🕦"
  ];
  let mojiIndex = 0;

  $: timeMoji = timeMojis[mojiIndex];

  // -----------------------
  // Lifecycle
  // -----------------------
  onMount(() => {
    const intervalId = setInterval(() => {
      mojiIndex = (mojiIndex + 1) % timeMojis.length;
    }, 1000);
    return () => clearInterval(intervalId);
  });
</script>

<span class={className}>
  {@html timeMoji}
</span>
