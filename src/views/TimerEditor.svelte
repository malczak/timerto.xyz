<script>
  import Modal from "../components/Modal.svelte";
  import TimerForm from "../components/TimerForm.svelte";

  // -----------------------
  // Properties
  // -----------------------
  export let event = null;
</script>

<Modal>
  <slot>
    <TimerForm
      class="bg-white m-4 py-2 w-full md:max-w-sm rounded overflow-hidden
      shadow-lg inline-block"
      label={event ? 'Update event' : 'Add event'}
      {event}
      on:save
      on:cancel />
  </slot>
</Modal>
