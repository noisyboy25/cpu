<script lang="ts">
  import { Compiler } from './compiler';
  import CpuStatus from './CpuStatus.svelte';
  import { Status } from './cpu';

  import { cpu } from './stores';

  export let programInput: string;
  export let output: string;
  export let error: string;

  $: ({ status, pc, rx, r } = $cpu);

  function step() {
    const out = cpu.step();
    ({ status } = $cpu);
    if (out) output += `${out}\n`;
  }

  function loadProgram() {
    clearOutput();
    try {
      const compiledProgram = Compiler.compile(programInput);
      console.log(compiledProgram);

      cpu.load(compiledProgram);
    } catch (err) {
      console.log(err);
      error = err;
    }
  }
  function reset() {
    clearOutput();
    cpu.reset();
  }
  function run() {
    while (status === Status.READY) step();
  }
  function clear() {
    clearOutput();
    const program = Compiler.compile('');
    cpu.load(program);
  }
  function clearOutput() {
    output = '';
    error = '';
  }
</script>

<div>
  <div class="button-group">
    <button on:click={() => loadProgram()}
      ><i class="fa-regular fa-square-caret-down" /> Load</button
    >
    <button on:click={() => run()}
      ><i class="fa-solid fa-forward-fast" /> Run</button
    >
    <button on:click={() => step()}
      ><i class="fa-solid fa-forward-step" /> Step</button
    >
    <button on:click={() => reset()}
      ><i class="fa-solid fa-rotate-left" /> Reset</button
    >
    <button on:click={() => clear()}
      ><i class="fa-regular fa-trash-can" /> Clear</button
    >
  </div>
  <CpuStatus {status} {pc} {rx} {r} {error} />
</div>

<style>
  .button-group {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
  }
</style>
