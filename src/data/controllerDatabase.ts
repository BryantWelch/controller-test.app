// Controller database for enhanced identification
export interface ControllerModel {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  description: string;
  features: string[];
  identifiers: string[]; // Patterns to match in gamepad.id
  vendorProductIds?: string[]; // Vendor:Product IDs in format "045e:02ea"
  priority?: number; // Higher priority = checked first (for overlapping IDs)
}

// Vendor ID to manufacturer mapping
const VENDOR_MANUFACTURERS: Record<string, string> = {
  '045e': 'Microsoft',
  '054c': 'Sony',
  '057e': 'Nintendo',
  '046d': 'Logitech',
  '044f': 'Thrustmaster',
  '28de': 'Valve',
  '18d1': 'Google',
  '2dc8': '8BitDo',
  '1532': 'Razer',
  '0738': 'Mad Catz',
  '0f0d': 'HORI',
  '0e6f': 'PDP',
  '20d6': 'PowerA',
  '9886': 'ASTRO Gaming',
  '0955': 'NVIDIA',
  '2563': 'SteelSeries',
  '24c6': 'PowerA',
  '1bad': 'Harmonix',
  '12ab': 'Afterglow',
};

// Extract vendor and product IDs from gamepad ID string
export function extractVendorProductId(gamepadId: string): string | null {
  if (!gamepadId) return null;
  
  // Common formats:
  // Chrome: "Xbox 360 Controller (XInput STANDARD GAMEPAD)"
  // Firefox: "045e-028e-Xbox 360 Controller"
  // "Vendor: xxxx Product: yyyy" or similar
  // "xxxx-yyyy" format
  // "xxxx/yyyy" format
  
  // Try to extract in format "Vendor: xxxx Product: yyyy"
  const vendorProductRegex = /Vendor:\s*([0-9a-f]{4})\s*Product:\s*([0-9a-f]{4})/i;
  const match = gamepadId.match(vendorProductRegex);
  
  if (match && match[1] && match[2]) {
    return `${match[1].toLowerCase()}:${match[2].toLowerCase()}`;
  }
  
  // Try to extract in format containing xxxx-yyyy or xxxx/yyyy at the start
  const altRegex = /^([0-9a-f]{4})[-/]([0-9a-f]{4})/i;
  const altMatch = gamepadId.match(altRegex);
  
  if (altMatch && altMatch[1] && altMatch[2]) {
    return `${altMatch[1].toLowerCase()}:${altMatch[2].toLowerCase()}`;
  }
  
  // Try to find any xxxx-yyyy pattern in the string
  const anywhereRegex = /([0-9a-f]{4})[-:]([0-9a-f]{4})/i;
  const anywhereMatch = gamepadId.match(anywhereRegex);
  
  if (anywhereMatch && anywhereMatch[1] && anywhereMatch[2]) {
    return `${anywhereMatch[1].toLowerCase()}:${anywhereMatch[2].toLowerCase()}`;
  }
  
  return null;
}

// Get manufacturer from vendor ID
export function getManufacturerFromVendorId(vendorProductId: string): string {
  const vendorId = vendorProductId.split(':')[0];
  return VENDOR_MANUFACTURERS[vendorId] || 'Unknown';
}

