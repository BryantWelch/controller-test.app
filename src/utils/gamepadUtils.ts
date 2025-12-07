// Gamepad Utility Functions

// Define controller types (copied from useGamepad.ts, consider moving to a shared types file)
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

// Define the GamepadHapticActuator interface (copied from useGamepad.ts)
export interface GamepadHapticActuator {
  type: string;
  playEffect?: (type: string, params: { duration: number; strongMagnitude: number; weakMagnitude: number; startDelay?: number }) => Promise<boolean>;
  pulse?: (strongMagnitude: number, weakMagnitude: number, duration: number) => Promise<boolean>;
}

// Define interfaces for non-standard gamepad properties (copied from useGamepad.ts)
export interface GamepadWithHaptics { // Exported for use in useGamepad.ts
  hapticActuators?: GamepadHapticActuator[];
}

export interface GamepadWithVibration { // Exported for use in useGamepad.ts
  vibrationActuator?: GamepadHapticActuator;
}

// Define interface for browser compatibility information
export interface BrowserCompatibilityInfo {
  name: string;
  version: string;
  fullSupport: boolean;
  limitations: string[];
  gamepadApiSupported: boolean;
  hapticFeedbackSupported: boolean;
  pollingRateSupported: boolean;
  specificIssues: string[];
}

// Detect browser information with enhanced error handling
export const detectBrowser = (): BrowserCompatibilityInfo => {
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

    if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1) {
      browserName = "Chrome";
      const match = userAgent.match(/Chrome\/(\d+)/);
      version = match ? match[1] : "Unknown";
      const versionNum = parseInt(version);
      fullSupport = versionNum >= 35;
      gamepadApiSupported = versionNum >= 35;
      hapticFeedbackSupported = versionNum >= 68;
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
      hapticFeedbackSupported = versionNum >= 59;
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
      hapticFeedbackSupported = false;
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
      hapticFeedbackSupported = versionNum >= 79;
      pollingRateSupported = versionNum >= 12;
      if (versionNum < 79) {
        limitations.push("Edge has limited haptic feedback support in version " + version);
        specificIssues.push("Legacy Edge has limited vibration API support");
      }
    } else {
      limitations.push("Unknown browser, compatibility cannot be guaranteed");
      specificIssues.push("Browser not recognized, assuming limited support");
      gamepadApiSupported = !!navigator.getGamepads;
      hapticFeedbackSupported = false;
      pollingRateSupported = !!navigator.getGamepads;
    }

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
export const stringToControllerType = (type: string): ControllerType => {
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
export const detectStickDrift = (
  axes: readonly number[], 
  deadzone: number = 0.05
): { leftStick: { detected: boolean; value: { x: number; y: number } }; rightStick: { detected: boolean; value: { x: number; y: number } } } => {
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


// Calculate average latency
export const calculateAverageLatency = (latencies: number[]): number => {
  if (latencies.length === 0) return 0;
  
  return latencies.reduce((sum, val) => sum + val, 0) / latencies.length;
};

// Detect haptic capabilities of a gamepad
export function detectHapticCapabilities(gamepad: Gamepad): {
  supported: boolean;
  actuator: GamepadHapticActuator | null;
  actuators: GamepadHapticActuator[];
} {
  const gamepadWithVibration = gamepad as unknown as GamepadWithVibration;
  const gamepadWithHaptics = gamepad as unknown as GamepadWithHaptics;
  const supported = !!gamepadWithVibration.vibrationActuator || !!gamepadWithHaptics.hapticActuators;
  const actuators: GamepadHapticActuator[] = [];
  let primaryActuator: GamepadHapticActuator | null = null;
  
  try {
    const gamepadWithVibrationInternal = gamepad as unknown as GamepadWithVibration;
    if (gamepadWithVibrationInternal.vibrationActuator) {
      actuators.push(gamepadWithVibrationInternal.vibrationActuator);
      primaryActuator = gamepadWithVibrationInternal.vibrationActuator;
    }
    
    const gamepadWithHapticsInternal = gamepad as unknown as GamepadWithHaptics;
    if (gamepadWithHapticsInternal.hapticActuators && gamepadWithHapticsInternal.hapticActuators.length) {
      actuators.push(...gamepadWithHapticsInternal.hapticActuators);
      if (!primaryActuator) {
        primaryActuator = gamepadWithHapticsInternal.hapticActuators[0];
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
