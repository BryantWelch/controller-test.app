import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GamepadState } from '../../hooks/useGamepad';
import { theme } from '../../styles/theme';

// Placeholder images for controllers that don't have specific images yet
const placeholderImages = {
  xbox: '/assets/controllers/xbox-placeholder.png',
  playstation: '/assets/controllers/playstation-placeholder.png',
  generic: '/assets/controllers/generic-placeholder.png',
};

const VisualizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: ${theme.space.xl};
`;

const ControllerImage = styled(motion.div)<{ imageUrl?: string }>`
  width: 100%;
  max-width: 500px;
  height: 300px;
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: ${theme.space.lg};
  position: relative;
`;

const PlaceholderText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.lg};
  text-align: center;
`;

const ControllerDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.md};
  margin-bottom: ${theme.space.lg};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.space.sm} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.sm};
`;

const DetailValue = styled.span`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
`;

const FeaturesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.sm};
`;

const FeatureTag = styled.li`
  background-color: ${theme.colors.backgroundLight};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xs};
  padding: ${theme.space.xs} ${theme.space.sm};
  border-radius: ${theme.borderRadius.sm};
`;

interface ControllerModelVisualizerProps {
  gamepad: GamepadState;
}

const ControllerModelVisualizer: React.FC<ControllerModelVisualizerProps> = ({ gamepad }) => {
  // Determine the image URL to use
  const getImageUrl = () => {
    if (gamepad.modelInfo && gamepad.modelInfo.imageUrl) {
      return gamepad.modelInfo.imageUrl;
    }
    
    // Use placeholder based on controller type
    switch (gamepad.type) {
      case 'xbox':
        return placeholderImages.xbox;
      case 'playstation':
        return placeholderImages.playstation;
      default:
        return placeholderImages.generic;
    }
  };
  
  const imageUrl = getImageUrl();
  
  return (
    <VisualizerContainer>
      <ControllerImage 
        imageUrl={imageUrl}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {!imageUrl && (
          <PlaceholderText>
            Controller Image Not Available
          </PlaceholderText>
        )}
      </ControllerImage>
      
      <ControllerDetails>
        <DetailRow>
          <DetailLabel>Model</DetailLabel>
          <DetailValue>
            {gamepad.modelInfo ? gamepad.modelInfo.name : 'Unknown Model'}
          </DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Manufacturer</DetailLabel>
          <DetailValue>
            {gamepad.modelInfo ? gamepad.modelInfo.manufacturer : 'Unknown Manufacturer'}
          </DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Controller ID</DetailLabel>
          <DetailValue>{gamepad.id}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Mapping</DetailLabel>
          <DetailValue>{gamepad.mapping || 'Custom'}</DetailValue>
        </DetailRow>
        
        {gamepad.modelInfo && gamepad.modelInfo.features && (
          <DetailRow>
            <DetailLabel>Features</DetailLabel>
            <FeaturesList>
              {gamepad.modelInfo.features.map((feature, index) => (
                <FeatureTag key={index}>{feature}</FeatureTag>
              ))}
            </FeaturesList>
          </DetailRow>
        )}
      </ControllerDetails>
    </VisualizerContainer>
  );
};

export default ControllerModelVisualizer;
