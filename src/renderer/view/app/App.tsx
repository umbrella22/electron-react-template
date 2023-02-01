import React, { FC } from "react";
import logo from "@renderer/assets/logo.svg";
import { Button, Rate } from "antd";
import { version } from "react/package.json";
import "./App.scss";

import TitleBar from "@renderer/components/common/TitleBar";

const App: FC = () => {
  const { systemInfo } = window;
  const systemInfolist = [
    {
      name: "系统平台",
      value: systemInfo.platform || "浏览器环境",
    },
    {
      name: "electron版本",
      value: systemInfo.release || "浏览器环境",
    },
    {
      name: "系统位数",
      value: systemInfo ? `${systemInfo.arch}位` : "浏览器环境",
    },
  ];
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

              {systemInfolist.map((item, index) => {
                return (
                  <div className="item" key={index}>
                    <div className="name">{item.name}:</div>
                    <div className="value">{item.value}</div>
                  </div>
                );
              })}

              <div className="item">
                <div className="name">antd组件示例</div>
                <div className="value flex-box">
                  <Button type="primary">按钮</Button>
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
