import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGamepad } from '../hooks/useGamepad';
import { theme } from '../styles/theme';
import ControllerDisplay from '../components/controller/ControllerDisplay';

const TestContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.space.xl} ${theme.space.md};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: ${theme.space.lg};
  color: ${theme.colors.primary};
  text-align: center;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.2rem);
  margin-bottom: ${theme.space.xl};
  color: ${theme.colors.text};
  text-align: center;
  max-width: 800px;
`;

const NoControllerMessage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.space.xl};
  margin: ${theme.space.xl} 0;
  box-shadow: ${theme.shadows.md};
  width: 100%;
  max-width: 600px;
`;

const NoControllerIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.space.md};
  color: ${theme.colors.accent};
`;

const NoControllerTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  margin-bottom: ${theme.space.md};
  color: ${theme.colors.primary};
`;

const NoControllerText = styled.p`
  color: ${theme.colors.text};
  text-align: center;
  line-height: 1.6;
  margin-bottom: ${theme.space.lg};
`;

const StepsList = styled.ol`
  color: ${theme.colors.text};
  text-align: left;
  line-height: 1.6;
  margin-bottom: ${theme.space.lg};
  padding-left: ${theme.space.xl};
`;

const StepItem = styled.li`
  margin-bottom: ${theme.space.sm};
`;

const ControllerSection = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ControllerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${theme.space.xl};
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.lg};
  width: 100%;
  max-width: 600px;
`;

const ControllerName = styled.h2`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.space.md};
`;

const ControllerDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${theme.space.sm};
`;

const DetailLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
  margin-bottom: ${theme.space.xs};
`;

const DetailValue = styled.div`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
  font-weight: 600;
`;

const DiagnosticsButton = styled(motion.button)`
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  padding: ${theme.space.sm} ${theme.space.lg};
  border-radius: ${theme.borderRadius.md};
  border: none;
  cursor: pointer;
  box-shadow: ${theme.shadows.sm};
  margin-top: ${theme.space.lg};
  
  &:hover {
    background-color: ${theme.colors.secondaryLight};
  }
`;

const DiagnosticsPanel = styled(motion.div)`
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.lg};
  margin-top: ${theme.space.xl};
  width: 100%;
  overflow-x: auto;
`;

const DiagnosticsTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.space.md};
`;

const DiagnosticsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${theme.colors.backgroundDark};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.backgroundDark};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const TableHeader = styled.th`
  padding: ${theme.space.sm};
  text-align: left;
  color: ${theme.colors.primary};
`;

const TableCell = styled.td`
  padding: ${theme.space.sm};
  color: ${theme.colors.text};
`;

