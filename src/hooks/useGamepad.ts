import { useState, useEffect, useRef } from 'react';
import { identifyControllerModel, ControllerModel } from '../data/controllerDatabase';
import { enhancedControllerIdentification } from '../data/gamepadVendorProductDatabase';

// Define controller types
export enum ControllerType {
  XBOX = 'xbox',
  PLAYSTATION = 'playstation',
  GENERIC = 'generic',
}

// Define gamepad state interface
export interface GamepadState {
  connected: boolean;
  id: string;
  index: number;
  mapping: string;
  timestamp: number;
  type: ControllerType;
  buttons: {
    pressed: boolean;
    touched: boolean;
    value: number;
  }[];
  axes: number[];
  stickDrift: {
    leftStick: {
      detected: boolean;
      value: { x: number; y: number };
    };
    rightStick: {
      detected: boolean;
      value: { x: number; y: number };
    };
  };
  deadZones: {
    leftStick: number;
    rightStick: number;
  };
  pollingData: {
    rate: number;
    samples: number[];
    average: number;
  };
  latencyData: {
    lastInputTime: number;
    currentLatency: number;
    averageLatency: number;
    samples: number[];
  };
  modelInfo: ControllerModel | null;
  browserCompatibility: {
    name: string;
    version: string;
    fullSupport: boolean;
    limitations: string[];
  };
  hapticCapabilities: {
    supported: boolean;
    actuator: GamepadHapticActuator | null;
    actuators: GamepadHapticActuator[];
  };
  vibrationActuator?: any;
}

// Define the extended gamepad type with additional properties
export interface GamepadWithExtras {
  // Include all Gamepad properties
  id: string;
  index: number;
  connected: boolean;
  mapping: string;
  buttons: GamepadButton[];
  axes: number[];
  timestamp: number;
  vibrationActuator: any;
  
  // Additional properties
  type: string;
  modelInfo?: ControllerModel;
  stickDrift: {
    leftStick: {
      detected: boolean;
      value: { x: number; y: number };
    };
    rightStick: {
      detected: boolean;
      value: { x: number; y: number };
    };
  };
  deadZones: {
    leftStick: number;
    rightStick: number;
  };
  pollingData: {
    timestamps: number[];
    rate: number;
  };
  latencyData: {
    timestamps: number[];
    averageLatency: number;
  };
  hapticCapabilities: {
    supported: boolean;
    actuators: GamepadHapticActuator[];
    actuator?: GamepadHapticActuator;
  };
  browserCompatibility: {
    name: string;
    version: string;
    fullSupport: boolean;
    limitations: string[];
  };
  hapticActuators?: any;
}

// Detect browser information
const detectBrowser = (): { name: string; version: string; fullSupport: boolean; limitations: string[] } => {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";
  let version = "Unknown";
  let fullSupport = false;
  let limitations: string[] = [];

  // Detect browser
  if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Chrome";
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : "Unknown";
    fullSupport = parseInt(version) >= 35;
    
    if (parseInt(version) < 35) {
      limitations.push("Gamepad API not fully supported in this Chrome version");
    }
  } else if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Firefox";
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : "Unknown";
    fullSupport = parseInt(version) >= 29;
    
    if (parseInt(version) < 29) {
      limitations.push("Gamepad API not fully supported in this Firefox version");
    }
  } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
    browserName = "Safari";
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : "Unknown";
    fullSupport = parseInt(version) >= 10.1;
    
    if (parseInt(version) < 10.1) {
      limitations.push("Gamepad API not fully supported in this Safari version");
    }
    
    limitations.push("Safari has limited haptic feedback support");
  } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
    browserName = "Edge";
    const match = userAgent.match(/Edge\/(\d+)|Edg\/(\d+)/);
    version = match ? (match[1] || match[2]) : "Unknown";
    fullSupport = true;
  }

  // Check for limitations
  if (browserName !== "Chrome" && browserName !== "Edge") {
    limitations.push("Haptic feedback may not be fully supported");
  }

  return { name: browserName, version, fullSupport, limitations };
};

// Detect controller type based on ID
const detectControllerType = (id: string): ControllerType => {
  const lowerCaseId = id.toLowerCase();
  
  if (lowerCaseId.includes('xbox') || lowerCaseId.includes('microsoft')) {
    return ControllerType.XBOX;
  } else if (
    lowerCaseId.includes('playstation') || 
    lowerCaseId.includes('dualshock') || 
    lowerCaseId.includes('dualsense') ||
    lowerCaseId.includes('sony')
  ) {
    return ControllerType.PLAYSTATION;
  }
  
  return ControllerType.GENERIC;
};

