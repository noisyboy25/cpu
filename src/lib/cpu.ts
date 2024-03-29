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
    name: 'NOP',
    call: () => {
      return 'NOP';
    },
  },
  {
    name: 'ADD',
    call: (cpu: Cpu, arg: number) => {
      const out = `RX <- ${cpu.rx} + ${arg}`;
      cpu.rx += arg;
      return out;
    },
  },
  {
    name: 'SUB',
    call: (cpu: Cpu, arg: number) => {
      const out = `RX <- ${cpu.rx} - ${arg}`;
      cpu.rx -= arg;
      return out;
    },
  },
  {
    name: 'MOV',
    call: (cpu: Cpu, arg: number) => {
      cpu.rx = arg;
      return `RX <- ${arg}`;
    },
  },
  {
    name: 'MOVRX',
    call: (cpu: Cpu, arg: number) => {
      cpu.rx = cpu.r[arg];
      return `RX <- R[${arg}]`;
    },
  },
  {
    name: 'MOVXR',
    call: (cpu: Cpu, arg: number) => {
      cpu.r[arg] = cpu.rx;
      return `RX -> R[${arg}]`;
    },
  },
  {
    name: 'MOVMX',
    call: (cpu: Cpu, arg: number) => {
      cpu.rx = cpu.dMem[arg];
      return `RX <- M[${arg}]`;
    },
  },
  {
    name: 'MOVXM',
    call: (cpu: Cpu, arg: number) => {
      cpu.dMem[arg] = cpu.rx;
      return `RX -> M[${arg}]`;
    },
  },
  {
    name: 'MOVMXR',
    call: (cpu: Cpu, arg: number) => {
      cpu.rx = cpu.dMem[cpu.r[arg]];
      return `RX <- M[${cpu.r[arg]}]`;
    },
  },
  {
    name: 'MOVXMR',
    call: (cpu: Cpu, arg: number) => {
      cpu.dMem[cpu.r[arg]] = cpu.rx;
      return `RX -> M[${cpu.r[arg]}]`;
    },
  },
  {
    name: 'JMP',
    call: (cpu: Cpu, arg: number) => {
      cpu.pc = arg;
      return `JMP ${arg}`;
    },
  },
  {
    name: 'JRXZ',
    call: (cpu: Cpu, arg: number) => {
      if (cpu.ez !== 0) {
        cpu.pc = arg;
      }
      return `JRXZ ${arg}`;
    },
  },
  {
    name: 'JRXNZ',
    call: (cpu: Cpu, arg: number) => {
      if (cpu.ez === 0) {
        cpu.pc = arg;
      }
      return `JRXNZ ${arg}`;
    },
  },
  {
    name: 'GRTR',
    call: (cpu: Cpu, arg: number) => {
      const out = `RX <- (RX > R${arg}) ${cpu.rx} > ${cpu.r[arg]}`;
      cpu.rx = cpu.rx > cpu.r[arg] ? 1 : 0;
      return out;
    },
  },
  {
    name: 'EQUR',
    call: (cpu: Cpu, arg: number) => {
      cpu.rx = cpu.rx === cpu.r[arg] ? 1 : 0;
      return `RX <- (RX == R${arg})`;
    },
  },
]);

export class Cpu {
  readonly registerCount = 3;

  pc = 0;
  cMem: number[] = [];
  dMem: number[] = [];
  rx = 0;
  ez = 0;
  r: number[] = new Array(this.registerCount).fill(0);
  status: Status = Status.READY;

  constructor() {
    if (Object.seal) Object.seal(this.r);
  }

  loadProgram(program: number[]) {
    this.reset();
    this.cMem = program;
    console.log(this);
  }

  step(): string {
    let output = '';
    if (this.status !== Status.READY) return output;
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
    this.ez = 0;
    this.dMem = [];
    if (Object.seal) Object.seal(this.r);
    this.status = Status.READY;
  }

  private process(cmd: number): string {
    let output = `${this.pc}: `;
    console.log(cmd.toString(2));
    const opCode = cmd >> 27;
    const arg = cmd & 0x7ffffff;
    output += instructions[opCode].call(this, arg);
    this.ez = this.rx === 0 ? 1 : 0;
    return output;
  }
}
