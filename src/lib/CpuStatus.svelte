<script lang="ts">
  export let status: string;
  export let pc: number;
  export let rx: number;
  export let r: number[];
  export let ez: number;
  export let dMem: number[];
  export let error: string;
</script>

<div class="container">
  <div class="info">
    <p>Status: {status}</p>
    <p>PC: {pc}</p>
    <p>EZ: {ez}</p>
    <p>RX: {String(rx).padStart(8, '0')}</p>
    {#each r as reg, i}
      <p>R{i}: {String(reg).padStart(8, '0')}</p>
    {/each}
  </div>
  <div class="dmem">
    {#each dMem as cell, i}
      <p>[{i}]:{String(cell).padStart(8, '0')}</p>
    {/each}
  </div>
</div>
<pre class="error">{error}</pre>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
  }
  .dmem {
    min-height: 0;
    overflow-y: scroll;
  }
</style>
