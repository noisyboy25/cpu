<script lang="ts">
  import type { Command } from './cpu';

  import { cpu } from './stores';

  let program = 'Hello world';
  let status;
  let counter;

  cpu.subscribe((value) => {
    status = value.status;
    counter = value.count;
  });

  $: commands = program.trim().split('\n').map(parseCommand);

  function parseCommand(line: string): Command {
    const words = line.split(' ');
    const op = words[0];
    const args = words.slice(1);
    return { op, args };
  }
</script>

<textarea bind:value={program} />
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
</div>
<button
  on:click={() => {
    cpu.update((value) => {
      value.step();
      return value;
    });
  }}>Step</button
>
<button
  on:click={() => {
    cpu.update((value) => {
      value.reset();
      return value;
    });
  }}>Reset</button
>

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
