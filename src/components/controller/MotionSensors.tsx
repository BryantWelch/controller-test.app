import React, { memo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { MotionData } from '../../hooks/useWebHID';

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

const SensorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.space.lg};
`;

const SensorCard = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.md};
`;

const SensorTitle = styled.h4`
  color: ${theme.colors.accent};
  margin: 0 0 ${theme.space.sm} 0;
  font-size: ${theme.fontSizes.md};
`;

const AxisContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
`;

const AxisRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
`;

const AxisLabel = styled.span`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.sm};
  width: 20px;
  font-weight: 600;
`;

const AxisBar = styled.div`
  flex: 1;
  height: 20px;
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.sm};
  position: relative;
  overflow: hidden;
`;

const AxisFill = styled.div<{ value: number; color: string }>`
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  width: ${props => Math.abs(props.value) * 50}%;
  background-color: ${props => props.color};
  transform: ${props => props.value < 0 ? 'translateX(-100%)' : 'translateX(0)'};
  transition: width 0.05s ease-out;
`;

const AxisCenter = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  background-color: ${theme.colors.textDark};
  transform: translateX(-50%);
`;

const AxisValue = styled.span`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xs};
  font-family: ${theme.fonts.monospace};
  width: 60px;
  text-align: right;
`;

const OrientationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.md};
`;

const Controller3D = styled.div`
  width: 200px;
  height: 120px;
  perspective: 500px;
`;

const ControllerModel = styled.div<{ pitch: number; roll: number; yaw: number }>`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.accent});
  border-radius: 30px;
  transform-style: preserve-3d;
  transform: rotateX(${props => -props.pitch}deg) rotateY(${props => props.yaw}deg) rotateZ(${props => props.roll}deg);
  transition: transform 0.05s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    left: 25%;
    top: 50%;
    transform: translateY(-50%);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    right: 25%;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const OrientationValues = styled.div`
  display: flex;
  gap: ${theme.space.lg};
  justify-content: center;
`;

const OrientationValue = styled.div`
  text-align: center;
`;

const OrientationLabel = styled.div`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.xs};
  margin-bottom: ${theme.space.xs};
`;

const OrientationNumber = styled.div`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.monospace};
`;

const ResetButton = styled.button`
  padding: ${theme.space.xs} ${theme.space.md};
  background-color: transparent;
  border: 1px solid ${theme.colors.primary};
  color: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.backgroundDark};
  }
`;

const NotConnected = styled.div`
  text-align: center;
  padding: ${theme.space.xl};
  color: ${theme.colors.textDark};
`;

const ConnectButton = styled.button`
  padding: ${theme.space.sm} ${theme.space.lg};
  background-color: ${theme.colors.primary};
  border: none;
  color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  margin-top: ${theme.space.md};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.primaryLight};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

interface MotionSensorsProps {
  motion: MotionData;
  connected: boolean;
  supported: boolean;
  onConnect: () => void;
  onResetOrientation: () => void;
}

