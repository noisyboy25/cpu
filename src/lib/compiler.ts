import { instructions } from './cpu';

export abstract class Compiler {
  static compile(programText: string): number[] {
    return programText
      .trim()
      .split('\n')
      .filter((el) => el)
      .map((line) => Compiler.encodeCommand(line));
  }

  static encodeCommand(line: string): number {
    const words = line.split(' ').filter((w) => w);
    const op = words[0].toUpperCase();
    const arg = Number(words[1]);
    console.log(op, arg);
    let opCode: number;
    instructions.forEach((w, index) => {
      console.log(w);
      if (w.name.toUpperCase() === op) {
        opCode = index;
      }
    });
    console.log(opCode, arg);
    return (opCode << 28) | arg;
  }
}
