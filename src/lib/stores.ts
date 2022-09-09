import { writable } from 'svelte/store';
import { Cpu } from './cpu';

export const cpu = writable(new Cpu());
