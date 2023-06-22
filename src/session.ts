import type { AuthenticationCreds, SignalDataTypeMap } from '@whiskeysockets/baileys';
import { proto } from '@whiskeysockets/baileys';
import { BufferJSON, initAuthCreds } from '@whiskeysockets/baileys';
import { useLogger ,useMysql} from './shared';

const fixId = (id: string) => id.replace(/\//g, '__').replace(/:/g, '-');
export async function useSession(sessionId: string|number) {
  // use shared class
  const logger = useLogger();
  const DB = useMysql();
  /** 
   *  write auth keys and creds data in database and update it if exiset 
   *  using mariadb libarty
   * */
  const write = async (data: any, id: string) => {
    try {
      data = JSON.stringify(data, BufferJSON.replacer);
      id = fixId(id);
      await DB.query('INSERT INTO session_details(sessionId,id,data) VALUES(?,?,?) ON DUPLICATE KEY UPDATE data =VALUES(data)',
      [sessionId,id,data]);
    } catch (e) {
      logger.error(e, 'An error occured during session write');
    }
  };
   /** 
   *  get  auth keys and creds data in database 
   *  using mariadb libarty return null if not data matched
   * */
  const read = async (id: string) => {
    try {
      const data= await DB.query('SELECT data FROM session_details WHERE sessionId = ? and  id = ?', 
      [sessionId,fixId(id)]);
      return JSON.parse(data[0]?.data??null, BufferJSON.reviver);

    } catch (e) {
      if (e) {
        logger.info({ id }, 'Trying to read non existent session data');
      } else {
        logger.error(e, 'An error occured during session read');
      }
      return null;
    }
  };
  // delete auth data
  const del = async (id: string) => {
    try {
      await DB.query('DELETE FROM session_details WHERE sessionId = ? and id = ?',
      [sessionId,fixId(id)]);
    } catch (e) {
      logger.error(e, 'An error occured during session delete');
    }
  };

  const creds: AuthenticationCreds = (await read('creds')) || initAuthCreds();
/**
 * the bussinc logic run here 
 *  state is creds to cheek auth
 * keys its cheek message auth
 */
  return {
    state: {
      creds,
      keys: {
        get: async (type: keyof SignalDataTypeMap, ids: string[]) => {
          const data: { [key: string]: SignalDataTypeMap[typeof type] } = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await read(`${type}-${id}`);
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            })
          );
          return data;
        },
        set: async (data: any) => {
          const tasks: Promise<void>[] = [];

          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const sId = `${category}-${id}`;
              tasks.push(value ? write(value, sId) : del(sId));
            }
          }
          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => write(creds, 'creds'),
  };
}
