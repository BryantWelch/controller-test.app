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
    imageUrl: '',
    description: 'Standard Xbox One controller with improved D-pad and ergonomics.',
    features: ['Impulse Triggers', 'Improved D-pad', 'Wireless'],
    identifiers: ['xbox one', 'microsoft xbox one', 'xbox wireless controller'],
    vendorProductIds: [
      '045e:02d1', // Xbox One Controller
      '045e:02dd', // Xbox One Controller (newer firmware)
      '045e:02e3', // Xbox One Elite Controller
      '045e:02ea', // Xbox One S Controller (Bluetooth)
      '045e:02fd', // Xbox One S Controller (Bluetooth)
      '045e:0b00', // Xbox Elite Series 2 Controller
      '045e:0b05', // Xbox Series X|S Controller
      '045e:0b12', // Xbox Series X|S Controller (newer firmware)
    ]
  },
  {
    id: 'xbox-360',
    name: 'Xbox 360 Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    imageUrl: '',
    description: 'Classic Xbox 360 controller with offset analog sticks.',
    features: ['Rumble', 'Wired/Wireless Options', 'Xbox Guide Button'],
    identifiers: ['xbox 360', 'microsoft xbox 360'],
    vendorProductIds: [
      '045e:028e', // Xbox 360 Controller
      '045e:028f', // Xbox 360 Wireless Controller (with adapter)
      '045e:0291', // Xbox 360 Wireless Controller
      '045e:0719', // Xbox 360 Wireless Receiver
    ]
  },
  {
    id: 'xbox-elite',
    name: 'Xbox Elite Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    imageUrl: '',
    description: 'Premium Xbox controller with customizable components and paddles.',
    features: ['Interchangeable Parts', 'Hair Trigger Locks', 'Paddles', 'App Configuration'],
    identifiers: ['xbox elite', 'elite controller', 'elite series'],
    vendorProductIds: [
      '045e:02e3', // Xbox One Elite Controller
      '045e:0b00', // Xbox Elite Series 2 Controller
    ]
  },
  {
    id: 'xbox-adaptive',
    name: 'Xbox Adaptive Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    imageUrl: '',
    description: 'Accessible controller designed for gamers with limited mobility.',
    features: ['Accessibility Focused', 'Customizable Inputs', 'External Switch Compatibility'],
    identifiers: ['xbox adaptive', 'adaptive controller'],
    vendorProductIds: ['045e:0b0c']
  },
  
  // PlayStation Controllers
  {
    id: 'ps5-dualsense',
    name: 'DualSense Controller',
    manufacturer: 'Sony',
    type: 'playstation',
    imageUrl: '',
    description: 'PlayStation 5 controller with haptic feedback and adaptive triggers.',
    features: ['Haptic Feedback', 'Adaptive Triggers', 'Built-in Microphone', 'Motion Controls'],
    identifiers: ['dualsense', 'ps5 controller', 'playstation 5'],
    vendorProductIds: [
      '054c:0ce6', // DualSense Wireless Controller
      '054c:0df2', // DualSense Edge Controller
    ]
  },
  {
    id: 'ps4-dualshock4',
    name: 'DualShock 4 Controller',
    manufacturer: 'Sony',
    type: 'playstation',
    imageUrl: '',
    description: 'PlayStation 4 controller with touchpad and light bar.',
    features: ['Touchpad', 'Light Bar', 'Motion Controls', 'Speaker'],
    identifiers: ['dualshock 4', 'ps4 controller', 'playstation 4'],
    vendorProductIds: [
      '054c:05c4', // DualShock 4 (1st gen)
      '054c:09cc', // DualShock 4 (2nd gen)
      '054c:0ba0', // DualShock 4 USB Wireless Adapter
    ]
  },
  {
    id: 'ps3-dualshock3',
    name: 'DualShock 3 Controller',
    manufacturer: 'Sony',
    type: 'playstation',
    imageUrl: '',
    description: 'PlayStation 3 controller with pressure-sensitive buttons and SIXAXIS motion sensing.',
    features: ['Pressure-Sensitive Buttons', 'SIXAXIS Motion Sensing', 'Bluetooth'],
    identifiers: ['dualshock 3', 'ps3 controller', 'playstation 3', 'sixaxis'],
    vendorProductIds: [
      '054c:0268', // DualShock 3 / SIXAXIS
    ]
  },
  
  // Nintendo Controllers
  {
    id: 'switch-pro',
    name: 'Nintendo Switch Pro Controller',
    manufacturer: 'Nintendo',
    type: 'nintendo',
    imageUrl: '',
    description: 'Premium controller for the Nintendo Switch with motion controls and HD rumble.',
    features: ['HD Rumble', 'Motion Controls', 'Amiibo Support'],
    identifiers: ['nintendo switch pro'],
    vendorProductIds: ['057e:2009']
  },
  {
    id: 'switch-joycon',
    name: 'Nintendo Switch Joy-Con',
    manufacturer: 'Nintendo',
    type: 'nintendo',
    imageUrl: '',
    description: 'Detachable controllers for the Nintendo Switch that can be used individually or as a pair.',
    features: ['HD Rumble', 'Motion Controls', 'IR Camera', 'Amiibo Support'],
    identifiers: ['joy-con', 'joycon', 'nintendo switch joy'],
    vendorProductIds: [
      '057e:2006', // Joy-Con Left
      '057e:2007', // Joy-Con Right
    ]
  },
  {
    id: 'stadia',
    name: 'Google Stadia Controller',
    manufacturer: 'Google',
    type: 'stadia',
    imageUrl: '',
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
    imageUrl: '',
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
    imageUrl: '',
    description: 'Retro-inspired controllers with modern features.',
    features: ['Bluetooth', 'Multiple Platform Support', 'Retro Design'],
    identifiers: ['8bitdo'],
    vendorProductIds: [
      '2dc8:2101', // 8BitDo SN30 Pro
      '2dc8:6001', // 8BitDo SF30 Pro
      '2dc8:3104', // 8BitDo Pro 2
      '2dc8:3810', // 8BitDo F30 Pro
      '2dc8:6100', // 8BitDo SF30 Pro (newer firmware)
      '2dc8:6101'  // 8BitDo SN30 Pro (newer firmware)
    ]
  },
  {
    id: 'logitech-f310',
    name: 'Logitech F310 Controller',
    manufacturer: 'Logitech',
    type: 'generic',
    imageUrl: '',
    description: 'Affordable wired gamepad with familiar button layout.',
    features: ['DirectInput/XInput Switch', 'Programmable Buttons'],
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
    imageUrl: '',
    description: 'Wireless gamepad with dual vibration motors and mode switching.',
    features: ['Wireless', 'Dual Vibration', 'DirectInput/XInput Switch'],
    identifiers: ['logitech f710', 'logitech wireless gamepad f710'],
    vendorProductIds: [
      '046d:c21f', // F710 (XInput)
      '046d:c219'  // F710 (DirectInput)
    ]
  },
  
  // Racing Wheels
  {
    id: 'thrustmaster-racing-wheel',
    name: 'Thrustmaster Racing Wheel',
    manufacturer: 'Thrustmaster',
    type: 'racing',
    imageUrl: '',
    description: 'Racing wheel with force feedback for realistic driving simulation.',
    features: ['Force Feedback', 'Pedals', 'Realistic Driving Experience'],
    identifiers: ['thrustmaster', 'racing wheel', 't150', 't300'],
    vendorProductIds: [
      '044f:b677', // T150 Force Feedback Racing Wheel
      '044f:b65b', // Ferrari 458 Racing Wheel
      '044f:b671'  // Ferrari 458 Spider Racing Wheel
    ]
  },
  
  // Additional Controllers
  {
    id: 'razer-wolverine',
    name: 'Razer Wolverine Controller',
    manufacturer: 'Razer',
    type: 'xbox',
    imageUrl: '',
    description: 'Premium Xbox-compatible controller with additional programmable buttons.',
    features: ['Extra Buttons', 'Chroma RGB Lighting', 'Hair Trigger Mode'],
    identifiers: ['razer wolverine', 'razer tournament'],
    vendorProductIds: [
      '1532:0a00', // Wolverine Ultimate
      '1532:0a03'  // Wolverine Tournament Edition
    ]
  },
  {
    id: 'scuf-controller',
    name: 'SCUF Controller',
    manufacturer: 'SCUF Gaming',
    type: 'premium',
    imageUrl: '',
    description: 'Premium customizable controllers with paddles and trigger stops.',
    features: ['Paddles', 'Trigger Stops', 'Interchangeable Thumbsticks'],
    identifiers: ['scuf', 'scuf gaming'],
    vendorProductIds: []
  },
  {
    id: 'hori-fighting-stick',
    name: 'HORI Fighting Stick',
    manufacturer: 'HORI',
    type: 'arcade',
    imageUrl: '',
    description: 'Arcade-style fighting stick for fighting games.',
    features: ['Arcade Buttons', 'Joystick', 'Platform Specific Models'],
    identifiers: ['hori', 'fighting stick', 'arcade stick'],
    vendorProductIds: [
      '0f0d:00c1', // HORI Fighting Stick Mini 4
      '0f0d:00ee', // HORI Real Arcade Pro V Kai
      '0f0d:0078'  // HORI Real Arcade Pro 4
    ]
  },
  {
    id: 'astro-c40',
    name: 'ASTRO C40 TR Controller',
    manufacturer: 'ASTRO Gaming',
    type: 'premium',
    imageUrl: '',
    description: 'Premium controller with swappable modules and customizable layout.',
    features: ['Modular Design', 'Customizable Layout', 'Trigger Stops'],
    identifiers: ['astro c40', 'c40 tr'],
    vendorProductIds: ['9886:0025']
  },
  {
    id: 'powera-enhanced',
    name: 'PowerA Enhanced Controller',
    manufacturer: 'PowerA',
    type: 'generic',
    imageUrl: '',
    description: 'Affordable third-party controllers with additional features.',
    features: ['Extra Buttons', 'Wired Connection', 'Various Designs'],
    identifiers: ['powera', 'enhanced controller'],
    vendorProductIds: [
      '20d6:2001', // PowerA Enhanced Wired Controller for Xbox
      '20d6:a711'  // PowerA Enhanced Wireless Controller for Switch
    ]
  }
];