// Detect stick drift
const detectStickDrift = (
  axes: readonly number[], 
  deadzone: number = 0.05
): { leftStick: { detected: boolean; value: { x: number; y: number } }; rightStick: { detected: boolean; value: { x: number; y: number } } } => {
  // Left stick is typically axes[0] (x) and axes[1] (y)
  // Right stick is typically axes[2] (x) and axes[3] (y)
  const leftStickX = axes[0] || 0;
  const leftStickY = axes[1] || 0;
  const rightStickX = axes[2] || 0;
  const rightStickY = axes[3] || 0;
  
  return {
    leftStick: {
      detected: Math.abs(leftStickX) > deadzone || Math.abs(leftStickY) > deadzone,
      value: { x: leftStickX, y: leftStickY },
    },
    rightStick: {
      detected: Math.abs(rightStickX) > deadzone || Math.abs(rightStickY) > deadzone,
      value: { x: rightStickX, y: rightStickY },
    },
  };
};

// Calculate polling rate
const calculatePollingRate = (
  timestamps: number[],
  maxSamples: number = 60
): { rate: number; samples: number[]; average: number } => {
  if (timestamps.length < 2) {
    return { rate: 0, samples: [], average: 0 };
  }

  // Calculate time differences between consecutive timestamps
  const timeDiffs: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    const diff = timestamps[i] - timestamps[i - 1];
    if (diff > 0) {
      timeDiffs.push(diff);
    }
  }

  // Keep only the most recent samples
  const recentDiffs = timeDiffs.slice(-maxSamples);

  // Calculate average time difference
  const avgTimeDiff = recentDiffs.reduce((sum, diff) => sum + diff, 0) / recentDiffs.length;

  // Calculate polling rate (polls per second)
  const pollingRate = avgTimeDiff > 0 ? 1000 / avgTimeDiff : 0;

  return {
    rate: Math.round(pollingRate),
    samples: recentDiffs,
    average: avgTimeDiff
  };
};

// Detect haptic capabilities of a gamepad
function detectHapticCapabilities(gamepad: Gamepad): {
  supported: boolean;
  actuator: GamepadHapticActuator | null;
  actuators: GamepadHapticActuator[];
} {
  const supported = !!(gamepad as any).vibrationActuator || !!(gamepad as any).hapticActuators;
  const actuators: GamepadHapticActuator[] = [];
  let primaryActuator: GamepadHapticActuator | null = null;
  
  try {
    // Check for vibrationActuator (standard)
    if ((gamepad as any).vibrationActuator) {
      actuators.push((gamepad as any).vibrationActuator);
      primaryActuator = (gamepad as any).vibrationActuator;
    }
    
    // Check for hapticActuators (non-standard)
    if ((gamepad as any).hapticActuators && (gamepad as any).hapticActuators.length) {
      actuators.push(...(gamepad as any).hapticActuators);
      if (!primaryActuator) {
        primaryActuator = (gamepad as any).hapticActuators[0];
      }
    }
  } catch (error) {
    console.error('Error detecting haptic capabilities:', error);
  }
  
  return {
    supported,
    actuator: primaryActuator,
    actuators
  };
}

