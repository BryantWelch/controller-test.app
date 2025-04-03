// Controller database for enhanced identification
export interface ControllerModel {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  imageUrl: string;
  description: string;
  features: string[];
  identifiers: string[]; // Patterns to match in gamepad.id
  vendorProductIds?: string[]; // Vendor:Product IDs in format "045e:02ea"
}

// Parse vendor and product IDs from gamepad ID string
export function parseVendorProductId(gamepadId: string): string | null {
  // Common formats:
  // "Vendor: xxxx Product: yyyy" or similar
  // "xxxx-yyyy" format
  // "xxxx/yyyy" format
  
  // Try to extract in format "Vendor: xxxx Product: yyyy"
  const vendorProductRegex = /Vendor: ([0-9a-f]{4}) Product: ([0-9a-f]{4})/i;
  const match = gamepadId.match(vendorProductRegex);
  
  if (match && match[1] && match[2]) {
    return `${match[1].toLowerCase()}:${match[2].toLowerCase()}`;
  }
  
  // Try to extract in format containing xxxx-yyyy or xxxx/yyyy
  const altRegex = /([0-9a-f]{4})[\-\/]([0-9a-f]{4})/i;
  const altMatch = gamepadId.match(altRegex);
  
  if (altMatch && altMatch[1] && altMatch[2]) {
    return `${altMatch[1].toLowerCase()}:${altMatch[2].toLowerCase()}`;
  }
  
  return null;
}

// Identify controller model based on gamepad ID
export function identifyControllerModel(gamepadId: string): ControllerModel | null {
  if (!gamepadId) return null;
  
  // Try to identify by vendor:product ID first (most accurate)
  const vendorProductId = parseVendorProductId(gamepadId);
  
  if (vendorProductId) {
    const matchByVendorProduct = controllerDatabase.find(controller => 
      controller.vendorProductIds?.some(id => id.toLowerCase() === vendorProductId)
    );
    
    if (matchByVendorProduct) {
      return matchByVendorProduct;
    }
  }
  
  // Fall back to string pattern matching
  const lowerCaseId = gamepadId.toLowerCase();
  
  for (const controller of controllerDatabase) {
    if (controller.identifiers.some(identifier => 
      lowerCaseId.includes(identifier.toLowerCase())
    )) {
      return controller;
    }
  }
  
  return null;
}

