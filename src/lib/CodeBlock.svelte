<script lang="ts">
  export let text: string;
  export let editable: boolean = false;
</script>

<pre class="code" spellcheck="false" contenteditable={editable}>{text}</pre>

<style>
  .code {
    margin: 0;
    background: black;
    text-align: left;
    overflow-y: scroll;
    padding: 1em;
    border-radius: 8px;
    font-size: 14px;
  }
</style>