// Unified controller identification function that combines both approaches
export async function identifyController(gamepadId: string): Promise<ControllerModel | null> {
  if (!gamepadId) return null;
  
  const lowerCaseId = gamepadId.toLowerCase();
  const vendorProductId = extractVendorProductId(gamepadId);
  
  // Sort database by priority (higher priority first) for specific controller matching
  const sortedDatabase = [...controllerDatabase].sort((a, b) => 
    (b.priority || 0) - (a.priority || 0)
  );
  
  // Step 1: Try to identify by vendor:product ID first (most accurate)
  if (vendorProductId) {
    // Find exact match by vendor:product ID
    const matchByVendorProduct = sortedDatabase.find(controller => 
      controller.vendorProductIds?.some(id => id.toLowerCase() === vendorProductId)
    );
    
    if (matchByVendorProduct) {
      return matchByVendorProduct;
    }
  }
  
  // Step 2: Try string pattern matching on the gamepad ID
  for (const controller of sortedDatabase) {
    if (controller.identifiers.some(identifier => 
      lowerCaseId.includes(identifier.toLowerCase())
    )) {
      return controller;
    }
  }
  
  // Step 3: Try to load from known_gamepads.txt external database
  if (vendorProductId) {
    try {
      const database = await loadKnownGamepadsDatabase();
      if (database[vendorProductId]) {
        const controllerName = database[vendorProductId];
        const manufacturer = getManufacturerFromVendorId(vendorProductId);
        
        // Determine controller type from name
        let controllerType = 'generic';
        const nameLower = controllerName.toLowerCase();
        
        if (nameLower.includes('xbox') || nameLower.includes('xinput')) {
          controllerType = 'xbox';
        } else if (nameLower.includes('playstation') || nameLower.includes('dualshock') || nameLower.includes('dualsense') || nameLower.includes('sixaxis')) {
          controllerType = 'playstation';
        } else if (nameLower.includes('switch') || nameLower.includes('joy-con') || nameLower.includes('nintendo')) {
          controllerType = 'nintendo';
        } else if (nameLower.includes('stadia')) {
          controllerType = 'stadia';
        } else if (nameLower.includes('steam')) {
          controllerType = 'steam';
        }
        
        // Format the name nicely
        const formattedName = formatControllerName(controllerName);
        
        return {
          id: vendorProductId,
          name: formattedName,
          manufacturer: manufacturer,
          type: controllerType,
          description: `Identified from gamepad database`,
          features: [],
          identifiers: [controllerName.toLowerCase()],
          vendorProductIds: [vendorProductId]
        };
      }
    } catch (error) {
      console.error('Error loading known gamepads database:', error);
    }
  }
  
  // Step 4: Create a generic entry based on what we can determine
  if (vendorProductId) {
    const manufacturer = getManufacturerFromVendorId(vendorProductId);
    let controllerType = 'generic';
    
    // Try to determine type from the gamepad ID string
    if (lowerCaseId.includes('xbox') || lowerCaseId.includes('xinput')) {
      controllerType = 'xbox';
    } else if (lowerCaseId.includes('playstation') || lowerCaseId.includes('dualshock') || lowerCaseId.includes('dualsense')) {
      controllerType = 'playstation';
    } else if (lowerCaseId.includes('switch') || lowerCaseId.includes('nintendo')) {
      controllerType = 'nintendo';
    }
    
    return {
      id: vendorProductId,
      name: manufacturer !== 'Unknown' ? `${manufacturer} Controller` : 'Unknown Controller',
      manufacturer: manufacturer,
      type: controllerType,
      description: `Vendor:Product ID: ${vendorProductId}`,
      features: [],
      identifiers: [],
      vendorProductIds: [vendorProductId]
    };
  }
  
  // Step 5: Handle XInput controllers (no vendor:product ID available)
  // This is common when using Xbox Wireless Adapter
  if (lowerCaseId.includes('xinput') || lowerCaseId.includes('xbox')) {
    // XInput controllers don't expose specific model info
    // Check if it mentions specific controller types
    let name = 'Xbox Controller (XInput)';
    let description = 'Xbox-compatible controller connected via XInput. Specific model cannot be determined.';
    
    if (lowerCaseId.includes('360')) {
      name = 'Xbox 360 Controller (XInput)';
      description = 'Xbox 360 or compatible controller connected via XInput.';
    }
    
    return {
      id: 'xinput-controller',
      name: name,
      manufacturer: 'Microsoft',
      type: 'xbox',
      description: description,
      features: ['XInput Compatible'],
      identifiers: [],
      vendorProductIds: []
    };
  }
  
  return null;
}

// Format controller name from database (convert CamelCase to readable)
function formatControllerName(name: string): string {
  // Add spaces before capital letters and clean up
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Load the known_gamepads.txt database
export async function loadKnownGamepadsDatabase(): Promise<Record<string, string>> {
  try {
    const response = await fetch('/components/controller/known_gamepads.txt');
    const text = await response.text();
    
    const mapping: Record<string, string> = {};
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const parts = line.trim().split(' ');
      if (parts.length >= 2) {
        const vendorProductId = parts[0].toLowerCase();
        const controllerName = parts.slice(1).join(' ');
        
        mapping[vendorProductId] = controllerName;
      }
    }
    
    return mapping;
  } catch (error) {
    console.error('Error loading known gamepads database:', error);
    return {};
  }
}

