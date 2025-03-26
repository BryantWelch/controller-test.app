import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';

// GitHub icon SVG
const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0.297C5.37 0.297 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.95 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.096C14.939 23.411 15.149 23.786 15.764 23.666C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627 0.297 12 0.297Z" />
  </svg>
);

// External link icon SVG
const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '4px' }}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Chevron icon SVG
const ChevronIcon = styled.svg<{ isUp: boolean }>`
  width: 16px;
  height: 16px;
  margin-left: 6px;
  transition: transform 0.2s ease;
  transform: ${props => props.isUp ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

// Right chevron icon SVG
const RightChevronIcon = styled.svg<{ isLeft: boolean }>`
  width: 16px;
  height: 16px;
  margin-left: 6px;
  transition: transform 0.2s ease;
  transform: ${props => props.isLeft ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

// Styled components
const NavbarContainer = styled.nav<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${props => props.isScrolled 
    ? 'rgba(0, 18, 9, 0.85)' 
    : theme.colors.background};
  backdrop-filter: ${props => props.isScrolled ? 'blur(8px)' : 'none'};
  padding: ${theme.space.md} ${theme.space.xl};
  display: flex;
  align-items: center;
  transition: ${theme.transitions.default};
  box-shadow: ${props => props.isScrolled ? theme.shadows.md : 'none'};
`;

const NavbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xl};
`;

const NavbarRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.lg};
`;

const NavLink = styled(Link)`
  color: ${theme.colors.text};
  font-weight: 500;
  position: relative;
  padding: ${theme.space.xs} ${theme.space.sm};
  
  &:hover {
    color: ${theme.colors.primary};
    text-decoration: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background-color: ${theme.colors.primary};
    transition: ${theme.transitions.default};
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  
  &:hover > div {
    display: block;
  }
  
  &:hover > button svg {
    transform: rotate(180deg);
  }
`;

const DropdownButton = styled.button`
  color: ${theme.colors.text};
  font-weight: 500;
  font-size: ${theme.fontSizes.lg};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.space.xs} ${theme.space.sm};
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: ${theme.colors.backgroundLight};
  min-width: 200px;
  box-shadow: ${theme.shadows.lg};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.sm} 0;
  z-index: 1;
  top: 100%;
  left: 0;
  
  /* This creates an invisible bridge to prevent the dropdown from closing */
  &::after {
    content: '';
    position: absolute;
    height: 10px;
    width: 100%;
    top: -10px;
    left: 0;
  }
`;

const DropdownLink = styled.a`
  color: ${theme.colors.text};
  padding: ${theme.space.sm} ${theme.space.md};
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.backgroundDark};
    color: ${theme.colors.primary};
    text-decoration: none;
  }
`;

const NestedDropdownContainer = styled.div`
  position: relative;
  
  &:hover > div {
    display: block;
  }
  
  &:hover > button svg {
    transform: rotate(180deg);
  }
`;

const NestedDropdownButton = styled.button`
  color: ${theme.colors.text};
  font-weight: 500;
  font-size: ${theme.fontSizes.xl};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.space.sm} ${theme.space.md};
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background-color: ${theme.colors.backgroundDark};
    color: ${theme.colors.primary};
  }
`;

const NestedDropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: ${theme.colors.backgroundLight};
  min-width: 200px;
  box-shadow: ${theme.shadows.lg};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.sm} 0;
  z-index: 2;
  top: 0;
  left: 100%;
  
  /* This creates an invisible bridge to prevent the dropdown from closing */
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 10px;
    top: 0;
    left: -10px;
  }
`;

