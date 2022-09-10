export type Command = { op: number; args: number[] };

export enum Status {
  READY = 'Ready',
  ERROR = 'Error',
  DONE = 'Done',
}

export const opCodes = ['EMPTY', 'ADD', 'SUB', 'INC', 'DEC', 'AND', 'OR'];

export class Cpu {
  readonly maxMemory = 3;

  pc = 0;
  cmem: Command[] = [];
  dmem: number[] = [];
  status: Status = Status.READY;

  static parseCommand(line: string, index: number): Command {
    const words = line.split(' ').filter((w) => w);
    const op = opCodes.indexOf(words[0].toUpperCase());
    if (op < 0)
      throw new Error(`Invalid op code at line (${index}): ${words[0]}`);
    const args = words.slice(1).map((word) => Number(word));
    if (args.length != 2)
      throw new Error(`Invalid args length at line (${index}): ${line}`);
    console.log(op, args);
    return { op, args };
  }

  static parseProgram(programText: string): Command[] {
    return programText
      .trim()
      .split('\n')
      .filter((el) => el)
      .map((line, index) => Cpu.parseCommand(line, index))
      .filter((cmd) => cmd.op > 0);
  }

  loadProgram(programText: string) {
    const program = Cpu.parseProgram(programText);
    this.reset();
    if (program.length > this.maxMemory)
      return console.log('Program memory overflow');
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
    this.status = Status.READY;
  }

  private process(cmd: Command): string {
    let output = `${this.pc}: `;
    console.log(cmd);
    switch (cmd.op) {
      case opCodes.indexOf('ADD'): {
        const args = cmd.args.filter((val) => val);
        output += `${args[0] + args[1]}`;
        break;
      }
      case opCodes.indexOf('SUB'): {
        const args = cmd.args.filter((val) => val);
        output += `${args[0] - args[1]}`;
        break;
      }
      default:
        break;
    }
    return output;
  }
}
