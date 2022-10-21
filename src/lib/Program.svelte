<script lang="ts">
  import { Compiler } from './compiler';

  import { Status } from './cpu';

  import { cpu } from './stores';

  let programInput = 'MOV 5\nADD 11';
  let status: Status;
  let pc: number;
  let programLength: number;
  let loadedProgram: number[];
  let maxMemory: number;

  let rx: number;
  let r: number[];

  let output = '';
  let error = '';

  let hint = false;

  cpu.subscribe((value) => {
    status = value.status;
    pc = value.pc;
    programLength = value.cMem.length;
    loadedProgram = value.cMem;
    maxMemory = value.maxMemory;
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

<textarea class="program-input" spellcheck="false" bind:value={programInput} />
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

<div class="info">
  <p>Status: {status}</p>
  <p>Program memory: {programLength} / {maxMemory}</p>
  <p>PC: {pc}</p>
  <p>RX: {String(rx).padStart(8, '0')}</p>
  {#each r as reg, i}
    <p>R{i}: {String(reg).padStart(8, '0')}</p>
  {/each}
</div>
<pre class="error">{error}</pre>
{#if !hint}
  <pre class="output">{output}</pre>
{:else}
  <div class="op-list" />
{/if}

<style>
  .active {
    background-color: #333;
  }
  .active > div {
    background-color: #333;
  }
  .program-input {
    min-height: 7em;
    border-radius: 8px;
    padding: 1em;
  }
  .loaded-commands {
    display: grid;
    grid-template-columns: 5ch 1fr;
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
  .info {
    padding: 1em;
    text-align: left;
  }
  .info p {
    margin: 0;
  }
  .error {
    margin: auto;
    background-color: firebrick;
    padding: 1em;
    font-weight: bold;
    border-radius: 8px;
  }
  .error:empty {
    display: none;
  }
  .output {
    margin: 0;
    background: black;
    text-align: left;
    padding: 1em;
    border-radius: 8px;
    overflow: scroll;
    height: 100%;
    font-size: 14px;
  }
  .op-list {
    margin: 0;
    padding: 1em;
    text-align: left;
    background-color: #333;
    border-radius: 8px;
    height: 100%;
  }
</style>
