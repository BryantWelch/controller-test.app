import { useState, useEffect, useRef } from 'react';
import { identifyControllerModel } from '../data/controllerDatabase';

// Define controller types to match the types in controllerDatabase.ts
export enum ControllerType {
  XBOX = 'xbox',
  PLAYSTATION = 'playstation',
  NINTENDO = 'nintendo',
  STADIA = 'stadia',
  STEAM = 'steam',
  GENERIC = 'generic',
  RACING = 'racing',
  PREMIUM = 'premium',
  ARCADE = 'arcade'
}

// Define the GamepadHapticActuator interface
interface GamepadHapticActuator {
  type: string;
  playEffect?: (type: string, params: { duration: number; strongMagnitude: number; weakMagnitude: number; startDelay?: number }) => Promise<boolean>;
  pulse?: (strongMagnitude: number, weakMagnitude: number, duration: number) => Promise<boolean>;
}

// Define interfaces for non-standard gamepad properties
interface GamepadWithHaptics {
  hapticActuators?: GamepadHapticActuator[];
}

interface GamepadWithVibration {
  vibrationActuator?: GamepadHapticActuator;
}

// Define button state interface
export interface ButtonState {
  pressed: boolean;
  touched: boolean;
  value: number;
}

// Define model info interface
export interface ModelInfo {
  model: string;
  manufacturer: string;
  type?: string;
  name?: string; // Added for compatibility with ControllerProfileManager
  features?: string[]; // Added for compatibility with ControllerIdentifierTest
}

// Define gamepad state interface
export interface GamepadState {
  connected: boolean;
  id: string;
  index: number;
  mapping: string;
  timestamp: number;
  type?: ControllerType;
  buttons: ButtonState[];
  axes: number[];
  stickDrift?: {
    leftStick: {
      detected: boolean;
      value: { x: number; y: number };
    };
    rightStick: {
      detected: boolean;
      value: { x: number; y: number };
    };
  };
  deadZones?: {
    leftStick: number;
    rightStick: number;
  };
  pollingData?: {
    rate: number;
    samples: number[];
    average: number;
  };
  pollingRate?: number;
  latencyData?: {
    lastInputTime: number;
    currentLatency: number;
    averageLatency: number;
    samples: number[];
  };
  inputLatency?: number;
  modelInfo: ModelInfo;
  hapticCapabilities: {
    supported: boolean;
    actuator: GamepadHapticActuator | null;
    actuators: GamepadHapticActuator[];
  };
  browserCompatibility: {
    name: string;
    version: string;
    fullSupport: boolean;
    limitations: string[];
    gamepadApiSupported: boolean;
    specificIssues: string[];
  };
  vibrationActuator?: GamepadHapticActuator;
}

