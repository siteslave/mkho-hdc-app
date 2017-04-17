import * as mysql from 'mysql';
import { IConnection, IConnectionConfig } from 'mysql';

export class Configure {
  getConnection() {
    return new Promise((resolve, reject) => {
      const config: IConnectionConfig = {
        host: localStorage.getItem('dbHost') || 'localhost',
        port: +localStorage.getItem('dbPort') || 3306,
        database: localStorage.getItem('dbName') || 'hosxp_pcu',
        user: localStorage.getItem('dbUser') || 'sa',
        password: localStorage.getItem('dbPassword') || 'sa'
      };

      const pool = mysql.createPool(config);

      pool.getConnection((err, connection: IConnection) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(connection);
        }
      });

      pool.on('connection', (connection) => {
        connection.query('SET NAMES utf8')
      });
    });
  }
}
