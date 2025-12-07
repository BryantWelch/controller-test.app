import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { ButtonState } from '../../hooks/useGamepad';

const Container = styled.div`
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.lg};
  margin-bottom: ${theme.space.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.space.md};
`;

const Title = styled.h3`
  color: ${theme.colors.primary};
  margin: 0;
  font-size: ${theme.fontSizes.lg};
`;

const ResetButton = styled.button`
  padding: ${theme.space.xs} ${theme.space.md};
  background-color: transparent;
  border: 1px solid ${theme.colors.secondary};
  color: ${theme.colors.secondary};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.text};
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: ${theme.space.lg};
  margin-bottom: ${theme.space.md};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  font-family: ${theme.fonts.monospace};
`;

const StatLabel = styled.div`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.xs};
`;

const ButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: ${theme.space.sm};
`;

const ButtonCounter = styled.div<{ active: boolean; hasCount: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.space.sm};
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.1s ease;
  opacity: ${props => props.hasCount ? 1 : 0.5};
`;

const ButtonName = styled.div<{ active: boolean }>`
  color: ${props => props.active ? theme.colors.backgroundDark : theme.colors.textDark};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  margin-bottom: ${theme.space.xs};
`;

const ButtonCount = styled.div<{ active: boolean }>`
  color: ${props => props.active ? theme.colors.backgroundDark : theme.colors.text};
  font-size: ${theme.fontSizes.md};
  font-weight: 700;
  font-family: ${theme.fonts.monospace};
`;

const HistorySection = styled.div`
  margin-top: ${theme.space.lg};
  border-top: 1px solid ${theme.colors.backgroundLight};
  padding-top: ${theme.space.md};
`;

const HistoryTitle = styled.h4`
  color: ${theme.colors.textDark};
  margin: 0 0 ${theme.space.sm} 0;
  font-size: ${theme.fontSizes.sm};
`;

const HistoryList = styled.div`
  max-height: 150px;
  overflow-y: auto;
  font-family: ${theme.fonts.monospace};
  font-size: ${theme.fontSizes.xs};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.backgroundLight};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.textDark};
    border-radius: 3px;
  }
`;

const HistoryItem = styled.div<{ type: 'press' | 'release' }>`
  display: flex;
  gap: ${theme.space.sm};
  padding: ${theme.space.xs} 0;
  color: ${props => props.type === 'press' ? theme.colors.primary : theme.colors.textDark};
  border-bottom: 1px solid ${theme.colors.backgroundLight};
  
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryTime = styled.span`
  color: ${theme.colors.textDark};
  min-width: 80px;
`;

const HistoryAction = styled.span`
  flex: 1;
`;

// Standard gamepad button names
const BUTTON_NAMES = [
  'A', 'B', 'X', 'Y',
  'LB', 'RB', 'LT', 'RT',
  'Back', 'Start', 'LS', 'RS',
  'Up', 'Down', 'Left', 'Right',
  'Home', 'Share'
];

interface HistoryEntry {
  timestamp: number;
  button: number;
  buttonName: string;
  type: 'press' | 'release';
}

interface ButtonPressCounterProps {
  buttons: ButtonState[];
  controllerType?: string;
}

const ButtonPressCounter: React.FC<ButtonPressCounterProps> = memo(({
  buttons,
  controllerType,
}) => {
  const [counts, setCounts] = useState<number[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [sessionStart] = useState(Date.now());
  const prevButtonsRef = useRef<boolean[]>([]);

  // Get button name based on controller type
  const getButtonName = useCallback((index: number): string => {
    if (controllerType === 'playstation') {
      const psNames = [
        'X', 'O', '□', '△',
        'L1', 'R1', 'L2', 'R2',
        'Share', 'Options', 'L3', 'R3',
        'Up', 'Down', 'Left', 'Right',
        'PS', 'Touch'
      ];
      return psNames[index] || `B${index}`;
    }
    return BUTTON_NAMES[index] || `B${index}`;
  }, [controllerType]);

  // Track button presses
  useEffect(() => {
    if (buttons.length === 0) return;

    // Initialize counts if needed
    if (counts.length !== buttons.length) {
      setCounts(new Array(buttons.length).fill(0));
      prevButtonsRef.current = buttons.map(b => b.pressed);
      return;
    }

    // Check for new presses
    const newCounts = [...counts];
    const newHistory: HistoryEntry[] = [];
    
    buttons.forEach((button, index) => {
      const wasPressed = prevButtonsRef.current[index];
      const isPressed = button.pressed;
      
      if (isPressed && !wasPressed) {
        // Button was just pressed
        newCounts[index]++;
        newHistory.push({
          timestamp: Date.now(),
          button: index,
          buttonName: getButtonName(index),
          type: 'press',
        });
      } else if (!isPressed && wasPressed) {
        // Button was just released
        newHistory.push({
          timestamp: Date.now(),
          button: index,
          buttonName: getButtonName(index),
          type: 'release',
        });
      }
    });

    if (newHistory.length > 0) {
      setCounts(newCounts);
      setHistory(prev => [...newHistory, ...prev].slice(0, 100)); // Keep last 100 entries
    }

    prevButtonsRef.current = buttons.map(b => b.pressed);
  }, [buttons, counts, getButtonName]);

  // Reset counters
  const handleReset = useCallback(() => {
    setCounts(new Array(buttons.length).fill(0));
    setHistory([]);
  }, [buttons.length]);

  // Calculate stats
  const totalPresses = counts.reduce((sum, count) => sum + count, 0);
  const mostUsedIndex = counts.indexOf(Math.max(...counts));
  const mostUsedButton = counts[mostUsedIndex] > 0 ? getButtonName(mostUsedIndex) : '-';
  const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
  const pressesPerMinute = sessionDuration > 0 ? Math.round((totalPresses / sessionDuration) * 60) : 0;

  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 2
    });
  };

  return (
    <Container>
      <Header>
        <Title>Button Press Counter</Title>
        <ResetButton onClick={handleReset}>Reset</ResetButton>
      </Header>

      <StatsRow>
        <StatItem>
          <StatValue>{totalPresses}</StatValue>
          <StatLabel>Total Presses</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{mostUsedButton}</StatValue>
          <StatLabel>Most Used</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{pressesPerMinute}</StatValue>
          <StatLabel>Presses/Min</StatLabel>
        </StatItem>
      </StatsRow>

      <ButtonsGrid>
        {buttons.map((button, index) => (
          <ButtonCounter 
            key={index} 
            active={button.pressed}
            hasCount={counts[index] > 0}
          >
            <ButtonName active={button.pressed}>
              {getButtonName(index)}
            </ButtonName>
            <ButtonCount active={button.pressed}>
              {counts[index] || 0}
            </ButtonCount>
          </ButtonCounter>
        ))}
      </ButtonsGrid>

      <HistorySection>
        <HistoryTitle>Recent Activity ({history.length} events)</HistoryTitle>
        <HistoryList>
          {history.slice(0, 20).map((entry, index) => (
            <HistoryItem key={index} type={entry.type}>
              <HistoryTime>{formatTime(entry.timestamp)}</HistoryTime>
              <HistoryAction>
                {entry.buttonName} {entry.type === 'press' ? '▼ pressed' : '▲ released'}
              </HistoryAction>
            </HistoryItem>
          ))}
          {history.length === 0 && (
            <HistoryItem type="release">
              <HistoryAction>No button activity yet</HistoryAction>
            </HistoryItem>
          )}
        </HistoryList>
      </HistorySection>
    </Container>
  );
});

export default ButtonPressCounter;
