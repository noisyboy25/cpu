<script lang="ts">
  import CodeBlock from './CodeBlock.svelte';
  import { Compiler } from './compiler';

  import { Status } from './cpu';
  import CpuStatus from './CpuStatus.svelte';
  import LoadedProgram from './LoadedProgram.svelte';

  import { cpu } from './stores';

  let programInput =
    'MOV 1\nMOVXR 1\nMOV 5\nMOVXR 0\nJRXZ 12\nSUB 1\nMOVXR 0\nMOVRX 1\nADD 2\nMOVXR 1\nMOVRX 0\nJMP 3';
  let status: Status;
  let pc: number;
  let program: number[];

  let rx: number;
  let r: number[];

  let output = '';
  let error = '';

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

<div class="main">
  <CodeBlock editable bind:value={programInput} />
  <LoadedProgram {program} {pc} />
  <div>
    <div class="button-group">
      <button on:click={() => loadProgram()}>Load</button>
      <button on:click={() => run()}>Run</button>
      <button on:click={() => step()}>Step</button>
      <button on:click={() => reset()}>Reset</button>
      <button on:click={() => clear()}>Clear</button>
    </div>
    <CpuStatus {status} {pc} {rx} {r} {error} />
  </div>
  <CodeBlock autoscroll bind:value={output} />
</div>

<style>
  div {
    flex: 1 0;
  }
  .button-group {
    flex: 0;
  }
  .main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2rem;
  }
</style>
