export type Command = { op: string; args: string[] };

export enum Status {
  READY = 'Ready',
  ERROR = 'Error',
  DONE = 'Done',
}

export class Cpu {
  readonly maxMemory = 3;
  pc = 0;
  cmem: Command[] = [];
  dmem: number[] = [];
  status: Status = Status.READY;

  loadProgram(program: Command[]) {
    this.reset();
    if (program.length > this.maxMemory)
      return console.log('Program memory overflow');
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
    this.status = Status.READY;
  }

  private process(cmd: Command): string {
    let output = `${this.pc}: ${JSON.stringify(this.cmem[this.pc])} `;
    switch (cmd.op.toUpperCase()) {
      case 'ADD':
        const res = cmd.args
          .map((arg) => Number(arg))
          .filter((val) => val)
          .reduce((acc, arg) => acc + arg, 0);
        output += `${res}`;
        break;
      default:
        break;
    }
    return output;
  }
}
