<script lang="ts">
  import { opCodes, Status, type Command } from './cpu';

  import { cpu } from './stores';

  let programInput = 'ADD 5 6\nADD 5 -10\nSUB 10 2';
  let status: Status;
  let pc: number;
  let programLength: number;
  let loadedProgram: Command[];
  let maxMemory: number;

  let output = '';
  let error = '';

  let hint = false;

  cpu.subscribe((value) => {
    status = value.status;
    pc = value.pc;
    programLength = value.cmem.length;
    loadedProgram = value.cmem;
    maxMemory = value.maxMemory;
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
        value.loadProgram(programInput);
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
      value.loadProgram('');
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
<table class="loaded-commands">
  <thead>
    <tr>
      <th>#</th>
      <th>OP</th>
    </tr>
  </thead>
  {#each loadedProgram as cmd, i}
    <tr>
      <td>{i}</td>
      <td class="op">
        {opCodes[cmd.op]}
      </td>
      {#each cmd.args as arg}
        <td class="arg">
          {arg}
        </td>
      {/each}
    </tr>
  {/each}
</table>

<div class="info">
  <p>Status: {status}</p>
  <p>Program memory: {programLength} / {maxMemory}</p>
  <p>PC: {pc}</p>
</div>
<pre class="error">{error}</pre>
{#if !hint}
  <pre class="output">{output}</pre>
{:else}
  <div class="op-list">
    {#each opCodes as op, i} <p>({i}) <span class="op">{op}</span></p> {/each}
  </div>
{/if}

<style>
  button.active {
    background-color: #333;
  }
  .program-input {
    min-height: 7em;
    border-radius: 8px;
    padding: 1em;
  }
  .loaded-commands {
    text-align: left;
    padding: 0 1em;
  }
  .op {
    color: orange;
  }
  .arg {
    color: lightyellow;
  }
  .arg::before {
    content: '[';
  }
  .arg::after {
    content: ']';
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
