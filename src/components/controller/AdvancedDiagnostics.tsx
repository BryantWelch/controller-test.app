import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GamepadState } from '../../hooks/useGamepad';
import { theme } from '../../styles/theme';

const DiagnosticsContainer = styled.div`
  width: 100%;
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.lg};
  margin-bottom: ${theme.space.xl};
`;

const DiagnosticsTitle = styled.h3`
  color: ${theme.colors.primary};
  margin-top: 0;
  margin-bottom: ${theme.space.md};
  font-size: ${theme.fontSizes.lg};
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: ${theme.space.lg};
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: ${theme.space.sm} ${theme.space.md};
  color: ${props => props.active ? theme.colors.primary : theme.colors.textDark};
  font-size: ${theme.fontSizes.md};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.active ? theme.colors.primary : 'transparent'};
  }
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const TabContent = styled.div`
  margin-top: ${theme.space.lg};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.space.md};
  margin-bottom: ${theme.space.lg};
`;

const MetricCard = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.md};
  display: flex;
  flex-direction: column;
`;

const MetricLabel = styled.div`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.space.xs};
`;

const MetricValue = styled.div<{ highlight?: boolean }>`
  color: ${props => props.highlight ? theme.colors.accent : theme.colors.text};
  font-size: ${theme.fontSizes.xl};
  font-weight: 600;
  margin-bottom: ${theme.space.xs};
`;

const MetricUnit = styled.div`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.xs};
`;

const StickContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: ${theme.space.xl};
  margin-bottom: ${theme.space.xl};
`;

const StickVisualizer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StickTitle = styled.h4`
  color: ${theme.colors.text};
  margin-bottom: ${theme.space.md};
`;

const StickCanvas = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: ${theme.space.md};
`;

const DeadZoneCircle = styled.div<{ size: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.size}%;
  height: ${props => props.size}%;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.3);
`;

const StickPosition = styled.div<{ x: number; y: number; isDrifting: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translate(${props => props.x * 100}px, ${props => props.y * 100}px);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.isDrifting ? theme.colors.accent : theme.colors.primary};
  box-shadow: 0 0 10px ${props => props.isDrifting ? theme.colors.accent : theme.colors.primary};
`;

const StickCrosshair = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  
  &::before, &::after {
    content: '';
    position: absolute;
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  &::before {
    top: 50%;
    left: -95px;
    width: 200px;
    height: 1px;
    transform: translateY(-50%);
  }
  
  &::after {
    left: 50%;
    top: -95px;
    height: 200px;
    width: 1px;
    transform: translateX(-50%);
  }
`;

const ControlsContainer = styled.div`
  margin-top: ${theme.space.lg};
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${theme.space.md};
`;

const ControlLabel = styled.label`
  color: ${theme.colors.textDark};
  margin-bottom: ${theme.space.xs};
  font-size: ${theme.fontSizes.sm};
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  background: ${theme.colors.backgroundLight};
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
  }
`;

const SliderValue = styled.span`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  min-width: 40px;
  text-align: right;
`;

const LatencyGraph = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.md};
  margin-top: ${theme.space.lg};
  position: relative;
  overflow: hidden;
`;

const GraphLine = styled.div<{ height: number; index: number; total: number }>`
  position: absolute;
  bottom: 0;
  left: ${props => (props.index / props.total) * 100}%;
  width: ${props => 100 / props.total}%;
  height: ${props => props.height}%;
  background-color: ${theme.colors.primary};
  opacity: 0.8;
`;

const GraphAxis = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
`;

const GraphLabel = styled.div`
  position: absolute;
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.xs};
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.md};
  margin-top: ${theme.space.lg};
`;

const ActionButton = styled(motion.button)`
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: ${theme.fontSizes.sm};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text};
`;

const InfoBox = styled.div`
  background-color: rgba(53, 137, 251, 0.1);
  border-left: 4px solid ${theme.colors.accent};
  padding: ${theme.space.md};
  margin-top: ${theme.space.lg};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
