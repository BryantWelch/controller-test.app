import React, { memo } from 'react';
import styled from 'styled-components';
import { GamepadState } from '../../hooks/useGamepad';
import { theme } from '../../styles/theme';

const SelectorContainer = styled.div`
  display: flex;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm};
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.space.md};
  flex-wrap: wrap;
`;

const GamepadButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm} ${theme.space.md};
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.backgroundLight};
  color: ${props => props.active ? theme.colors.backgroundDark : theme.colors.text};
  border: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background-color: ${props => props.active ? theme.colors.primary : theme.colors.backgroundLight};
    border-color: ${theme.colors.primary};
  }
`;

const GamepadIcon = styled.span`
  font-size: 1.2em;
`;

const GamepadInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const GamepadName = styled.span`
  font-weight: 500;
`;

const GamepadType = styled.span`
  font-size: ${theme.fontSizes.xs};
  opacity: 0.8;
`;

const Label = styled.span`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.sm};
  margin-right: ${theme.space.sm};
`;

interface GamepadSelectorProps {
  gamepads: GamepadState[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const GamepadSelector: React.FC<GamepadSelectorProps> = memo(({ gamepads, activeIndex, onSelect }) => {
  if (gamepads.length <= 1) {
    return null; // Don't show selector if only one controller
  }

  const getControllerIcon = (type?: string): string => {
    switch (type) {
      case 'xbox': return '🎮';
      case 'playstation': return '🎮';
      case 'nintendo': return '🕹️';
      default: return '🎮';
    }
  };

  return (
    <SelectorContainer>
      <Label>Controllers:</Label>
      {gamepads.map((gamepad) => (
        <GamepadButton
          key={gamepad.index}
          active={gamepad.index === activeIndex}
          onClick={() => onSelect(gamepad.index)}
        >
          <GamepadIcon>{getControllerIcon(gamepad.type)}</GamepadIcon>
          <GamepadInfo>
            <GamepadName>
              {gamepad.modelInfo?.name || 'Controller'} #{gamepad.index + 1}
            </GamepadName>
            <GamepadType>{gamepad.modelInfo?.manufacturer || 'Unknown'}</GamepadType>
          </GamepadInfo>
        </GamepadButton>
      ))}
    </SelectorContainer>
  );
});

export default GamepadSelector;
