export type Command = { op: string; args: string[] };

enum Status {
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

  step() {
    console.log('tick', this.count, this.program[this.count], this.status);

    if (this.count < 0) {
      this.status = Status.ERROR;
      return;
    }
    if (this.count === this.program.length) {
      this.status = Status.DONE;
      return;
    }

    this.count++;
  }
  reset() {
    this.count = 0;
    this.status = Status.READY;
  }
}
