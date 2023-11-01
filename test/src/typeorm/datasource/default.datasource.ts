import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
export const defaultDataSource: SqlServerConnectionOptions = {
  type: 'mssql',
  host: 'localhost',
  database: 'crud',
  username: 'sa',
  password: 'yourStrong(!)Password',
  options: {
    trustServerCertificate: true,
  },
  entities: [join(__dirname, '../..', '**/**.entity{.ts,.js}')],
  migrations: [join(__dirname, '../..', 'typeorm/migrations/*{.ts,.js}')],
  subscribers: [join(__dirname, '../..', '**/**.sub{.ts,.js}')],
};
export default new DataSource(defaultDataSource);
