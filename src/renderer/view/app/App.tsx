import React, { FC } from "react";
import logo from "@/assets/logo.svg";
import { Button, Rate } from "antd";
// import { platform, arch } from "os";
import { version } from "react/package.json";
import "./App.scss";

import TitleBar from "../../components/common/TitleBar"

const App: FC = () => {
  return (
    <div className="App">
      <div className="App-header">
        <TitleBar />
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
                <div className="value">
                  {!process.env.IS_WEB
                    ? process.versions.electron
                    : "浏览器环境"}
                </div>
              </div>
              <div className="item">
                <div className="name">Node版本:</div>
                <div className="value">
                  {!process.env.IS_WEB ? process.versions.node : "浏览器环境"}
                </div>
              </div>
              <div className="item">
                <div className="name">所运行的系统:</div>
                <div className="value">
                  {!process.env.IS_WEB
                    ? require("os").platform()
                    : "浏览器环境"}
                </div>
              </div>
              <div className="item">
                <div className="name">所运行的系统:</div>
                <div className="value">
                  {!process.env.IS_WEB ? require("os").arch() : "浏览器环境"}位
                </div>
              </div>
              <div className="item">
                <div className="name">静态文件目录:</div>
                <div className="value">
                  {!process.env.IS_WEB
                    ? window.__static
                    : "web环境下没有此目录"}
                </div>
              </div>
              <div className="item">
                <div className="name">dll自定义路径:</div>
                <div className="value">
                  {!process.env.IS_WEB
                    ? process.env.__lib || window.__lib
                    : "web环境下没有此目录"}
                </div>
              </div>
              <div className="item">
                <div className="name">antd组件示例</div>
                <div className="value">
                  <Button type="primary">Primary</Button>
                  <Rate />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
