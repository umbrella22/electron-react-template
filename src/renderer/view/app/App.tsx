import React from 'react';
import AppRoutes from '@renderer/router';
import TitleBar from '@renderer/components/common/TitleBar';
import { HashRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './App.scss';

function RouteElement() {
  const element = useRoutes(AppRoutes);
  return element;
}

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 12,
          colorPrimary: '#4285F4',
        },
      }}
    >
      <div className="ease-app">
        <TitleBar title="header" />
        <main className="ease-main">
          <HashRouter>
            <RouteElement />
          </HashRouter>
        </main>
      </div>
    </ConfigProvider>
  );
};

export default App;