// Database of known controllers - sorted by priority (specific models first)
export const controllerDatabase: ControllerModel[] = [
  // Xbox Elite Controllers (HIGH PRIORITY - must be checked before regular Xbox controllers)
  {
    id: 'xbox-elite-2',
    name: 'Xbox Elite Wireless Controller Series 2',
    manufacturer: 'Microsoft',
    type: 'xbox',
    description: 'Premium Xbox controller with adjustable-tension thumbsticks, wrap-around rubberized grip, and shorter hair trigger locks.',
    features: ['Adjustable Thumbstick Tension', 'Wrap-around Grip', 'Shorter Hair Triggers', '40hr Battery', 'Bluetooth', 'Paddles', 'USB-C'],
    identifiers: ['elite series 2', 'elite 2', 'elite2', 'elite2controller', 'xboxoneelite2'],
    vendorProductIds: [
      '045e:0b00', // Xbox Elite Series 2 (USB)
      '045e:0b05', // Xbox Elite Series 2 (via Wireless Adapter - sometimes reports this)
      '045e:0b0a', // Xbox Elite Series 2 (Bluetooth)
      '045e:0b0c', // Xbox Elite Series 2 Core
    ],
    priority: 100
  },
  {
    id: 'xbox-elite-1',
    name: 'Xbox Elite Wireless Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    description: 'Premium Xbox controller with interchangeable components, hair trigger locks, and back paddles.',
    features: ['Interchangeable Parts', 'Hair Trigger Locks', 'Paddles', 'App Configuration'],
    identifiers: ['xbox elite', 'elite controller', 'xboxoneelite'],
    vendorProductIds: ['045e:02e3', '045e:02ff'],
    priority: 90
  },
  
  // Xbox Wireless Adapter - when controller connects through this, we need special handling
  {
    id: 'xbox-wireless-adapter',
    name: 'Xbox Controller (via Wireless Adapter)',
    manufacturer: 'Microsoft',
    type: 'xbox',
    description: 'Xbox controller connected via the Xbox Wireless Adapter for Windows.',
    features: ['Wireless', 'Low Latency', 'Multiple Controllers'],
    identifiers: ['xbox wireless adapter', 'wireless receiver'],
    vendorProductIds: ['045e:0719', '045e:02e6', '045e:02fe'],
    priority: 40
  },
  
  // DualSense Edge (HIGH PRIORITY - must be checked before regular DualSense)
  {
    id: 'ps5-dualsense-edge',
    name: 'DualSense Edge Wireless Controller',
    manufacturer: 'Sony',
    type: 'playstation',
    description: 'Pro-level PlayStation 5 controller with customizable controls, back buttons, and interchangeable stick caps.',
    features: ['Back Buttons', 'Interchangeable Stick Caps', 'Trigger Dead Zones', 'Function Buttons', 'Haptic Feedback', 'Adaptive Triggers'],
    identifiers: ['dualsense edge'],
    vendorProductIds: ['054c:0df2'],
    priority: 100
  },
  
  // Xbox Series X|S Controller
  {
    id: 'xbox-series',
    name: 'Xbox Wireless Controller (Series X|S)',
    manufacturer: 'Microsoft',
    type: 'xbox',
    description: 'Next-gen Xbox controller with textured grip, Share button, and improved D-pad.',
    features: ['Share Button', 'Textured Grip', 'Hybrid D-pad', 'USB-C', 'Bluetooth', 'Dynamic Latency Input'],
    identifiers: ['xbox series', 'series x', 'series s'],
    vendorProductIds: ['045e:0b12', '045e:0b13', '045e:0b05', '045e:0b20', '045e:0b21', '045e:0b22'],
    priority: 80
  },
  
  // Xbox One S/X Controller
  {
    id: 'xbox-one-s',
    name: 'Xbox One S Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    description: 'Updated Xbox One controller with textured grip and Bluetooth support.',
    features: ['Bluetooth', 'Textured Grip', 'Impulse Triggers', '3.5mm Jack'],
    identifiers: ['xbox one s'],
    vendorProductIds: ['045e:02ea', '045e:02fd', '045e:02e0'],
    priority: 70
  },
  
  // Xbox One Controller (original)
  {
    id: 'xbox-one',
    name: 'Xbox One Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    description: 'Standard Xbox One controller with improved D-pad and ergonomics.',
    features: ['Impulse Triggers', 'Improved D-pad', 'Wireless'],
    identifiers: ['xbox one', 'microsoft xbox one', 'xbox wireless controller'],
    vendorProductIds: ['045e:02d1', '045e:02dd'],
    priority: 60
  },
  
  // Xbox 360 Controller
  {
    id: 'xbox-360',
    name: 'Xbox 360 Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    description: 'Classic Xbox 360 controller with offset analog sticks.',
    features: ['Rumble', 'Wired/Wireless Options', 'Xbox Guide Button'],
    identifiers: ['xbox 360', 'xbox360', 'microsoft xbox 360'],
    vendorProductIds: ['045e:028e', '045e:028f', '045e:0291', '045e:0719', '045e:02a1'],
    priority: 50
  },
  
  // Xbox Adaptive Controller
  {
    id: 'xbox-adaptive',
    name: 'Xbox Adaptive Controller',
    manufacturer: 'Microsoft',
    type: 'xbox',
    description: 'Accessible controller designed for gamers with limited mobility.',
    features: ['Accessibility Focused', 'Customizable Inputs', 'External Switch Compatibility', '19 Jacks for External Devices'],
    identifiers: ['xbox adaptive', 'adaptive controller'],
    vendorProductIds: ['045e:0b0c'],
    priority: 85
  },
  
  // PlayStation Controllers
  {
    id: 'ps5-dualsense',
    name: 'DualSense Wireless Controller',
    manufacturer: 'Sony',
    type: 'playstation',
    description: 'PlayStation 5 controller with haptic feedback and adaptive triggers.',
    features: ['Haptic Feedback', 'Adaptive Triggers', 'Built-in Microphone', 'Motion Controls', 'USB-C', 'Create Button'],
    identifiers: ['dualsense', 'ps5 controller', 'playstation 5'],
    vendorProductIds: ['054c:0ce6'],
    priority: 80
  },
  {
    id: 'ps4-dualshock4-v2',
    name: 'DualShock 4 Controller (V2)',
    manufacturer: 'Sony',
    type: 'playstation',
    description: 'Updated PlayStation 4 controller with improved light bar and USB communication.',
    features: ['Touchpad', 'Light Bar (visible from top)', 'Motion Controls', 'Speaker', 'USB Communication'],
    identifiers: ['dualshock 4 v2', 'cuh-zct2'],
    vendorProductIds: ['054c:09cc'],
    priority: 75
  },
  {
    id: 'ps4-dualshock4',
    name: 'DualShock 4 Controller',
    manufacturer: 'Sony',
    type: 'playstation',
    description: 'PlayStation 4 controller with touchpad and light bar.',
    features: ['Touchpad', 'Light Bar', 'Motion Controls', 'Speaker'],
    identifiers: ['dualshock 4', 'ps4 controller', 'playstation 4', 'dualshock4'],
    vendorProductIds: ['054c:05c4', '054c:0ba0'],
    priority: 70
  },
  {
    id: 'ps3-dualshock3',
    name: 'DualShock 3 / SIXAXIS Controller',
    manufacturer: 'Sony',
    type: 'playstation',
    description: 'PlayStation 3 controller with pressure-sensitive buttons and SIXAXIS motion sensing.',
    features: ['Pressure-Sensitive Buttons', 'SIXAXIS Motion Sensing', 'Bluetooth', 'Rumble (DualShock 3 only)'],
    identifiers: ['dualshock 3', 'dualshock3', 'ps3 controller', 'playstation 3', 'sixaxis'],
    vendorProductIds: ['054c:0268'],
    priority: 60
  },
  
  // Nintendo Controllers
  {
    id: 'switch-pro',
    name: 'Nintendo Switch Pro Controller',
    manufacturer: 'Nintendo',
    type: 'nintendo',
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
    description: 'Affordable third-party controllers with additional features.',
    features: ['Extra Buttons', 'Wired Connection', 'Various Designs'],
    identifiers: ['powera', 'enhanced controller'],
    vendorProductIds: [
      '20d6:2001', // PowerA Enhanced Wired Controller for Xbox
      '20d6:a711'  // PowerA Enhanced Wireless Controller for Switch
    ]
  }
];
