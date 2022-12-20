<script lang="ts">
  import CodeBlock from './CodeBlock.svelte';
  import CpuControls from './CpuControls.svelte';

  import LoadedProgram from './LoadedProgram.svelte';

  import { cpu } from './stores';

  let programInput = String.raw`MOV 1
MOVXR 1
MOV 5
MOVXR 0
JRXZ 12
SUB 1
MOVXR 0
MOVRX 1
ADD 2
MOVXR 1
MOVRX 0
JMP 3`;

  let pc: number;
  let program: number[];

  let rx: number;
  let r: number[];

  let output = '';
  let error = '';

  cpu.subscribe((value) => {
    pc = value.pc;
    program = value.cMem;
    rx = value.rx;
    r = value.r;
  });
</script>

<div class="main">
  <CodeBlock editable bind:value={programInput} />
  <CpuControls {programInput} bind:output bind:error />
  <LoadedProgram {program} {pc} />
  <CodeBlock autoscroll bind:value={output} />
</div>

<style>
  .main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2rem;
    height: 100%;
  }
</style>
