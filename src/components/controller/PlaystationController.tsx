import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GamepadState, ControllerType } from '../../hooks/useGamepad';
import { theme } from '../../styles/theme';
import AnalogStickVisualizer from './AnalogStickVisualizer';
import { ReactComponent as PS4ControllerSvg } from '../../assets/ps4_dualshock4_modified.svg';

const ControllerWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -60px;
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
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin-top: 0;
`;

interface PlaystationControllerProps {
  gamepad: GamepadState;
}

// Define styled components outside of the component to prevent recreation on each render
const PS4SvgWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  transform: scale(1.2);
  margin-bottom: 30px;
  
  svg {
    width: 100%;
    height: auto;
  }
`;

// Create styled components for button overlays (not used directly but kept for future reference)
const ButtonOverlay = styled(motion.div)<{ pressed?: boolean }>`
  position: absolute;
  background-color: ${props => props.pressed ? theme.colors.primary : 'transparent'};
  border-radius: 50%;
  opacity: ${props => props.pressed ? 0.7 : 0};
  transition: opacity 0.1s ease, background-color 0.1s ease;
  pointer-events: none;
`;

const DPadOverlay = styled(motion.div)<{ pressed?: boolean }>`
  position: absolute;
  background-color: ${props => props.pressed ? theme.colors.primary : 'transparent'};
  opacity: ${props => props.pressed ? 0.7 : 0};
  transition: opacity 0.1s ease, background-color 0.1s ease;
  pointer-events: none;
`;

const AnalogStickOverlay = styled(motion.div)<{ x: number; y: number }>`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(125, 252, 189, 0.3);
  border: 2px solid ${theme.colors.primary};
  transform: translate(${props => props.x * 10}px, ${props => props.y * 10}px);
  transition: transform 0.05s ease-out;
  pointer-events: none;
`;

