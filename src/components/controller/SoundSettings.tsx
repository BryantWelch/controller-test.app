import React, { memo } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

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

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.space.lg};
`;

const SettingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

const SettingLabel = styled.label`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Toggle = styled.button<{ active: boolean }>`
  width: 50px;
  height: 26px;
  border-radius: 13px;
  border: none;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.backgroundLight};
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.active ? '27px' : '3px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${theme.colors.text};
    transition: left 0.2s ease;
  }
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${theme.colors.backgroundLight};
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

const SliderValue = styled.span`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xs};
  font-family: ${theme.fonts.monospace};
`;

const SoundTypeSelector = styled.div`
  display: flex;
  gap: ${theme.space.xs};
`;

const SoundTypeButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${theme.space.xs} ${theme.space.sm};
  border: 1px solid ${props => props.active ? theme.colors.primary : theme.colors.backgroundLight};
  background-color: ${props => props.active ? theme.colors.primary : 'transparent'};
  color: ${props => props.active ? theme.colors.backgroundDark : theme.colors.textDark};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${theme.fontSizes.xs};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TestButton = styled.button`
  padding: ${theme.space.sm} ${theme.space.md};
  background-color: ${theme.colors.secondary};
  border: none;
  color: ${theme.colors.text};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.accent};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export interface SoundSettingsState {
  enabled: boolean;
  volume: number;
  buttonSound: 'click' | 'beep' | 'pop';
  stickSound: boolean;
}

interface SoundSettingsProps {
  settings: SoundSettingsState;
  onSettingsChange: (settings: SoundSettingsState) => void;
  onTestSound: () => void;
}

const SoundSettings: React.FC<SoundSettingsProps> = memo(({
  settings,
  onSettingsChange,
  onTestSound,
}) => {
  const handleToggle = (key: 'enabled' | 'stickSound') => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, volume: Number(e.target.value) / 100 });
  };

  const handleSoundTypeChange = (type: 'click' | 'beep' | 'pop') => {
    onSettingsChange({ ...settings, buttonSound: type });
  };

  return (
    <Container>
      <Title>🔊 Sound Feedback</Title>
      
      <SettingsGrid>
        <SettingGroup>
          <SettingLabel>
            Enable Sound
            <Toggle 
              active={settings.enabled} 
              onClick={() => handleToggle('enabled')}
            />
          </SettingLabel>
        </SettingGroup>

        <SettingGroup>
          <SettingLabel>
            Volume
            <SliderValue>{Math.round(settings.volume * 100)}%</SliderValue>
          </SettingLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={settings.volume * 100}
            onChange={handleVolumeChange}
            disabled={!settings.enabled}
          />
        </SettingGroup>

        <SettingGroup>
          <SettingLabel>Button Sound Type</SettingLabel>
          <SoundTypeSelector>
            <SoundTypeButton
              active={settings.buttonSound === 'click'}
              onClick={() => handleSoundTypeChange('click')}
              disabled={!settings.enabled}
            >
              Click
            </SoundTypeButton>
            <SoundTypeButton
              active={settings.buttonSound === 'beep'}
              onClick={() => handleSoundTypeChange('beep')}
              disabled={!settings.enabled}
            >
              Beep
            </SoundTypeButton>
            <SoundTypeButton
              active={settings.buttonSound === 'pop'}
              onClick={() => handleSoundTypeChange('pop')}
              disabled={!settings.enabled}
            >
              Pop
            </SoundTypeButton>
          </SoundTypeSelector>
        </SettingGroup>

        <SettingGroup>
          <SettingLabel>
            Stick Movement Sound
            <Toggle 
              active={settings.stickSound} 
              onClick={() => handleToggle('stickSound')}
            />
          </SettingLabel>
        </SettingGroup>

        <SettingGroup>
          <TestButton onClick={onTestSound} disabled={!settings.enabled}>
            🔊 Test Sound
          </TestButton>
        </SettingGroup>
      </SettingsGrid>
    </Container>
  );
});

export default SoundSettings;
