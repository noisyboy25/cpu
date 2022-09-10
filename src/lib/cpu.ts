export type Command = { op: string; args: string[] };

export enum Status {
  READY = 'Ready',
  ERROR = 'Error',
  DONE = 'Done',
}

export class Cpu {
  program: Command[] = [];
  count = 0;
  status: Status = Status.READY;

  loadProgram(program: Command[]) {
    this.program = program;
    this.reset();
  }

  step(): string {
    let output = '';
    switch (true) {
      case this.count < 0:
        this.status = Status.ERROR;
        break;
      case this.count === this.program.length:
        this.status = Status.DONE;
        break;
      default:
        output = this.process(this.program[this.count]);
        this.count++;
        break;
    }
    return output;
  }
  reset() {
    this.count = 0;
    this.status = Status.READY;
  }
  private process(cmd: Command): string {
    let output = `${this.count}: ${JSON.stringify(this.program[this.count])} `;
    switch (cmd.op.toUpperCase()) {
      case 'ADD':
        output += `${cmd.args
          .map((arg) => Number(arg))
          .filter((val) => val)
          .reduce((acc, arg) => acc + arg)}`;
        break;
      default:
        break;
    }
    return output;
  }
}
