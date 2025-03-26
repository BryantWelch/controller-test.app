import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../styles/theme';

const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.space.xl} ${theme.space.md};
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: ${theme.space.lg};
  color: ${theme.colors.primary};
  text-align: center;
`;

const Section = styled(motion.section)`
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.space.xl};
  margin-bottom: ${theme.space.xl};
  width: 100%;
  box-shadow: ${theme.shadows.md};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  margin-bottom: ${theme.space.md};
  color: ${theme.colors.primary};
  border-bottom: 1px solid ${theme.colors.backgroundDark};
  padding-bottom: ${theme.space.sm};
`;

const SectionContent = styled.div`
  color: ${theme.colors.text};
  line-height: 1.6;
  
  p {
    margin-bottom: ${theme.space.md};
  }
  
  a {
    color: ${theme.colors.accent};
    text-decoration: none;
    transition: ${theme.transitions.default};
    
    &:hover {
      color: ${theme.colors.primary};
      text-decoration: underline;
    }
  }
  
  ul, ol {
    margin-bottom: ${theme.space.md};
    padding-left: ${theme.space.xl};
  }
  
  li {
    margin-bottom: ${theme.space.sm};
  }
`;

const TechStackList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.space.md};
  margin-top: ${theme.space.md};
`;

const TechItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.space.sm};
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.default};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.sm};
  }
`;

const TechIcon = styled.span`
  margin-right: ${theme.space.sm};
  font-size: ${theme.fontSizes.lg};
`;

const TechName = styled.span`
  color: ${theme.colors.text};
`;

const FaqItem = styled.div`
  margin-bottom: ${theme.space.lg};
`;

const FaqQuestion = styled.h3`
  font-size: ${theme.fontSizes.lg};
  margin-bottom: ${theme.space.sm};
  color: ${theme.colors.accent};
`;

const FaqAnswer = styled.div`
  color: ${theme.colors.text};
  line-height: 1.6;
`;

const ContactButton = styled(motion.a)`
  display: inline-block;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.backgroundDark};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  padding: ${theme.space.sm} ${theme.space.lg};
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  box-shadow: ${theme.shadows.sm};
  margin-top: ${theme.space.md};
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${theme.colors.primaryLight};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    text-decoration: none;
  }
`;

const About: React.FC = () => {
  return (
    <AboutContainer>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Controller Test
      </Title>
      
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SectionTitle>Project Overview</SectionTitle>
        <SectionContent>
          <p>
            Controller Test is a free, open-source web application designed to help gamers and developers test and diagnose issues with their game controllers. 
            Whether you're experiencing stick drift, button problems, or just want to make sure your controller is working properly, this tool provides a simple 
            and intuitive way to visualize controller inputs in real-time.
          </p>
          <p>
            This project was created to address the need for an accessible, browser-based controller testing tool that works across different platforms and controller types.
            It's built with modern web technologies and is completely free to use, with no ads or tracking.
          </p>
          <p>
            The source code is available on <a href="https://github.com/BryantWelch/controller-test.app" target="_blank" rel="noopener noreferrer">GitHub</a>, and contributions are welcome!
          </p>
        </SectionContent>
      </Section>
      
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionTitle>Features</SectionTitle>
        <SectionContent>
          <ul>
            <li><strong>Controller Detection:</strong> Automatically detects connected controllers via the Gamepad API.</li>
            <li><strong>Multi-Controller Support:</strong> Works with Xbox, PlayStation, and generic controllers.</li>
            <li><strong>Visual Feedback:</strong> Real-time visual representation of button presses and stick movements.</li>
            <li><strong>Stick Drift Detection:</strong> Identifies and visualizes analog stick drift issues.</li>
            <li><strong>Diagnostics Dashboard:</strong> Detailed view of all controller inputs and their values.</li>
            <li><strong>Responsive Design:</strong> Works on desktop and mobile browsers that support the Gamepad API.</li>
            <li><strong>No Installation Required:</strong> Runs directly in your web browser with no downloads or plugins.</li>
          </ul>
        </SectionContent>
      </Section>
      
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SectionTitle>Technology Stack</SectionTitle>
        <SectionContent>
          <p>
            Controller Test is built with the following technologies:
          </p>
          <TechStackList>
            <TechItem>
              <TechIcon>⚛️</TechIcon>
              <TechName>React</TechName>
            </TechItem>
            <TechItem>
              <TechIcon>💅</TechIcon>
              <TechName>Styled Components</TechName>
            </TechItem>
            <TechItem>
              <TechIcon>🔄</TechIcon>
              <TechName>React Router</TechName>
            </TechItem>
            <TechItem>
              <TechIcon>✨</TechIcon>
              <TechName>Framer Motion</TechName>
            </TechItem>
            <TechItem>
              <TechIcon>🎮</TechIcon>
              <TechName>Gamepad API</TechName>
            </TechItem>
            <TechItem>
              <TechIcon>🌐</TechIcon>
              <TechName>TypeScript</TechName>
            </TechItem>
          </TechStackList>
        </SectionContent>
      </Section>
      
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <SectionContent>
          <FaqItem>
            <FaqQuestion>Why can't the app detect my controller?</FaqQuestion>
            <FaqAnswer>
              <p>
                There are several reasons why your controller might not be detected:
              </p>
              <ul>
                <li>Your browser doesn't support the Gamepad API (try Chrome, Edge, or Firefox)</li>
                <li>Your controller isn't properly connected to your device</li>
                <li>You need to press a button on the controller to activate it</li>
                <li>Your controller might require specific drivers</li>
              </ul>
              <p>
                Try refreshing the page after connecting your controller and pressing a button.
              </p>
            </FaqAnswer>
          </FaqItem>
          
          <FaqItem>
            <FaqQuestion>What is stick drift and how does this app detect it?</FaqQuestion>
            <FaqAnswer>
              <p>
                Stick drift is a common issue where analog sticks register movement even when you're not touching them.
                This app detects stick drift by monitoring the resting position of your analog sticks over time.
                If the sticks consistently report non-zero values when at rest, the app will flag this as potential drift.
              </p>
            </FaqAnswer>
          </FaqItem>
          
          <FaqItem>
            <FaqQuestion>Does this app work on mobile devices?</FaqQuestion>
            <FaqAnswer>
              <p>
                Yes, the app works on mobile browsers that support the Gamepad API and can connect to controllers.
                However, controller support on mobile devices varies widely depending on your device, operating system,
                and the controller you're using.
              </p>
            </FaqAnswer>
          </FaqItem>
          
          <FaqItem>
            <FaqQuestion>Can I use this app offline?</FaqQuestion>
            <FaqAnswer>
              <p>
                Yes! Once you've loaded the app in your browser, it can work offline.
                We recommend bookmarking the page for easy access in the future.
              </p>
            </FaqAnswer>
          </FaqItem>
        </SectionContent>
      </Section>
      
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <SectionTitle>Contact & Support</SectionTitle>
        <SectionContent>
          <p>
            If you have questions, feedback, or encounter any issues with the app, please reach out through one of these channels:
          </p>
          <ul>
            <li>
              <strong>GitHub Issues:</strong> <a href="https://github.com/BryantWelch/controller-test.app/issues" target="_blank" rel="noopener noreferrer">Report bugs or request features</a>
            </li>
          </ul>
          <p>
            If you find this tool helpful, consider supporting the project:
          </p>
          <ContactButton 
            href="https://ko-fi.com/controllertest" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Buy Me a Coffee ☕
          </ContactButton>
        </SectionContent>
      </Section>
    </AboutContainer>
  );
};

export default About;
