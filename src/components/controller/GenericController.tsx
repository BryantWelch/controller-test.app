import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GamepadState } from '../../hooks/useGamepad';
import { theme } from '../../styles/theme';
import AnalogStickVisualizer from './AnalogStickVisualizer';

const ControllerWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ControllerSvg = styled.svg`
  width: 100%;
  max-width: 500px;
  height: auto;
`;

const ButtonBase = styled(motion.rect)<{ pressed?: boolean }>`
  fill: ${props => props.pressed ? theme.colors.primary : '#333'};
  stroke: #555;
  stroke-width: 1;
  transition: fill 0.1s ease;
  cursor: pointer;
  
  &:hover {
    fill: ${props => props.pressed ? theme.colors.primary : theme.colors.accent};
  }
`;

const CircleButton = styled(motion.circle)<{ pressed?: boolean }>`
  fill: ${props => props.pressed ? theme.colors.primary : '#333'};
  stroke: #555;
  stroke-width: 1;
  transition: fill 0.1s ease;
  cursor: pointer;
  
  &:hover {
    fill: ${props => props.pressed ? theme.colors.primary : theme.colors.accent};
  }
`;

const DPadButton = styled(motion.path)<{ pressed?: boolean }>`
  fill: ${props => props.pressed ? theme.colors.primary : '#222'};
  stroke: #555;
  stroke-width: 1;
  transition: fill 0.1s ease;
  cursor: pointer;
  
  &:hover {
    fill: ${props => props.pressed ? theme.colors.primary : theme.colors.accent};
  }
`;

const AnalogStickContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: ${theme.space.xl};
`;

const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: ${theme.space.md};
  margin-top: ${theme.space.xl};
  width: 100%;
  max-width: 600px;
`;

const ButtonItem = styled.div<{ pressed?: boolean }>`
  background-color: ${props => props.pressed ? theme.colors.primary : theme.colors.backgroundLight};
  color: ${props => props.pressed ? theme.colors.backgroundDark : theme.colors.text};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.sm};
  text-align: center;
  box-shadow: ${theme.shadows.md};
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.pressed ? theme.colors.primary : theme.colors.accent};
    transform: translateY(-2px);
  }
`;

interface GenericControllerProps {
  gamepad: GamepadState;
}