`;

interface AdvancedDiagnosticsProps {
  gamepad: GamepadState;
  updateDeadZones: (leftStick: number, rightStick: number) => void;
}

const AdvancedDiagnostics: React.FC<AdvancedDiagnosticsProps> = ({ 
  gamepad,
  updateDeadZones
}) => {
  const [activeTab, setActiveTab] = useState('stickDrift');
  const [leftDeadZone, setLeftDeadZone] = useState(gamepad.deadZones.leftStick);
  const [rightDeadZone, setRightDeadZone] = useState(gamepad.deadZones.rightStick);
  
  // Handle dead zone changes
  const handleDeadZoneChange = (stick: 0 | 1, value: number) => {
    if (stick === 0) {
      setLeftDeadZone(value);
      updateDeadZones(value, rightDeadZone);
    } else {
      setRightDeadZone(value);
      updateDeadZones(leftDeadZone, value);
    }
  };
  
  // Normalize latency data for graph
  const normalizeLatencyData = (samples: number[]) => {
    if (samples.length === 0) return [];
    
    const maxLatency = Math.max(...samples, 50); // At least 50ms for scale
    return samples.map(sample => (sample / maxLatency) * 80); // 80% of graph height
  };
  
  const normalizedLatencyData = normalizeLatencyData(gamepad.latencyData.samples);
  
  return (
    <DiagnosticsContainer>
      <DiagnosticsTitle>Advanced Diagnostics</DiagnosticsTitle>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'stickDrift'} 
          onClick={() => setActiveTab('stickDrift')}
        >
          Stick Drift
        </Tab>
        <Tab 
          active={activeTab === 'latency'} 
          onClick={() => setActiveTab('latency')}
        >
          Input Latency
        </Tab>
        <Tab 
          active={activeTab === 'polling'} 
          onClick={() => setActiveTab('polling')}
        >
          Polling Rate
        </Tab>
      </TabsContainer>
      
      {activeTab === 'stickDrift' && (
        <TabContent>
          <MetricsGrid>
            <MetricCard>
              <MetricLabel>Left Stick Drift</MetricLabel>
              <MetricValue highlight={gamepad.stickDrift.leftStick.detected}>
                {gamepad.stickDrift.leftStick.detected ? 'Detected' : 'None'}
              </MetricValue>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Right Stick Drift</MetricLabel>
              <MetricValue highlight={gamepad.stickDrift.rightStick.detected}>
                {gamepad.stickDrift.rightStick.detected ? 'Detected' : 'None'}
              </MetricValue>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Left Deadzone</MetricLabel>
              <MetricValue>{(leftDeadZone * 100).toFixed(1)}</MetricValue>
              <MetricUnit>%</MetricUnit>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Right Deadzone</MetricLabel>
              <MetricValue>{(rightDeadZone * 100).toFixed(1)}</MetricValue>
              <MetricUnit>%</MetricUnit>
            </MetricCard>
          </MetricsGrid>
          
          <StickContainer>
            <StickVisualizer>
              <StickTitle>Left Stick</StickTitle>
              <StickCanvas>
                <StickCrosshair />
                <DeadZoneCircle size={leftDeadZone * 100} />
                <StickPosition 
                  x={gamepad.axes[0]} 
                  y={gamepad.axes[1]} 
                  isDrifting={gamepad.stickDrift.leftStick.detected}
                />
              </StickCanvas>
              <div>
                <div>X: {gamepad.axes[0].toFixed(4)}</div>
                <div>Y: {gamepad.axes[1].toFixed(4)}</div>
              </div>
            </StickVisualizer>
            
            <StickVisualizer>
              <StickTitle>Right Stick</StickTitle>
              <StickCanvas>
                <StickCrosshair />
                <DeadZoneCircle size={rightDeadZone * 100} />
                <StickPosition 
                  x={gamepad.axes[2]} 
                  y={gamepad.axes[3]} 
                  isDrifting={gamepad.stickDrift.rightStick.detected}
                />
              </StickCanvas>
              <div>
                <div>X: {gamepad.axes[2].toFixed(4)}</div>
                <div>Y: {gamepad.axes[3].toFixed(4)}</div>
              </div>
            </StickVisualizer>
          </StickContainer>
          
          <ControlsContainer>
            <ControlGroup>
              <ControlLabel>Left Stick Deadzone</ControlLabel>
              <SliderContainer>
                <Slider 
                  type="range" 
                  min={0} 
                  max={0.5} 
                  step={0.01} 
                  value={leftDeadZone} 
                  onChange={(e) => handleDeadZoneChange(0, parseFloat(e.target.value))} 
                />
                <SliderValue>{(leftDeadZone * 100).toFixed(0)}%</SliderValue>
              </SliderContainer>
            </ControlGroup>
            
            <ControlGroup>
              <ControlLabel>Right Stick Deadzone</ControlLabel>
              <SliderContainer>
                <Slider 
                  type="range" 
                  min={0} 
                  max={0.5} 
                  step={0.01} 
                  value={rightDeadZone} 
                  onChange={(e) => handleDeadZoneChange(1, parseFloat(e.target.value))} 
                />
                <SliderValue>{(rightDeadZone * 100).toFixed(0)}%</SliderValue>
              </SliderContainer>
            </ControlGroup>
          </ControlsContainer>
          
          <InfoBox>
            <strong>About Stick Drift:</strong> Stick drift occurs when your controller registers input even when you're not touching the analog sticks. 
            Increasing the deadzone can help compensate for stick drift, but may reduce sensitivity for small movements.
            Move the sticks around and then release them to test for drift.
          </InfoBox>
        </TabContent>
      )}
      
      {activeTab === 'latency' && (
        <TabContent>
          <MetricsGrid>
            <MetricCard>
              <MetricLabel>Current Latency</MetricLabel>
              <MetricValue>{gamepad.latencyData.currentLatency.toFixed(1)}</MetricValue>
              <MetricUnit>ms</MetricUnit>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Average Latency</MetricLabel>
              <MetricValue>{gamepad.latencyData.averageLatency.toFixed(1)}</MetricValue>
              <MetricUnit>ms</MetricUnit>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Samples</MetricLabel>
              <MetricValue>{gamepad.latencyData.samples.length}</MetricValue>
            </MetricCard>
          </MetricsGrid>
          
          <LatencyGraph>
            <GraphAxis />
            {normalizedLatencyData.map((height, index) => (
              <GraphLine 
                key={index} 
                height={height} 
                index={index} 
                total={normalizedLatencyData.length} 
              />
            ))}
            
            <GraphLabel style={{ bottom: '5px', left: '10px' }}>0 ms</GraphLabel>
            <GraphLabel style={{ bottom: '40%', left: '10px' }}>25 ms</GraphLabel>
            <GraphLabel style={{ bottom: '80%', left: '10px' }}>50 ms</GraphLabel>
          </LatencyGraph>
          
          <InfoBox>
            <strong>About Input Latency:</strong> Input latency measures the time between a button press and when it's detected by the system.
            Lower values are better. Press buttons repeatedly to generate more samples for the latency graph.
            Note that this measures software latency, not the physical latency of your controller or display.
          </InfoBox>
        </TabContent>
      )}
      
      {activeTab === 'polling' && (
        <TabContent>
          <MetricsGrid>
            <MetricCard>
              <MetricLabel>Polling Rate</MetricLabel>
              <MetricValue>{gamepad.pollingData.rate}</MetricValue>
              <MetricUnit>Hz</MetricUnit>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Average Interval</MetricLabel>
              <MetricValue>{gamepad.pollingData.average.toFixed(2)}</MetricValue>
              <MetricUnit>ms</MetricUnit>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Browser</MetricLabel>
              <MetricValue>{gamepad.browserCompatibility.name}</MetricValue>
              <MetricUnit>v{gamepad.browserCompatibility.version}</MetricUnit>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Full Support</MetricLabel>
              <MetricValue>{gamepad.browserCompatibility.fullSupport ? 'Yes' : 'No'}</MetricValue>
            </MetricCard>
          </MetricsGrid>
          
          <InfoBox>
            <strong>About Polling Rate:</strong> Polling rate indicates how frequently your controller's state is checked per second.
            Higher values (60Hz+) provide more responsive input. Most browsers cap this at around 60-125Hz.
            
            {gamepad.browserCompatibility.limitations.length > 0 && (
              <>
                <br /><br />
                <strong>Browser Limitations:</strong>
                <ul>
                  {gamepad.browserCompatibility.limitations.map((limitation, index) => (
                    <li key={index}>{limitation}</li>
                  ))}
                </ul>
              </>
            )}
          </InfoBox>
        </TabContent>
      )}
    </DiagnosticsContainer>
  );
};

export default AdvancedDiagnostics;
