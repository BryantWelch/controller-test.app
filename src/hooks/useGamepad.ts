import { useState, useEffect, useRef, useCallback } from 'react';
import { identifyController } from '../data/controllerDatabase';
import {
  ControllerType,
  stringToControllerType,
  detectStickDrift,
  calculateAverageLatency,
  detectHapticCapabilities,
  BrowserCompatibilityInfo
} from '../utils/gamepadUtils';
import { useBrowserCompatibility } from './customHooks/useBrowserCompatibility';
import { useHapticFeedback } from './customHooks/useHapticFeedback';
import { useUpdateLoopTiming } from './customHooks/useUpdateLoopTiming';

// Define the GamepadHapticActuator interface
interface GamepadHapticActuator {
  type: string;
  playEffect?: (type: string, params: { duration: number; strongMagnitude: number; weakMagnitude: number; startDelay?: number }) => Promise<boolean>;
  pulse?: (strongMagnitude: number, weakMagnitude: number, duration: number) => Promise<boolean>;
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
  name?: string;
  features?: string[];
  id?: string;
  identifiers?: string[];
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
    leftStick: { detected: boolean; value: { x: number; y: number } };
    rightStick: { detected: boolean; value: { x: number; y: number } };
  };
  deadZones?: { leftStick: number; rightStick: number };
  pollingData?: { rate: number; samples: readonly number[] };
  latencyData?: {
    lastInputTime: number;
    currentLatency: number;
    averageLatency: number;
    samples: number[];
  };
  modelInfo: ModelInfo;
  hapticCapabilities: {
    supported: boolean;
    actuator: GamepadHapticActuator | null;
    actuators: GamepadHapticActuator[];
  };
  browserCompatibility: BrowserCompatibilityInfo;
}

// Helper to check if gamepad state has meaningfully changed (for reducing re-renders)
const hasGamepadChanged = (prev: GamepadState | null, next: GamepadState | null): boolean => {
  if (!prev && !next) return false;
  if (!prev || !next) return true;
  if (prev.connected !== next.connected) return true;
  if (prev.timestamp !== next.timestamp) return true;
  
  // Check buttons
  for (let i = 0; i < next.buttons.length; i++) {
    if (!prev.buttons[i]) return true;
    if (prev.buttons[i].pressed !== next.buttons[i].pressed) return true;
    if (Math.abs(prev.buttons[i].value - next.buttons[i].value) > 0.01) return true;
  }
  
  // Check axes
  for (let i = 0; i < next.axes.length; i++) {
    if (Math.abs((prev.axes[i] || 0) - (next.axes[i] || 0)) > 0.01) return true;
  }
  
  return false;
};

