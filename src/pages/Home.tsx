import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';
// Removed controller icon imports
// Icons removed due to React 19 compatibility issues

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${theme.space.xl} 0;
  background: linear-gradient(to bottom, ${theme.colors.backgroundDark}, ${theme.colors.background});
`;

const HeroSection = styled.section`
  margin-bottom: ${theme.space['2xl']};
  max-width: 800px;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: ${theme.space.lg};
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  margin-bottom: ${theme.space.xl};
  color: ${theme.colors.text};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const StartButton = styled(motion.button)`
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryLight});
  color: ${theme.colors.backgroundDark};
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  padding: ${theme.space.md} ${theme.space.xl};
  border-radius: ${theme.borderRadius.md};
  border: none;
  cursor: pointer;
  box-shadow: ${theme.shadows.md};
  transition: ${theme.transitions.default};
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.primary});
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const Section = styled.section`
  margin-bottom: ${theme.space['2xl']};
  width: 100%;
  max-width: 1200px;
  background: linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.backgroundLight}, ${theme.colors.background});
  padding: ${theme.space.xl} ${theme.space.lg};
  border-radius: ${theme.borderRadius.lg};
`;

const FeaturesSection = styled(Section)``;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  margin-bottom: ${theme.space.xl};
  color: ${theme.colors.primary};
`;

const FeaturesTitle = styled(SectionTitle)``;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.space.lg};
`;

const FeatureCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(3, 111, 154, 0.1), rgba(125, 252, 189, 0.05));
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.lg};
  box-shadow: ${theme.shadows.sm};
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-3px);
    background: linear-gradient(135deg, rgba(3, 111, 154, 0.15), rgba(125, 252, 189, 0.1));
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${theme.space.md};
  color: ${theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  margin-bottom: ${theme.space.md};
  color: ${theme.colors.primary};
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.text};
  line-height: 1.6;
`;

const InfoSection = styled(Section)`
  text-align: left;
  padding: ${theme.space.xl} ${theme.space.xl};
`;

const InfoContent = styled.div`
  margin-bottom: ${theme.space.xl};
`;

const InfoSubtitle = styled.h3`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.secondary};
  margin-bottom: ${theme.space.md};
  display: flex;
  align-items: center;
  
  .icon {
    margin-right: ${theme.space.sm};
    font-size: 1.2em;
  }
`;

const InfoText = styled.p`
  margin-bottom: ${theme.space.md};
  line-height: 1.6;
  color: ${theme.colors.text};
  max-width: 100%;
  white-space: normal;
  overflow-wrap: break-word;
  word-wrap: break-word;
  
  strong {
    color: ${theme.colors.secondary};
  }
`;

const InfoList = styled.ul`
  margin-left: 0;
  margin-bottom: ${theme.space.md};
  list-style-type: none;
  padding-left: 0;
  
  li {
    margin-bottom: ${theme.space.md};
    line-height: 1.6;
    position: relative;
    padding-left: ${theme.space.xl};
    text-align: left;
    display: block;
    width: 100%;
    word-break: break-word;
    
    &::before {
      content: '\2022';
      color: ${theme.colors.primary};
      font-weight: bold;
      position: absolute;
      left: ${theme.space.md};
    }
  }
`;

const BenefitsContainer = styled.div`
  background: linear-gradient(135deg, rgba(3, 111, 154, 0.1), rgba(125, 252, 189, 0.05));
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.lg};
  margin-bottom: ${theme.space.lg};
  border-left: 3px solid ${theme.colors.primary};
`;

const BenefitsTitle = styled.h3`
  color: ${theme.colors.secondary};
  margin-bottom: ${theme.space.md};
  font-size: 1.2rem;
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${theme.space.sm};
  line-height: 1.6;
  position: relative;
  text-align: left;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const BenefitIcon = styled.span`
  color: ${theme.colors.primary};
  margin-right: ${theme.space.sm};
  flex-shrink: 0;
`;

const BenefitText = styled.span`
  flex: 1;
`;

const StepsList = styled.ol`
  margin-left: ${theme.space.xl};
  margin-bottom: ${theme.space.md};
  counter-reset: steps;
  
  li {
    margin-bottom: ${theme.space.md};
    line-height: 1.6;
    position: relative;
    padding-left: ${theme.space.md};
    counter-increment: steps;
    list-style-type: none;
    
    &::before {
      content: counter(steps) ".";
      color: ${theme.colors.primary};
      font-weight: bold;
      position: absolute;
      left: -${theme.space.lg};
      top: 0;
    }
  }
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, rgba(3, 111, 154, 0.1), rgba(125, 252, 189, 0.05));
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.xl};
  margin-bottom: ${theme.space.xl};
  border-left: 3px solid ${theme.colors.primary};
  width: 100%;
  box-sizing: border-box;
