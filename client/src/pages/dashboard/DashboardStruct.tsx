import React from 'react';
import { Header } from 'containers';
import { FlexBox } from 'components';
import Sidebar from './Sidebar';

const DashboardStruct: React.FC = ({ children }) => (
  <>
    <Header />
    <FlexBox marginTop={8}>
      {
        //<Sidebar />
      }
      {children}
    </FlexBox>
  </>
);

export default DashboardStruct;