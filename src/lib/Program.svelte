<script lang="ts">
  let program = 'Hello world';
  $: lines = program.split('\n');
</script>

<textarea bind:value={program} />
{#each lines as line}
  <p>{line}</p>
{/each}
