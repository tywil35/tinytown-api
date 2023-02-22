import { EnvUtil } from '../utils';
import mysql, { MysqlError, PoolConnection } from 'mysql';
import { LogUtil } from '../utils/log.util';
export namespace MySqlDb {
  const dbPool = mysql.createPool({
    connectionLimit: EnvUtil.MYSQL_POOL_CONNECT_LIMIT,
    host: EnvUtil.MYSQL_HOST,
    port: EnvUtil.MYSQL_HOST_PORT,
    user: EnvUtil.MYSQL_DB_USER,
    password: EnvUtil.MYSQL_USER_PASSWORD,
    database: EnvUtil.MYSQL_DB_NAME,
    insecureAuth: true
  });

  export const MySqlConnect = () => {
    return dbPool.getConnection;
  };

  export const Connection = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      dbPool.getConnection((err: MysqlError, connection: PoolConnection) => {
        if (err) reject(err);
        LogUtil.debug("MySQL pool connected: threadId", connection?.threadId);
        const query = async (sql: string, binding: any): Promise<any> => {
          return new Promise((resolve, reject) => {
            connection.query(sql, binding, (err, result) => {
              if (err) reject(err);
              resolve(result);
            });
          });
        };
        const release = async (): Promise<void> => {
          return new Promise((resolve, reject) => {
            if (err) reject(err);
            LogUtil.debug("MySQL pool released: threadId", connection?.threadId);
            resolve(connection.release());
          });
        };
        resolve({ query, release });
      });
    });
  };
}