const GenericController: React.FC<GenericControllerProps> = ({ gamepad }) => {
  return (
    <ControllerWrapper>
      <ControllerSvg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        {/* Controller Body */}
        <rect 
          x="150" 
          y="100" 
          width="500" 
          height="200" 
          rx="50" 
          fill="#222" 
          stroke="#444" 
          strokeWidth="2"
        />
        
        {/* Left Analog Stick Base */}
        <circle cx="250" cy="200" r="40" fill="#333" stroke="#444" strokeWidth="2" />
        
        {/* Right Analog Stick Base */}
        <circle cx="550" cy="200" r="40" fill="#333" stroke="#444" strokeWidth="2" />
        
        {/* Face Buttons Group */}
        <CircleButton 
          cx="650" 
          cy="200" 
          r="20" 
          pressed={gamepad.buttons[0]?.pressed}
        />
        <text x="650" y="204" textAnchor="middle" fill="white" fontSize="12">A</text>
        
        <CircleButton 
          cx="600" 
          cy="200" 
          r="20" 
          pressed={gamepad.buttons[1]?.pressed}
        />
        <text x="600" y="204" textAnchor="middle" fill="white" fontSize="12">B</text>
        
        <CircleButton 
          cx="625" 
          cy="150" 
          r="20" 
          pressed={gamepad.buttons[2]?.pressed}
        />
        <text x="625" y="154" textAnchor="middle" fill="white" fontSize="12">X</text>
        
        <CircleButton 
          cx="625" 
          cy="250" 
          r="20" 
          pressed={gamepad.buttons[3]?.pressed}
        />
        <text x="625" y="254" textAnchor="middle" fill="white" fontSize="12">Y</text>
        
        {/* Shoulder Buttons */}
        <ButtonBase 
          x="175" 
          y="100" 
          width="100" 
          height="20" 
          rx="5" 
          pressed={gamepad.buttons[4]?.pressed}
        />
        <text x="225" y="115" textAnchor="middle" fill="white" fontSize="12">L1</text>
        
        <ButtonBase 
          x="525" 
          y="100" 
          width="100" 
          height="20" 
          rx="5" 
          pressed={gamepad.buttons[5]?.pressed}
        />
        <text x="575" y="115" textAnchor="middle" fill="white" fontSize="12">R1</text>
        
        {/* Triggers */}
        <ButtonBase 
          x="175" 
          y="80" 
          width="100" 
          height="20" 
          rx="5" 
          pressed={gamepad.buttons[6]?.value > 0.1}
          style={{ fill: gamepad.buttons[6]?.value > 0.1 ? `rgba(125, 252, 189, ${gamepad.buttons[6]?.value})` : '#333' }}
        />
        <text x="225" y="95" textAnchor="middle" fill="white" fontSize="12">L2</text>
        
        <ButtonBase 
          x="525" 
          y="80" 
          width="100" 
          height="20" 
          rx="5" 
          pressed={gamepad.buttons[7]?.value > 0.1}
          style={{ fill: gamepad.buttons[7]?.value > 0.1 ? `rgba(125, 252, 189, ${gamepad.buttons[7]?.value})` : '#333' }}
        />
        <text x="575" y="95" textAnchor="middle" fill="white" fontSize="12">R2</text>
        
        {/* Center Buttons */}
        <ButtonBase 
          x="350" 
          y="180" 
          width="30" 
          height="15" 
          rx="3" 
          pressed={gamepad.buttons[8]?.pressed}
        />
        <text x="365" y="191" textAnchor="middle" fill="white" fontSize="8">SELECT</text>
        
        <ButtonBase 
          x="420" 
          y="180" 
          width="30" 
          height="15" 
          rx="3" 
          pressed={gamepad.buttons[9]?.pressed}
        />
        <text x="435" y="191" textAnchor="middle" fill="white" fontSize="8">START</text>
        
        {/* D-Pad */}
        <rect 
          x="150" 
          y="150" 
          width="100" 
          height="100" 
          rx="10" 
          fill="#333" 
          stroke="#444" 
          strokeWidth="2"
        />
        
        {/* D-Pad Up */}
        <DPadButton 
          d="M200 160L220 180L180 180Z" 
          pressed={gamepad.buttons[12]?.pressed}
        />
        
        {/* D-Pad Down */}
        <DPadButton 
          d="M200 240L220 220L180 220Z" 
          pressed={gamepad.buttons[13]?.pressed}
        />
        
        {/* D-Pad Left */}
        <DPadButton 
          d="M160 200L180 220L180 180Z" 
          pressed={gamepad.buttons[14]?.pressed}
        />
        
        {/* D-Pad Right */}
        <DPadButton 
          d="M240 200L220 220L220 180Z" 
          pressed={gamepad.buttons[15]?.pressed}
        />
        
        {/* Left Stick */}
        <circle 
          cx="250" 
          cy="200" 
          r="30" 
          fill={gamepad.buttons[10]?.pressed ? theme.colors.primary : "#444"} 
          stroke="#555" 
          strokeWidth="2"
          style={{ 
            transform: `translate(${gamepad.axes[0] * 10}px, ${gamepad.axes[1] * 10}px)`,
            transition: 'transform 0.1s ease'
          }}
        />
        <text x="250" y="204" textAnchor="middle" fill="white" fontSize="10">L3</text>
        
        {/* Right Stick */}
        <circle 
          cx="550" 
          cy="200" 
          r="30" 
          fill={gamepad.buttons[11]?.pressed ? theme.colors.primary : "#444"} 
          stroke="#555" 
          strokeWidth="2"
          style={{ 
            transform: `translate(${gamepad.axes[2] * 10}px, ${gamepad.axes[3] * 10}px)`,
            transition: 'transform 0.1s ease'
          }}
        />
        <text x="550" y="204" textAnchor="middle" fill="white" fontSize="10">R3</text>
      </ControllerSvg>
      
      <AnalogStickContainer>
        <AnalogStickVisualizer 
          title="Left Stick" 
          xAxis={gamepad.axes[0]} 
          yAxis={gamepad.axes[1]} 
          driftDetected={gamepad.stickDrift.leftStick.detected}
        />
        <AnalogStickVisualizer 
          title="Right Stick" 
          xAxis={gamepad.axes[2]} 
          yAxis={gamepad.axes[3]} 
          driftDetected={gamepad.stickDrift.rightStick.detected}
        />
      </AnalogStickContainer>
      
      <ButtonsContainer>
        {gamepad.buttons.map((button, index) => (
          <ButtonItem key={index} pressed={button.pressed}>
            <div>Button {index}</div>
            <div>{button.pressed ? 'Pressed' : 'Released'}</div>
            {button.value !== 0 && button.value !== 1 && (
              <div>Value: {button.value.toFixed(2)}</div>
            )}
          </ButtonItem>
        ))}
      </ButtonsContainer>
    </ControllerWrapper>
  );
};

export default GenericController;
