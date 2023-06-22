import type { BaileysEventEmitter ,Contact } from '@whiskeysockets/baileys';
import { useLogger, useMysql } from '../shared';
import type { BaileysEventHandler } from '../types';

export default function contactHandler(sessionId:number |string, event: BaileysEventEmitter) {
  const db = useMysql();
  // main funcation save contact phone
  const logger = useLogger();
  const excu = async (contacts:Contact[]|Partial<Contact>[]) =>{
    const contactIds = contacts.map((c) =>`(${sessionId},${c.id},${c.name})`);
    const sql =`INSERT INTO contacts (sessionId,wtId,name) VALUES ${contactIds.toString()}  ON DUPLICATE KEY UPDATE  wtId = wtId`;
    await db.query(sql);
  } 
  let listening:boolean = false;
   /**
    * on Start get contact
    * @param contacts 
    */
  const upsert: BaileysEventHandler<'contacts.upsert'> = async (contacts) => {
    try {
        excu(contacts);
    } catch (e) { 
      logger.error(e, 'An error occured during contacts update');
    }
  };
  const update: BaileysEventHandler<'contacts.update'> = async (contacts) => {
    try {
        excu(contacts);
    } catch (e) { 
      logger.error(e, 'An error occured during contacts upsert');
    }
  };


  const listen = () => {
    if (listening) return;
    event.on('contacts.upsert', upsert);
    event.on('contacts.update', update);
    listening = true;
  };

  const unlisten = () => {
    if (!listening) return;
    event.off('contacts.upsert', upsert);
    event.off('contacts.upsert', update);

    listening = false;
  };

  return { listen, unlisten };
}
