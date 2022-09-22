import type { Command } from './compiler';

export enum Status {
  READY = 'Ready',
  ERROR = 'Error',
  DONE = 'Done',
}

export type Instruction = {
  argNumber: number;
  call: (cpu: Cpu, args: number[]) => string;
};

export const instructions = new Map<string, Instruction>([
  [
    'mov',
    {
      argNumber: 1,
      call: (cpu, args: number[]) => {
        cpu.rx = args[0];
        return '';
      },
    },
  ],
]);

export class Cpu {
  readonly maxMemory = 3;
  readonly registerCount = 2;

  pc = 0;
  cmem: Command[] = [];
  rx = 0;
  r: number[] = new Array(this.registerCount).fill(0);
  status: Status = Status.READY;

  constructor() {
    if (Object.seal) Object.seal(this.r);
  }

  loadProgram(program: Command[]) {
    this.reset();
    if (program.length > this.maxMemory)
      throw new Error(
        `Program memory overflow (max: ${this.maxMemory} commands)`
      );
    for (const cmd of program) {
      if (cmd.op === undefined) {
        console.log('Error loading command ', cmd);
        return;
      }
    }
    this.cmem = program;
    console.log(this);
  }

  step(): string {
    let output = '';
    switch (true) {
      case this.pc < 0:
        this.status = Status.ERROR;
        break;
      case this.pc === this.cmem.length:
        this.status = Status.DONE;
        break;
      default:
        output = this.process(this.cmem[this.pc]);
        this.pc++;
        break;
    }
    return output;
  }

  reset() {
    this.pc = 0;
    this.r = new Array(this.registerCount).fill(0);
    if (Object.seal) Object.seal(this.r);
    this.status = Status.READY;
  }

  private process(cmd: Command): string {
    let output = `${this.pc}: `;
    console.log(cmd);
    output += instructions.get(cmd.op).call(this, cmd.args);
    return output;
  }
}
