import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GamepadState } from '../../hooks/useGamepad';
import { theme } from '../../styles/theme';

const HapticContainer = styled.div`
  width: 100%;
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.lg};
  margin-bottom: ${theme.space.xl};
`;

const HapticTitle = styled.h3`
  color: ${theme.colors.primary};
  margin-top: 0;
  margin-bottom: ${theme.space.md};
  font-size: ${theme.fontSizes.lg};
`;

const HapticDescription = styled.p`
  color: ${theme.colors.text};
  margin-bottom: ${theme.space.lg};
  font-size: ${theme.fontSizes.sm};
`;

const NotSupportedMessage = styled.div`
  background-color: rgba(244, 67, 54, 0.1);
  border-left: 4px solid #F44336;
  padding: ${theme.space.md};
  margin-bottom: ${theme.space.lg};
  color: ${theme.colors.text};
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${theme.space.md};
  margin-bottom: ${theme.space.lg};
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const ControlLabel = styled.label`
  color: ${theme.colors.textDark};
  margin-bottom: ${theme.space.xs};
  font-size: ${theme.fontSizes.sm};
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  background: ${theme.colors.backgroundLight};
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
  }
`;

const SliderValue = styled.span`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  min-width: 40px;
  text-align: right;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.md};
  margin-top: ${theme.space.lg};
