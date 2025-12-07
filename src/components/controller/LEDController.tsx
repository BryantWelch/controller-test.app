import React, { memo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { LEDData } from '../../hooks/useWebHID';

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

const LEDGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.space.lg};
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.md};
`;

const LEDPreview = styled.div<{ r: number; g: number; b: number; brightness: number }>`
  width: 100px;
  height: 30px;
  border-radius: ${theme.borderRadius.full};
  background-color: rgb(${props => Math.round(props.r * props.brightness / 100)}, ${props => Math.round(props.g * props.brightness / 100)}, ${props => Math.round(props.b * props.brightness / 100)});
  box-shadow: 0 0 20px rgba(${props => props.r}, ${props => props.g}, ${props => props.b}, ${props => props.brightness / 100});
  transition: all 0.2s ease;
`;

const ColorValue = styled.div`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.xs};
  font-family: ${theme.fonts.monospace};
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

const SliderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
`;

const SliderLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.sm};
`;

const SliderValue = styled.span`
  color: ${theme.colors.text};
  font-family: ${theme.fonts.monospace};
  font-size: ${theme.fontSizes.xs};
`;

const Slider = styled.input<{ color: string }>`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #000, ${props => props.color});
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${theme.colors.text};
    cursor: pointer;
    border: 2px solid ${props => props.color};
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${theme.colors.text};
    cursor: pointer;
    border: 2px solid ${props => props.color};
  }
`;

const BrightnessSlider = styled(Slider)`
  background: linear-gradient(to right, #333, #fff);
`;

const PresetsSection = styled.div`
  margin-top: ${theme.space.md};
`;

const PresetsTitle = styled.h4`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.sm};
  margin: 0 0 ${theme.space.sm} 0;
`;

const PresetsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.xs};
`;

const PresetButton = styled.button<{ r: number; g: number; b: number }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.sm};
  border: 2px solid transparent;
  background-color: rgb(${props => props.r}, ${props => props.g}, ${props => props.b});
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${theme.colors.text};
    transform: scale(1.1);
  }
`;

const ApplyButton = styled.button`
  width: 100%;
  padding: ${theme.space.sm} ${theme.space.md};
  background-color: ${theme.colors.primary};
  border: none;
  color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  margin-top: ${theme.space.md};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.primaryLight};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NotConnected = styled.div`
  text-align: center;
  padding: ${theme.space.lg};
  color: ${theme.colors.textDark};
`;

const presets = [
  { name: 'Blue', r: 0, g: 0, b: 255 },
  { name: 'Red', r: 255, g: 0, b: 0 },
  { name: 'Green', r: 0, g: 255, b: 0 },
  { name: 'Purple', r: 128, g: 0, b: 255 },
  { name: 'Cyan', r: 0, g: 255, b: 255 },
  { name: 'Yellow', r: 255, g: 255, b: 0 },
  { name: 'Orange', r: 255, g: 128, b: 0 },
  { name: 'Pink', r: 255, g: 0, b: 128 },
  { name: 'White', r: 255, g: 255, b: 255 },
  { name: 'Off', r: 0, g: 0, b: 0 },
];

interface LEDControllerProps {
  led: LEDData;
  connected: boolean;
  onSetColor: (r: number, g: number, b: number, brightness: number) => Promise<boolean>;
}

const LEDController: React.FC<LEDControllerProps> = memo(({
  led,
  connected,
  onSetColor,
}) => {
  const [r, setR] = useState(led.r);
  const [g, setG] = useState(led.g);
  const [b, setB] = useState(led.b);
  const [brightness, setBrightness] = useState(led.brightness);
  const [applying, setApplying] = useState(false);

  const handleApply = useCallback(async () => {
    setApplying(true);
    await onSetColor(r, g, b, brightness);
    setApplying(false);
  }, [r, g, b, brightness, onSetColor]);

  const handlePreset = useCallback((preset: { r: number; g: number; b: number }) => {
    setR(preset.r);
    setG(preset.g);
    setB(preset.b);
  }, []);

  if (!connected) {
    return (
      <Container>
        <Title>LED Light Bar</Title>
        <NotConnected>
          <p>Connect via WebHID to control LED colors</p>
          <p style={{ fontSize: theme.fontSizes.sm, marginTop: theme.space.sm }}>
            Available for DualSense and DualShock 4 controllers
          </p>
        </NotConnected>
      </Container>
    );
  }

  return (
    <Container>
      <Title>LED Light Bar</Title>
      
      <LEDGrid>
        <PreviewSection>
          <LEDPreview r={r} g={g} b={b} brightness={brightness} />
          <ColorValue>
            RGB({r}, {g}, {b}) @ {brightness}%
          </ColorValue>
        </PreviewSection>

        <ControlsSection>
          <SliderGroup>
            <SliderLabel>
              Red <SliderValue>{r}</SliderValue>
            </SliderLabel>
            <Slider
              type="range"
              min="0"
              max="255"
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              color="#ff0000"
            />
          </SliderGroup>

          <SliderGroup>
            <SliderLabel>
              Green <SliderValue>{g}</SliderValue>
            </SliderLabel>
            <Slider
              type="range"
              min="0"
              max="255"
              value={g}
              onChange={(e) => setG(Number(e.target.value))}
              color="#00ff00"
            />
          </SliderGroup>

          <SliderGroup>
            <SliderLabel>
              Blue <SliderValue>{b}</SliderValue>
            </SliderLabel>
            <Slider
              type="range"
              min="0"
              max="255"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              color="#0000ff"
            />
          </SliderGroup>

          <SliderGroup>
            <SliderLabel>
              Brightness <SliderValue>{brightness}%</SliderValue>
            </SliderLabel>
            <BrightnessSlider
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              color="#ffffff"
            />
          </SliderGroup>
        </ControlsSection>
      </LEDGrid>

      <PresetsSection>
        <PresetsTitle>Color Presets</PresetsTitle>
        <PresetsGrid>
          {presets.map((preset) => (
            <PresetButton
              key={preset.name}
              r={preset.r}
              g={preset.g}
              b={preset.b}
              onClick={() => handlePreset(preset)}
              title={preset.name}
            />
          ))}
        </PresetsGrid>
      </PresetsSection>

      <ApplyButton onClick={handleApply} disabled={applying}>
        {applying ? 'Applying...' : 'Apply Color'}
      </ApplyButton>
    </Container>
  );
});

export default LEDController;
