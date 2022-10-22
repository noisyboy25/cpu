<script lang="ts">
  export let text: string;
  export let editable: boolean = false;
</script>

<textarea class="code" spellcheck="false" contenteditable={editable}
  >{text}</textarea
>

<style>
  .code {
    height: 100%;
    width: 100%;
    background: black;
    text-align: left;
    overflow-y: auto;
    padding: 1em;
    border-radius: 8px;
    font-size: 14px;
    resize: none;
  }
</style>