const GitHubLink = styled.a`
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.space.xs};
  border-radius: ${theme.borderRadius.full};
  transition: ${theme.transitions.default};
  
  &:hover {
    color: ${theme.colors.primary};
    transform: scale(1.1);
  }
`;

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <NavbarContainer isScrolled={isScrolled}>
      <NavbarLeft>
        <Logo to="/">Controller Test</Logo>
        <NavLink to="/about">About</NavLink>
        
        <NavLinks>
          <DropdownContainer>
            <DropdownButton>
              Other Tools
              <ChevronIcon viewBox="0 0 24 24" isUp={false}>
                <path 
                  d="M7 10l5 5 5-5" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </ChevronIcon>
            </DropdownButton>
            <DropdownContent>
              <DropdownLink href="https://display-test.app" target="_blank" rel="noopener noreferrer">
                <span>Display Test</span> <ExternalLinkIcon />
              </DropdownLink>
              <DropdownLink href="https://keyboard-test.app" target="_blank" rel="noopener noreferrer">
                <span>Keyboard Test</span> <ExternalLinkIcon />
              </DropdownLink>
            </DropdownContent>
          </DropdownContainer>
          
          <DropdownContainer>
            <DropdownButton>
              Controllers
              <ChevronIcon viewBox="0 0 24 24" isUp={false}>
                <path 
                  d="M7 10l5 5 5-5" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </ChevronIcon>
            </DropdownButton>
            <DropdownContent>
              <NestedDropdownContainer>
                <NestedDropdownButton>
                  <span>Xbox</span>
                  <RightChevronIcon viewBox="0 0 24 24" isLeft={false}>
                    <path 
                      d="M10 17l5-5-5-5" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </RightChevronIcon>
                </NestedDropdownButton>
                <NestedDropdownContent>
                  <DropdownLink 
                    href="https://amzn.to/3XtBE5u" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>Xbox Series Controller</span> <ExternalLinkIcon />
                  </DropdownLink>
                  <DropdownLink 
                    href="https://amzn.to/4jaeWaV" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>Xbox Elite Controller</span> <ExternalLinkIcon />
                  </DropdownLink>
                  <DropdownLink 
                    href="https://amzn.to/42gzPvg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>Xbox One Controller</span> <ExternalLinkIcon />
                  </DropdownLink>
                  <DropdownLink 
                    href="https://amzn.to/4hPqU8S" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>Xbox Elite 2 Controller</span> <ExternalLinkIcon />
                  </DropdownLink>
                </NestedDropdownContent>
              </NestedDropdownContainer>
              
              <NestedDropdownContainer>
                <NestedDropdownButton>
                  <span>PlayStation</span>
                  <RightChevronIcon viewBox="0 0 24 24" isLeft={false}>
                    <path 
                      d="M10 17l5-5-5-5" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </RightChevronIcon>
                </NestedDropdownButton>
                <NestedDropdownContent>
                  <DropdownLink 
                    href="https://amzn.to/3Xw58zz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>PS5 DualSense Controller</span> <ExternalLinkIcon />
                  </DropdownLink>
                  <DropdownLink 
                    href="https://amzn.to/3QPlwaI" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>PS4 DualShock Controller</span> <ExternalLinkIcon />
                  </DropdownLink>
                  <DropdownLink 
                    href="https://amzn.to/3XAI5nk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>PS5 DualSense Edge</span> <ExternalLinkIcon />
                  </DropdownLink>
                </NestedDropdownContent>
              </NestedDropdownContainer>
              
              <NestedDropdownContainer>
                <NestedDropdownButton>
                  <span>Nintendo</span>
                  <RightChevronIcon viewBox="0 0 24 24" isLeft={false}>
                    <path 
                      d="M10 17l5-5-5-5" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </RightChevronIcon>
                </NestedDropdownButton>
                <NestedDropdownContent>
                  <DropdownLink 
                    href="https://amzn.to/3DJwStY" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>Switch Pro Controller</span> <ExternalLinkIcon />
                  </DropdownLink>
                  <DropdownLink 
                    href="https://amzn.to/4hRxpaV" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>Switch Joy-Cons</span> <ExternalLinkIcon />
                  </DropdownLink>
                  <DropdownLink 
                    href="https://amzn.to/3Y3edA0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>Hori Split Pad Pro</span> <ExternalLinkIcon />
                  </DropdownLink>
                </NestedDropdownContent>
              </NestedDropdownContainer>
            </DropdownContent>
          </DropdownContainer>
        </NavLinks>
      </NavbarLeft>
      
      <NavbarRight>
        <GitHubLink 
          href="https://github.com/BryantWelch/controller-test.app" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
        >
          <GitHubIcon />
        </GitHubLink>
      </NavbarRight>
    </NavbarContainer>
  );
};

export default Navbar;
