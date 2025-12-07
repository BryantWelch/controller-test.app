import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamepad } from '../hooks/useGamepad';
import { useWebHID } from '../hooks/useWebHID';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import { theme } from '../styles/theme';
import ControllerDisplay from '../components/controller/ControllerDisplay';
import HapticFeedbackTester from '../components/controller/HapticFeedbackTester';
import AdvancedDiagnostics from '../components/controller/AdvancedDiagnostics';
import ControllerProfileManager from '../components/controller/ControllerProfileManager';
import ControllerIdentifierTest from '../components/controller/ControllerIdentifierTest';
import ButtonActivityIndicator from '../components/controller/ButtonActivityIndicator';
import ConnectionStatus from '../components/controller/ConnectionStatus';
import GamepadSelector from '../components/controller/GamepadSelector';
import MotionSensors from '../components/controller/MotionSensors';
import TouchpadVisualizer from '../components/controller/TouchpadVisualizer';
import BatteryIndicator from '../components/controller/BatteryIndicator';
import LEDController from '../components/controller/LEDController';
import ButtonPressCounter from '../components/controller/ButtonPressCounter';
import SoundSettings, { SoundSettingsState } from '../components/controller/SoundSettings';
import { exportControllerDataUtil } from '../utils/controllerUtils';
import BrowserCompatibilityInfo from '../components/common/BrowserCompatibilityInfo';

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

const MessageIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.space.md};
  color: ${props => props.color || theme.colors.accent};
`;

const MessageTitle = styled.h3`
  font-size: ${theme.fontSizes.xl};
  margin-bottom: ${theme.space.md};
  color: ${theme.colors.primary};
`;

const MessageText = styled.p`
  font-size: ${theme.fontSizes.md};
  text-align: center;
  margin-bottom: ${theme.space.lg};
  color: ${theme.colors.text};
`;

const NotificationPopup = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.space.md} ${theme.space.lg};
  box-shadow: ${theme.shadows.lg};
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  z-index: 1000;
  color: ${theme.colors.text};
  border-left: 4px solid ${theme.colors.primary};
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
  
  h2 {
    font-size: ${theme.fontSizes.xl};
    color: ${theme.colors.primary};
    margin-bottom: ${theme.space.md};
  }
  
  div {
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.textDark};
  }
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

const DetailText = styled.div<{ isLabel?: boolean }>`
  font-size: ${theme.fontSizes.sm};
  color: ${props => props.isLabel ? theme.colors.primary : theme.colors.text};
  font-weight: ${props => props.isLabel ? 600 : 'normal'};
  text-align: ${props => props.isLabel ? 'left' : 'right'};
  word-break: ${props => props.isLabel ? 'normal' : 'break-word'};
  max-width: ${props => props.isLabel ? 'auto' : '60%'};
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.space.lg};
  width: 100%;
`;

const ActionButton = styled(motion.button)`
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
  
  span {
    font-size: ${theme.fontSizes.md};
  }
`;

const ControllerHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: ${theme.space.md};
`;

const TabContent = styled(motion.div)`
  width: 100%;
  padding: ${theme.space.md};
`;

type TabType = 'visualization' | 'diagnostics' | 'haptic' | 'profiles' | 'identifier' | 'advanced';

