import React, { memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(125, 252, 189, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(125, 252, 189, 0); }
  100% { box-shadow: 0 0 0 0 rgba(125, 252, 189, 0); }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.xs} ${theme.space.md};
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.full};
`;

const StatusDot = styled.div<{ connected: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.connected ? theme.colors.primary : '#F44336'};
  animation: ${props => props.connected ? pulse : 'none'} 2s infinite;
`;

const StatusText = styled.span<{ connected: boolean }>`
  font-size: ${theme.fontSizes.sm};
  color: ${props => props.connected ? theme.colors.primary : '#F44336'};
  font-weight: 500;
`;

const PollingRate = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textDark};
  margin-left: ${theme.space.xs};
`;

interface ConnectionStatusProps {
  connected: boolean;
  pollingRate?: number;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = memo(({ connected, pollingRate }) => (
  <Container>
    <StatusDot connected={connected} />
    <StatusText connected={connected}>
      {connected ? 'Connected' : 'Disconnected'}
    </StatusText>
    {connected && pollingRate !== undefined && pollingRate > 0 && (
      <PollingRate>@ {pollingRate}Hz</PollingRate>
    )}
  </Container>
));

export default ConnectionStatus;
