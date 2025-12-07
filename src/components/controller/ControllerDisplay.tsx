import React, { memo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GamepadState } from '../../hooks/useGamepad';
import { ControllerType } from '../../utils/gamepadUtils';
import { theme } from '../../styles/theme';
import XboxController from './XboxController';
import PlaystationController from './PlaystationController';
import GenericController from './GenericController';

const ControllerContainer = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.space.lg};
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
`;

const ControllerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.space.lg};
  padding-bottom: ${theme.space.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ControllerTitle = styled.h2`
  color: ${theme.colors.primary};
  margin: 0;
`;

const ControllerStatus = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  
  &::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.connected ? '#4CAF50' : '#F44336'};
  }
`;

const NoControllerMessage = styled.div`
  text-align: center;
  padding: ${theme.space.xl};
  
  h3 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.space.md};
  }
  
  p {
    color: ${theme.colors.text};
    max-width: 600px;
    margin: 0 auto ${theme.space.md};
  }
`;

interface ControllerDisplayProps {
  gamepad: GamepadState | null;
}

const ControllerDisplay: React.FC<ControllerDisplayProps> = memo(({ gamepad }) => {
  if (!gamepad || !gamepad.connected) {
    return (
      <ControllerContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NoControllerMessage>
          <h3>No Controller Detected</h3>
          <p>
            Connect a controller via USB, Bluetooth, or WiFi to begin testing.
            Make sure your controller is powered on and properly paired with your device.
          </p>
          <p>
            This app supports Xbox, PlayStation, and most generic controllers.
          </p>
        </NoControllerMessage>
      </ControllerContainer>
    );
  }

  const renderController = () => {
    switch (gamepad.type) {
      case ControllerType.XBOX:
        return <XboxController gamepad={gamepad} />;
      case ControllerType.PLAYSTATION:
        return <PlaystationController gamepad={gamepad} />;
      default:
        return <GenericController gamepad={gamepad} />;
    }
  };

  return (
    <ControllerContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ControllerHeader>
        <ControllerTitle>
          {gamepad.type === ControllerType.XBOX
            ? 'Xbox Controller'
            : gamepad.type === ControllerType.PLAYSTATION
            ? 'PlayStation Controller'
            : 'Generic Controller'}
        </ControllerTitle>
        <ControllerStatus connected={gamepad.connected}>
          {gamepad.connected ? 'Connected' : 'Disconnected'}
        </ControllerStatus>
      </ControllerHeader>
      
      {renderController()}
    </ControllerContainer>
  );
});

export default ControllerDisplay;