const Test: React.FC = () => {
  const { 
    gamepads,
    activeGamepad, 
    setGamepadActive,
    isSupported,
    updateDeadZones,
    triggerHapticFeedback
  } = useGamepad();
  
  // WebHID for advanced features (motion, touchpad, LED, battery)
  const webHID = useWebHID();
  
  // Sound feedback settings
  const [soundSettings, setSoundSettings] = useState<SoundSettingsState>({
    enabled: false,
    volume: 0.3,
    buttonSound: 'click',
    stickSound: false,
  });
  
  const { playButtonSound } = useSoundFeedback(soundSettings);
  
  // Track previous button states for sound feedback
  const prevButtonsRef = useRef<boolean[]>([]);
  
  // Play sound on button press
  useEffect(() => {
    if (!activeGamepad || !soundSettings.enabled) return;
    
    const currentButtons = activeGamepad.buttons.map(b => b.pressed);
    
    // Check for new presses
    currentButtons.forEach((pressed, index) => {
      if (pressed && !prevButtonsRef.current[index]) {
        playButtonSound();
      }
    });
    
    prevButtonsRef.current = currentButtons;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGamepad?.buttons, soundSettings.enabled, playButtonSound]);
  
  // Get all connected gamepads
  const connectedGamepads = gamepads();
  
  const [activeTab, setActiveTab] = useState<TabType>('visualization');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  
  const showControllerRequiredNotification = () => {
    setNotificationMessage('Please connect a controller to use this feature');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  const safeSetActiveTab = (tab: TabType) => {
    if (tab !== 'visualization' && !activeGamepad) {
      showControllerRequiredNotification();
      return;
    }
    setActiveTab(tab);
  };
  
  const handleLoadProfile = useCallback((profile: { deadZones?: { leftStick: number | string, rightStick: number | string } }) => {
    if (profile && profile.deadZones) {
      const leftDeadZone = typeof profile.deadZones.leftStick === 'string' 
        ? parseFloat(profile.deadZones.leftStick) 
        : profile.deadZones.leftStick;
        
      const rightDeadZone = typeof profile.deadZones.rightStick === 'string' 
        ? parseFloat(profile.deadZones.rightStick) 
        : profile.deadZones.rightStick;
        
      updateDeadZones(leftDeadZone, rightDeadZone);
    }
  }, [updateDeadZones]);

  const renderContent = () => {
    if (!isSupported) {
      return (
        <NoControllerMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MessageIcon>
            <i className="fas fa-exclamation-triangle" />
          </MessageIcon>
          <MessageTitle>
            No Controller Detected
          </MessageTitle>
          <MessageText>
            Please connect a controller to your device to begin testing.
          </MessageText>

          <MessageText>
            <strong>Supported Controllers:</strong>
          </MessageText>
          <MessageText>
            Xbox, PlayStation, Nintendo Switch Pro, and most other USB or Bluetooth controllers.
          </MessageText>
          <BrowserCompatibilityInfo isSupported={isSupported} />
        </NoControllerMessage>
      );
    }
    
    // Case 2: No controller detected
    if (!activeGamepad) {
      return (
        <>
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
            <MessageIcon>🎮</MessageIcon>
            <MessageTitle>No Controller Detected</MessageTitle>
            <MessageText>
              We couldn't detect a connected controller. Please follow these steps:
            </MessageText>
            <StepsList>
              <StepItem>Make sure your controller is connected to your device via USB, Bluetooth, or WiFi.</StepItem>
              <StepItem>If using a wireless controller, ensure it's charged and turned on.</StepItem>
              <StepItem>Press any button on your controller to activate it.</StepItem>
              <StepItem>Some browsers require a button press to initialize controller detection.</StepItem>
              <StepItem>Try refreshing the page after connecting your controller.</StepItem>
            </StepsList>
            <MessageText>
              Once connected, your controller should be automatically detected and displayed here.
            </MessageText>
            
            <BrowserCompatibilityInfo isSupported={isSupported} />
          </NoControllerMessage>
        </>
      );
    }
    
    // Case 3: Controller detected and active
    return (
      <>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Test your gamepad's buttons, sticks, and triggers. Diagnose issues like stick drift and input latency.
        </Subtitle>
        
        {/* Gamepad selector for multiple controllers */}
        <GamepadSelector 
          gamepads={connectedGamepads}
          activeIndex={activeGamepad?.index ?? 0}
          onSelect={setGamepadActive}
        />
        
        <ControllerSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ControllerHeader>
            <ControllerInfo>
              <h2>
                {activeGamepad?.modelInfo?.name || 'Generic Controller'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.space.md, marginTop: theme.space.xs }}>
                <span>{activeGamepad?.type}</span>
                <ConnectionStatus 
                  connected={activeGamepad?.connected ?? false} 
                  pollingRate={activeGamepad?.pollingData?.rate}
                />
              </div>
            </ControllerInfo>
          </ControllerHeader>
          
          <TabsContainer>
            <Tab 
              active={activeTab === 'visualization'} 
              onClick={() => safeSetActiveTab('visualization')}
            >
              Visualization
            </Tab>
            <Tab 
              active={activeTab === 'diagnostics'} 
              onClick={() => safeSetActiveTab('diagnostics')}
            >
              Diagnostics
            </Tab>
            <Tab 
              active={activeTab === 'haptic'} 
              onClick={() => safeSetActiveTab('haptic')}
            >
              Haptic Feedback
            </Tab>
            <Tab 
              active={activeTab === 'profiles'} 
              onClick={() => safeSetActiveTab('profiles')}
            >
              Profiles
            </Tab>
            <Tab 
              active={activeTab === 'identifier'} 
              onClick={() => safeSetActiveTab('identifier')}
            >
              Identifier
            </Tab>
            <Tab 
              active={activeTab === 'advanced'} 
              onClick={() => safeSetActiveTab('advanced')}
            >
              Advanced
            </Tab>
          </TabsContainer>
          
          {/* Notification popup */}
          {showNotification && (
            <NotificationPopup
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MessageIcon>🎮</MessageIcon>
              {notificationMessage}
            </NotificationPopup>
          )}
          
          <AnimatePresence mode="wait">
            {!activeGamepad && activeTab !== 'visualization' && (
              <TabContent
                key="no-controller"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <NoControllerMessage
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <MessageIcon>🎮</MessageIcon>
                  <MessageTitle>Controller Required</MessageTitle>
                  <MessageText>
                    Please connect a controller to use this feature.
                  </MessageText>
                </NoControllerMessage>
              </TabContent>
            )}
            
            {activeTab === 'visualization' && activeGamepad && (
              <TabContent
                key="visualization"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ButtonActivityIndicator gamepad={activeGamepad} />
                <div style={{ height: theme.space.md }} />
                <ControllerDisplay gamepad={activeGamepad} />
                
                <ControllerDetailsCard>
                  <ControllerDetailRow>
                    <DetailText isLabel>
                      Model
                    </DetailText>
                    <DetailText>
                      {activeGamepad.modelInfo?.name || 'Unknown'}
                    </DetailText>
                  </ControllerDetailRow>
                    
                  <ControllerDetailRow>
                    <DetailText isLabel>
                      Manufacturer
                    </DetailText>
                    <DetailText>
                      {activeGamepad.modelInfo?.manufacturer || 'Unknown'}
                    </DetailText>
                  </ControllerDetailRow>
                    
                  <ControllerDetailRow>
                    <DetailText isLabel>
                      Controller ID
                    </DetailText>
                    <DetailText>
                      {activeGamepad.id}
                    </DetailText>
                  </ControllerDetailRow>
                    
                  <ControllerDetailRow>
                    <DetailText isLabel>
                      Mapping
                    </DetailText>
                    <DetailText>
                      {activeGamepad.mapping}
                    </DetailText>
                  </ControllerDetailRow>
                    
                  <ControllerDetailRow>
                    <DetailText isLabel>
                      Features
                    </DetailText>
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
            
            {activeTab === 'diagnostics' && activeGamepad && (
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
            
            {activeTab === 'haptic' && activeGamepad && (
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
            
            {activeTab === 'profiles' && activeGamepad && (
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
            
            {activeTab === 'identifier' && activeGamepad && (
              <TabContent
                key="identifier"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ControllerIdentifierTest gamepad={activeGamepad} />
              </TabContent>
            )}
            
            {activeTab === 'advanced' && activeGamepad && (
              <TabContent
                key="advanced"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Sound Settings */}
                <SoundSettings 
                  settings={soundSettings}
                  onSettingsChange={setSoundSettings}
                  onTestSound={playButtonSound}
                />
                
                {/* Button Press Counter */}
                <ButtonPressCounter 
                  buttons={activeGamepad.buttons}
                  controllerType={activeGamepad.type}
                />
                
                {/* Battery Indicator (if WebHID connected) */}
                {webHID.connected && (
                  <div style={{ marginBottom: theme.space.lg }}>
                    <h3 style={{ color: theme.colors.primary, marginBottom: theme.space.md }}>Battery Status</h3>
                    <BatteryIndicator battery={webHID.battery} />
                  </div>
                )}
                
                {/* Motion Sensors */}
                <MotionSensors 
                  motion={webHID.motion}
                  connected={webHID.connected}
                  supported={webHID.supported}
                  onConnect={webHID.connect}
                  onResetOrientation={webHID.resetOrientation}
                />
                
                {/* Touchpad */}
                <TouchpadVisualizer 
                  touchpad={webHID.touchpad}
                  connected={webHID.connected}
                />
                
                {/* LED Controller */}
                <LEDController 
                  led={webHID.led}
                  connected={webHID.connected}
                  onSetColor={webHID.setLEDColor}
                />
              </TabContent>
            )}
          </AnimatePresence>
          
          <ButtonContainer>
            <ActionButton 
              onClick={() => exportControllerDataUtil(activeGamepad)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <span>
                <i className="fas fa-download" />
              </span>
              Export Controller Data
            </ActionButton>
          </ButtonContainer>
        </ControllerSection>
      </>
    );
  };
  
  return (
    <TestContainer>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Controller Test
      </Title>
      
      {renderContent()}
    </TestContainer>
  );
};

export default Test;