// Hook for gamepad functionality
export const useGamepad = (deadzone: number = 0.05) => {
  const [gamepads, setGamepads] = useState<GamepadState[]>([]);
  const [activeGamepad, setActiveGamepad] = useState<GamepadState | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const animationRef = useRef<number | null>(null);
  const timestampsRef = useRef<number[]>([]);
  const inputTimestampsRef = useRef<{ [key: string]: number }>({});
  const latencySamplesRef = useRef<number[]>([]);
  const browserInfo = useRef(detectBrowser());

  // Check if Gamepad API is supported
  useEffect(() => {
    if (!navigator.getGamepads) {
      setIsSupported(false);
    }
  }, []);

  // Initialize gamepads on mount
  useEffect(() => {
    if (!isSupported) return;
    
    const initializeGamepads = async () => {
      const navigatorGamepads = navigator.getGamepads();
      const initialGamepads: GamepadState[] = [];
      
      for (let i = 0; i < navigatorGamepads.length; i++) {
        const gamepad = navigatorGamepads[i];
        
        if (gamepad) {
          const controllerType = detectControllerType(gamepad.id);
          
          // Enhanced controller identification
          let modelInfo: ControllerModel | null = null;
          try {
            // First try the enhanced identification with vendor/product IDs
            const enhancedModel = await enhancedControllerIdentification(gamepad.id);
            if (enhancedModel) {
              modelInfo = enhancedModel;
            } else {
              // Fall back to the regular identification if enhanced fails
              const regularModel = identifyControllerModel(gamepad.id);
              if (regularModel) {
                modelInfo = regularModel;
              }
            }
          } catch (error) {
            console.error('Error identifying controller model:', error);
            const regularModel = identifyControllerModel(gamepad.id);
            if (regularModel) {
              modelInfo = regularModel;
            }
          }
          
          const hapticCapabilities = detectHapticCapabilities(gamepad);
          
          const extendedGamepad: GamepadState = {
            id: gamepad.id,
            index: gamepad.index,
            connected: gamepad.connected,
            mapping: gamepad.mapping,
            timestamp: gamepad.timestamp,
            buttons: gamepad.buttons.map(button => ({
              pressed: button.pressed,
              touched: button.touched,
              value: button.value
            })),
            axes: Array.from(gamepad.axes),
            type: controllerType,
            modelInfo,
            stickDrift: detectStickDrift(gamepad.axes, deadzone),
            deadZones: {
              leftStick: deadzone,
              rightStick: deadzone
            },
            pollingData: {
              rate: 0,
              samples: [],
              average: 0
            },
            latencyData: {
              lastInputTime: Date.now(),
              currentLatency: 0,
              averageLatency: 0,
              samples: []
            },
            hapticCapabilities,
            browserCompatibility: browserInfo.current
          };
          
          initialGamepads[i] = extendedGamepad;
        }
      }
      
      setGamepads(initialGamepads);
      
      // Set the first connected gamepad as active
      const firstConnected = initialGamepads.find(g => g && g.connected);
      if (firstConnected) {
        setActiveGamepad(firstConnected);
      }
    };
    
    initializeGamepads();
    
    // Set up gamepad connection event listeners
    const handleGamepadConnected = (event: GamepadEvent) => {
      console.log('Gamepad connected:', event.gamepad);
    };

    const handleGamepadDisconnected = (event: GamepadEvent) => {
      console.log('Gamepad disconnected:', event.gamepad);
      setGamepads(prevGamepads => 
        prevGamepads.filter(gamepad => gamepad.index !== event.gamepad.index)
      );
      
      if (activeGamepad && activeGamepad.index === event.gamepad.index) {
        setActiveGamepad(null);
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
    
    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [isSupported, deadzone, activeGamepad]);

  // Update gamepad state on animation frame
  useEffect(() => {
    if (!isSupported) return;

    const updateGamepadState = () => {
      const connectedGamepads = navigator.getGamepads();
      const updatedGamepads: GamepadState[] = [];
      const currentTimestamp = performance.now();
      
      // Add timestamp for polling rate calculation
      timestampsRef.current.push(currentTimestamp);
      if (timestampsRef.current.length > 120) { // Keep last 2 seconds of data at 60fps
        timestampsRef.current.shift();
      }

      for (let i = 0; i < connectedGamepads.length; i++) {
        const gamepad = connectedGamepads[i];
        
        if (gamepad) {
          const controllerType = detectControllerType(gamepad.id);
          const stickDrift = detectStickDrift(gamepad.axes, deadzone);
          const pollingData = calculatePollingRate(timestampsRef.current);
          const modelInfo = identifyControllerModel(gamepad.id);
          
          // Check for haptic actuator support
          let hapticActuator = null;
          let hapticSupported = false;
          let hapticActuators: GamepadHapticActuator[] = [];
          
          // Check for haptic actuators
          if ((gamepad as any).hapticActuators && (gamepad as any).hapticActuators.length > 0) {
            // @ts-ignore - GamepadHapticActuator is experimental
            hapticActuator = (gamepad as any).hapticActuators[0];
            hapticSupported = true;
            hapticActuators = (gamepad as any).hapticActuators;
          } else if ((gamepad as any).vibrationActuator) {
            // @ts-ignore
            hapticActuator = (gamepad as any).vibrationActuator;
            hapticSupported = true;
            hapticActuators = [(gamepad as any).vibrationActuator];
          }
          
          const buttonStates = gamepad.buttons.map((button, index) => {
            // Calculate input latency when button state changes
            const buttonKey = `button-${index}`;
            const wasPressed = activeGamepad?.buttons[index]?.pressed || false;
            
            if (button.pressed && !wasPressed) {
              inputTimestampsRef.current[buttonKey] = currentTimestamp;
            } else if (button.pressed) {
              const pressStartTime = inputTimestampsRef.current[buttonKey] || 0;
              if (pressStartTime > 0) {
                const latency = currentTimestamp - pressStartTime;
                latencySamplesRef.current.push(latency);
                
                // Keep only recent samples
                if (latencySamplesRef.current.length > 30) {
                  latencySamplesRef.current.shift();
                }
              }
            }
            
            return {
              pressed: button.pressed,
              touched: button.touched,
              value: button.value,
            };
          });
          
          // Calculate average latency
          const avgLatency = latencySamplesRef.current.length > 0
            ? latencySamplesRef.current.reduce((sum, val) => sum + val, 0) / latencySamplesRef.current.length
            : 0;

          updatedGamepads.push({
            connected: true,
            id: gamepad.id,
            index: gamepad.index,
            mapping: gamepad.mapping,
            timestamp: gamepad.timestamp,
            type: controllerType,
            buttons: buttonStates,
            axes: Array.from(gamepad.axes),
            stickDrift,
            deadZones: {
              leftStick: deadzone,
              rightStick: deadzone,
            },
            pollingData,
            latencyData: {
              lastInputTime: Math.max(...Object.values(inputTimestampsRef.current)),
              currentLatency: latencySamplesRef.current[latencySamplesRef.current.length - 1] || 0,
              averageLatency: avgLatency,
              samples: [...latencySamplesRef.current],
            },
            modelInfo,
            hapticCapabilities: {
              supported: hapticSupported,
              actuator: hapticActuator,
              actuators: hapticActuators,
            },
            browserCompatibility: browserInfo.current,
            vibrationActuator: (gamepad as any).vibrationActuator,
          });
        }
      }

      setGamepads(() => updatedGamepads);
      
      // Set the first gamepad as active if none is selected
      if (updatedGamepads.length > 0 && !activeGamepad) {
        setActiveGamepad(updatedGamepads[0]);
      } else if (activeGamepad && updatedGamepads.length > 0) {
        // Update the active gamepad if it's still connected
        const updatedActiveGamepad = updatedGamepads.find(
          gamepad => gamepad.index === activeGamepad.index
        );
        
        if (updatedActiveGamepad) {
          setActiveGamepad(updatedActiveGamepad);
        }
      }

      animationRef.current = requestAnimationFrame(updateGamepadState);
    };

    animationRef.current = requestAnimationFrame(updateGamepadState);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSupported, deadzone, activeGamepad]);

  // Set a gamepad as active
  const setGamepadActive = (index: number) => {
    const gamepad = gamepads.find(g => g.index === index);
    if (gamepad) {
      setActiveGamepad(gamepad);
    }
  };

  // Trigger haptic feedback
  const triggerHapticFeedback = (
    duration: number = 100,
    strongMagnitude: number = 1.0,
    weakMagnitude: number = 1.0
  ): boolean => {
    if (!activeGamepad) {
      return false;
    }

    try {
      // Method 1: Try the standard vibrationActuator API (Chrome, Edge)
      if ((activeGamepad as any).vibrationActuator && 
          typeof (activeGamepad as any).vibrationActuator.playEffect === 'function') {
        (activeGamepad as any).vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: duration,
          weakMagnitude: weakMagnitude,
          strongMagnitude: strongMagnitude
        });
        return true;
      }
      
      // Method 2: Try the GamepadHapticActuator API (Firefox)
      if (activeGamepad.hapticCapabilities && activeGamepad.hapticCapabilities.supported) {
        if (activeGamepad.hapticCapabilities.actuator) {
          const actuator = activeGamepad.hapticCapabilities.actuator;
          if (typeof (actuator as any).pulse === 'function') {
            (actuator as any).pulse(strongMagnitude, weakMagnitude, duration);
            return true;
          }
        }
      }
      
      // Method 3: Try direct access to haptic actuators array (some implementations)
      const gamepad = navigator.getGamepads()[activeGamepad.index];
      if (gamepad && (gamepad as any).hapticActuators && (gamepad as any).hapticActuators.length > 0) {
        const actuator = (gamepad as any).hapticActuators[0];
        if (typeof actuator.pulse === 'function') {
          actuator.pulse(strongMagnitude, weakMagnitude, duration);
          return true;
        }
      }
      
      console.log('No compatible haptic feedback method found for this browser/controller');
      return false;
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
      return false;
    }
  };

  // Update deadzone settings
  const updateDeadZones = (leftStick: number, rightStick: number) => {
    if (activeGamepad) {
      setActiveGamepad({
        ...activeGamepad,
        deadZones: {
          leftStick,
          rightStick
        }
      });
    }
  };

  return { 
    gamepads, 
    activeGamepad, 
    setGamepadActive, 
    isSupported,
    triggerHapticFeedback,
    updateDeadZones,
    browserInfo: browserInfo.current
  };
};

export default useGamepad;