// Detect browser information with enhanced error handling
const detectBrowser = (): {
  name: string;
  version: string;
  fullSupport: boolean;
  limitations: string[];
  gamepadApiSupported: boolean;
  hapticFeedbackSupported: boolean;
  pollingRateSupported: boolean;
  specificIssues: string[];
} => {
  try {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let version = "Unknown";
    let fullSupport = false;
    let limitations: string[] = [];
    let gamepadApiSupported = false;
    let hapticFeedbackSupported = false;
    let pollingRateSupported = false;
    let specificIssues: string[] = [];

    // First check if the Gamepad API is available at all
    if (!navigator.getGamepads && !("getGamepads" in navigator)) {
      limitations.push("Gamepad API is not supported in this browser");
      specificIssues.push("navigator.getGamepads is not available");
      return {
        name: "Unknown",
        version: "Unknown",
        fullSupport: false,
        limitations,
        gamepadApiSupported: false,
        hapticFeedbackSupported: false,
        pollingRateSupported: false,
        specificIssues
      };
    }

    // Detect browser
    if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1) {
      browserName = "Chrome";
      const match = userAgent.match(/Chrome\/(\d+)/);
      version = match ? match[1] : "Unknown";
      const versionNum = parseInt(version);
      fullSupport = versionNum >= 35;
      gamepadApiSupported = versionNum >= 35;
      hapticFeedbackSupported = versionNum >= 68; // Chrome 68+ has better haptic feedback support
      pollingRateSupported = versionNum >= 35;
      
      if (versionNum < 35) {
        limitations.push("Gamepad API not fully supported in Chrome " + version);
        specificIssues.push("Chrome version too old for Gamepad API (need 35+)");
      } else if (versionNum < 68) {
        limitations.push("Limited haptic feedback support in Chrome " + version);
        specificIssues.push("Chrome version has limited haptic feedback (need 68+)");
      }
    } else if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      const match = userAgent.match(/Firefox\/(\d+)/);
      version = match ? match[1] : "Unknown";
      const versionNum = parseInt(version);
      fullSupport = versionNum >= 29;
      gamepadApiSupported = versionNum >= 29;
      hapticFeedbackSupported = versionNum >= 59; // Firefox 59+ has some haptic support
      pollingRateSupported = versionNum >= 29;
      
      if (versionNum < 29) {
        limitations.push("Gamepad API not fully supported in Firefox " + version);
        specificIssues.push("Firefox version too old for Gamepad API (need 29+)");
      } else {
        limitations.push("Firefox has limited haptic feedback support");
        specificIssues.push("Firefox has partial implementation of vibration API");
      }
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
      browserName = "Safari";
      const match = userAgent.match(/Version\/(\d+)/);
      version = match ? match[1] : "Unknown";
      const versionNum = parseInt(version);
      fullSupport = versionNum >= 10.1;
      gamepadApiSupported = versionNum >= 10.1;
      hapticFeedbackSupported = false; // Safari doesn't support haptic feedback
      pollingRateSupported = versionNum >= 10.1;
      
      if (versionNum < 10.1) {
        limitations.push("Gamepad API not supported in Safari " + version);
        specificIssues.push("Safari version too old for Gamepad API (need 10.1+)");
      }
      
      limitations.push("Safari has no haptic feedback support");
      specificIssues.push("Safari does not implement vibration API");
    } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
      browserName = "Edge";
      const match = userAgent.match(/Edge\/(\d+)|Edg\/(\d+)/);
      version = match ? (match[1] || match[2]) : "Unknown";
      const versionNum = parseInt(version);
      fullSupport = versionNum >= 12;
      gamepadApiSupported = versionNum >= 12;
      hapticFeedbackSupported = versionNum >= 79; // Chromium-based Edge
      pollingRateSupported = versionNum >= 12;
      
      if (versionNum < 79) {
        limitations.push("Edge has limited haptic feedback support in version " + version);
        specificIssues.push("Legacy Edge has limited vibration API support");
      }
    } else {
      // Unknown browser
      limitations.push("Unknown browser, compatibility cannot be guaranteed");
      specificIssues.push("Browser not recognized, assuming limited support");
      gamepadApiSupported = !!navigator.getGamepads; // Check if the API exists
      hapticFeedbackSupported = false; // Assume no support
      pollingRateSupported = !!navigator.getGamepads; // Assume basic support if API exists
    }

    // Test if the Gamepad API actually works
    try {
      const gamepads = navigator.getGamepads();
      if (!gamepads) {
        gamepadApiSupported = false;
        limitations.push("Gamepad API returned null or undefined");
        specificIssues.push("navigator.getGamepads() returned null or undefined");
      }
    } catch (error) {
      gamepadApiSupported = false;
      limitations.push("Error accessing Gamepad API");
      specificIssues.push(`Error when calling getGamepads: ${error instanceof Error ? error.message : String(error)}`);
    }

    return {
      name: browserName,
      version,
      fullSupport,
      limitations,
      gamepadApiSupported,
      hapticFeedbackSupported,
      pollingRateSupported,
      specificIssues
    };
  } catch (error) {
    // Fallback for any unexpected errors in the detection process
    console.error("Error detecting browser compatibility:", error);
    return {
      name: "Unknown (Detection Failed)",
      version: "Unknown",
      fullSupport: false,
      limitations: ["Browser detection failed", "Functionality may be limited"],
      gamepadApiSupported: false,
      hapticFeedbackSupported: false,
      pollingRateSupported: false,
      specificIssues: [`Detection error: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
};

// Helper function to convert string type to ControllerType enum
const stringToControllerType = (type: string): ControllerType => {
  switch (type) {
    case 'xbox':
      return ControllerType.XBOX;
    case 'playstation':
      return ControllerType.PLAYSTATION;
    case 'nintendo':
      return ControllerType.NINTENDO;
    case 'stadia':
      return ControllerType.STADIA;
    case 'steam':
      return ControllerType.STEAM;
    case 'racing':
      return ControllerType.RACING;
    case 'premium':
      return ControllerType.PREMIUM;
    case 'arcade':
      return ControllerType.ARCADE;
    default:
      return ControllerType.GENERIC;
  }
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
const calculatePollingRate = (timestamps: number[]): number => {
  if (timestamps.length < 2) return 0;
  
  const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
  const frameCount = timestamps.length - 1;
  
  if (timeSpan <= 0) return 0;
  
  // Convert to Hz (frames per second)
  return Math.round((frameCount / timeSpan) * 1000);
};

// Calculate average latency
const calculateAverageLatency = (latencies: number[]): number => {
  if (latencies.length === 0) return 0;
  
  return latencies.reduce((sum, val) => sum + val, 0) / latencies.length;
};

// Detect haptic capabilities of a gamepad
function detectHapticCapabilities(gamepad: Gamepad): {
  supported: boolean;
  actuator: GamepadHapticActuator | null;
  actuators: GamepadHapticActuator[];
} {
  // Cast to unknown first to avoid TypeScript errors
  const gamepadWithVibration = gamepad as unknown as GamepadWithVibration;
  const gamepadWithHaptics = gamepad as unknown as GamepadWithHaptics;
  const supported = !!gamepadWithVibration.vibrationActuator || !!gamepadWithHaptics.hapticActuators;
  const actuators: GamepadHapticActuator[] = [];
  let primaryActuator: GamepadHapticActuator | null = null;
  
  try {
    // Check for vibrationActuator (standard)
    const gamepadWithVibration = gamepad as unknown as GamepadWithVibration;
    if (gamepadWithVibration.vibrationActuator) {
      actuators.push(gamepadWithVibration.vibrationActuator);
      primaryActuator = gamepadWithVibration.vibrationActuator;
    }
    
    // Check for hapticActuators (non-standard)
    const gamepadWithHaptics = gamepad as unknown as GamepadWithHaptics;
    if (gamepadWithHaptics.hapticActuators && gamepadWithHaptics.hapticActuators.length) {
      actuators.push(...gamepadWithHaptics.hapticActuators);
      if (!primaryActuator) {
        primaryActuator = gamepadWithHaptics.hapticActuators[0];
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
// These helper functions are now used directly inline where needed

export const useGamepad = (deadzone: number = 0.05) => {
  // Define isSupported state at the top of the hook to avoid reference errors
  const [isSupported, setIsSupported] = useState<boolean>(true);
  
  const [gamepads, setGamepads] = useState<GamepadState[]>([]);
  const [activeGamepad, setActiveGamepad] = useState<GamepadState | null>(null);
  const animationRef = useRef<number | null>(null);
  const timestampsRef = useRef<number[]>([]);
  const inputTimestampsRef = useRef<{ [key: string]: number }>({});
  const latencySamplesRef = useRef<number[]>([]);
  const browserInfo = useRef(detectBrowser());
  // Create a ref to store the current activeGamepad value to avoid dependency issues
  const activeGamepadRef = useRef<GamepadState | null>(null);
  
  // Check if Gamepad API is supported with enhanced error handling
  useEffect(() => {
    try {
      // Check if the Gamepad API exists
      if (!navigator.getGamepads && !("getGamepads" in navigator)) {
        console.error("Gamepad API is not supported in this browser");
        setIsSupported(false);
        return;
      }
      
      // Check if the browser info indicates API support
      if (!browserInfo.current.gamepadApiSupported) {
        console.warn("Browser detected as not supporting Gamepad API:", 
          browserInfo.current.specificIssues.join(", "));
        setIsSupported(false);
        return;
      }
      
      // Try to access the API to confirm it works
      try {
        const gamepads = navigator.getGamepads();
        if (gamepads === null || gamepads === undefined) {
          throw new Error("getGamepads() returned null or undefined");
        }
        // Successfully accessed the API
        setIsSupported(true);
      } catch (error) {
        console.error("Error accessing Gamepad API:", error);
        setIsSupported(false);
      }
    } catch (error) {
      console.error("Unexpected error checking Gamepad API support:", error);
      setIsSupported(false);
    }
  }, []);

  // Initialize gamepads on mount with enhanced error handling
  useEffect(() => {
    // No need to check isSupported here as it's already defined at the top
    
    // Create a polling interval to detect controllers even if events don't fire
    const pollInterval = setInterval(() => {
      try {
        const navigatorGamepads = navigator.getGamepads();
        if (!navigatorGamepads) return;
        
        // Check if we have any connected gamepads that aren't in our state
        let newGamepadDetected = false;
        for (let i = 0; i < navigatorGamepads.length; i++) {
          const gamepad = navigatorGamepads[i];
          if (gamepad && gamepad.connected) {
            const existingGamepad = gamepads.find(g => g.index === gamepad.index);
            if (!existingGamepad) {
              console.log('Polling detected new gamepad:', gamepad.id);
              newGamepadDetected = true;
              // Simulate a connection event
              handleGamepadConnected({ gamepad } as GamepadEvent);
            }
          }
        }
        
        // If we detected new gamepads, reinitialize
        if (newGamepadDetected) {
          initializeGamepads();
        }
      } catch (error) {
        console.error('Error in gamepad polling:', error);
      }
    }, 1000); // Poll every second
    
    const initializeGamepads = async () => {
      try {
        const navigatorGamepads = navigator.getGamepads();
        if (!navigatorGamepads) {
          console.error("Failed to get gamepads: navigator.getGamepads() returned null or undefined");
          return;
        }
        
        const initialGamepads: GamepadState[] = [];
        
        for (let i = 0; i < navigatorGamepads.length; i++) {
          const gamepad = navigatorGamepads[i];
          
          if (!gamepad) continue;
          
          try {
            // Try to identify controller model
            const controllerModel = await identifyControllerModel(gamepad.id);
            let modelInfo: ModelInfo = { model: 'Generic', manufacturer: 'Unknown' };
            let controllerType = ControllerType.GENERIC;
            
            if (controllerModel) {
              modelInfo = {
                model: controllerModel.name, // Use name from ControllerModel
                manufacturer: controllerModel.manufacturer,
                type: controllerModel.type,
                name: controllerModel.name // Store name for compatibility
              };
              controllerType = stringToControllerType(controllerModel.type);
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
            
            initialGamepads.push(extendedGamepad);
          } catch (error) {
            console.error(`Error processing gamepad at index ${i}:`, error);
            // Continue with other gamepads even if one fails
          }
        }
      
        setGamepads(initialGamepads);
      
        // Set first connected gamepad as active if available
        if (initialGamepads.length > 0) {
          setActiveGamepad(initialGamepads[0]);
        } else {
          console.warn("No gamepads detected during initialization");
        }
      } catch (error) {
        console.error("Error initializing gamepads:", error);
      }
    };
    
    initializeGamepads();
    
    // Set up event listeners for gamepad connections
    const handleGamepadConnected = async (event: GamepadEvent) => {
      console.log('Gamepad connected:', event.gamepad);
      console.log('Gamepad ID:', event.gamepad.id);
      console.log('Gamepad mapping:', event.gamepad.mapping);
      console.log('Gamepad buttons:', event.gamepad.buttons.length);
      console.log('Gamepad axes:', event.gamepad.axes.length);
      
      try {
        // Get the newly connected gamepad
        const gamepad = event.gamepad;
        if (!gamepad) return;
        
        // Try to identify controller model
        const controllerModel = await identifyControllerModel(gamepad.id);
        let modelInfo: ModelInfo = { model: 'Generic', manufacturer: 'Unknown' };
        let controllerType = ControllerType.GENERIC;
        
        if (controllerModel) {
          modelInfo = {
            model: controllerModel.name,
            manufacturer: controllerModel.manufacturer,
            type: controllerModel.type,
            name: controllerModel.name
          };
          controllerType = stringToControllerType(controllerModel.type);
        }
        
        const hapticCapabilities = detectHapticCapabilities(gamepad);
        
        // Create extended gamepad state
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
        
        // Update gamepads state with the new gamepad
        setGamepads(prevGamepads => {
          // Check if this gamepad already exists in the array
          const existingIndex = prevGamepads.findIndex(g => g.index === gamepad.index);
          if (existingIndex >= 0) {
            // Replace the existing gamepad
            const updatedGamepads = [...prevGamepads];
            updatedGamepads[existingIndex] = extendedGamepad;
            return updatedGamepads;
          } else {
            // Add the new gamepad
            return [...prevGamepads, extendedGamepad];
          }
        });
        
        // If no active gamepad is set, set this one as active
        if (!activeGamepad) {
          setActiveGamepad(extendedGamepad);
        }
      } catch (error) {
        console.error('Error processing newly connected gamepad:', error);
      }
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
      // Clean up event listeners
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      
      // Clear the polling interval
      clearInterval(pollInterval);
    };
  }, [activeGamepad, deadzone, gamepads]); // Include gamepads in dependencies for polling

  // Keep activeGamepadRef in sync with activeGamepad state
  useEffect(() => {
    activeGamepadRef.current = activeGamepad;
  }, [activeGamepad]);

  // Update gamepad state on animation frame with enhanced error handling
  useEffect(() => {
    // No need to check isSupported here as it's already defined at the top
    
    // Reset refs when the effect runs to prevent stale data
    timestampsRef.current = [];
    inputTimestampsRef.current = {};
    latencySamplesRef.current = [];

    const updateGamepadState = async () => {
      try {
        const connectedGamepads = navigator.getGamepads();
        if (!connectedGamepads) {
          console.error("Failed to get gamepads in animation frame");
          animationRef.current = requestAnimationFrame(updateGamepadState);
          return;
        }
        
        const updatedGamepads: GamepadState[] = [];
        const currentTimestamp = performance.now();
        
        // Add timestamp for polling rate calculation
        timestampsRef.current.push(currentTimestamp);
        if (timestampsRef.current.length > 120) { // Keep last 2 seconds of data at 60fps
          timestampsRef.current.shift();
        }

        // Process all connected gamepads
        for (let i = 0; i < connectedGamepads.length; i++) {
          try {
            const gamepad = connectedGamepads[i];
            if (!gamepad || !gamepad.connected) continue;
            
            // Find existing gamepad in our state
            const existingGamepad = gamepads.find(g => g.index === gamepad.index);
            
            // Process buttons with enhanced error handling
            const buttons: ButtonState[] = [];
            try {
              if (gamepad.buttons && gamepad.buttons.length > 0) {
                for (let j = 0; j < gamepad.buttons.length; j++) {
                  const button = gamepad.buttons[j];
                  const buttonState: ButtonState = {
                    pressed: button.pressed,
                    touched: button.touched,
                    value: button.value,
                  };
                  
                  // Calculate button latency if pressed
                  if (button.pressed) {
                    const buttonKey = `button-${i}-${j}`;
                    if (!inputTimestampsRef.current[buttonKey]) {
                      inputTimestampsRef.current[buttonKey] = performance.now();
                    } else {
                      const latency = performance.now() - inputTimestampsRef.current[buttonKey];
                      latencySamplesRef.current.push(latency);
                      if (latencySamplesRef.current.length > 30) {
                        latencySamplesRef.current.shift();
                      }
                    }
                  } else {
                    // Reset timestamp when button is released
                    const buttonKey = `button-${i}-${j}`;
                    delete inputTimestampsRef.current[buttonKey];
                  }
                  
                  buttons.push(buttonState);
                }
              }
            } catch (error) {
              console.error(`Error processing buttons for gamepad ${i}:`, error);
              // Continue with empty buttons array
            }
            
            // Process axes with enhanced error handling
            const axes: number[] = [];
            try {
              if (gamepad.axes && gamepad.axes.length > 0) {
                for (let j = 0; j < gamepad.axes.length; j++) {
                  let value = gamepad.axes[j];
                  
                  // Apply deadzone
                  if (Math.abs(value) < deadzone) {
                    value = 0;
                  }
                  
                  axes.push(value);
                }
              }
            } catch (error) {
              console.error(`Error processing axes for gamepad ${i}:`, error);
              // Continue with empty axes array
            }
            
            // Check for haptic feedback support with enhanced error handling
            let hapticSupported = false;
            let hapticActuator: GamepadHapticActuator | null = null;
            let hapticActuators: GamepadHapticActuator[] = [];
            
            try {
              // Check for standard haptic actuator
              const gamepadWithHaptics = gamepad as unknown as GamepadWithHaptics;
              if (gamepadWithHaptics.hapticActuators && gamepadWithHaptics.hapticActuators.length > 0) {
                hapticSupported = true;
                hapticActuators = gamepadWithHaptics.hapticActuators;
                hapticActuator = hapticActuators[0];
              }
              // Check for non-standard vibration actuator (older API)
              else if ((gamepad as unknown as GamepadWithVibration).vibrationActuator) {
                hapticSupported = true;
                const vibrationActuator = (gamepad as unknown as GamepadWithVibration).vibrationActuator;
                if (vibrationActuator) {
                  hapticActuator = {
                    type: vibrationActuator.type || 'unknown',
                    pulse: vibrationActuator.pulse ? vibrationActuator.pulse.bind(vibrationActuator) : undefined,
                  };
                  hapticActuators = [hapticActuator];
                }
              }
            } catch (error) {
              console.error(`Error checking haptic support for gamepad ${i}:`, error);
              // Continue with haptic support disabled
              hapticSupported = false;
              hapticActuator = null;
              hapticActuators = [];
            }
            
            // Get model info with enhanced error handling
            let modelInfo: ModelInfo = { model: 'Generic', manufacturer: 'Unknown' };
            let controllerType = ControllerType.GENERIC;
            
            try {
              // If we already have model info from an existing gamepad, use that
              if (existingGamepad && existingGamepad.modelInfo) {
                modelInfo = existingGamepad.modelInfo;
                controllerType = existingGamepad.type || ControllerType.GENERIC;
              } else {
                // Otherwise try to identify the controller
                const controllerInfo = identifyControllerModel(gamepad.id);
                if (controllerInfo) {
                  modelInfo = {
                    model: controllerInfo.name,
                    manufacturer: controllerInfo.manufacturer,
                    type: controllerInfo.type,
                    name: controllerInfo.name,
                    features: controllerInfo.features || []
                  };
                  controllerType = stringToControllerType(controllerInfo.type);
                }
              }
            } catch (error) {
              console.error(`Error getting model info for gamepad ${i}:`, error);
              // Continue with default model info
            }
            
            // Detect stick drift
            const stickDrift = detectStickDrift(axes, existingGamepad?.deadZones?.leftStick || deadzone);
            
            // Create updated gamepad state
            const updatedGamepad: GamepadState = {
              connected: true,
              id: gamepad.id,
              index: gamepad.index,
              mapping: gamepad.mapping,
              timestamp: gamepad.timestamp,
              buttons,
              axes,
              type: controllerType,
              stickDrift,
              deadZones: existingGamepad?.deadZones || {
                leftStick: deadzone,
                rightStick: deadzone
              },
              pollingData: {
                rate: calculatePollingRate(timestampsRef.current),
                samples: [...timestampsRef.current],
                average: calculatePollingRate(timestampsRef.current)
              },
              latencyData: {
                lastInputTime: Math.max(...Object.values(inputTimestampsRef.current), 0),
                currentLatency: latencySamplesRef.current[latencySamplesRef.current.length - 1] || 0,
                averageLatency: calculateAverageLatency(latencySamplesRef.current),
                samples: [...latencySamplesRef.current]
              },
              modelInfo,
              hapticCapabilities: {
                supported: hapticSupported,
                actuator: hapticActuator,
                actuators: hapticActuators,
              },
              browserCompatibility: browserInfo.current,
              vibrationActuator: (gamepad as unknown as GamepadWithVibration).vibrationActuator,
            };
          updatedGamepads.push(updatedGamepad);
          } catch (error) {
            console.error(`Error processing gamepad ${i} in animation frame:`, error);
            // Continue with other gamepads even if one fails
          }
        }
        
        setGamepads(updatedGamepads);
        
        // Update active gamepad if it exists in the updated list
        if (activeGamepad) {
          const updatedActiveGamepad = updatedGamepads.find(g => g.index === activeGamepad.index);
          if (updatedActiveGamepad) {
            setActiveGamepad(updatedActiveGamepad);
          }
        }
      } catch (error) {
        console.error("Error updating gamepad state:", error);
      }
      
      animationRef.current = requestAnimationFrame(updateGamepadState);
    };

    animationRef.current = requestAnimationFrame(updateGamepadState);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Clear all refs on cleanup to prevent memory leaks
      timestampsRef.current = [];
      inputTimestampsRef.current = {};
      latencySamplesRef.current = [];
    };
  }, [activeGamepad, deadzone, gamepads]); // Include dependencies used in the effect

  // Set a gamepad as active
  const setGamepadActive = (index: number) => {
    const gamepad = gamepads.find(g => g.index === index);
    if (gamepad) {
      setActiveGamepad(gamepad);
    }
  };

  // Update deadzone settings
  const updateDeadZones = (leftStick: number, rightStick: number): void => {
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

  // Helper function for PlayStation controllers
  const triggerPlaystationHapticFeedback = (
    gamepad: GamepadState,
    duration: number,
    strongMagnitude: number,
    weakMagnitude: number
  ): boolean => {
    try {
      const gamepadWithHaptics = gamepad as unknown as GamepadWithHaptics;
      if (gamepadWithHaptics.hapticActuators && gamepadWithHaptics.hapticActuators.length > 0) {
        const actuator = gamepadWithHaptics.hapticActuators[0];
        if (actuator && actuator.pulse) {
          actuator.pulse(strongMagnitude, weakMagnitude, duration);
          return true;
        }
      }
    } catch (error) {
      console.error('Error with PlayStation haptic feedback:', error);
    }
    return false;
  };

  // Helper function for Xbox controllers
  const triggerXboxHapticFeedback = (
    gamepad: GamepadState,
    duration: number,
    strongMagnitude: number,
    weakMagnitude: number
  ): boolean => {
    try {
      const gamepadWithVibration = gamepad as unknown as GamepadWithVibration;
      if (gamepadWithVibration.vibrationActuator &&
        typeof gamepadWithVibration.vibrationActuator.playEffect === 'function') {
        gamepadWithVibration.vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: duration,
          weakMagnitude: weakMagnitude,
          strongMagnitude: strongMagnitude
        });
        return true;
      }
    } catch (error) {
      console.error('Error with Xbox haptic feedback:', error);
    }
    return false;
  };

  // Helper function for Stadia controllers
  const triggerStadiaHapticFeedback = (
    gamepad: GamepadState,
    duration: number,
    strongMagnitude: number,
    weakMagnitude: number
  ): boolean => {
    try {
      // Try vibrationActuator first
      const gamepadWithVibration = gamepad as unknown as GamepadWithVibration;
      if (gamepadWithVibration.vibrationActuator &&
        typeof gamepadWithVibration.vibrationActuator.playEffect === 'function') {
        gamepadWithVibration.vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: duration,
          weakMagnitude: weakMagnitude,
          strongMagnitude: strongMagnitude
        });
        return true;
      }
      
      // Then try hapticActuators
      const gamepadWithHaptics = gamepad as unknown as GamepadWithHaptics;
      if (gamepadWithHaptics.hapticActuators && gamepadWithHaptics.hapticActuators.length > 0) {
        const actuator = gamepadWithHaptics.hapticActuators[0];
        if (actuator && actuator.pulse) {
          actuator.pulse(strongMagnitude, weakMagnitude, duration);
          return true;
        }
      }
    } catch (error) {
      console.error('Error with Stadia haptic feedback:', error);
    }
    return false;
  };

  // Generic haptic feedback for all controller types
  const triggerGenericHapticFeedback = (
    gamepad: GamepadState,
    duration: number,
    strongMagnitude: number,
    weakMagnitude: number
  ): boolean => {
    try {
      // Method 1: Try the standard vibrationActuator API
      const gamepadWithVibration = gamepad as unknown as GamepadWithVibration;
      if (gamepadWithVibration.vibrationActuator &&
        typeof gamepadWithVibration.vibrationActuator.playEffect === 'function') {
        gamepadWithVibration.vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: duration,
          weakMagnitude: weakMagnitude,
          strongMagnitude: strongMagnitude
        });
        return true;
      }
      
      // Method 2: Try the hapticActuators array
      const gamepadWithHaptics = gamepad as unknown as GamepadWithHaptics;
      if (gamepadWithHaptics.hapticActuators && gamepadWithHaptics.hapticActuators.length > 0) {
        const actuator = gamepadWithHaptics.hapticActuators[0];
        if (actuator && actuator.pulse) {
          actuator.pulse(strongMagnitude, weakMagnitude, duration);
          return true;
        }
      }
    } catch (error) {
      console.error('Error with generic haptic feedback:', error);
    }
    return false;
  };
  
  // Trigger haptic feedback with enhanced support for different controller types
  const triggerHapticFeedback = (
    duration: number = 100,
    strongMagnitude: number = 1.0,
    weakMagnitude: number = 1.0
  ): boolean => {
    if (!activeGamepad) {
      console.warn("Cannot trigger haptic feedback: no active gamepad");
      return false;
    }

    try {
      // Special handling for different controller types
      if (activeGamepad.type === ControllerType.PLAYSTATION) {
        return triggerPlaystationHapticFeedback(activeGamepad, duration, strongMagnitude, weakMagnitude);
      } else if (activeGamepad.type === ControllerType.XBOX) {
        return triggerXboxHapticFeedback(activeGamepad, duration, strongMagnitude, weakMagnitude);
      } else if (activeGamepad.type === ControllerType.STADIA) {
        return triggerStadiaHapticFeedback(activeGamepad, duration, strongMagnitude, weakMagnitude);
      }
      
      // For other controllers, try all methods in sequence
      return triggerGenericHapticFeedback(activeGamepad, duration, strongMagnitude, weakMagnitude);
    } catch (error) {
      console.error('Unexpected error triggering haptic feedback:', error);
      return false;
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
