import React, { memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import { BatteryData } from '../../hooks/useWebHID';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm} ${theme.space.md};
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.md};
`;

const BatteryIcon = styled.div<{ level: number; charging: boolean }>`
  position: relative;
  width: 32px;
  height: 16px;
  border: 2px solid ${props => {
    if (props.charging) return theme.colors.primary;
    if (props.level <= 20) return '#F44336';
    if (props.level <= 50) return '#FF9800';
    return theme.colors.primary;
  }};
  border-radius: 3px;
  
  &::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 8px;
    background-color: ${props => {
      if (props.charging) return theme.colors.primary;
      if (props.level <= 20) return '#F44336';
      if (props.level <= 50) return '#FF9800';
      return theme.colors.primary;
    }};
    border-radius: 0 2px 2px 0;
  }
`;

const BatteryFill = styled.div<{ level: number; charging: boolean }>`
  position: absolute;
  left: 2px;
  top: 2px;
  bottom: 2px;
  width: calc(${props => props.level}% - 4px);
  max-width: calc(100% - 4px);
  background-color: ${props => {
    if (props.charging) return theme.colors.primary;
    if (props.level <= 20) return '#F44336';
    if (props.level <= 50) return '#FF9800';
    return theme.colors.primary;
  }};
  border-radius: 1px;
  transition: width 0.3s ease;
  animation: ${props => props.charging ? pulse : 'none'} 1.5s ease-in-out infinite;
`;

const ChargingIcon = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  z-index: 1;
`;

const BatteryText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BatteryLevel = styled.span`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
`;

const BatteryStatus = styled.span<{ charging: boolean }>`
  color: ${props => props.charging ? theme.colors.primary : theme.colors.textDark};
  font-size: ${theme.fontSizes.xs};
`;

// Compact version for header
const CompactContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
`;

const CompactBattery = styled.div<{ level: number; charging: boolean }>`
  position: relative;
  width: 24px;
  height: 12px;
  border: 1.5px solid ${props => {
    if (props.charging) return theme.colors.primary;
    if (props.level <= 20) return '#F44336';
    if (props.level <= 50) return '#FF9800';
    return theme.colors.textDark;
  }};
  border-radius: 2px;
  
  &::after {
    content: '';
    position: absolute;
    right: -3px;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 6px;
    background-color: ${props => {
      if (props.charging) return theme.colors.primary;
      if (props.level <= 20) return '#F44336';
      if (props.level <= 50) return '#FF9800';
      return theme.colors.textDark;
    }};
    border-radius: 0 1px 1px 0;
  }
`;

const CompactFill = styled.div<{ level: number; charging: boolean }>`
  position: absolute;
  left: 1px;
  top: 1px;
  bottom: 1px;
  width: calc(${props => props.level}% - 2px);
  max-width: calc(100% - 2px);
  background-color: ${props => {
    if (props.charging) return theme.colors.primary;
    if (props.level <= 20) return '#F44336';
    if (props.level <= 50) return '#FF9800';
    return theme.colors.primary;
  }};
  border-radius: 1px;
  animation: ${props => props.charging ? pulse : 'none'} 1.5s ease-in-out infinite;
`;

const CompactText = styled.span`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.xs};
  font-family: ${theme.fonts.monospace};
`;

interface BatteryIndicatorProps {
  battery: BatteryData;
  compact?: boolean;
}

const BatteryIndicator: React.FC<BatteryIndicatorProps> = memo(({
  battery,
  compact = false,
}) => {
  if (compact) {
    return (
      <CompactContainer>
        <CompactBattery level={battery.level} charging={battery.charging}>
          <CompactFill level={battery.level} charging={battery.charging} />
        </CompactBattery>
        <CompactText>
          {battery.level}%{battery.charging ? ' ⚡' : ''}
        </CompactText>
      </CompactContainer>
    );
  }

  return (
    <Container>
      <BatteryIcon level={battery.level} charging={battery.charging}>
        <BatteryFill level={battery.level} charging={battery.charging} />
        {battery.charging && <ChargingIcon>⚡</ChargingIcon>}
      </BatteryIcon>
      <BatteryText>
        <BatteryLevel>{battery.level}%</BatteryLevel>
        <BatteryStatus charging={battery.charging}>
          {battery.status === 'charging' ? 'Charging' : 
           battery.status === 'full' ? 'Fully Charged' : 
           'Battery'}
        </BatteryStatus>
      </BatteryText>
    </Container>
  );
});

export default BatteryIndicator;
