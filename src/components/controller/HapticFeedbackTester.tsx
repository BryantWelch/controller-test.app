import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GamepadState } from '../../hooks/useGamepad';
import { HapticFeedbackOptions } from '../../hooks/customHooks/useHapticFeedback';
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

const FeedbackMessage = styled.div<{ success: boolean }>`
  background-color: ${props => props.success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  border-left: 4px solid ${props => props.success ? '#4CAF50' : '#F44336'};
  padding: ${theme.space.md};
  margin-bottom: ${theme.space.lg};
  color: ${theme.colors.text};
  transition: opacity 0.3s ease;
  opacity: 1;
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
  font-weight: 700;
  font-size: ${theme.fontSizes.md};
  background-color: ${props => 
    props.variant === 'strong' ? theme.colors.accent :
    props.variant === 'weak' ? theme.colors.secondary :
    '#5AFCB0' // Brighter green for better contrast
  };
  color: ${props => 
    props.variant ? theme.colors.text :
    '#001209' // Dark background color for contrast
  };
  text-shadow: ${props => 
    props.variant ? 'none' :
    '0 0 2px rgba(0, 18, 9, 0.2)' // Subtle text shadow for better readability
  };
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
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
  triggerHapticFeedback: (options: HapticFeedbackOptions) => Promise<boolean>;
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

// Predefined haptic patterns - defined outside component to avoid recreation on every render
const HAPTIC_PATTERNS: HapticPattern[] = [
  {
    name: 'Pulse',
    sequence: [
      { duration: 200, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
      { duration: 200, strongMagnitude: 0.0, weakMagnitude: 0.0, delay: 200 },
      { duration: 200, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
    ]
  },
  {
    name: 'Escalating',
    sequence: [
      { duration: 150, strongMagnitude: 0.2, weakMagnitude: 0.2, delay: 0 },
      { duration: 150, strongMagnitude: 0.4, weakMagnitude: 0.4, delay: 200 },
      { duration: 150, strongMagnitude: 0.6, weakMagnitude: 0.6, delay: 200 },
      { duration: 150, strongMagnitude: 0.8, weakMagnitude: 0.8, delay: 200 },
      { duration: 150, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 200 },
    ]
  },
  {
    name: 'Rumble',
    sequence: [
      { duration: 1000, strongMagnitude: 0.8, weakMagnitude: 0.8, delay: 0 },
    ]
  },
  {
    name: 'SOS',
    sequence: [
      { duration: 100, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
      { duration: 100, strongMagnitude: 0.0, weakMagnitude: 0.0, delay: 100 },
      { duration: 100, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
      { duration: 100, strongMagnitude: 0.0, weakMagnitude: 0.0, delay: 100 },
      { duration: 100, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
      { duration: 0, strongMagnitude: 0.0, weakMagnitude: 0.0, delay: 300 },
      { duration: 300, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
      { duration: 100, strongMagnitude: 0.0, weakMagnitude: 0.0, delay: 100 },
      { duration: 300, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
      { duration: 100, strongMagnitude: 0.0, weakMagnitude: 0.0, delay: 100 },
      { duration: 300, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
      { duration: 0, strongMagnitude: 0.0, weakMagnitude: 0.0, delay: 300 },
      { duration: 100, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
      { duration: 100, strongMagnitude: 0.0, weakMagnitude: 0.0, delay: 100 },
      { duration: 100, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
      { duration: 100, strongMagnitude: 0.0, weakMagnitude: 0.0, delay: 100 },
      { duration: 100, strongMagnitude: 1.0, weakMagnitude: 1.0, delay: 0 },
    ]
  },
  {
    name: 'Alternating',
    sequence: [
      { duration: 300, strongMagnitude: 1.0, weakMagnitude: 0.0, delay: 0 },
      { duration: 300, strongMagnitude: 0.0, weakMagnitude: 1.0, delay: 50 },
      { duration: 300, strongMagnitude: 1.0, weakMagnitude: 0.0, delay: 50 },
      { duration: 300, strongMagnitude: 0.0, weakMagnitude: 1.0, delay: 50 },
    ]
  }
];

const HapticFeedbackTester: React.FC<HapticFeedbackTesterProps> = memo(({ 
  gamepad, 
  triggerHapticFeedback 
}) => {
  const [duration, setDuration] = useState(300);
  const [strongMagnitude, setStrongMagnitude] = useState(1.0);
  const [weakMagnitude, setWeakMagnitude] = useState(1.0);
  const [activePattern, setActivePattern] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const isSupported = gamepad.hapticCapabilities.supported;
  
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  
  useEffect(() => {
    if (feedbackVisible) {
      const timer = setTimeout(() => {
        setFeedbackVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedbackVisible]);

  const handleTestVibration = async () => {
    const success = await triggerHapticFeedback({ duration, strongMagnitude, weakMagnitude });
    
    if (success) {
      setFeedbackMessage('Haptic feedback successfully triggered!');
      setFeedbackSuccess(true);
    } else {
      setFeedbackMessage('Failed to trigger haptic feedback. Your browser or controller may not support this feature.');
      setFeedbackSuccess(false);
    }
    
    setFeedbackVisible(true);
  };
  
  const playPattern = async (pattern: HapticPattern) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setActivePattern(pattern.name);
    
    for (const effect of pattern.sequence) {
      await triggerHapticFeedback({ duration: effect.duration, strongMagnitude: effect.strongMagnitude, weakMagnitude: effect.weakMagnitude });
      
      // Wait for the duration plus any delay
      await new Promise(resolve => setTimeout(resolve, effect.duration + effect.delay));
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
        Test the vibration capabilities of your controller by adjusting the parameters below.
      </HapticDescription>
      
      {!isSupported && (
        <NotSupportedMessage>
          Your controller may not support haptic feedback or your browser may not fully support the Gamepad Haptic Actuator API.
          We'll still try to use any available vibration methods.
        </NotSupportedMessage>
      )}
      
      {feedbackVisible && (
        <FeedbackMessage success={feedbackSuccess}>
          {feedbackMessage}
        </FeedbackMessage>
      )}
      
      <ControlsGrid>
        <ControlGroup>
          <ControlLabel>Duration (ms)</ControlLabel>
          <SliderContainer>
            <Slider 
              type="range" 
              min={50} 
              max={2000} 
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
          onClick={handleTestVibration}
          disabled={isPlaying}
        >
          Test Vibration
        </HapticButton>
        
        <HapticButton
          variant="strong"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={async () => await triggerHapticFeedback({ duration: 300, strongMagnitude: 1.0, weakMagnitude: 0.0 })}
          disabled={isPlaying}
        >
          Strong Only
        </HapticButton>
        
        <HapticButton
          variant="weak"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={async () => await triggerHapticFeedback({ duration: 300, strongMagnitude: 0.0, weakMagnitude: 1.0 })}
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
        {HAPTIC_PATTERNS.map((pattern) => (
          <PatternButton
            key={pattern.name}
            active={activePattern === pattern.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playPattern(pattern)}
            disabled={isPlaying && activePattern !== pattern.name}
          >
            {pattern.name}
          </PatternButton>
        ))}
      </ButtonsContainer>
    </HapticContainer>
  );
});

export default HapticFeedbackTester;
