import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamepad } from '../hooks/useGamepad';
import { theme } from '../styles/theme';
import ControllerDisplay from '../components/controller/ControllerDisplay';
import ControllerModelVisualizer from '../components/controller/ControllerModelVisualizer';
import HapticFeedbackTester from '../components/controller/HapticFeedbackTester';
import AdvancedDiagnostics from '../components/controller/AdvancedDiagnostics';
import ControllerProfileManager from '../components/controller/ControllerProfileManager';
import ControllerIdentifierTest from '../components/controller/ControllerIdentifierTest';

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

const NoControllerTitle = styled.h3`
  font-size: ${theme.fontSizes.xl};
  margin-bottom: ${theme.space.md};
  color: ${theme.colors.primary};
`;

const NoControllerText = styled.p`
  font-size: ${theme.fontSizes.md};
  text-align: center;
  margin-bottom: ${theme.space.lg};
  color: ${theme.colors.text};
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
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const ControllerName = styled.h2`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.space.md};
`;

const ControllerType = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
`;

const ControllerDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.sm};
  margin-bottom: ${theme.space.md};
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
`;

const ControllerDetailsCard = styled.div`
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.lg};
  margin-top: ${theme.space.lg};
  margin-bottom: ${theme.space.lg};
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const ControllerDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.space.sm};
  padding-bottom: ${theme.space.sm};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ControllerDetailLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.primary};
  font-weight: 600;
`;

const ControllerDetailValue = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
  text-align: right;
  word-break: break-word;
  max-width: 60%;
`;

const ControllerDetailFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${theme.space.xs};
`;

const FeatureTag = styled.span`
  background-color: rgba(125, 252, 189, 0.2);
  color: ${theme.colors.primary};
  padding: ${theme.space.xs} ${theme.space.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
`;

const BrowserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${theme.space.md};
  padding: ${theme.space.sm} ${theme.space.md};
  background-color: ${theme.colors.backgroundDark};
  border-radius: ${theme.borderRadius.md};
`;

const BrowserIcon = styled.div`
  font-size: ${theme.fontSizes.lg};
  margin-right: ${theme.space.sm};
`;

const BrowserText = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
`;

const BrowserCompatibility = styled.div<{ isSupported: boolean }>`
  display: inline-block;
  margin-left: ${theme.space.sm};
  padding: ${theme.space.xs} ${theme.space.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  background-color: ${props => props.isSupported ? 'rgba(125, 252, 189, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: ${props => props.isSupported ? theme.colors.primary : '#F44336'};
`;

const SectionContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: ${theme.space.xl};
`;

const SectionTitle = styled.h3`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.lg};
  margin-bottom: ${theme.space.md};
  padding-bottom: ${theme.space.sm};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: ${theme.space.lg};
  justify-content: center;
  flex-wrap: wrap;
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
  white-space: nowrap;
  
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

const ExportButton = styled(motion.button)`
  background-color: ${theme.colors.backgroundLight};
  color: ${theme.colors.text};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.sm} ${theme.space.md};
  font-size: ${theme.fontSizes.sm};
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.backgroundDark};
  }
`;

const ExportButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.space.lg};
  width: 100%;
`;

const ExportIcon = styled.span`
  font-size: ${theme.fontSizes.md};
`;

const WarningIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${theme.space.md};
`;

const BrowserName = styled.span`
  font-weight: bold;
`;

const BrowserSupport = styled.span<{ supported: boolean }>`
  margin-left: ${theme.space.sm};
  color: ${props => props.supported ? theme.colors.primary : theme.colors.secondary};
`;

const ControllerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${theme.space.md};
`;

const TabContent = styled(motion.div)`
  width: 100%;
  padding: ${theme.space.md};
`;

type TabType = 'visualization' | 'diagnostics' | 'haptic' | 'profiles' | 'identifier';

