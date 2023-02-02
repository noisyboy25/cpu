import { writable } from 'svelte/store';
import { Cpu } from './cpu';

function createCpu() {
  const { subscribe, update } = writable(new Cpu());
  return {
    subscribe,
    step: () => {
      let out = '';
      update((cpu) => {
        out += cpu.step();
        return cpu;
      });
      return out;
    },
    reset: () => {
      update((cpu) => {
        cpu.reset();
        return cpu;
      });
    },
    load: (program: number[]) => {
      update((cpu) => {
        cpu.loadProgram(program);
        return cpu;
      });
    },
  };
}

export const cpu = createCpu();
