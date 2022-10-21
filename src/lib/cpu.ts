export enum Status {
  READY = 'Ready',
  ERROR = 'Error',
  DONE = 'Done',
}

export type Instruction = {
  name: string;
  call: (cpu: Cpu, literal: number, args: number) => string;
};

export const instructions: Array<Instruction> = Array.from([
  {
    name: 'add',
    call: (cpu: Cpu, literal: number, arg: number) => {
      const out = `RX <- ${cpu.rx} + ${literal}`;
      cpu.rx += literal;
      return out;
    },
  },
  {
    name: 'mov',
    call: (cpu: Cpu, literal: number, args: number) => {
      cpu.rx = literal;
      return `RX <- ${literal}`;
    },
  },
  {
    name: 'jmp',
    call: (cpu: Cpu, literal: number, args: number) => {
      cpu.pc = literal;
      return `JMP ${literal}`;
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
    this.r = new Array(this.registerCount).fill(0);
    if (Object.seal) Object.seal(this.r);
    this.status = Status.READY;
  }

  private process(cmd: number): string {
    let output = `${this.pc}: `;
    console.log(cmd.toString(2));
    const cmdType = cmd >> 28;
    const literal = (cmd >> 12) & 0xffff;
    const arg = cmd & 0xfff;
    output += instructions[cmdType].call(this, literal, arg);
    return output;
  }
}