const PlaystationController: React.FC<PlaystationControllerProps> = ({ gamepad }) => {
  // Create a ref for the SVG element - must be at the top level
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  // Define variables with safe defaults
  const hasGamepad = !!gamepad;
  const isPS4Controller = hasGamepad && (
    gamepad.modelInfo?.model?.toLowerCase().includes('dualshock 4') || 
    gamepad.id?.toLowerCase().includes('dualshock 4') || 
    gamepad.id?.toLowerCase().includes('054c:09cc') || // PS4 controller USB vendor:product ID
    gamepad.id?.toLowerCase().includes('054c:05c4')    // PS4 controller Bluetooth vendor:product ID
  );
  
  // PlayStation controller button mapping
  // 0: Cross, 1: Circle, 2: Square, 3: Triangle, 4: L1, 5: R1, 6: L2, 7: R2, 
  // 8: Share, 9: Options, 10: L3, 11: R3, 12: PS Button, 13: Touchpad
  // 14-17: D-pad (Up, Right, Down, Left)
  
  // Axes mapping
  // 0: Left Stick X, 1: Left Stick Y, 2: Right Stick X, 3: Right Stick Y
  
  // Use useEffect to update the SVG elements when gamepad state changes
  useEffect(() => {
    if (!svgRef.current || !isPS4Controller || !gamepad) return;
    
    const svg = svgRef.current;
      
    // Update face buttons
    const crossButton = svg.querySelector('.face-button-cross');
    if (crossButton) {
      crossButton.setAttribute('fill', gamepad.buttons[0]?.pressed ? theme.colors.primary : '#333');
    }
      
      const circleButton = svg.querySelector('.face-button-circle');
      if (circleButton) {
        circleButton.setAttribute('fill', gamepad.buttons[1]?.pressed ? theme.colors.primary : '#333');
      }
      
      const squareButton = svg.querySelector('.face-button-square');
      if (squareButton) {
        squareButton.setAttribute('fill', gamepad.buttons[2]?.pressed ? theme.colors.primary : '#333');
      }
      
      const triangleButton = svg.querySelector('.face-button-triangle');
      if (triangleButton) {
        triangleButton.setAttribute('fill', gamepad.buttons[3]?.pressed ? theme.colors.primary : '#333');
      }
      
      // Update share/options buttons
      const shareButton = svg.querySelector('.button-share');
      if (shareButton) {
        shareButton.setAttribute('fill', gamepad.buttons[8]?.pressed ? theme.colors.primary : '#333');
      }
      
      const optionsButton = svg.querySelector('.button-options');
      if (optionsButton) {
        optionsButton.setAttribute('fill', gamepad.buttons[9]?.pressed ? theme.colors.primary : '#333');
      }
      
      // Update PS button
      const psButton = svg.querySelector('.button-ps');
      if (psButton) {
        psButton.setAttribute('fill', gamepad.buttons[16]?.pressed ? theme.colors.primary : '#333');
      }
      
      // Update touchpad
      const touchpad = svg.querySelector('.touchpad');
      if (touchpad) {
        touchpad.setAttribute('fill', gamepad.buttons[17]?.pressed ? theme.colors.primary : '#333');
      }
      
      // Update D-pad - individual buttons
      const dpadUp = svg.querySelector('.dpad-up');
      if (dpadUp) {
        dpadUp.setAttribute('fill', gamepad.buttons[12]?.pressed ? theme.colors.primary : '#333');
      }
      
      const dpadDown = svg.querySelector('.dpad-down');
      if (dpadDown) {
        dpadDown.setAttribute('fill', gamepad.buttons[13]?.pressed ? theme.colors.primary : '#333');
      }
      
      const dpadLeft = svg.querySelector('.dpad-left');
      if (dpadLeft) {
        dpadLeft.setAttribute('fill', gamepad.buttons[14]?.pressed ? theme.colors.primary : '#333');
      }
      
      const dpadRight = svg.querySelector('.dpad-right');
      if (dpadRight) {
        dpadRight.setAttribute('fill', gamepad.buttons[15]?.pressed ? theme.colors.primary : '#333');
      }
      
      // Update analog sticks
      const leftStick = svg.querySelector('.left-analog-stick');
      if (leftStick) {
        leftStick.setAttribute('transform', 
          `translate(${gamepad.axes[0] ? gamepad.axes[0] * 10 : 0}, ${gamepad.axes[1] ? gamepad.axes[1] * 10 : 0})`);
      }
      
      const rightStick = svg.querySelector('.right-analog-stick');
      if (rightStick) {
        rightStick.setAttribute('transform', 
          `translate(${gamepad.axes[2] ? gamepad.axes[2] * 10 : 0}, ${gamepad.axes[3] ? gamepad.axes[3] * 10 : 0})`);
      }
      
  }, [gamepad, theme.colors.primary, isPS4Controller]); // Only re-run when gamepad state, theme, or controller type changes
    
  // Render different views based on conditions
  if (!hasGamepad) {
    return (
      <ControllerWrapper>
        <div>No controller connected</div>
      </ControllerWrapper>
    );
  }
  
  if (isPS4Controller) {
    return (
      <ControllerWrapper>
        <PS4SvgWrapper>
          {/* Main controller SVG with ref for direct manipulation */}
          <PS4ControllerSvg ref={svgRef} />
        </PS4SvgWrapper>
        
        <AnalogStickContainer>
          <AnalogStickVisualizer 
            title="Left Stick"
            xAxis={gamepad.axes[0] || 0}
            yAxis={gamepad.axes[1] || 0}
            driftDetected={gamepad.stickDrift?.leftStick?.detected || false}
          />
          <AnalogStickVisualizer 
            title="Right Stick"
            xAxis={gamepad.axes[2] || 0}
            yAxis={gamepad.axes[3] || 0}
            driftDetected={gamepad.stickDrift?.rightStick?.detected || false}
          />
        </AnalogStickContainer>
      </ControllerWrapper>
    );
  }
  
  // Generic PlayStation controller rendering
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
