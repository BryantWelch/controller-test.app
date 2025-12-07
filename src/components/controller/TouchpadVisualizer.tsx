import React, { memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { TouchpadData } from '../../hooks/useWebHID';

const Container = styled.div`
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.lg};
  margin-bottom: ${theme.space.lg};
`;

const Title = styled.h3`
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.space.md} 0;
  font-size: ${theme.fontSizes.lg};
`;

const TouchpadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.md};
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(125, 252, 189, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(125, 252, 189, 0); }
`;

const TouchpadSurface = styled.div<{ pressed: boolean }>`
  width: 300px;
  height: 150px;
  background: linear-gradient(135deg, ${theme.colors.backgroundLight}, ${theme.colors.backgroundDark});
  border: 2px solid ${props => props.pressed ? theme.colors.primary : theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.lg};
  position: relative;
  overflow: hidden;
  transition: border-color 0.1s ease;
  animation: ${props => props.pressed ? pulse : 'none'} 0.5s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const TouchPoint = styled.div<{ x: number; y: number; id: number }>`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle, ${props => props.id === 0 ? theme.colors.primary : theme.colors.accent}, transparent);
  border: 2px solid ${props => props.id === 0 ? theme.colors.primary : theme.colors.accent};
  transform: translate(-50%, -50%);
  left: ${props => props.x * 100}%;
  top: ${props => props.y * 100}%;
  pointer-events: none;
  transition: left 0.05s ease-out, top 0.05s ease-out;
  
  &::after {
    content: '${props => props.id + 1}';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: ${theme.fontSizes.xs};
    color: ${theme.colors.text};
    font-weight: 600;
  }
`;

const TouchInfo = styled.div`
  display: flex;
  gap: ${theme.space.lg};
  justify-content: center;
  flex-wrap: wrap;
`;

const TouchInfoItem = styled.div`
  text-align: center;
  min-width: 100px;
`;

const TouchInfoLabel = styled.div`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.xs};
  margin-bottom: ${theme.space.xs};
`;

const TouchInfoValue = styled.div`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  font-family: ${theme.fonts.monospace};
`;

const StatusBadge = styled.span<{ active: boolean }>`
  display: inline-block;
  padding: ${theme.space.xs} ${theme.space.sm};
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.backgroundLight};
  color: ${props => props.active ? theme.colors.backgroundDark : theme.colors.textDark};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
`;

const NotConnected = styled.div`
  text-align: center;
  padding: ${theme.space.lg};
  color: ${theme.colors.textDark};
`;

interface TouchpadVisualizerProps {
  touchpad: TouchpadData;
  connected: boolean;
}

const TouchpadVisualizer: React.FC<TouchpadVisualizerProps> = memo(({
  touchpad,
  connected,
}) => {
  if (!connected) {
    return (
      <Container>
        <Title>Touchpad</Title>
        <NotConnected>
          <p>Connect via WebHID to see touchpad data</p>
          <p style={{ fontSize: theme.fontSizes.sm, marginTop: theme.space.sm }}>
            Available for DualSense and DualShock 4 controllers
          </p>
        </NotConnected>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Touchpad</Title>
      
      <TouchpadContainer>
        <TouchpadSurface pressed={touchpad.pressed}>
          {touchpad.touches.map((touch) => (
            <TouchPoint
              key={touch.id}
              x={touch.x}
              y={touch.y}
              id={touch.id}
            />
          ))}
        </TouchpadSurface>
        
        <TouchInfo>
          <TouchInfoItem>
            <TouchInfoLabel>Touchpad Click</TouchInfoLabel>
            <StatusBadge active={touchpad.pressed}>
              {touchpad.pressed ? 'PRESSED' : 'Released'}
            </StatusBadge>
          </TouchInfoItem>
          
          <TouchInfoItem>
            <TouchInfoLabel>Active Touches</TouchInfoLabel>
            <TouchInfoValue>{touchpad.touches.length}</TouchInfoValue>
          </TouchInfoItem>
          
          {touchpad.touches.map((touch) => (
            <TouchInfoItem key={touch.id}>
              <TouchInfoLabel>Touch {touch.id + 1} Position</TouchInfoLabel>
              <TouchInfoValue>
                X: {(touch.x * 100).toFixed(1)}% Y: {(touch.y * 100).toFixed(1)}%
              </TouchInfoValue>
            </TouchInfoItem>
          ))}
        </TouchInfo>
      </TouchpadContainer>
    </Container>
  );
});

export default TouchpadVisualizer;
