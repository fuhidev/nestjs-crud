import { isNil } from '@fuhidev/util';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const type = (process.env.TYPEORM_CONNECTION as any) || 'postgres';

export const withCache: TypeOrmModuleOptions = {
  type,
  host: '127.0.0.1',
  port: type === 'postgres' ? 5455 : 3316,
  username: type === 'mysql' ? 'nestjsx_crud' : 'root',
  password: type === 'mysql' ? 'nestjsx_crud' : 'root',
  database: 'nestjsx_crud',
  synchronize: false,
  logging: !isNil(process.env.TYPEORM_LOGGING) ? !!parseInt(process.env.TYPEORM_LOGGING, 10) : true,
  entities: [join(__dirname, './**/*.entity{.ts,.js}')],
};
