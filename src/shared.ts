import type { SocketConfig } from '@whiskeysockets/baileys';
import { DEFAULT_CONNECTION_CONFIG } from '@whiskeysockets/baileys';
import invariant from 'tiny-invariant';
import DB from './handlers/db';


let logger: SocketConfig['logger']|null;
let db: typeof DB;


export function setLogger(pinoLogger?: SocketConfig['logger']) {
  logger = pinoLogger || DEFAULT_CONNECTION_CONFIG.logger;
}

export function setMysql(Client:typeof DB) {
       db =  Client;
}
export function useMysql() {
  invariant(db, 'MariaDb client cannot be used before initialization');
  return db;
}

export function useLogger() {
  invariant(logger, 'Pino logger cannot be used before initialization');
  return logger;
}
