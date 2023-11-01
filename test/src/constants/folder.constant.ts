import * as fs from 'fs';
import { join } from 'path';

export const HOME_FOLDER = join(__dirname, '..', '..');

export const UPLOAD_FOLDER = join(HOME_FOLDER, 'uploads');

export const mkdir = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

mkdir(UPLOAD_FOLDER);
