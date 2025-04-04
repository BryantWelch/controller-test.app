import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { theme } from '../../styles/theme';

const Main = styled.main`
  min-height: 100vh;
  padding-top: 80px; /* Account for fixed navbar */
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.space.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.space.lg};
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Main>
        <ContentContainer>
          <Breadcrumbs />
          {children}
        </ContentContainer>
        <Footer />
      </Main>
    </>
  );
};

export default Layout;