const Test: React.FC = () => {
  const { 
    gamepads, 
    activeGamepad, 
    isSupported,
    browserInfo,
    updateDeadZones,
    triggerHapticFeedback
  } = useGamepad();
  
  const [activeTab, setActiveTab] = useState<TabType>('visualization');
  
  // Function to export controller data
  const exportControllerData = () => {
    if (!activeGamepad) return;
    
    // Create a formatted JSON object with controller data
    const exportData = {
      controller: {
        id: activeGamepad.id,
        type: activeGamepad.type,
        mapping: activeGamepad.mapping,
        model: activeGamepad.modelInfo ? activeGamepad.modelInfo.name : 'Unknown',
        manufacturer: activeGamepad.modelInfo ? activeGamepad.modelInfo.manufacturer : 'Unknown',
      },
      buttons: activeGamepad.buttons.map((button, index) => ({
        index,
        pressed: button.pressed,
        value: button.value
      })),
      axes: activeGamepad.axes.map((axis, index) => ({
        index,
        value: axis
      })),
      stickDrift: activeGamepad.stickDrift,
      diagnostics: {
        pollingRate: activeGamepad.pollingData.rate,
        latency: activeGamepad.latencyData.averageLatency,
        browser: `${activeGamepad.browserCompatibility.name} ${activeGamepad.browserCompatibility.version}`
      },
      timestamp: new Date().toISOString()
    };
    
    // Convert to a JSON string with pretty formatting
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `controller-data-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  // Function to handle loading a profile
  const handleLoadProfile = (profile: any) => {
    if (profile && profile.deadZones) {
      const leftDeadZone = typeof profile.deadZones.leftStick === 'string' 
        ? parseFloat(profile.deadZones.leftStick) 
        : profile.deadZones.leftStick;
        
      const rightDeadZone = typeof profile.deadZones.rightStick === 'string' 
        ? parseFloat(profile.deadZones.rightStick) 
        : profile.deadZones.rightStick;
        
      updateDeadZones(leftDeadZone, rightDeadZone);
    }
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
          <WarningIcon>⚠️</WarningIcon>
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
          
          <BrowserInfo>
            <BrowserIcon>🌐</BrowserIcon>
            <BrowserText>
              Browser: {browserInfo.name} {browserInfo.version}
              <BrowserCompatibility isSupported={browserInfo.fullSupport}>
                {browserInfo.fullSupport ? 'Fully Supported' : 'Limited Support'}
              </BrowserCompatibility>
            </BrowserText>
          </BrowserInfo>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Test your gamepad's buttons, sticks, and triggers. Diagnose issues like stick drift and input latency.
      </Subtitle>
      
      {!isSupported && (
        <NoControllerMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <WarningIcon>⚠️</WarningIcon>
          <NoControllerTitle>Gamepad API Not Supported</NoControllerTitle>
          <NoControllerText>
            Your browser doesn't support the Gamepad API. Please try using a modern browser like Chrome, Edge, or Firefox.
          </NoControllerText>
        </NoControllerMessage>
      )}
      
      {isSupported && !activeGamepad && (
        <NoControllerMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <WarningIcon>🎮</WarningIcon>
          <NoControllerTitle>No Controller Detected</NoControllerTitle>
          <NoControllerText>
            Connect a controller and press any button to activate it.
          </NoControllerText>
          <BrowserInfo>
            <BrowserName>{browserInfo.name} {browserInfo.version}</BrowserName>
            <BrowserSupport supported={browserInfo.fullSupport}>
              {browserInfo.fullSupport ? 'Full Support' : 'Limited Support'}
            </BrowserSupport>
          </BrowserInfo>
        </NoControllerMessage>
      )}
      
      {isSupported && activeGamepad && (
        <ControllerSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ControllerHeader>
            <ControllerInfo>
              <ControllerName>
                {activeGamepad.modelInfo ? activeGamepad.modelInfo.name : 'Generic Controller'}
              </ControllerName>
              <ControllerType>
                {activeGamepad.modelInfo ? activeGamepad.modelInfo.manufacturer : activeGamepad.type}
              </ControllerType>
            </ControllerInfo>
          </ControllerHeader>
          
          <TabsContainer>
            <Tab 
              active={activeTab === 'visualization'} 
              onClick={() => setActiveTab('visualization')}
            >
              Visualization
            </Tab>
            <Tab 
              active={activeTab === 'diagnostics'} 
              onClick={() => setActiveTab('diagnostics')}
            >
              Diagnostics
            </Tab>
            <Tab 
              active={activeTab === 'haptic'} 
              onClick={() => setActiveTab('haptic')}
            >
              Haptic Feedback
            </Tab>
            <Tab 
              active={activeTab === 'profiles'} 
              onClick={() => setActiveTab('profiles')}
            >
              Profiles
            </Tab>
            <Tab 
              active={activeTab === 'identifier'} 
              onClick={() => setActiveTab('identifier')}
            >
              Identifier
            </Tab>
          </TabsContainer>
          
          <AnimatePresence mode="wait">
            {activeTab === 'visualization' && (
              <TabContent
                key="visualization"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ControllerDisplay gamepad={activeGamepad} />
                
                <ControllerDetailsCard>
                  <ControllerDetailRow>
                    <ControllerDetailLabel>Model</ControllerDetailLabel>
                    <ControllerDetailValue>
                      {activeGamepad.modelInfo ? activeGamepad.modelInfo.name : 'Generic Controller'}
                    </ControllerDetailValue>
                  </ControllerDetailRow>
                  
                  <ControllerDetailRow>
                    <ControllerDetailLabel>Manufacturer</ControllerDetailLabel>
                    <ControllerDetailValue>
                      {activeGamepad.modelInfo ? activeGamepad.modelInfo.manufacturer : 'Unknown'}
                    </ControllerDetailValue>
                  </ControllerDetailRow>
                  
                  <ControllerDetailRow>
                    <ControllerDetailLabel>Controller ID</ControllerDetailLabel>
                    <ControllerDetailValue>{activeGamepad.id}</ControllerDetailValue>
                  </ControllerDetailRow>
                  
                  <ControllerDetailRow>
                    <ControllerDetailLabel>Mapping</ControllerDetailLabel>
                    <ControllerDetailValue>{activeGamepad.mapping}</ControllerDetailValue>
                  </ControllerDetailRow>
                  
                  <ControllerDetailRow>
                    <ControllerDetailLabel>Features</ControllerDetailLabel>
                    <ControllerDetailFeatures>
                      <FeatureTag>Wireless</FeatureTag>
                      {activeGamepad.hapticCapabilities.supported && (
                        <FeatureTag>Vibration Feedback</FeatureTag>
                      )}
                    </ControllerDetailFeatures>
                  </ControllerDetailRow>
                </ControllerDetailsCard>
              </TabContent>
            )}
            
            {activeTab === 'diagnostics' && (
              <TabContent
                key="diagnostics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AdvancedDiagnostics 
                  gamepad={activeGamepad}
                  updateDeadZones={updateDeadZones}
                />
              </TabContent>
            )}
            
            {activeTab === 'haptic' && (
              <TabContent
                key="haptic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <HapticFeedbackTester 
                  gamepad={activeGamepad}
                  triggerHapticFeedback={triggerHapticFeedback}
                />
              </TabContent>
            )}
            
            {activeTab === 'profiles' && (
              <TabContent
                key="profiles"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ControllerProfileManager 
                  gamepad={activeGamepad}
                  onLoadProfile={handleLoadProfile}
                />
              </TabContent>
            )}
            
            {activeTab === 'identifier' && (
              <TabContent
                key="identifier"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ControllerIdentifierTest />
              </TabContent>
            )}
          </AnimatePresence>
          
          <ExportButtonContainer>
            <ExportButton 
              onClick={exportControllerData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExportIcon>📊</ExportIcon> Export Controller Data
            </ExportButton>
          </ExportButtonContainer>
        </ControllerSection>
      )}
    </TestContainer>
  );
};

export default Test;
