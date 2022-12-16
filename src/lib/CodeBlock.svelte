<script lang="ts">
  import { afterUpdate, beforeUpdate } from 'svelte';

  export let value: string;
  export let editable: boolean = false;
  export let autoscroll: boolean = false;
  let textarea: HTMLTextAreaElement;

  afterUpdate(() => {
    if (autoscroll) textarea.scrollTop = textarea.scrollHeight;
  });
</script>

<div>
  <textarea
    class="code"
    spellcheck="false"
    contenteditable={editable}
    bind:this={textarea}
    bind:value
  />
</div>

<style>
  div {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
  .code {
    background: #111;
    text-align: left;
    overflow-y: auto;
    padding: 1em;
    border-radius: 8px;
    font-size: 14px;
    resize: none;
    flex: 1;
  }
</style>
