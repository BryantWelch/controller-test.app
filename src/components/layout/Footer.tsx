import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.backgroundDark};
  color: ${theme.colors.text};
  padding: ${theme.space.xl} 0;
  margin-top: ${theme.space['2xl']};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.space.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.space.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FooterTitle = styled.h3`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.space.md};
  font-size: ${theme.fontSizes.lg};
  position: relative;
  text-align: center;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background-color: ${theme.colors.primary};
  }
`;

const FooterLink = styled.a`
  color: ${theme.colors.text};
  margin-bottom: ${theme.space.sm};
  transition: ${theme.transitions.default};
  display: inline-block;
  position: relative;
  text-decoration: none;
  width: fit-content;
  
  &:hover {
    color: ${theme.colors.primary};
    text-decoration: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: ${theme.colors.primary};
    transition: width 0.2s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

// Commented out to fix ESLint warning - will be used in future implementation
// const FooterText = styled.p`
//   margin-bottom: ${theme.space.md};
//   font-size: ${theme.fontSizes.sm};
//   line-height: 1.6;
// `;

const Copyright = styled.div`
  text-align: center;
  padding-top: ${theme.space.xl};
  margin-top: ${theme.space.xl};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const KofiButton = styled.div`
  position: absolute;
  right: 2rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    position: static;
    margin-top: 2rem;
  }
`;

const KofiLink = styled.a`
  display: inline-block;
  transition: ${theme.transitions.default};
  
  &:hover {
    transform: translateY(-3px);
  }
  
  img {
    height: 36px;
  }
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>About</FooterTitle>
          <FooterLink 
            href="https://github.com/BryantWelch/controller-test.app" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            GitHub Repository
          </FooterLink>
          <FooterLink 
            href="https://github.com/BryantWelch/controller-test.app/issues" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Report an Issue
          </FooterLink>
          <FooterLink 
            href="https://github.com/BryantWelch/controller-test.app/pulls" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Contribute
          </FooterLink>
          <FooterLink 
            href="https://github.com/BryantWelch/controller-test.app/releases" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Releases
          </FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Resources</FooterTitle>
          <FooterLink 
            href="https://support.xbox.com/help/hardware-network/controller/controller-troubleshooting" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Xbox Controller Support
          </FooterLink>
          <FooterLink 
            href="https://www.playstation.com/support/hardware/dualsense-controller-support/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            PlayStation Controller Support
          </FooterLink>
          <FooterLink 
            href="https://en-americas-support.nintendo.com/app/answers/detail/a_id/22391/~/controller-not-responding-or-responding-incorrectly" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Nintendo Controller Support
          </FooterLink>
          <FooterLink 
            href="https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Gamepad API Documentation
          </FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Community</FooterTitle>
          <FooterLink 
            href="https://www.reddit.com/r/gamepad/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            r/gamepad
          </FooterLink>
          <FooterLink 
            href="https://www.reddit.com/r/XboxSupport/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            r/XboxSupport
          </FooterLink>
          <FooterLink 
            href="https://www.reddit.com/r/PlayStationSolutions/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            r/PlayStationSolutions
          </FooterLink>
          <FooterLink 
            href="https://discord.gg/nintendo" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Nintendo Discord
          </FooterLink>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        <p>
          &copy; {currentYear} Controller Test App. All rights reserved.{" "}
          <FooterLink 
            href="https://github.com/BryantWelch/controller-test.app/blob/main/LICENSE" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            MIT License
          </FooterLink>
          {" | "}
          <FooterLink 
            href="/privacy"
          >
            Privacy Policy
          </FooterLink>
        </p>
        
        <KofiButton>
          <KofiLink href='https://ko-fi.com/V7V01A0SJC' target='_blank' rel="noopener noreferrer">
            <img src='https://storage.ko-fi.com/cdn/kofi5.png?v=6' alt='Buy Me a Coffee at ko-fi.com' />
          </KofiLink>
        </KofiButton>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
