<script lang="ts">
  type Command = { op: string; args: string[] };
  let program = 'Hello world';
  $: commands = program.split('\n').map(parseCommand);

  function parseCommand(line: string): Command {
    const words = line.split(' ');
    const operator = words[0];
    const args = words.slice(1);
    return { op: operator, args };
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
