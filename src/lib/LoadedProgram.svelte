<script lang="ts">
  export let program: number[];
  export let pc: number;
</script>

<div class="loaded-commands">
  <div class="row head">
    <div>#</div>
    <div>OP</div>
  </div>
  {#each program as cmd, i}
    <div class="row" class:active={i === pc - 1}>
      <div>{i}</div>
      <div class="op">
        {cmd.toString(2).padStart(32, '0')}
      </div>
    </div>
  {/each}
</div>

<style>
  .loaded-commands {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .row {
    display: contents;
  }
</style>
