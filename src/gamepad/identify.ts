import knownRaw from './known_gamepads.txt?raw'

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

const knownGamepads = parseKnownGamepads(knownRaw)

function parseKnownGamepads(text: string): Record<string, string> {
  const mapping: Record<string, string> = {}
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const space = trimmed.indexOf(' ')
    if (space <= 0) continue
    mapping[trimmed.slice(0, space).toLowerCase()] = trimmed.slice(space + 1).trim()
  }
  return mapping
}

export interface IdentifiedPad {
  id: string
  name: string
  manufacturer: string
  type: string
  description: string
  features: string[]
}

export function identifyPad(gamepadId: string): IdentifiedPad {
  const model = identifyController(gamepadId)
  if (!model) {
    return {
      id: 'unknown',
      name: gamepadId?.trim() || 'Controller',
      manufacturer: 'Unknown',
      type: 'generic',
      description: 'The browser reported a controller that is not in the catalog.',
      features: [],
    }
  }
  return {
    id: model.id,
    name: model.name,
    manufacturer: model.manufacturer,
    type: model.type,
    description: model.description,
    features: model.features,
  }
}

// Match a browser gamepad id against the local model list and the SDL name table.
export function identifyController(gamepadId: string): ControllerModel | null {
  if (!gamepadId) return null;

  const lowerCaseId = gamepadId.toLowerCase();
  const vendorProductId = extractVendorProductId(gamepadId);

  if (vendorProductId) {
    const matchByVendorProduct = sortedDatabase.find(controller =>
      controller.vendorProductIds?.some(id => id.toLowerCase() === vendorProductId)
    );

    if (matchByVendorProduct) {
      return matchByVendorProduct;
    }
  }

  for (const controller of sortedDatabase) {
    if (controller.identifiers.some(identifier =>
      lowerCaseId.includes(identifier.toLowerCase())
    )) {
      return controller;
    }
  }

  if (vendorProductId && knownGamepads[vendorProductId]) {
    const controllerName = knownGamepads[vendorProductId];
    const manufacturer = getManufacturerFromVendorId(vendorProductId);
    const nameLower = controllerName.toLowerCase();
    let controllerType = 'generic';

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

    const readableName = formatControllerName(controllerName)
    return {
      id: vendorProductId,
      name: readableName,
      manufacturer,
      type: controllerType,
      description: `${readableName} from ${manufacturer}. Recognized from USB id ${vendorProductId}.`,
      features: [],
      identifiers: [controllerName.toLowerCase()],
      vendorProductIds: [vendorProductId],
    };
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
    
    const named = manufacturer !== 'Unknown'
    return {
      id: vendorProductId,
      name: named ? `${manufacturer} Controller` : 'Unknown Controller',
      manufacturer: manufacturer,
      type: controllerType,
      description: named
        ? `${manufacturer} controller. The catalog does not have a specific model for USB id ${vendorProductId}.`
        : `Unrecognized controller at USB id ${vendorProductId}.`,
      features: [],
      identifiers: [],
      vendorProductIds: [vendorProductId]
    };
  }
  
  if (lowerCaseId.includes('steam deck')) {
    return {
      id: 'steam-deck',
      name: 'Steam Deck',
      manufacturer: 'Valve',
      type: 'steam',
      description: 'Steam Deck handheld.',
      features: [],
      identifiers: [],
      vendorProductIds: []
    };
  }

  // Chrome reports many Xbox pads as "Xbox Wireless Controller" with no model.
  if (lowerCaseId.includes('xbox wireless controller')) {
    return {
      id: 'xbox-wireless',
      name: 'Xbox Wireless Controller',
      manufacturer: 'Microsoft',
      type: 'xbox',
      description: 'Xbox controller reported without a specific model.',
      features: [],
      identifiers: [],
      vendorProductIds: []
    };
  }

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

  // Chrome often reports DualShock and DualSense with this generic name.
  if (lowerCaseId.includes('wireless controller')) {
    return {
      id: 'wireless-controller',
      name: 'PlayStation Controller',
      manufacturer: 'Sony',
      type: 'playstation',
      description: 'Sony controller reported by the browser as Wireless Controller.',
      features: [],
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
      '045e:0b05', // Xbox Elite Series 2 (Bluetooth / wireless adapter)
      '045e:0b20',
      '045e:0b22',
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
    identifiers: ['xbox one', 'microsoft xbox one'],
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
    id: 'switch-joycon-left',
    name: 'Joy-Con (L)',
    manufacturer: 'Nintendo',
    type: 'nintendo',
    description: 'Left Joy-Con, with the stick, D-pad, capture button, and minus.',
    features: ['HD Rumble', 'Motion Controls'],
    identifiers: ['joy-con (l)', 'joy-con l', 'joy-con left', 'joycon left', 'left joy-con'],
    vendorProductIds: ['057e:2006'],
    priority: 95
  },
  {
    id: 'switch-joycon-right',
    name: 'Joy-Con (R)',
    manufacturer: 'Nintendo',
    type: 'nintendo',
    description: 'Right Joy-Con, with the face buttons, stick, plus, and home.',
    features: ['HD Rumble', 'Motion Controls', 'IR Camera'],
    identifiers: ['joy-con (r)', 'joy-con r', 'joy-con right', 'joycon right', 'right joy-con'],
    vendorProductIds: ['057e:2007'],
    priority: 95
  },
  {
    id: 'switch-joycon',
    name: 'Joy-Con Pair',
    manufacturer: 'Nintendo',
    type: 'nintendo',
    description: 'Left and right Joy-Con used together, including in the grip.',
    features: ['HD Rumble', 'Motion Controls', 'IR Camera', 'Amiibo Support'],
    identifiers: ['joy-con', 'joycon', 'nintendo switch joy'],
    vendorProductIds: ['057e:200e'],
    priority: 40
  },
  {
    id: 'switch-pro',
    name: 'Nintendo Switch Pro Controller',
    manufacturer: 'Nintendo',
    type: 'nintendo',
    description: 'Premium controller for the Nintendo Switch with motion controls and HD rumble.',
    features: ['HD Rumble', 'Motion Controls', 'Amiibo Support'],
    identifiers: ['nintendo switch pro', 'pro controller'],
    vendorProductIds: ['057e:2009'],
    priority: 70
  },
  {
    id: 'wii-u-pro',
    name: 'Wii U Pro Controller',
    manufacturer: 'Nintendo',
    type: 'nintendo',
    description: 'Full-size controller for the Wii U.',
    features: ['Rumble', 'Digital Triggers'],
    identifiers: ['wii u pro', 'wiiu pro'],
    vendorProductIds: ['057e:0330'],
    priority: 70
  },
  {
    id: 'gamecube',
    name: 'GameCube Controller',
    manufacturer: 'Nintendo',
    type: 'nintendo',
    description: 'GameCube controller, including pads connected through an adapter.',
    features: ['Analog Triggers', 'Click Stick'],
    identifiers: ['gamecube', 'game cube', 'wavebird'],
    vendorProductIds: ['057e:0337', '0079:1844'],
    priority: 70
  },
  {
    id: 'wiimote',
    name: 'Wii Remote',
    manufacturer: 'Nintendo',
    type: 'nintendo',
    description: 'Wii Remote, with or without a Nunchuk.',
    features: ['Pointer', 'Motion Controls', 'Speaker'],
    identifiers: ['wiimote', 'wii remote'],
    vendorProductIds: ['057e:0306'],
    priority: 70
  },
  {
    id: 'xbox-controller-s',
    name: 'Xbox Controller S',
    manufacturer: 'Microsoft',
    type: 'xbox',
    description: 'The smaller controller for the original Xbox.',
    features: ['Rumble', 'Memory Card Slots'],
    identifiers: ['xbox controller s', 'controller s'],
    vendorProductIds: ['045e:0285', '045e:0287', '045e:0288', '045e:0289'],
    priority: 75
  },
  {
    id: 'xbox-duke',
    name: 'Xbox Controller (Duke)',
    manufacturer: 'Microsoft',
    type: 'xbox',
    description: 'The original large Xbox controller.',
    features: ['Rumble', 'Memory Card Slots'],
    identifiers: ['xbox duke', 'duke controller'],
    vendorProductIds: ['045e:0202'],
    priority: 75
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
    id: 'steam-2026',
    name: 'Steam Controller (2026)',
    manufacturer: 'Valve',
    type: 'steam',
    description: 'The current Steam Controller. Two sticks, a D-pad, four face buttons, a trackpad on each side, and four grip buttons.',
    features: ['Two Thumbsticks', 'Two Trackpads', 'Four Grip Buttons', 'Motion Controls', 'Puck Receiver', 'USB-C'],
    identifiers: ['steam controller (2026)', 'steam controller 2026', 'steam controller 2', 'triton'],
    vendorProductIds: [
      '28de:1302', // wired
      '28de:1303', // Bluetooth
      '28de:1304', // wireless puck
      '28de:1305', // Steam Machine internal receiver
    ],
    priority: 92
  },
  {
    id: 'steam',
    name: 'Steam Controller (2015)',
    manufacturer: 'Valve',
    type: 'steam',
    description: 'The original Steam Controller, with one stick and two large trackpads.',
    features: ['Dual Trackpads', 'Haptic Feedback', 'Customizable Controls'],
    identifiers: ['steam controller', 'valve'],
    vendorProductIds: ['28de:1102', '28de:1142']
  },
  {
    id: '8bitdo-pro2',
    name: '8BitDo Pro 2',
    manufacturer: '8BitDo',
    type: 'generic',
    description: 'Modern 8BitDo pad with back buttons and switchable layouts.',
    features: ['Back Buttons', 'Bluetooth', 'XInput / Switch / DInput'],
    identifiers: ['8bitdo pro 2', '8bitdo pro2'],
    vendorProductIds: ['2dc8:3104', '2dc8:6003', '2dc8:6006'],
    priority: 80
  },
  {
    id: '8bitdo-sn30',
    name: '8BitDo SN30',
    manufacturer: '8BitDo',
    type: 'generic',
    description: 'SNES-shaped 8BitDo controller, including the SN30 Pro.',
    features: ['Bluetooth', 'Retro Shape'],
    identifiers: ['8bitdo sn30', 'sn30 pro'],
    vendorProductIds: ['2dc8:6001', '2dc8:6101', '2dc8:3000', '2dc8:2840', '2dc8:ab20', '2dc8:2101'],
    priority: 75
  },
  {
    id: '8bitdo-sf30',
    name: '8BitDo SF30',
    manufacturer: '8BitDo',
    type: 'generic',
    description: 'Super Famicom-shaped 8BitDo controller.',
    features: ['Bluetooth', 'Retro Shape'],
    identifiers: ['8bitdo sf30', 'sfc30'],
    vendorProductIds: ['2dc8:6000', '2dc8:6100', '2dc8:3001', '2dc8:2830', '2dc8:ab21'],
    priority: 75
  },
  {
    id: '8bitdo-nes30',
    name: '8BitDo NES30',
    manufacturer: '8BitDo',
    type: 'generic',
    description: 'NES-shaped 8BitDo controller.',
    features: ['Bluetooth', 'Retro Shape'],
    identifiers: ['8bitdo nes30', 'nes30 pro'],
    vendorProductIds: ['2dc8:3820', '2dc8:9001', '2002:9000', '3820:0009'],
    priority: 75
  },
  {
    id: '8bitdo',
    name: '8BitDo Controller',
    manufacturer: '8BitDo',
    type: 'generic',
    description: 'Retro-inspired 8BitDo controller.',
    features: ['Bluetooth', 'Multiple Platform Support'],
    identifiers: ['8bitdo'],
    vendorProductIds: [],
    priority: 20
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
    id: 'qanba',
    name: 'Qanba Arcade Stick',
    manufacturer: 'Qanba',
    type: 'arcade',
    description: 'Arcade stick from Qanba, including the Obsidian and Drone.',
    features: ['Arcade Buttons', 'Sanwa-style Lever'],
    identifiers: ['qanba'],
    vendorProductIds: ['2c22:2000', '2c22:2300', '2c22:2302', '0f30:1012', '0f30:1100', '0f30:1112', '0f30:1116', '1a34:0401'],
    priority: 70
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

const sortedDatabase = [...controllerDatabase].sort(
  (a, b) => (b.priority || 0) - (a.priority || 0)
)

export interface CatalogEntry {
  id: string
  name: string
  manufacturer: string
  type: string
  description: string
  features: string[]
}

const CATALOG_ORDER = ['Microsoft', 'Sony', 'Nintendo', 'Valve']

export function controllerCatalog(): CatalogEntry[] {
  return controllerDatabase
    .map(model => ({
      id: model.id,
      name: model.name,
      manufacturer: model.manufacturer,
      type: model.type,
      description: model.description,
      features: model.features,
    }))
    .sort((a, b) => {
      const rank = (manufacturer: string) => {
        const index = CATALOG_ORDER.indexOf(manufacturer)
        return index === -1 ? CATALOG_ORDER.length : index
      }
      const byRank = rank(a.manufacturer) - rank(b.manufacturer)
      if (byRank !== 0) return byRank
      const byMaker = a.manufacturer.localeCompare(b.manufacturer)
      if (byMaker !== 0) return byMaker
      return a.name.localeCompare(b.name)
    })
}

export function controllerById(id: string): CatalogEntry | null {
  const model = controllerDatabase.find(entry => entry.id === id)
  if (!model) return null
  return {
    id: model.id,
    name: model.name,
    manufacturer: model.manufacturer,
    type: model.type,
    description: model.description,
    features: model.features,
  }
}
