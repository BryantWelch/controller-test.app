import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';
import xboxIcon from '../assets/icons/xbox.svg';
import playstationIcon from '../assets/icons/playstation.svg';
import genericIcon from '../assets/icons/generic.svg';

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

const FeaturesSection = styled.section`
  margin-bottom: ${theme.space['2xl']};
  width: 100%;
  max-width: 1200px;
  background: linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.backgroundLight}, ${theme.colors.background});
  padding: ${theme.space.xl} ${theme.space.lg};
  border-radius: ${theme.borderRadius.lg};
`;

const FeaturesTitle = styled(motion.h2)`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  margin-bottom: ${theme.space.xl};
  color: ${theme.colors.primary};
`;

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

const SupportedSection = styled.section`
  margin-bottom: ${theme.space.xl};
  width: 100%;
  max-width: 1200px;
  padding: ${theme.space.xl} ${theme.space.lg};
  background: linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.backgroundLight});
  border-radius: ${theme.borderRadius.lg};
`;

const SupportedTitle = styled(motion.h2)`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  margin-bottom: ${theme.space.xl};
  color: ${theme.colors.primary};
`;

const SupportedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${theme.space.lg};
`;

const SupportedItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, rgba(3, 111, 154, 0.1), rgba(125, 252, 189, 0.05));
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.lg};
  margin: ${theme.space.md};
  min-width: 200px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.md};
    background: linear-gradient(135deg, rgba(3, 111, 154, 0.15), rgba(125, 252, 189, 0.1));
  }
`;

const SupportedIcon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: ${theme.space.md};
  filter: drop-shadow(0 0 8px rgba(125, 252, 189, 0.3));
  transition: filter 0.2s ease, transform 0.2s ease;
  
  ${SupportedItem}:hover & {
    filter: drop-shadow(0 0 12px rgba(125, 252, 189, 0.5));
    transform: scale(1.05);
  }
`;

const SupportedName = styled.h3`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
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
              Automatically detects when a controller is connected and identifies its type (Xbox, PlayStation, or generic).
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
      
      <SupportedSection>
        <SupportedTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Supported Controllers
        </SupportedTitle>
        <SupportedList>
          <SupportedItem
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SupportedIcon src={xboxIcon} alt="Xbox Controller" />
            <SupportedName>Xbox Controllers</SupportedName>
          </SupportedItem>
          
          <SupportedItem
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SupportedIcon src={playstationIcon} alt="PlayStation Controller" />
            <SupportedName>PlayStation Controllers</SupportedName>
          </SupportedItem>
          
          <SupportedItem
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SupportedIcon src={genericIcon} alt="Generic Controller" />
            <SupportedName>Generic Controllers</SupportedName>
          </SupportedItem>
        </SupportedList>
      </SupportedSection>
    </HomeContainer>
  );
};

export default Home;
