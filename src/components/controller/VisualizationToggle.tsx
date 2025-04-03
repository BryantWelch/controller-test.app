import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.space.lg};
  width: 100%;
`;

const ToggleWrapper = styled.div`
  display: flex;
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.space.xs};
  position: relative;
  width: 300px;
`;

const ToggleOption = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${theme.space.sm} ${theme.space.md};
  background: none;
  border: none;
  color: ${props => props.active ? theme.colors.text : theme.colors.textDark};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
`;

const ToggleIndicator = styled(motion.div)`
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background-color: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  z-index: 1;
`;

export type VisualizationMode = 'realistic' | 'interactive';

interface VisualizationToggleProps {
  mode: VisualizationMode;
  onChange: (mode: VisualizationMode) => void;
}

const VisualizationToggle: React.FC<VisualizationToggleProps> = ({ mode, onChange }) => {
  return (
    <ToggleContainer>
      <ToggleWrapper>
        <ToggleIndicator
          initial={false}
          animate={{ x: mode === 'realistic' ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        <ToggleOption
          active={mode === 'realistic'}
          onClick={() => onChange('realistic')}
        >
          Realistic
        </ToggleOption>
        <ToggleOption
          active={mode === 'interactive'}
          onClick={() => onChange('interactive')}
        >
          Interactive
        </ToggleOption>
      </ToggleWrapper>
    </ToggleContainer>
  );
};

export default VisualizationToggle;
