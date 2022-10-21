export enum Status {
  READY = 'Ready',
  ERROR = 'Error',
  DONE = 'Done',
}

export type Instruction = {
  name: string;
  call: (cpu: Cpu, arg: number) => string;
};

export const instructions: Array<Instruction> = Array.from([
  {
    name: 'add',
    call: (cpu: Cpu, arg: number) => {
      const out = `RX <- ${cpu.rx} + ${arg}`;
      cpu.rx += arg;
      return out;
    },
  },
  {
    name: 'mov',
    call: (cpu: Cpu, arg: number) => {
      cpu.rx = arg;
      return `RX <- ${arg}`;
    },
  },
  {
    name: 'jmp',
    call: (cpu: Cpu, arg: number) => {
      cpu.pc = arg;
      return `JMP ${arg}`;
    },
  },
]);

export class Cpu {
  readonly maxMemory = 3;
  readonly registerCount = 2;

  pc = 0;
  cMem: number[] = [];
  dMem: number[] = [];
  rx = 0;
  r: number[] = new Array(this.registerCount).fill(0);
  status: Status = Status.READY;

  constructor() {
    if (Object.seal) Object.seal(this.r);
  }

  loadProgram(program: number[]) {
    this.reset();
    if (program.length > this.maxMemory)
      throw new Error(
        `Program memory overflow (max: ${this.maxMemory} commands)`
      );
    this.cMem = program;
    console.log(this);
  }

  step(): string {
    let output = '';
    switch (true) {
      case this.pc < 0:
        this.status = Status.ERROR;
        break;
      case this.pc === this.cMem.length:
        this.status = Status.DONE;
        break;
      default:
        this.pc++;
        output = this.process(this.cMem[this.pc - 1]);
        break;
    }
    return output;
  }

  reset() {
    this.pc = 0;
    this.rx = 0;
    this.r = new Array(this.registerCount).fill(0);
    if (Object.seal) Object.seal(this.r);
    this.status = Status.READY;
  }

  private process(cmd: number): string {
    let output = `${this.pc}: `;
    console.log(cmd.toString(2));
    const opCode = cmd >> 28;
    const arg = cmd & 0xfffffff;
    output += instructions[opCode].call(this, arg);
    return output;
  }
}
