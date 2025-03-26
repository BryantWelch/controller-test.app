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

const ButtonBase = styled(motion.path)<{ pressed?: boolean }>`
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

interface XboxControllerProps {
  gamepad: GamepadState;
}

const XboxController: React.FC<XboxControllerProps> = ({ gamepad }) => {
  // Xbox controller button mapping
  // 0: A, 1: B, 2: X, 3: Y, 4: LB, 5: RB, 6: LT, 7: RT, 
  // 8: Back, 9: Start, 10: LS, 11: RS, 
  // 12: D-Up, 13: D-Down, 14: D-Left, 15: D-Right
  
  // Axes mapping
  // 0: Left Stick X, 1: Left Stick Y, 2: Right Stick X, 3: Right Stick Y
  
  return (
    <ControllerWrapper>
      <ControllerSvg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
        {/* Controller Body */}
        <path 
          d="M400 120C250 120 150 180 120 220C90 260 50 350 50 380C50 410 70 450 110 470C150 490 200 480 220 460C240 440 270 420 290 420C310 420 350 420 400 420C450 420 490 420 510 420C530 420 560 440 580 460C600 480 650 490 690 470C730 450 750 410 750 380C750 350 710 260 680 220C650 180 550 120 400 120Z" 
          fill="#222" 
          stroke="#444" 
          strokeWidth="2"
        />
        
        {/* Left Analog Stick Base */}
        <circle cx="200" cy="250" r="40" fill="#333" stroke="#444" strokeWidth="2" />
        
        {/* Right Analog Stick Base */}
        <circle cx="500" cy="320" r="40" fill="#333" stroke="#444" strokeWidth="2" />
        
        {/* A Button */}
        <ButtonBase 
          d="M600 280C600 291.046 591.046 300 580 300C568.954 300 560 291.046 560 280C560 268.954 568.954 260 580 260C591.046 260 600 268.954 600 280Z" 
          pressed={gamepad.buttons[0]?.pressed}
        />
        <text x="580" y="285" textAnchor="middle" fill="white" fontSize="16">A</text>
        
        {/* B Button */}
        <ButtonBase 
          d="M640 240C640 251.046 631.046 260 620 260C608.954 260 600 251.046 600 240C600 228.954 608.954 220 620 220C631.046 220 640 228.954 640 240Z" 
          pressed={gamepad.buttons[1]?.pressed}
        />
        <text x="620" y="245" textAnchor="middle" fill="white" fontSize="16">B</text>
        
        {/* X Button */}
        <ButtonBase 
          d="M560 240C560 251.046 551.046 260 540 260C528.954 260 520 251.046 520 240C520 228.954 528.954 220 540 220C551.046 220 560 228.954 560 240Z" 
          pressed={gamepad.buttons[2]?.pressed}
        />
        <text x="540" y="245" textAnchor="middle" fill="white" fontSize="16">X</text>
        
        {/* Y Button */}
        <ButtonBase 
          d="M600 200C600 211.046 591.046 220 580 220C568.954 220 560 211.046 560 200C560 188.954 568.954 180 580 180C591.046 180 600 188.954 600 200Z" 
          pressed={gamepad.buttons[3]?.pressed}
        />
        <text x="580" y="205" textAnchor="middle" fill="white" fontSize="16">Y</text>
        
        {/* Left Bumper */}
        <ButtonBase 
          d="M150 150C150 150 200 130 220 130C240 130 260 140 260 140L260 160C260 160 240 150 220 150C200 150 160 170 150 170Z" 
          pressed={gamepad.buttons[4]?.pressed}
        />
        
        {/* Right Bumper */}
        <ButtonBase 
          d="M650 150C650 150 600 130 580 130C560 130 540 140 540 140L540 160C540 160 560 150 580 150C600 150 640 170 650 170Z" 
          pressed={gamepad.buttons[5]?.pressed}
        />
        
        {/* Left Trigger */}
        <ButtonBase 
          d="M150 130C150 130 180 110 200 110C220 110 240 120 240 120L240 140C240 140 220 130 200 130C180 130 150 150 150 150Z" 
          pressed={gamepad.buttons[6]?.value > 0.1}
          style={{ fill: gamepad.buttons[6]?.value > 0.1 ? `rgba(125, 252, 189, ${gamepad.buttons[6]?.value})` : '#333' }}
        />
        
        {/* Right Trigger */}
        <ButtonBase 
          d="M650 130C650 130 620 110 600 110C580 110 560 120 560 120L560 140C560 140 580 130 600 130C620 130 650 150 650 150Z" 
          pressed={gamepad.buttons[7]?.value > 0.1}
          style={{ fill: gamepad.buttons[7]?.value > 0.1 ? `rgba(125, 252, 189, ${gamepad.buttons[7]?.value})` : '#333' }}
        />
        
        {/* Back Button */}
        <ButtonBase 
          d="M320 220C320 226.627 314.627 232 308 232C301.373 232 296 226.627 296 220C296 213.373 301.373 208 308 208C314.627 208 320 213.373 320 220Z" 
          pressed={gamepad.buttons[8]?.pressed}
        />
        
        {/* Start Button */}
        <ButtonBase 
          d="M504 220C504 226.627 498.627 232 492 232C485.373 232 480 226.627 480 220C480 213.373 485.373 208 492 208C498.627 208 504 213.373 504 220Z" 
          pressed={gamepad.buttons[9]?.pressed}
        />
        
        {/* Xbox Button */}
        <circle cx="400" cy="220" r="20" fill="#333" stroke="#444" strokeWidth="2" />
        <circle cx="400" cy="220" r="15" fill="#1e1e1e" stroke="#444" strokeWidth="1" />
        <path d="M400 210C405 210 410 215 410 220C410 225 405 230 400 230C395 230 390 225 390 220C390 215 395 210 400 210Z" fill="#107C10" />
        
        {/* D-Pad Base */}
        <circle cx="300" cy="320" r="40" fill="#333" stroke="#444" strokeWidth="2" />
        
        {/* D-Pad Up */}
        <DPadButton 
          d="M300 290L320 310L280 310Z" 
          pressed={gamepad.buttons[12]?.pressed}
        />
        
        {/* D-Pad Down */}
        <DPadButton 
          d="M300 350L320 330L280 330Z" 
          pressed={gamepad.buttons[13]?.pressed}
        />
        
        {/* D-Pad Left */}
        <DPadButton 
          d="M270 320L290 340L290 300Z" 
          pressed={gamepad.buttons[14]?.pressed}
        />
        
        {/* D-Pad Right */}
        <DPadButton 
          d="M330 320L310 340L310 300Z" 
          pressed={gamepad.buttons[15]?.pressed}
        />
        
        {/* Left Stick Button */}
        <circle 
          cx="200" 
          cy="250" 
          r="30" 
          fill={gamepad.buttons[10]?.pressed ? theme.colors.primary : "#444"} 
          stroke="#555" 
          strokeWidth="2"
          style={{ 
            transform: `translate(${gamepad.axes[0] * 10}px, ${gamepad.axes[1] * 10}px)`,
            transition: 'transform 0.1s ease'
          }}
        />
        
        {/* Right Stick Button */}
        <circle 
          cx="500" 
          cy="320" 
          r="30" 
          fill={gamepad.buttons[11]?.pressed ? theme.colors.primary : "#444"} 
          stroke="#555" 
          strokeWidth="2"
          style={{ 
            transform: `translate(${gamepad.axes[2] * 10}px, ${gamepad.axes[3] * 10}px)`,
            transition: 'transform 0.1s ease'
          }}
        />
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
    </ControllerWrapper>
  );
};

export default XboxController;
