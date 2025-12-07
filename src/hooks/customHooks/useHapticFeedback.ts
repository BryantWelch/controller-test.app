import { useCallback } from 'react';
import { GamepadState } from '../useGamepad'; // Assuming GamepadState and others might be needed
import { ControllerType, GamepadWithHaptics, GamepadWithVibration } from '../../utils/gamepadUtils';

export interface HapticFeedbackOptions {
  duration?: number;
  strongMagnitude?: number;
  weakMagnitude?: number;
  startDelay?: number; // For playEffect
}

export interface UseHapticFeedbackReturn {
  triggerHapticFeedback: (options: HapticFeedbackOptions) => Promise<boolean>;
  // Potentially expose more haptic-related states or functions if needed later
}

export const useHapticFeedback = (activeGamepad: GamepadState | null): UseHapticFeedbackReturn => {
  // Helper function to trigger haptic feedback on Xbox controllers
  const triggerXboxHapticFeedback = useCallback(async (
    gamepadState: GamepadState,
    duration: number,
    strongMagnitude: number,
    weakMagnitude: number
  ): Promise<boolean> => {
    try {
      // Get the raw gamepad object - this is required for haptic feedback
      const rawGamepad = navigator.getGamepads()[gamepadState.index];
      if (!rawGamepad) {
        console.warn('Raw gamepad object not found for Xbox haptics.');
        return false;
      }

      // Try vibrationActuator first (standard for Xbox controllers)
      const vibrationActuator = (rawGamepad as unknown as GamepadWithVibration).vibrationActuator;
      if (vibrationActuator && typeof vibrationActuator.playEffect === 'function') {
        await vibrationActuator.playEffect('dual-rumble', {
          duration: duration,
          strongMagnitude: strongMagnitude,
          weakMagnitude: weakMagnitude,
          startDelay: 0,
        });
        return true;
      }

      // Fallback to hapticActuators
      const hapticActuators = (rawGamepad as unknown as GamepadWithHaptics).hapticActuators;
      if (hapticActuators && hapticActuators.length > 0) {
        for (const actuator of hapticActuators) {
          if (typeof actuator.playEffect === 'function') {
            await actuator.playEffect('dual-rumble', {
              duration: duration,
              strongMagnitude: strongMagnitude,
              weakMagnitude: weakMagnitude,
              startDelay: 0,
            });
            return true;
          }
        }
      }

      console.warn('Xbox controller does not support dual-rumble or playEffect.');
      return false;
    } catch (error) {
      console.error('Error triggering Xbox haptic feedback:', error);
      return false;
    }
  }, []);

  // Helper function to trigger haptic feedback on DualSense controllers
  const triggerDualSenseHapticFeedback = useCallback(async (
    gamepadState: GamepadState, // Renamed to avoid conflict
    duration: number,
    strongMagnitude: number,
    weakMagnitude: number
  ): Promise<boolean> => {
    if (!gamepadState.hapticCapabilities.supported || !gamepadState.hapticCapabilities.actuators || gamepadState.hapticCapabilities.actuators.length === 0) {
      console.warn('DualSense haptic feedback not supported or no actuators found.');
      return false;
    }
    try {
      // DualSense uses the 'dual-rumble' effect type typically
      // The actual gamepad object is needed here, not just GamepadState
      // This will require passing the raw Gamepad object or finding it
      const rawGamepad = navigator.getGamepads()[gamepadState.index];
      if (!rawGamepad) {
        console.warn('Raw gamepad object not found for DualSense haptics.');
        return false;
      }

      const hapticActuators = (rawGamepad as unknown as GamepadWithHaptics).hapticActuators;
      if (hapticActuators && hapticActuators.length > 0) {
        for (const actuator of hapticActuators) {
          if (actuator.type === 'dual-rumble' && typeof actuator.playEffect === 'function') {
            await actuator.playEffect('dual-rumble', {
              duration: duration,
              strongMagnitude: strongMagnitude,
              weakMagnitude: weakMagnitude,
              startDelay: 0,
            });
            return true;
          }
        }
      }
      console.warn('DualSense does not have a dual-rumble actuator with playEffect.');
      return false;
    } catch (error) {
      console.error('Error triggering DualSense haptic feedback:', error);
      return false;
    }
  }, []);

  // Generic haptic feedback trigger
  const triggerGenericHapticFeedback = useCallback(async (
    gamepad: GamepadState,
    duration: number,
    strongMagnitude: number,
    weakMagnitude: number
  ): Promise<boolean> => {
    if (!gamepad.hapticCapabilities.supported) {
      console.warn('Generic haptic feedback not supported on this gamepad.');
      return false;
    }

    const rawGamepad = navigator.getGamepads()[gamepad.index];
    if (!rawGamepad) {
      console.warn('Raw gamepad object not found for generic haptics.');
      return false;
    }

    try {
      // Try standard vibrationActuator.pulse first (common for simple rumble)
      const vibrationActuator = (rawGamepad as unknown as GamepadWithVibration).vibrationActuator;
      if (vibrationActuator && typeof vibrationActuator.pulse === 'function') {
        // Assuming pulse here might take (strong, weak, duration) if it's a dual-rumble style actuator
        // or (value, duration) for simpler ones. The original code used 3 args for generic pulse.
        await vibrationActuator.pulse(strongMagnitude, weakMagnitude, duration);
        return true;
      }

      // Try hapticActuators (more modern API)
      const hapticActuators = (rawGamepad as unknown as GamepadWithHaptics).hapticActuators;
      if (hapticActuators && hapticActuators.length > 0) {
        for (const actuator of hapticActuators) {
          if (typeof actuator.pulse === 'function') {
            await actuator.pulse(strongMagnitude, weakMagnitude, duration); // Matched to original 3-arg call
            return true;
          }
          if (typeof actuator.playEffect === 'function') {
            // Try a generic effect if pulse is not available
            await actuator.playEffect('dual-rumble', { // or 'vibration'
              duration: duration,
              strongMagnitude: strongMagnitude,
              weakMagnitude: weakMagnitude,
              startDelay: 0,
            });
            return true;
          }
        }
      }
      console.warn('No suitable generic haptic feedback method found.');
      return false;
    } catch (error) {
      console.error('Error triggering generic haptic feedback:', error);
      return false;
    }
  }, []);

  const triggerHapticFeedback = useCallback(async (options: HapticFeedbackOptions): Promise<boolean> => {
    const { duration = 150, strongMagnitude = 1.0, weakMagnitude = 1.0 } = options;

    if (!activeGamepad || !activeGamepad.connected || !activeGamepad.hapticCapabilities.supported) {
      // console.warn('Haptic feedback trigger failed: No active gamepad, not connected, or haptics not supported.');
      return false;
    }

    try {
      // Prioritize DualSense for its specific capabilities if it's a PlayStation controller
      if (activeGamepad.type === ControllerType.PLAYSTATION) {
        const psSuccess = await triggerDualSenseHapticFeedback(activeGamepad, duration, strongMagnitude, weakMagnitude);
        if (psSuccess) return true;
        // Fall through to generic if DualSense specific method fails but haptics are supported
      }

      // Handle Xbox controllers
      if (activeGamepad.type === ControllerType.XBOX) {
        return await triggerXboxHapticFeedback(activeGamepad, duration, strongMagnitude, weakMagnitude);
      }
      
      // For other controllers or as a fallback, try generic methods
      return await triggerGenericHapticFeedback(activeGamepad, duration, strongMagnitude, weakMagnitude);
    } catch (error) {
      console.error('Unexpected error triggering haptic feedback:', error);
      return false;
    }
  }, [activeGamepad, triggerXboxHapticFeedback, triggerDualSenseHapticFeedback, triggerGenericHapticFeedback]);

  return {
    triggerHapticFeedback,
  };
};
