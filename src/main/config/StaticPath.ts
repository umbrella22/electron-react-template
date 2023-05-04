// 这里定义了静态文件路径的位置
import { join } from 'path';
import config from '@config/index';
import { app } from 'electron';

interface FilePath {
  winURL: {
    [key: string]: string;
  };
  loadingURL: {
    [key: string]: string;
  };
  getPreloadFile(fileName: string): string;
}

const filePath: FilePath = {
  winURL: {
    development: `http://localhost:${process.env.PORT}`,
    production: `file://${join(app.getAppPath(), 'dist', 'electron', 'renderer', 'index.html')}`,
  },
  loadingURL: {
    development: `http://localhost:${process.env.PORT}/loader.html`,
    production: `file://${join(app.getAppPath(), 'dist', 'electron', 'renderer', 'loader.html')}`,
  },
  getPreloadFile(fileName: string) {
    if (process.env.NODE_ENV !== 'development') {
      return join(app.getAppPath(), 'dist', 'electron', 'main', `${fileName}.js`);
    }
    return join(app.getAppPath(), `${fileName}.js`);
  },
};

if (process.env.NODE_ENV !== 'development')
  // eslint-disable-next-line no-underscore-dangle
  process.env.__static = join(app.getAppPath(), 'dist', 'electron', 'renderer').replace(/\\/g, '\\\\');

function getAppRootPath(path: string) {
  return process.env.NODE_ENV !== 'development'
    ? join(__dirname, '..', '..', '..', '..', path).replace(/\\/g, '\\\\')
    : join(__dirname, '..', '..', '..', path).replace(/\\/g, '\\\\');
}

// eslint-disable-next-line no-underscore-dangle
process.env.__lib = getAppRootPath(config.DllFolder);
// eslint-disable-next-line no-underscore-dangle
process.env.__updateFolder = getAppRootPath(config.HotUpdateFolder);

export const winURL = filePath.winURL[process.env.NODE_ENV || 'development'];
export const loadingURL = filePath.loadingURL[process.env.NODE_ENV || 'development'];
// eslint-disable-next-line no-underscore-dangle
export const lib = process.env.__lib;
// eslint-disable-next-line no-underscore-dangle
export const updateFolder = process.env.__updateFolder;
export const { getPreloadFile } = filePath;
