import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

const VisualizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 250px;
`;

const VisualizerTitle = styled.h3`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.space.sm};
  font-size: ${theme.fontSizes.lg};
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.backgroundDark};
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
`;

const StickCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const DriftIndicator = styled(motion.div)<{ detected: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: ${theme.space.xs} ${theme.space.sm};
  background-color: ${props => props.detected ? '#F44336' : '#4CAF50'};
  color: white;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  opacity: ${props => props.detected ? 1 : 0.7};
`;

const AxisValues = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: ${theme.space.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
`;

interface AnalogStickVisualizerProps {
  title: string;
  xAxis: number;
  yAxis: number;
  driftDetected: boolean;
}

const AnalogStickVisualizer: React.FC<AnalogStickVisualizerProps> = ({
  title,
  xAxis,
  yAxis,
  driftDetected,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the analog stick visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas resolution
    canvas.width = 400;
    canvas.height = 400;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid
    const gridSize = 40;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Draw deadzone circle
    const deadzoneRadius = 20;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, deadzoneRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw max range circle
    const maxRadius = 180;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Calculate stick position
    const stickX = centerX + xAxis * maxRadius;
    const stickY = centerY + yAxis * maxRadius;
    
    // Draw line from center to stick position
    ctx.strokeStyle = theme.colors.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(stickX, stickY);
    ctx.stroke();
    
    // Draw stick position
    const stickRadius = 15;
    
    // Draw glow effect for drift
    if (driftDetected) {
      const gradient = ctx.createRadialGradient(
        stickX, stickY, 0,
        stickX, stickY, stickRadius * 2
      );
      gradient.addColorStop(0, 'rgba(244, 67, 54, 0.7)');
      gradient.addColorStop(1, 'rgba(244, 67, 54, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(stickX, stickY, stickRadius * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw stick
    ctx.fillStyle = driftDetected ? '#F44336' : theme.colors.primary;
    ctx.beginPath();
    ctx.arc(stickX, stickY, stickRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw crosshair on stick
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(stickX - stickRadius / 2, stickY);
    ctx.lineTo(stickX + stickRadius / 2, stickY);
    ctx.stroke();
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(stickX, stickY - stickRadius / 2);
    ctx.lineTo(stickX, stickY + stickRadius / 2);
    ctx.stroke();
    
  }, [xAxis, yAxis, driftDetected]);
  
  return (
    <VisualizerContainer>
      <VisualizerTitle>{title}</VisualizerTitle>
      
      <CanvasContainer>
        <StickCanvas ref={canvasRef} />
        <DriftIndicator 
          detected={driftDetected}
          initial={{ opacity: 0 }}
          animate={{ opacity: driftDetected ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          {driftDetected ? 'DRIFT DETECTED' : 'NO DRIFT'}
        </DriftIndicator>
      </CanvasContainer>
      
      <AxisValues>
        <span>X: {xAxis.toFixed(3)}</span>
        <span>Y: {yAxis.toFixed(3)}</span>
      </AxisValues>
    </VisualizerContainer>
  );
};

export default AnalogStickVisualizer;
