import React, { FC } from 'react';
import './TitleBar.scss';

interface Props {
  title: string;
}

const App: FC<Props> = ({ title }) => {
  return (
    <div className="ease-title-bar" style={{ height: process.env.IS_WEB ? '0px' : '36px' }}>
      {title}
    </div>
  );
};

export default App;
