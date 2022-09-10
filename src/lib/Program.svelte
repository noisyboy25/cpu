<script lang="ts">
  import { Status, type Command } from './cpu';

  import { cpu } from './stores';

  let program = 'Hello world';
  let status;
  let counter;
  let programLength;

  let output = '';

  cpu.subscribe((value) => {
    status = value.status;
    counter = value.count;
    programLength = value.program.length;
  });

  $: commands = program
    .trim()
    .split('\n')
    .filter((el) => el)
    .map(parseCommand);

  function parseCommand(line: string): Command {
    const words = line.split(' ').filter((w) => w);
    const op = words[0];
    const args = words.slice(1);
    return { op, args };
  }
  function step() {
    cpu.update((value) => {
      const out = value.step();
      if (out) output += `${out}\n`;
      return value;
    });
  }
  function loadProgram(program: Command[]) {
    cpu.update((value) => {
      value.loadProgram(program);
      return value;
    });
    output = '';
  }
  function reset() {
    cpu.update((value) => {
      value.reset();
      return value;
    });
    output = '';
  }
  function run() {
    while (status === Status.READY) {
      step();
    }
  }
</script>

<textarea bind:value={program} />
<button on:click={() => step()}>Step</button>
<button on:click={() => loadProgram(commands)}>Load</button>
<button on:click={() => reset()}>Reset</button>
<button on:click={() => run()}>Run</button>
<table>
  {#each commands as cmd}
    <tr>
      <td class="op">
        {cmd.op}
      </td>
      {#each cmd.args as arg}
        <td class="arg">
          {arg}
        </td>
      {/each}
    </tr>
  {/each}
</table>

<div>
  <p>Count: {counter}</p>
  <p>Status: {status}</p>
  <p>Length: {programLength}</p>
</div>
<pre>{output}</pre>

<style>
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
</style>
