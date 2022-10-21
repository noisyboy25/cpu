<script lang="ts">
  import CodeBlock from './CodeBlock.svelte';
  import { Compiler } from './compiler';

  import { Status } from './cpu';
  import CpuStatus from './CpuStatus.svelte';

  import { cpu } from './stores';

  let programInput =
    'MOV 1\nMOVXR 1\nMOV 5\nMOVXR 0\nJRXZ 12\nSUB 1\nMOVXR 0\nMOVRX 1\nADD 2\nMOVXR 1\nMOVRX 0\nJMP 3\n';
  let status: Status;
  let pc: number;
  let loadedProgram: number[];

  let rx: number;
  let r: number[];

  let output = '';
  let error = '';

  let hint = false;

  cpu.subscribe((value) => {
    status = value.status;
    pc = value.pc;
    loadedProgram = value.cMem;
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
        const program = Compiler.compile(programInput);
        value.loadProgram(program);
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

<CodeBlock editable text={programInput} />
<div>
  <button on:click={() => loadProgram()}>Load</button>
  <button on:click={() => run()}>Run</button>
  <button on:click={() => step()}>Step</button>
  <button on:click={() => reset()}>Reset</button>
  <button on:click={() => clear()}>Clear</button>
  <button
    class:active={hint}
    on:click={() => {
      hint = !hint;
    }}>Hint</button
  >
</div>
<div class="main">
  <div>
    <div class="loaded-commands">
      <div class="row head">
        <div>#</div>
        <div>OP</div>
      </div>
      {#each loadedProgram as cmd, i}
        <div class="row" class:active={status != Status.DONE && i === pc - 1}>
          <div>{i}</div>
          <div class="op">
            {cmd.toString(2).padStart(32, '0')}
          </div>
        </div>
      {/each}
    </div>
  </div>
  <CpuStatus {status} {pc} {rx} {r} {error} />
  {#if !hint}
    <CodeBlock text={output} />
  {:else}
    <div class="op-list" />
  {/if}
</div>

<style>
  .active {
    background-color: #333;
  }
  .active > div {
    background-color: #333;
  }
  .loaded-commands {
    display: grid;
    grid-template-columns: 5ch 1fr;
    max-height: 20em;
    text-align: left;
    padding: 0 1em;
  }
  .loaded-commands .row {
    display: contents;
  }
  .loaded-commands .head {
    font-weight: bold;
  }
  .loaded-commands div {
    display: inline-block;
    text-align: center;
  }
  .op {
    color: orange;
  }
  .op-list {
    margin: 0;
    padding: 1em;
    text-align: left;
    background-color: #333;
    border-radius: 8px;
  }
</style>
