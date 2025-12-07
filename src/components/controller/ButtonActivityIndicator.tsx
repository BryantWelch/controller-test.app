import React, { memo, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { GamepadState } from '../../hooks/useGamepad';
import { theme } from '../../styles/theme';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.xs};
  padding: ${theme.space.sm};
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  min-height: 40px;
  align-items: center;
  justify-content: center;
`;

const ButtonIndicator = styled.div<{ pressed: boolean; value: number }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  transition: all 0.1s ease;
  background-color: ${props => 
    props.pressed 
      ? `rgba(125, 252, 189, ${0.3 + props.value * 0.7})` 
      : theme.colors.backgroundLight};
  color: ${props => props.pressed ? theme.colors.backgroundDark : theme.colors.textDark};
  border: 2px solid ${props => props.pressed ? theme.colors.primary : 'transparent'};
  animation: ${props => props.pressed ? pulse : 'none'} 0.3s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const TriggerIndicator = styled.div<{ value: number }>`
  width: 48px;
  height: 24px;
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  position: relative;
  overflow: hidden;
  background-color: ${theme.colors.backgroundLight};
  color: ${theme.colors.text};
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.value * 100}%;
    background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent});
    transition: width 0.05s ease;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
`;

const Label = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textDark};
  margin-right: ${theme.space.sm};
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: ${theme.colors.backgroundLight};
  margin: 0 ${theme.space.sm};
`;

// Button name mappings for standard gamepad
const BUTTON_NAMES = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', '⊞', '☰', 'L3', 'R3', '↑', '↓', '←', '→'];

interface ButtonActivityIndicatorProps {
  gamepad: GamepadState;
}

const ButtonActivityIndicator: React.FC<ButtonActivityIndicatorProps> = memo(({ gamepad }) => {
  // Get active buttons count for display
  const activeCount = useMemo(() => 
    gamepad.buttons.filter(b => b.pressed).length,
    [gamepad.buttons]
  );

  // Get trigger values
  const leftTrigger = gamepad.buttons[6]?.value ?? 0;
  const rightTrigger = gamepad.buttons[7]?.value ?? 0;

  return (
    <Container>
      <Section>
        <Label>Buttons:</Label>
        {gamepad.buttons.slice(0, 6).map((button, index) => (
          <ButtonIndicator 
            key={index} 
            pressed={button.pressed} 
            value={button.value}
            title={`Button ${index}: ${BUTTON_NAMES[index] || index}`}
          >
            {BUTTON_NAMES[index] || index}
          </ButtonIndicator>
        ))}
      </Section>
      
      <Divider />
      
      <Section>
        <Label>Triggers:</Label>
        <TriggerIndicator value={leftTrigger}>
          <span>LT {(leftTrigger * 100).toFixed(0)}%</span>
        </TriggerIndicator>
        <TriggerIndicator value={rightTrigger}>
          <span>RT {(rightTrigger * 100).toFixed(0)}%</span>
        </TriggerIndicator>
      </Section>
      
      <Divider />
      
      <Section>
        <Label>D-Pad:</Label>
        {gamepad.buttons.slice(12, 16).map((button, index) => (
          <ButtonIndicator 
            key={index + 12} 
            pressed={button.pressed} 
            value={button.value}
            title={`D-Pad ${BUTTON_NAMES[index + 12]}`}
          >
            {BUTTON_NAMES[index + 12]}
          </ButtonIndicator>
        ))}
      </Section>
      
      {activeCount > 0 && (
        <>
          <Divider />
          <Label style={{ color: theme.colors.primary }}>
            {activeCount} active
          </Label>
        </>
      )}
    </Container>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if buttons changed
  const prevButtons = prevProps.gamepad.buttons;
  const nextButtons = nextProps.gamepad.buttons;
  
  if (prevButtons.length !== nextButtons.length) return false;
  
  for (let i = 0; i < nextButtons.length; i++) {
    if (prevButtons[i]?.pressed !== nextButtons[i]?.pressed) return false;
    if (Math.abs((prevButtons[i]?.value ?? 0) - (nextButtons[i]?.value ?? 0)) > 0.01) return false;
  }
  
  return true;
});

export default ButtonActivityIndicator;
