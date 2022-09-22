import { instructions } from './cpu';

export type Command = { op: string; args: number[] };

export abstract class Compiler {
  static compile(programText: string): Command[] {
    return programText
      .trim()
      .split('\n')
      .filter((el) => el)
      .map((line, index) => Compiler.parseCommand(line, index));
  }

  static parseCommand(line: string, index: number): Command {
    const words = line.split(' ').filter((w) => w);
    const op = words[0].toUpperCase();
    const args = words.slice(1).map((word) => Number(word));
    if (instructions.get(op).argNumber != args.length)
      throw new Error('Invalid arguments length');
    console.log(op, args);
    return { op, args };
  }
}
