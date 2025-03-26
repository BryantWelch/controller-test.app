import { useState, useEffect, useRef } from 'react';

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
}

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

// Hook for gamepad functionality
export const useGamepad = (deadzone: number = 0.05) => {
  const [gamepads, setGamepads] = useState<GamepadState[]>([]);
  const [activeGamepad, setActiveGamepad] = useState<GamepadState | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const animationRef = useRef<number | null>(null);

  // Check if Gamepad API is supported
  useEffect(() => {
    if (!navigator.getGamepads) {
      setIsSupported(false);
    }
  }, []);

  // Handle gamepad connection/disconnection
  useEffect(() => {
    if (!isSupported) return;

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
  }, [isSupported, activeGamepad]);

  // Update gamepad state on animation frame
  useEffect(() => {
    if (!isSupported) return;

    const updateGamepadState = () => {
      const connectedGamepads = navigator.getGamepads();
      const updatedGamepads: GamepadState[] = [];

      for (let i = 0; i < connectedGamepads.length; i++) {
        const gamepad = connectedGamepads[i];
        
        if (gamepad) {
          const controllerType = detectControllerType(gamepad.id);
          const stickDrift = detectStickDrift(gamepad.axes, deadzone);
          
          const buttonStates = gamepad.buttons.map(button => ({
            pressed: button.pressed,
            touched: button.touched,
            value: button.value,
          }));

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
  }, [isSupported, activeGamepad, deadzone]);

  // Set a gamepad as active
  const setGamepadActive = (index: number) => {
    const gamepad = gamepads.find(g => g.index === index);
    if (gamepad) {
      setActiveGamepad(gamepad);
    }
  };

  return { gamepads, activeGamepad, setGamepadActive, isSupported };
};

export default useGamepad;
