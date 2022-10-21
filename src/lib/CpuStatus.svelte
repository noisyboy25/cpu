<script lang="ts">
  export let status: string;
  export let pc: number;
  export let rx: number;
  export let r: number[];
  export let error: string;
</script>

<div class="info">
  <p>Status: {status}</p>
  <p>PC: {pc}</p>
  <p>RX: {String(rx).padStart(8, '0')}</p>
  {#each r as reg, i}
    <p>R{i}: {String(reg).padStart(8, '0')}</p>
  {/each}
</div>
<pre class="error">{error}</pre>