const Test: React.FC = () => {
  const { activeGamepad, isSupported } = useGamepad();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  const toggleDiagnostics = () => {
    setShowDiagnostics(!showDiagnostics);
  };
  
  if (!isSupported) {
    return (
      <TestContainer>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Controller Test
        </Title>
        <NoControllerMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <NoControllerIcon>⚠️</NoControllerIcon>
          <NoControllerTitle>Gamepad API Not Supported</NoControllerTitle>
          <NoControllerText>
            Your browser doesn't support the Gamepad API, which is required to test controllers.
            Please try using a modern browser like Chrome, Edge, Firefox, or Safari.
          </NoControllerText>
        </NoControllerMessage>
      </TestContainer>
    );
  }
  
  if (!activeGamepad) {
    return (
      <TestContainer>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Controller Test
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Connect your controller and press any button to begin testing
        </Subtitle>
        <NoControllerMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <NoControllerIcon>🎮</NoControllerIcon>
          <NoControllerTitle>No Controller Detected</NoControllerTitle>
          <NoControllerText>
            We couldn't detect a connected controller. Please follow these steps:
          </NoControllerText>
          <StepsList>
            <StepItem>Make sure your controller is connected to your device via USB, Bluetooth, or WiFi.</StepItem>
            <StepItem>If using a wireless controller, ensure it's charged and turned on.</StepItem>
            <StepItem>Press any button on your controller to activate it.</StepItem>
            <StepItem>Some browsers require a button press to initialize controller detection.</StepItem>
            <StepItem>Try refreshing the page after connecting your controller.</StepItem>
          </StepsList>
          <NoControllerText>
            Once connected, your controller should be automatically detected and displayed here.
          </NoControllerText>
        </NoControllerMessage>
      </TestContainer>
    );
  }
  
  return (
    <TestContainer>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Controller Test
      </Title>
      <Subtitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Press buttons or move sticks to test your controller
      </Subtitle>
      
      <ControllerSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ControllerInfo>
          <ControllerName>{activeGamepad.id}</ControllerName>
          <ControllerDetails>
            <DetailItem>
              <DetailLabel>Type</DetailLabel>
              <DetailValue>{activeGamepad.type}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Buttons</DetailLabel>
              <DetailValue>{activeGamepad.buttons.length}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Axes</DetailLabel>
              <DetailValue>{activeGamepad.axes.length}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Mapping</DetailLabel>
              <DetailValue>{activeGamepad.mapping || 'Custom'}</DetailValue>
            </DetailItem>
          </ControllerDetails>
          
          <DiagnosticsButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDiagnostics}
          >
            {showDiagnostics ? 'Hide Diagnostics' : 'Show Diagnostics'}
          </DiagnosticsButton>
        </ControllerInfo>
        
        <ControllerDisplay gamepad={activeGamepad} />
        
        {showDiagnostics && (
          <DiagnosticsPanel
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DiagnosticsTitle>Diagnostics</DiagnosticsTitle>
            
            <DiagnosticsTable>
              <TableHead>
                <TableRow>
                  <TableHeader>Button</TableHeader>
                  <TableHeader>Pressed</TableHeader>
                  <TableHeader>Value</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {activeGamepad.buttons.map((button, index) => (
                  <TableRow key={`button-${index}`}>
                    <TableCell>Button {index}</TableCell>
                    <TableCell>{button.pressed ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{button.value.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </DiagnosticsTable>
            
            <DiagnosticsTitle style={{ marginTop: theme.space.lg }}>Axes</DiagnosticsTitle>
            <DiagnosticsTable>
              <TableHead>
                <TableRow>
                  <TableHeader>Axis</TableHeader>
                  <TableHeader>Value</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {activeGamepad.axes.map((axis, index) => (
                  <TableRow key={`axis-${index}`}>
                    <TableCell>Axis {index}</TableCell>
                    <TableCell>{axis.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </DiagnosticsTable>
            
            {(activeGamepad.stickDrift.leftStick.detected || activeGamepad.stickDrift.rightStick.detected) && (
              <>
                <DiagnosticsTitle style={{ marginTop: theme.space.lg }}>Stick Drift Analysis</DiagnosticsTitle>
                <DiagnosticsTable>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Stick</TableHeader>
                      <TableHeader>Drift Detected</TableHeader>
                      <TableHeader>X Offset</TableHeader>
                      <TableHeader>Y Offset</TableHeader>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    <TableRow>
                      <TableCell>Left Stick</TableCell>
                      <TableCell>{activeGamepad.stickDrift.leftStick.detected ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{activeGamepad.stickDrift.leftStick.value.x.toFixed(4)}</TableCell>
                      <TableCell>{activeGamepad.stickDrift.leftStick.value.y.toFixed(4)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Right Stick</TableCell>
                      <TableCell>{activeGamepad.stickDrift.rightStick.detected ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{activeGamepad.stickDrift.rightStick.value.x.toFixed(4)}</TableCell>
                      <TableCell>{activeGamepad.stickDrift.rightStick.value.y.toFixed(4)}</TableCell>
                    </TableRow>
                  </tbody>
                </DiagnosticsTable>
              </>
            )}
          </DiagnosticsPanel>
        )}
      </ControllerSection>
    </TestContainer>
  );
};

export default Test;