// Database of known controllers
export const controllerDatabase: ControllerModel[] = [
  // Xbox Controllers
  {
    id: 'xbox-one',
    name: 'Xbox One Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    imageUrl: '/assets/controllers/xbox-one.png',
    description: 'Standard Xbox One controller with improved D-pad and ergonomics.',
    features: ['Impulse Triggers', 'Improved D-pad', 'Wireless'],
    identifiers: ['xbox one', 'microsoft x-box one', 'xbox wireless controller'],
    vendorProductIds: [
      '045e:02ea', // Xbox One S Controller (USB)
      '045e:02e0', // Xbox One S Controller (Bluetooth)
      '045e:02fd', // Xbox One S Controller (Bluetooth)
      '045e:02dd', // Xbox One Controller
      '045e:02d1'  // Xbox One Controller
    ]
  },
  {
    id: 'xbox-360',
    name: 'Xbox 360 Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    imageUrl: '/assets/controllers/xbox-360.png',
    description: 'Classic Xbox 360 controller with transforming D-pad.',
    features: ['Wireless', 'Vibration Feedback'],
    identifiers: ['xbox 360', 'microsoft x-box 360'],
    vendorProductIds: [
      '045e:028e', // Xbox 360 Controller
      '045e:0719', // Xbox 360 Wireless Receiver
      '045e:02a1', // Xbox 360 Wireless Controller
      '045e:0291', // Xbox 360 Wireless Receiver (Unlicensed)
      '045e:02a0'  // Xbox 360 Big Button IR Receiver
    ]
  },
  {
    id: 'xbox-elite',
    name: 'Xbox Elite Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    imageUrl: '/assets/controllers/xbox-elite.png',
    description: 'Premium Xbox controller with customizable components and paddles.',
    features: ['Swappable Components', 'Adjustable Thumbsticks', 'Paddle Buttons', 'Hair Trigger Locks'],
    identifiers: ['xbox elite', 'elite wireless controller'],
    vendorProductIds: [
      '045e:02e3', // Xbox Elite Controller
      '045e:02ff'  // Xbox Elite Controller Series 2
    ]
  },
  {
    id: 'xbox-adaptive',
    name: 'Xbox Adaptive Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    imageUrl: '/assets/controllers/xbox-adaptive.png',
    description: 'Designed for gamers with limited mobility.',
    features: ['Programmable Buttons', 'External Input Support', 'Accessibility Focused'],
    identifiers: ['xbox adaptive'],
    vendorProductIds: ['045e:0b0c']
  },
  
  // PlayStation Controllers
  {
    id: 'ps5-dualsense',
    name: 'DualSense Controller',
    manufacturer: 'Sony',
    type: 'playstation',
    imageUrl: '/assets/controllers/dualsense.png',
    description: 'PlayStation 5 controller with haptic feedback and adaptive triggers.',
    features: ['Haptic Feedback', 'Adaptive Triggers', 'Built-in Microphone', 'Motion Controls'],
    identifiers: ['dualsense', 'playstation 5', 'ps5'],
    vendorProductIds: [
      '054c:0ce6', // DualSense Controller
      '054c:0df2'  // DualSense Edge Controller
    ]
  },
  {
    id: 'ps4-dualshock4',
    name: 'DualShock 4 Controller',
    manufacturer: 'Sony',
    type: 'playstation',
    imageUrl: '/assets/controllers/dualshock4.png',
    description: 'PlayStation 4 controller with touchpad and light bar.',
    features: ['Touchpad', 'Light Bar', 'Motion Controls', 'Built-in Speaker'],
    identifiers: ['dualshock 4', 'playstation 4', 'ps4'],
    vendorProductIds: [
      '054c:05c4', // DualShock 4 (Original)
      '054c:09cc', // DualShock 4 (V2)
      '054c:0ba0'  // DualShock 4 USB Wireless Adapter
    ]
  },
  {
    id: 'ps3-dualshock3',
    name: 'DualShock 3 Controller',
    manufacturer: 'Sony',
    type: 'playstation',
    imageUrl: '/assets/controllers/dualshock3.png',
    description: 'PlayStation 3 controller with pressure-sensitive buttons.',
    features: ['Pressure-Sensitive Buttons', 'Motion Controls', 'Wireless'],
    identifiers: ['dualshock 3', 'playstation 3', 'ps3', 'sixaxis'],
    vendorProductIds: [
      '054c:0268', // DualShock 3 / Sixaxis
      '054c:042f'  // DualShock 3 (Alternative)
    ]
  },
  
  // Other Popular Controllers
  {
    id: 'switch-pro',
    name: 'Nintendo Switch Pro Controller',
    manufacturer: 'Nintendo',
    type: 'nintendo',
    imageUrl: '/assets/controllers/switch-pro.png',
    description: 'Official Nintendo Switch Pro Controller with motion controls and HD rumble.',
    features: ['HD Rumble', 'Motion Controls', 'Amiibo Support'],
    identifiers: ['nintendo switch pro'],
    vendorProductIds: ['057e:2009']
  },
  {
    id: 'stadia',
    name: 'Google Stadia Controller',
    manufacturer: 'Google',
    type: 'stadia',
    imageUrl: '/assets/controllers/stadia.png',
    description: 'Google Stadia controller designed for cloud gaming.',
    features: ['WiFi Connection', 'Google Assistant Button', 'Capture Button'],
    identifiers: ['stadia controller', 'google stadia'],
    vendorProductIds: ['18d1:9400']
  },
  {
    id: 'steam',
    name: 'Steam Controller',
    manufacturer: 'Valve',
    type: 'steam',
    imageUrl: '/assets/controllers/steam.png',
    description: 'Innovative controller with dual trackpads instead of traditional analog sticks.',
    features: ['Dual Trackpads', 'Haptic Feedback', 'Customizable Controls'],
    identifiers: ['steam controller', 'valve'],
    vendorProductIds: ['28de:1102', '28de:1142']
  },
  {
    id: '8bitdo',
    name: '8BitDo Controller',
    manufacturer: '8BitDo',
    type: 'generic',
    imageUrl: '/assets/controllers/8bitdo.png',
    description: 'Retro-inspired controllers with modern features.',
    features: ['Bluetooth', 'Multiple Platform Support', 'Retro Design'],
    identifiers: ['8bitdo'],
    vendorProductIds: [
      '2dc8:2101', // 8BitDo SN30 Pro
      '2dc8:6001', // 8BitDo SF30 Pro
      '2dc8:3104'  // 8BitDo Pro 2
    ]
  },
  
  // Logitech Controllers
  {
    id: 'logitech-f310',
    name: 'Logitech F310 Controller',
    manufacturer: 'Logitech',
    type: 'generic',
    imageUrl: '/assets/controllers/logitech-f310.png',
    description: 'Affordable wired gamepad with both DirectInput and XInput modes.',
    features: ['DirectInput/XInput Switch', 'Wired Connection', 'Affordable'],
    identifiers: ['logitech f310', 'logitech gamepad f310'],
    vendorProductIds: [
      '046d:c21d', // F310 (XInput)
      '046d:c216'  // F310 (DirectInput)
    ]
  },
  {
    id: 'logitech-f710',
    name: 'Logitech F710 Controller',
    manufacturer: 'Logitech',
    type: 'generic',
    imageUrl: '/assets/controllers/logitech-f710.png',
    description: 'Wireless gamepad with dual vibration motors and mode switching.',
    features: ['Wireless', 'Dual Vibration', 'DirectInput/XInput Switch'],
    identifiers: ['logitech f710', 'logitech wireless gamepad f710'],
    vendorProductIds: [
      '046d:c21f', // F710 (XInput)
      '046d:c219'  // F710 (DirectInput)
    ]
  },
  
  // Thrustmaster Controllers
  {
    id: 'thrustmaster-racing-wheel',
    name: 'Thrustmaster Racing Wheel',
    manufacturer: 'Thrustmaster',
    type: 'racing',
    imageUrl: '/assets/controllers/thrustmaster-wheel.png',
    description: 'Racing wheel with force feedback for realistic driving simulation.',
    features: ['Force Feedback', 'Pedals', 'Realistic Driving Experience'],
    identifiers: ['thrustmaster', 'racing wheel', 't150', 't300'],
    vendorProductIds: [
      '044f:b677', // T150 Force Feedback Racing Wheel
      '044f:b65b', // Ferrari 458 Racing Wheel
      '044f:b671'  // Ferrari 458 Spider Racing Wheel
    ]
  }
];
