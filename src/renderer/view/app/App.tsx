import React from 'react';
import logo from '@/assets/logo.svg';
import { platform, arch } from 'os'
import { version } from 'react/package.json'
import './App.scss';

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <div className="left-box">
          <div className="logo">
            <img src={logo} className="App-logo" alt="logo" />
            <span className="logo-title">
              <span>electron</span>-react
            </span>
          </div>
          <div className="info-box">
            <div className="title">关于系统</div>
            <div className="items">
              <div className="item">
                <div className="name">react版本:</div>
                <div className="value">{version}</div>
              </div>
              <div className="item">
                <div className="name">Electron版本:</div>
                <div className="value">{process.versions.electron || "浏览器环境"}</div>
              </div>
              <div className="item">
                <div className="name">Node版本:</div>
                <div className="value">{process.versions.node || "浏览器环境"}</div>
              </div>
              <div className="item">
                <div className="name">所运行的系统:</div>
                <div className="value">{platform()}</div>
              </div>
              <div className="item">
                <div className="name">所运行的系统:</div>
                <div className="value">{arch()}位</div>
              </div>
              <div className="item">
                <div className="name">静态文件目录:</div>
                <div className="value">{process.env.__static}</div>
              </div>
              <div className="item">
                <div className="name">dll自定义路径:</div>
                <div className="value">{process.env.__lib}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
