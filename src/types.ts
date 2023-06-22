import type { BaileysEventMap } from '@whiskeysockets/baileys';

export type BaileysEventHandler<T extends keyof BaileysEventMap> = (
  args: BaileysEventMap[T]
) => void;