`;

const HapticButton = styled(motion.button)<{ variant?: string }>`
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: ${theme.fontSizes.sm};
  background-color: ${props => 
    props.variant === 'strong' ? theme.colors.accent :
    props.variant === 'weak' ? theme.colors.secondary :
    theme.colors.primary
  };
  color: ${theme.colors.text};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PatternButton = styled(motion.button)<{ active: boolean }>`
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  border: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
  background-color: ${theme.colors.backgroundLight};
  color: ${theme.colors.text};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface HapticFeedbackTesterProps {
  gamepad: GamepadState;
  triggerHapticFeedback: (duration: number, strongMagnitude: number, weakMagnitude: number) => boolean;
}

interface HapticPattern {
  name: string;
  sequence: Array<{
    duration: number;
    strongMagnitude: number;
    weakMagnitude: number;
    delay: number;
  }>;
}

const HapticFeedbackTester: React.FC<HapticFeedbackTesterProps> = ({ 
  gamepad, 
  triggerHapticFeedback 
}) => {
  const [duration, setDuration] = useState(300);
  const [strongMagnitude, setStrongMagnitude] = useState(1.0);
  const [weakMagnitude, setWeakMagnitude] = useState(1.0);
  const [activePattern, setActivePattern] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const isSupported = gamepad.hapticCapabilities.supported;
  
  // Predefined haptic patterns
  const hapticPatterns: HapticPattern[] = [
    {
      name: 'Pulse',
      sequence: [
        { duration: 100, strongMagnitude: 1.0, weakMagnitude: 0.0, delay: 0 },
        { duration: 100, strongMagnitude: 0.0, weakMagnitude: 0.0, delay: 150 },
        { duration: 100, strongMagnitude: 1.0, weakMagnitude: 0.0, delay: 0 },
      ]
    },
    {
      name: 'Heartbeat',
      sequence: [
        { duration: 100, strongMagnitude: 0.7, weakMagnitude: 0.3, delay: 0 },
        { duration: 80, strongMagnitude: 1.0, weakMagnitude: 0.5, delay: 120 },
      ]
    },
    {
      name: 'Escalating',
      sequence: [
        { duration: 100, strongMagnitude: 0.2, weakMagnitude: 0.1, delay: 0 },
        { duration: 100, strongMagnitude: 0.4, weakMagnitude: 0.2, delay: 150 },
        { duration: 100, strongMagnitude: 0.6, weakMagnitude: 0.3, delay: 150 },
        { duration: 100, strongMagnitude: 0.8, weakMagnitude: 0.4, delay: 150 },
        { duration: 100, strongMagnitude: 1.0, weakMagnitude: 0.5, delay: 150 },
      ]
    },
    {
      name: 'Rumble',
      sequence: [
        { duration: 500, strongMagnitude: 0.8, weakMagnitude: 0.8, delay: 0 },
      ]
    }
  ];
  
  const handleTriggerHaptic = () => {
    triggerHapticFeedback(duration, strongMagnitude, weakMagnitude);
  };
  
  const playHapticPattern = async (pattern: HapticPattern) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setActivePattern(pattern.name);
    
    for (const step of pattern.sequence) {
      triggerHapticFeedback(step.duration, step.strongMagnitude, step.weakMagnitude);
      
      // Wait for the duration plus any delay
      await new Promise(resolve => setTimeout(resolve, step.duration + step.delay));
    }
    
    setIsPlaying(false);
  };
  
  if (!isSupported) {
    return (
      <HapticContainer>
        <HapticTitle>Haptic Feedback Tester</HapticTitle>
        <NotSupportedMessage>
          <strong>Haptic feedback is not supported by this controller or browser.</strong>
          <p>
            Haptic feedback requires a controller with vibration/rumble capabilities and a browser that supports the Gamepad Haptic Actuator API.
            This feature is best supported in Chrome and Edge browsers with Xbox or PlayStation controllers.
          </p>
        </NotSupportedMessage>
      </HapticContainer>
    );
  }
  
  return (
    <HapticContainer>
      <HapticTitle>Haptic Feedback Tester</HapticTitle>
      <HapticDescription>
        Test your controller's vibration capabilities. Adjust the sliders to customize the intensity and duration of the haptic feedback.
      </HapticDescription>
      
      <ControlsGrid>
        <ControlGroup>
          <ControlLabel>Duration (ms)</ControlLabel>
          <SliderContainer>
            <Slider 
              type="range" 
              min={50} 
              max={1000} 
              step={50} 
              value={duration} 
              onChange={(e) => setDuration(parseInt(e.target.value))} 
            />
            <SliderValue>{duration}</SliderValue>
          </SliderContainer>
        </ControlGroup>
        
        <ControlGroup>
          <ControlLabel>Strong Magnitude</ControlLabel>
          <SliderContainer>
            <Slider 
              type="range" 
              min={0} 
              max={1} 
              step={0.1} 
              value={strongMagnitude} 
              onChange={(e) => setStrongMagnitude(parseFloat(e.target.value))} 
            />
            <SliderValue>{strongMagnitude.toFixed(1)}</SliderValue>
          </SliderContainer>
        </ControlGroup>
        
        <ControlGroup>
          <ControlLabel>Weak Magnitude</ControlLabel>
          <SliderContainer>
            <Slider 
              type="range" 
              min={0} 
              max={1} 
              step={0.1} 
              value={weakMagnitude} 
              onChange={(e) => setWeakMagnitude(parseFloat(e.target.value))} 
            />
            <SliderValue>{weakMagnitude.toFixed(1)}</SliderValue>
          </SliderContainer>
        </ControlGroup>
      </ControlsGrid>
      
      <ButtonsContainer>
        <HapticButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTriggerHaptic}
          disabled={isPlaying}
        >
          Test Vibration
        </HapticButton>
        
        <HapticButton
          variant="strong"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => triggerHapticFeedback(300, 1.0, 0.0)}
          disabled={isPlaying}
        >
          Strong Only
        </HapticButton>
        
        <HapticButton
          variant="weak"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => triggerHapticFeedback(300, 0.0, 1.0)}
          disabled={isPlaying}
        >
          Weak Only
        </HapticButton>
      </ButtonsContainer>
      
      <HapticTitle style={{ marginTop: theme.space.xl }}>Haptic Patterns</HapticTitle>
      <HapticDescription>
        Try these predefined haptic patterns to test different vibration effects.
      </HapticDescription>
      
      <ButtonsContainer>
        {hapticPatterns.map((pattern) => (
          <PatternButton
            key={pattern.name}
            active={activePattern === pattern.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playHapticPattern(pattern)}
            disabled={isPlaying && activePattern !== pattern.name}
          >
            {pattern.name}
          </PatternButton>
        ))}
      </ButtonsContainer>
    </HapticContainer>
  );
};

export default HapticFeedbackTester;