const MotionSensors: React.FC<MotionSensorsProps> = memo(({
  motion,
  connected,
  supported,
  onConnect,
  onResetOrientation,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw gyroscope visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw crosshair
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw gyro indicator
    const gyroX = Math.max(-1, Math.min(1, motion.gyroscope.x / 5));
    const gyroY = Math.max(-1, Math.min(1, motion.gyroscope.y / 5));
    
    const indicatorX = centerX + gyroX * radius * 0.8;
    const indicatorY = centerY + gyroY * radius * 0.8;

    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 8, 0, Math.PI * 2);
    ctx.fillStyle = theme.colors.primary;
    ctx.fill();

    // Draw trail
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(indicatorX, indicatorY);
    ctx.strokeStyle = theme.colors.primary;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [motion.gyroscope]);

  if (!supported) {
    return (
      <Container>
        <Title>Motion Sensors</Title>
        <NotConnected>
          <p>WebHID is not supported in your browser.</p>
          <p style={{ fontSize: theme.fontSizes.sm, marginTop: theme.space.sm }}>
            Please use Chrome, Edge, or Opera for motion sensor support.
          </p>
        </NotConnected>
      </Container>
    );
  }

  if (!connected) {
    return (
      <Container>
        <Title>Motion Sensors</Title>
        <NotConnected>
          <p>Connect via WebHID for motion sensor data</p>
          <p style={{ fontSize: theme.fontSizes.sm, marginTop: theme.space.sm }}>
            Supports PlayStation DualSense and DualShock 4 controllers
          </p>
          <ConnectButton onClick={onConnect}>
            🎮 Connect Controller (WebHID)
          </ConnectButton>
        </NotConnected>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Motion Sensors</Title>
      
      <SensorsGrid>
        {/* Gyroscope */}
        <SensorCard>
          <SensorTitle>Gyroscope (°/s)</SensorTitle>
          <AxisContainer>
            <AxisRow>
              <AxisLabel>X</AxisLabel>
              <AxisBar>
                <AxisCenter />
                <AxisFill value={motion.gyroscope.x / 10} color={theme.colors.accent} />
              </AxisBar>
              <AxisValue>{motion.gyroscope.x.toFixed(2)}</AxisValue>
            </AxisRow>
            <AxisRow>
              <AxisLabel>Y</AxisLabel>
              <AxisBar>
                <AxisCenter />
                <AxisFill value={motion.gyroscope.y / 10} color={theme.colors.primary} />
              </AxisBar>
              <AxisValue>{motion.gyroscope.y.toFixed(2)}</AxisValue>
            </AxisRow>
            <AxisRow>
              <AxisLabel>Z</AxisLabel>
              <AxisBar>
                <AxisCenter />
                <AxisFill value={motion.gyroscope.z / 10} color={theme.colors.secondary} />
              </AxisBar>
              <AxisValue>{motion.gyroscope.z.toFixed(2)}</AxisValue>
            </AxisRow>
          </AxisContainer>
        </SensorCard>

        {/* Accelerometer */}
        <SensorCard>
          <SensorTitle>Accelerometer (g)</SensorTitle>
          <AxisContainer>
            <AxisRow>
              <AxisLabel>X</AxisLabel>
              <AxisBar>
                <AxisCenter />
                <AxisFill value={motion.accelerometer.x} color={theme.colors.accent} />
              </AxisBar>
              <AxisValue>{motion.accelerometer.x.toFixed(3)}</AxisValue>
            </AxisRow>
            <AxisRow>
              <AxisLabel>Y</AxisLabel>
              <AxisBar>
                <AxisCenter />
                <AxisFill value={motion.accelerometer.y} color={theme.colors.primary} />
              </AxisBar>
              <AxisValue>{motion.accelerometer.y.toFixed(3)}</AxisValue>
            </AxisRow>
            <AxisRow>
              <AxisLabel>Z</AxisLabel>
              <AxisBar>
                <AxisCenter />
                <AxisFill value={motion.accelerometer.z} color={theme.colors.secondary} />
              </AxisBar>
              <AxisValue>{motion.accelerometer.z.toFixed(3)}</AxisValue>
            </AxisRow>
          </AxisContainer>
        </SensorCard>

        {/* 3D Orientation */}
        <SensorCard>
          <SensorTitle>3D Orientation</SensorTitle>
          <OrientationContainer>
            <Controller3D>
              <ControllerModel 
                pitch={motion.orientation.pitch}
                roll={motion.orientation.roll}
                yaw={motion.orientation.yaw}
              />
            </Controller3D>
            <OrientationValues>
              <OrientationValue>
                <OrientationLabel>Pitch</OrientationLabel>
                <OrientationNumber>{motion.orientation.pitch.toFixed(1)}°</OrientationNumber>
              </OrientationValue>
              <OrientationValue>
                <OrientationLabel>Roll</OrientationLabel>
                <OrientationNumber>{motion.orientation.roll.toFixed(1)}°</OrientationNumber>
              </OrientationValue>
              <OrientationValue>
                <OrientationLabel>Yaw</OrientationLabel>
                <OrientationNumber>{motion.orientation.yaw.toFixed(1)}°</OrientationNumber>
              </OrientationValue>
            </OrientationValues>
            <ResetButton onClick={onResetOrientation}>Reset Orientation</ResetButton>
          </OrientationContainer>
        </SensorCard>
      </SensorsGrid>
    </Container>
  );
});

export default MotionSensors;
