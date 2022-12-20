<script lang="ts">
  import { Compiler } from './compiler';
  import CpuStatus from './CpuStatus.svelte';
  import { Status } from './cpu';

  import { cpu } from './stores';

  export let programInput: string;
  export let output: string;
  export let error: string;

  let status: Status;
  let pc: number;
  let program: number[];

  let rx: number;
  let r: number[];

  cpu.subscribe((value) => {
    status = value.status;
    pc = value.pc;
    program = value.cMem;
    rx = value.rx;
    r = value.r;
  });

  function step() {
    cpu.update((value) => {
      const out = value.step();
      if (out) output += `${out}\n`;
      return value;
    });
  }
  function loadProgram() {
    clearOutput();
    try {
      cpu.update((value) => {
        const compiledProgram = Compiler.compile(programInput);
        console.log(compiledProgram);

        value.loadProgram(compiledProgram);
        return value;
      });
    } catch (err) {
      console.log(err);
      error = err;
    }
  }
  function reset() {
    clearOutput();
    cpu.update((value) => {
      value.reset();
      return value;
    });
  }
  function run() {
    while (status === Status.READY) {
      step();
    }
  }
  function clear() {
    clearOutput();
    cpu.update((value) => {
      const program = Compiler.compile('');
      value.loadProgram(program);
      return value;
    });
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
