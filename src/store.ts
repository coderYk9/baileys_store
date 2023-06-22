import type { BaileysEventEmitter, SocketConfig } from '@whiskeysockets/baileys';
import { setLogger ,setMysql,useLogger, useMysql } from './shared';
import ContactHandler from './handlers/contact';
import DB from './handlers/db';

type initStoreOptions = {
  /** Mysql client instance */
    dbclient: typeof  DB ;
  /** Baileys pino logger */
  logger?: SocketConfig['logger'];
};

/** Initialize shared instances that will be consumed by the Store instance */
export async function initStore({ logger ,dbclient}: initStoreOptions) {
  setLogger(logger);
  setMysql(dbclient);
  useLogger();
  useMysql().conection();
  
}

export class Store {
  private readonly contactHandler;

  constructor(sessionId: string|number, event: BaileysEventEmitter) {

    this.contactHandler = ContactHandler(sessionId, event);
    this.listen();
  }

  /** Start listening to the events */
  public listen() {

    this.contactHandler.listen();
    //setTimeout(()=>this.unlisten(),1000*5)
  }

  /** Stop listening to the events */
  public unlisten() {

    this.contactHandler.unlisten();
  }
}
