import React, { memo } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${theme.space.md};
  padding: ${theme.space.sm} ${theme.space.md};
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
`;

const InfoIcon = styled.div`
  font-size: ${theme.fontSizes.lg};
  margin-right: ${theme.space.sm};
`;

const InfoText = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
`;

const StatusBadge = styled.div<{ success?: boolean }>`
  display: inline-block;
  margin-left: ${theme.space.sm};
  padding: ${theme.space.xs} ${theme.space.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  background-color: ${props => props.success ? 'rgba(125, 252, 189, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: ${props => props.success ? theme.colors.primary : '#F44336'};
`;

interface BrowserCompatibilityInfoProps {
  isSupported: boolean;
}

const BrowserCompatibilityInfo: React.FC<BrowserCompatibilityInfoProps> = memo(({ isSupported }) => (
  <InfoContainer>
    <InfoIcon>
      <i className="fas fa-browser" />
    </InfoIcon>
    <InfoText>
      <div>Browser Compatibility</div>
      <StatusBadge success={isSupported}>
        {isSupported ? 'Supported' : 'Not Supported'}
      </StatusBadge>
    </InfoText>
  </InfoContainer>
));

export default BrowserCompatibilityInfo;