export const useGamepad = (deadzone: number = 0.05) => {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [activeGamepad, setActiveGamepad] = useState<GamepadState | null>(null);
  
  const animationRef = useRef<number | null>(null);
  const gamepadsRef = useRef<Map<number, GamepadState>>(new Map());
  const activeGamepadRef = useRef<GamepadState | null>(null);
  const deadzoneRef = useRef(deadzone);
  const inputTimestampsRef = useRef<{ [key: string]: number }>({});
  const latencySamplesRef = useRef<number[]>([]);
  const identificationInProgressRef = useRef(new Set<number>());
  const pendingModelUpdatesRef = useRef<Map<number, ModelInfo>>(new Map());
  const isRunningRef = useRef(false);
  
  const browserCompatibilityData = useBrowserCompatibility();
  const { triggerHapticFeedback: newTriggerHapticFeedback } = useHapticFeedback(activeGamepad);
  const { recordTimestamp, getCurrentRate, getTimingSamples } = useUpdateLoopTiming();
  
  // Keep deadzone ref updated
  useEffect(() => {
    deadzoneRef.current = deadzone;
  }, [deadzone]);
  
  // Check if Gamepad API is supported
  useEffect(() => {
    if (!('getGamepads' in navigator)) {
      setIsSupported(false);
      return;
    }
    if (!browserCompatibilityData.gamepadApiSupported) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);
  }, [browserCompatibilityData.gamepadApiSupported]);

  // Keep activeGamepadRef in sync
  useEffect(() => {
    activeGamepadRef.current = activeGamepad;
  }, [activeGamepad]);

  // Helper to create gamepad state from raw gamepad
  const createGamepadState = useCallback((gamepad: Gamepad, existingState?: GamepadState): GamepadState => {
    const dz = deadzoneRef.current;
    
    // Process buttons
    const buttons: ButtonState[] = gamepad.buttons.map(button => ({
      pressed: button.pressed,
      touched: button.touched,
      value: button.value,
    }));
    
    // Process axes with deadzone
    const axes: number[] = gamepad.axes.map(value => 
      Math.abs(value) < dz ? 0 : value
    );
    
    // Get model info from existing state or pending updates
    let modelInfo: ModelInfo = existingState?.modelInfo || {
      model: 'Identifying...',
      manufacturer: 'Unknown',
      type: 'generic',
      name: 'Identifying...',
      features: [],
    };
    let controllerType = existingState?.type || ControllerType.GENERIC;

    // Check for pending model updates
    const pendingUpdate = pendingModelUpdatesRef.current.get(gamepad.index);
    if (pendingUpdate) {
      modelInfo = pendingUpdate;
      controllerType = stringToControllerType(pendingUpdate.type || 'generic');
      pendingModelUpdatesRef.current.delete(gamepad.index);
    }

    return {
      id: gamepad.id,
      index: gamepad.index,
      connected: gamepad.connected,
      mapping: gamepad.mapping,
      timestamp: gamepad.timestamp,
      type: controllerType,
      modelInfo,
      buttons,
      axes,
      stickDrift: detectStickDrift(axes, existingState?.deadZones?.leftStick || dz),
      deadZones: existingState?.deadZones || { leftStick: dz, rightStick: dz },
      pollingData: { rate: getCurrentRate(), samples: getTimingSamples() },
      latencyData: {
        lastInputTime: Math.max(...Object.values(inputTimestampsRef.current).filter(ts => !isNaN(ts)), 0),
        currentLatency: latencySamplesRef.current[latencySamplesRef.current.length - 1] || 0,
        averageLatency: calculateAverageLatency(latencySamplesRef.current),
        samples: [...latencySamplesRef.current], // Return all samples for accurate graph
      },
      hapticCapabilities: detectHapticCapabilities(gamepad),
      browserCompatibility: browserCompatibilityData,
    };
  }, [browserCompatibilityData, getCurrentRate, getTimingSamples]);

  // Trigger controller identification
  const identifyGamepad = useCallback((gamepadIndex: number, gamepadId: string) => {
    if (identificationInProgressRef.current.has(gamepadIndex)) return;
    
    identificationInProgressRef.current.add(gamepadIndex);
    identifyController(gamepadId)
      .then(identifiedModel => {
        const finalModelInfo: ModelInfo = identifiedModel ? {
          model: identifiedModel.name,
          manufacturer: identifiedModel.manufacturer,
          type: identifiedModel.type,
          name: identifiedModel.name,
          features: identifiedModel.features,
          id: identifiedModel.id,
          identifiers: identifiedModel.identifiers,
        } : {
          model: 'Generic Controller',
          manufacturer: 'Unknown',
          type: 'generic',
          name: gamepadId,
          features: [],
        };
        pendingModelUpdatesRef.current.set(gamepadIndex, finalModelInfo);
      })
      .catch(() => {
        pendingModelUpdatesRef.current.set(gamepadIndex, {
          model: 'Generic Controller',
          manufacturer: 'Unknown',
          type: 'generic',
          name: gamepadId,
          features: [],
        });
      })
      .finally(() => {
        identificationInProgressRef.current.delete(gamepadIndex);
      });
  }, []);

  // Main animation loop - runs continuously, only updates state when there are meaningful changes
  useEffect(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const updateGamepadState = () => {
      if (!isRunningRef.current) return;
      
      const connectedGamepads = navigator.getGamepads();
      if (!connectedGamepads) {
        animationRef.current = requestAnimationFrame(updateGamepadState);
        return;
      }
      
      recordTimestamp(performance.now());
      
      let hasChanges = false;
      let newActiveGamepad: GamepadState | null = null;

      for (let i = 0; i < connectedGamepads.length; i++) {
        const gamepad = connectedGamepads[i];
        if (!gamepad || !gamepad.connected) continue;
        
        // Track button press latency
        for (let j = 0; j < gamepad.buttons.length; j++) {
          const button = gamepad.buttons[j];
          const buttonKey = `button-${gamepad.index}-${j}`;
          
          if (button.pressed) {
            if (!inputTimestampsRef.current[buttonKey]) {
              // First frame of button press - record timestamp
              inputTimestampsRef.current[buttonKey] = performance.now();
            }
          } else {
            // Button released - calculate latency if we had a press
            if (inputTimestampsRef.current[buttonKey]) {
              const pressTime = inputTimestampsRef.current[buttonKey];
              const releaseTime = performance.now();
              const latency = releaseTime - pressTime;
              
              // Only record reasonable latencies (< 5 seconds)
              if (latency < 5000) {
                latencySamplesRef.current.push(latency);
                if (latencySamplesRef.current.length > 30) {
                  latencySamplesRef.current.shift();
                }
              }
              delete inputTimestampsRef.current[buttonKey];
            }
          }
        }
        
        const existingState = gamepadsRef.current.get(gamepad.index);
        const newState = createGamepadState(gamepad, existingState);
        
        // Trigger identification if needed
        if (newState.modelInfo.model === 'Identifying...') {
          identifyGamepad(gamepad.index, gamepad.id);
        }
        
        // Check if this gamepad has meaningful changes
        if (hasGamepadChanged(existingState || null, newState)) {
          hasChanges = true;
          gamepadsRef.current.set(gamepad.index, newState);
        }
        
        // Track active gamepad
        if (activeGamepadRef.current?.index === gamepad.index) {
          newActiveGamepad = gamepadsRef.current.get(gamepad.index) || newState;
        }
      }

      // Remove disconnected gamepads
      const connectedIndices = new Set<number>();
      for (let i = 0; i < connectedGamepads.length; i++) {
        const gp = connectedGamepads[i];
        if (gp && gp.connected) connectedIndices.add(gp.index);
      }
      gamepadsRef.current.forEach((_, index) => {
        if (!connectedIndices.has(index)) {
          gamepadsRef.current.delete(index);
          hasChanges = true;
        }
      });

      // Only update React state if there are meaningful changes
      if (hasChanges) {
        // Update active gamepad
        if (newActiveGamepad) {
          if (hasGamepadChanged(activeGamepadRef.current, newActiveGamepad)) {
            setActiveGamepad(newActiveGamepad);
          }
        } else if (gamepadsRef.current.size > 0) {
          // Set first available as active
          const first = gamepadsRef.current.values().next().value;
          if (first && hasGamepadChanged(activeGamepadRef.current, first)) {
            setActiveGamepad(first);
          }
        } else if (activeGamepadRef.current !== null) {
          setActiveGamepad(null);
        }
      }
      
      animationRef.current = requestAnimationFrame(updateGamepadState);
    };

    // Handle gamepad connection events
    const handleGamepadConnected = (event: GamepadEvent) => {
      const gamepad = event.gamepad;
      const newState = createGamepadState(gamepad);
      gamepadsRef.current.set(gamepad.index, newState);
      identifyGamepad(gamepad.index, gamepad.id);
      
      if (!activeGamepadRef.current) {
        setActiveGamepad(newState);
      }
    };

    const handleGamepadDisconnected = (event: GamepadEvent) => {
      gamepadsRef.current.delete(event.gamepad.index);
      
      if (activeGamepadRef.current?.index === event.gamepad.index) {
        const remaining = gamepadsRef.current.values().next().value;
        setActiveGamepad(remaining || null);
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
    
    animationRef.current = requestAnimationFrame(updateGamepadState);

    return () => {
      isRunningRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      inputTimestampsRef.current = {};
      latencySamplesRef.current = [];
    };
  }, [createGamepadState, identifyGamepad, recordTimestamp]);

  // Set a gamepad as active
  const setGamepadActive = useCallback((index: number) => {
    const gamepad = gamepadsRef.current.get(index);
    if (gamepad) {
      setActiveGamepad(gamepad);
    }
  }, []);

  // Update deadzone settings
  const updateDeadZones = useCallback((leftStick: number, rightStick: number): void => {
    if (activeGamepadRef.current) {
      const newDeadZones = { leftStick, rightStick };
      const updatedGamepad = { ...activeGamepadRef.current, deadZones: newDeadZones };
      gamepadsRef.current.set(activeGamepadRef.current.index, updatedGamepad);
      setActiveGamepad(updatedGamepad);
    }
  }, []);

  // Get gamepads array for components that need it
  const getGamepads = useCallback(() => Array.from(gamepadsRef.current.values()), []);

  return { 
    gamepads: getGamepads,
    activeGamepad, 
    setGamepadActive, 
    isSupported,
    triggerHapticFeedback: newTriggerHapticFeedback,
    updateDeadZones,
    browserCompatibility: browserCompatibilityData
  };
};

export default useGamepad;