`;


const Home: React.FC = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Professional Controller Testing
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A free tool to test and diagnose your game controllers. Check for button responsiveness, analog stick drift, and more.
        </Subtitle>
        <StyledLink to="/test">
          <StartButton
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Testing
          </StartButton>
        </StyledLink>
      </HeroSection>
      
      <FeaturesSection>
        <FeaturesTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Features
        </FeaturesTitle>
        <FeaturesGrid>
          <FeatureCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FeatureIcon>🎮</FeatureIcon>
            <FeatureTitle>Controller Detection</FeatureTitle>
            <FeatureDescription>
              Automatically detects when a controller is connected and identifies its type (Xbox, PlayStation, Nintendo...etc).
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Real-time Feedback</FeatureTitle>
            <FeatureDescription>
              See button presses and analog stick movements in real-time with a visual representation of your controller.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureTitle>Stick Drift Detection</FeatureTitle>
            <FeatureDescription>
              Identify and visualize analog stick drift issues to help diagnose controller problems.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Responsive Design</FeatureTitle>
            <FeatureDescription>
              Works on desktop and mobile devices with a clean, modern interface that adapts to your screen size.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <FeatureIcon>📈</FeatureIcon>
            <FeatureTitle>Diagnostics Dashboard</FeatureTitle>
            <FeatureDescription>
              View detailed information about your controller's inputs, including button states and axis values.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <FeatureIcon>💡</FeatureIcon>
            <FeatureTitle>Troubleshooting Tips</FeatureTitle>
            <FeatureDescription>
              Get helpful tips and resources for fixing common controller issues and improving performance.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <InfoSection>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What is Controller Test App?
        </SectionTitle>
        
        <InfoContent>
          <InfoText>
            Controller Test App is a comprehensive online tool designed to help gamers test and diagnose their gaming controllers. 
            Whether you're experiencing stick drift, unresponsive buttons, or just want to ensure your controller is functioning properly, 
            our application provides the tools you need to identify and troubleshoot issues.
          </InfoText>
          
          <InfoText>
            Our application uses the Web Gamepad API to provide real-time feedback on controller inputs, allowing you to visualize 
            button presses, analog stick movements, and trigger sensitivity. All testing is performed locally in your browser, 
            with no data being sent to external servers.
          </InfoText>
          
          <BenefitsContainer>
            <BenefitsTitle>Key Benefits:</BenefitsTitle>
            <BenefitsList>
              <BenefitItem>
                <BenefitIcon>✔️</BenefitIcon>
                <BenefitText>Test your controller without installing any software</BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>✔️</BenefitIcon>
                <BenefitText>Identify specific controller models (Xbox 360, Xbox One, PS4, PS5, etc.)</BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>✔️</BenefitIcon>
                <BenefitText>Diagnose stick drift and button response issues</BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>✔️</BenefitIcon>
                <BenefitText>Access detailed controller information and specifications</BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>✔️</BenefitIcon>
                <BenefitText>Get troubleshooting tips for common controller problems</BenefitText>
              </BenefitItem>
            </BenefitsList>
          </BenefitsContainer>
        </InfoContent>
      </InfoSection>
      
      <InfoSection>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How to Test Your Controller
        </SectionTitle>
        
        <InfoContent>
          <InfoText>
            Testing your controller with Controller Test App is simple and straightforward. Follow these steps to get started:
          </InfoText>
          
          <StepsList>
            <li>
              <InfoSubtitle><span className="icon">🕹️</span> Connect Your Controller</InfoSubtitle>
              <InfoText>
                Connect your controller to your device using USB or Bluetooth, depending on your controller type. 
                Make sure your controller is properly paired with your device before proceeding.
              </InfoText>
            </li>
            
            <li>
              <InfoSubtitle><span className="icon">✅</span> Verify Detection</InfoSubtitle>
              <InfoText>
                Once connected, our application will automatically detect your controller and display its type. 
                You'll see a visual representation of your controller on screen, along with detailed information about the model.
              </InfoText>
            </li>
            
            <li>
              <InfoSubtitle><span className="icon">🔧</span> Test All Inputs</InfoSubtitle>
              <InfoText>
                Test all buttons, analog sticks, and triggers by pressing them and observing the on-screen feedback. 
                Our interactive visualization will highlight each input as it's activated, making it easy to identify any issues.
              </InfoText>
            </li>
            
            <li>
              <InfoSubtitle><span className="icon">⚠️</span> Check for Stick Drift</InfoSubtitle>
              <InfoText>
                To test for stick drift, leave your analog sticks untouched in their neutral position and observe if there's any movement 
                in the on-screen visualization. Any movement without physical input indicates stick drift.
              </InfoText>
            </li>
          </StepsList>
        </InfoContent>
      </InfoSection>
      
      <InfoSection>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How to Fix Controller Stick Drift
        </SectionTitle>
        
        <InfoContent>
          <InfoText>
            Stick drift is a common issue where your controller's analog sticks register movement even when you're not touching them. 
            This can make games difficult to play as your character or cursor may move on its own. Here are some methods to fix stick drift:
          </InfoText>
          
          <InfoCard>
            <InfoSubtitle><span className="icon">🧹</span> Clean Your Controller</InfoSubtitle>
            <InfoText>
              Dust and debris around the analog sticks can cause drift. Turn off your controller and gently clean around the base of the 
              analog sticks using compressed air or a cotton swab lightly dampened with isopropyl alcohol. Rotate the sticks as you clean 
              to remove dirt from all angles.
            </InfoText>
          </InfoCard>
          
          <InfoCard>
            <InfoSubtitle><span className="icon">🔄</span> Reset Your Controller</InfoSubtitle>
            <InfoText>
              Many controllers have a reset button (usually a small hole on the back). Insert a paperclip or similar tool to press this 
              button, which can sometimes resolve electronic glitches causing drift. For controllers without a reset button, try 
              disconnecting the controller, waiting 30 seconds, and reconnecting it.
            </InfoText>
          </InfoCard>
          
          <InfoCard>
            <InfoSubtitle><span className="icon">❓</span> Adjust Dead Zones</InfoSubtitle>
            <InfoText>
              Some games and platforms allow you to adjust the controller's "dead zone" - the area around the center position where small 
              movements are ignored. Increasing this value can help compensate for minor drift, though it may slightly reduce sensitivity.
            </InfoText>
          </InfoCard>
        </InfoContent>
      </InfoSection>
      
      {/* Supported Controllers section removed */}
    </HomeContainer>
  );
};

export default Home;
