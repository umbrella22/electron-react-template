import { ipcRenderer, shell } from 'electron';

interface AnyObject {
  [key: string]: any;
}

interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

declare global {
  interface Window {
    performance: {
      memory: MemoryInfo;
    };
    ipcRenderer: typeof ipcRenderer;
    systemInfo: {
      platform: string;
      release: string;
      arch: string;
      nodeVersion: string;
      electronVersion: string;
    };
    shell: {
      shell: typeof shell;
    };
    crash: {
      start: () => void;
    };
  }
}
