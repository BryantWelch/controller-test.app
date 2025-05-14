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

const FaceButton = styled(motion.circle)<{ pressed?: boolean }>`
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

interface PlaystationControllerProps {
  gamepad: GamepadState;
}

const PlaystationController: React.FC<PlaystationControllerProps> = ({ gamepad }) => {
  // PlayStation controller button mapping
  // 0: Cross, 1: Circle, 2: Square, 3: Triangle, 4: L1, 5: R1, 6: L2, 7: R2, 
  // 8: Share, 9: Options, 10: L3, 11: R3, 
  // 12: D-Up, 13: D-Down, 14: D-Left, 15: D-Right, 16: PS Button, 17: Touchpad
  
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
        <circle cx="250" cy="280" r="40" fill="#333" stroke="#444" strokeWidth="2" />
        
        {/* Right Analog Stick Base */}
        <circle cx="550" cy="280" r="40" fill="#333" stroke="#444" strokeWidth="2" />
        
        {/* Cross Button */}
        <FaceButton 
          cx="650" 
          cy="280" 
          r="20" 
          pressed={gamepad.buttons[0]?.pressed}
        />
        <path d="M642 272L658 288M642 288L658 272" stroke="white" strokeWidth="2" />
        
        {/* Circle Button */}
        <FaceButton 
          cx="690" 
          cy="240" 
          r="20" 
          pressed={gamepad.buttons[1]?.pressed}
        />
        <circle cx="690" cy="240" r="12" stroke="white" strokeWidth="2" fill="none" />
        
        {/* Square Button */}
        <FaceButton 
          cx="610" 
          cy="240" 
          r="20" 
          pressed={gamepad.buttons[2]?.pressed}
        />
        <rect x="602" y="232" width="16" height="16" stroke="white" strokeWidth="2" fill="none" />
        
        {/* Triangle Button */}
        <FaceButton 
          cx="650" 
          cy="200" 
          r="20" 
          pressed={gamepad.buttons[3]?.pressed}
        />
        <path d="M650 192L642 208H658L650 192Z" stroke="white" strokeWidth="2" fill="none" />
        
        {/* L1 Button */}
        <ButtonBase 
          d="M150 150C150 150 200 130 220 130C240 130 260 140 260 140L260 160C260 160 240 150 220 150C200 150 160 170 150 170Z" 
          pressed={gamepad.buttons[4]?.pressed}
        />
        <text x="200" y="155" textAnchor="middle" fill="white" fontSize="14">L1</text>
        
        {/* R1 Button */}
        <ButtonBase 
          d="M650 150C650 150 600 130 580 130C560 130 540 140 540 140L540 160C540 160 560 150 580 150C600 150 640 170 650 170Z" 
          pressed={gamepad.buttons[5]?.pressed}
        />
        <text x="600" y="155" textAnchor="middle" fill="white" fontSize="14">R1</text>
        
        {/* L2 Trigger */}
        <ButtonBase 
          d="M150 130C150 130 180 110 200 110C220 110 240 120 240 120L240 140C240 140 220 130 200 130C180 130 150 150 150 150Z" 
          pressed={gamepad.buttons[6]?.value > 0.1}
          style={{ fill: gamepad.buttons[6]?.value > 0.1 ? `rgba(125, 252, 189, ${gamepad.buttons[6]?.value})` : '#333' }}
        />
        <text x="200" y="125" textAnchor="middle" fill="white" fontSize="14">L2</text>
        
        {/* R2 Trigger */}
        <ButtonBase 
          d="M650 130C650 130 620 110 600 110C580 110 560 120 560 120L560 140C560 140 580 130 600 130C620 130 650 150 650 150Z" 
          pressed={gamepad.buttons[7]?.value > 0.1}
          style={{ fill: gamepad.buttons[7]?.value > 0.1 ? `rgba(125, 252, 189, ${gamepad.buttons[7]?.value})` : '#333' }}
        />
        <text x="600" y="125" textAnchor="middle" fill="white" fontSize="14">R2</text>
        
        {/* Share Button */}
        <ButtonBase 
          d="M320 220C320 226.627 314.627 232 308 232C301.373 232 296 226.627 296 220C296 213.373 301.373 208 308 208C314.627 208 320 213.373 320 220Z" 
          pressed={gamepad.buttons[8]?.pressed}
        />
        <text x="308" y="223" textAnchor="middle" fill="white" fontSize="8">SHARE</text>
        
        {/* Options Button */}
        <ButtonBase 
          d="M504 220C504 226.627 498.627 232 492 232C485.373 232 480 226.627 480 220C480 213.373 485.373 208 492 208C498.627 208 504 213.373 504 220Z" 
          pressed={gamepad.buttons[9]?.pressed}
        />
        <text x="492" y="223" textAnchor="middle" fill="white" fontSize="8">OPTIONS</text>
        
        {/* PS Button */}
        <circle 
          cx="400" 
          cy="220" 
          r="20" 
          fill={gamepad.buttons[16]?.pressed ? theme.colors.primary : "#333"} 
          stroke="#444" 
          strokeWidth="2"
        />
        <path d="M400 210C405 210 410 215 410 220C410 225 405 230 400 230C395 230 390 225 390 220C390 215 395 210 400 210Z" fill="#006FCD" />
        
        {/* Touchpad */}
        <rect 
          x="350" 
          y="170" 
          width="100" 
          height="40" 
          rx="5" 
          fill={gamepad.buttons[17]?.pressed ? theme.colors.primary : "#333"} 
          stroke="#444" 
          strokeWidth="2"
        />
        
        {/* D-Pad Base */}
        <circle cx="150" cy="280" r="40" fill="#333" stroke="#444" strokeWidth="2" />
        
        {/* D-Pad Up */}
        <DPadButton 
          d="M150 250L170 270L130 270Z" 
          pressed={gamepad.buttons[12]?.pressed}
        />
        
        {/* D-Pad Down */}
        <DPadButton 
          d="M150 310L170 290L130 290Z" 
          pressed={gamepad.buttons[13]?.pressed}
        />
        
        {/* D-Pad Left */}
        <DPadButton 
          d="M120 280L140 300L140 260Z" 
          pressed={gamepad.buttons[14]?.pressed}
        />
        
        {/* D-Pad Right */}
        <DPadButton 
          d="M180 280L160 300L160 260Z" 
          pressed={gamepad.buttons[15]?.pressed}
        />
        
        {/* Left Stick Button */}
        <circle 
          cx="250" 
          cy="280" 
          r="30" 
          fill={gamepad.buttons[10]?.pressed ? theme.colors.primary : "#444"} 
          stroke="#555" 
          strokeWidth="2"
          style={{ 
            transform: `translate(${gamepad.axes[0] * 10}px, ${gamepad.axes[1] * 10}px)`,
            transition: 'transform 0.1s ease'
          }}
        />
        <text x="250" y="285" textAnchor="middle" fill="white" fontSize="12">L3</text>
        
        {/* Right Stick Button */}
        <circle 
          cx="550" 
          cy="280" 
          r="30" 
          fill={gamepad.buttons[11]?.pressed ? theme.colors.primary : "#444"} 
          stroke="#555" 
          strokeWidth="2"
          style={{ 
            transform: `translate(${gamepad.axes[2] * 10}px, ${gamepad.axes[3] * 10}px)`,
            transition: 'transform 0.1s ease'
          }}
        />
        <text x="550" y="285" textAnchor="middle" fill="white" fontSize="12">R3</text>
      </ControllerSvg>
      
      <AnalogStickContainer>
        <AnalogStickVisualizer 
          title="Left Stick" 
          xAxis={gamepad.axes[0]} 
          yAxis={gamepad.axes[1]} 
          driftDetected={gamepad.stickDrift?.leftStick.detected ?? false}
        />
        <AnalogStickVisualizer 
          title="Right Stick" 
          xAxis={gamepad.axes[2]} 
          yAxis={gamepad.axes[3]} 
          driftDetected={gamepad.stickDrift?.rightStick.detected ?? false}
        />
      </AnalogStickContainer>
    </ControllerWrapper>
  );
};

export default PlaystationController;
