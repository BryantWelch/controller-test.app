// Gamepad Vendor/Product ID Database
// This file provides a mapping of vendor:product IDs to controller names
// Based on the known_gamepads.txt file

import { controllerDatabase, ControllerModel } from './controllerDatabase';

// Interface for the vendor/product ID mapping
export interface VendorProductMapping {
  [key: string]: string; // vendorId:productId -> controller name
}

// Parse the known_gamepads.txt file and build a mapping
export async function buildVendorProductDatabase(): Promise<VendorProductMapping> {
  try {
    const response = await fetch('/components/controller/known_gamepads.txt');
    const text = await response.text();
    
    const mapping: VendorProductMapping = {};
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
    console.error('Error building vendor/product database:', error);
    return {};
  }
}

// Map a vendor/product ID to a known controller in our database
export function mapVendorProductIdToController(
  vendorProductId: string,
  vendorProductMapping: VendorProductMapping
): ControllerModel | null {
  if (!vendorProductId || !vendorProductMapping[vendorProductId]) {
    return null;
  }
  
  const controllerName = vendorProductMapping[vendorProductId];
  const lowerCaseName = controllerName.toLowerCase();
  
  // Try to find a matching controller based on the name
  // First check for exact matches in vendorProductIds
  for (const controller of controllerDatabase) {
    if (controller.vendorProductIds?.includes(vendorProductId)) {
      return controller;
    }
  }
  
  // Then try to match based on name patterns
  for (const controller of controllerDatabase) {
    // Check if any of the controller's identifiers are in the name
    if (controller.identifiers.some(id => lowerCaseName.includes(id.toLowerCase()))) {
      return controller;
    }
    
    // For Xbox controllers
    if (lowerCaseName.includes('xbox') && controller.type === 'xbox') {
      if (
        (lowerCaseName.includes('one') && controller.id === 'xbox-one') ||
        (lowerCaseName.includes('360') && controller.id === 'xbox-360') ||
        (lowerCaseName.includes('elite') && controller.id === 'xbox-elite')
      ) {
        return controller;
      }
    }
    
    // For PlayStation controllers
    if ((lowerCaseName.includes('playstation') || lowerCaseName.includes('dual')) && 
        controller.type === 'playstation') {
      if (
        (lowerCaseName.includes('5') || lowerCaseName.includes('dualsense')) && controller.id === 'ps5-dualsense' ||
        (lowerCaseName.includes('4') || lowerCaseName.includes('dualshock 4')) && controller.id === 'ps4-dualshock4' ||
        (lowerCaseName.includes('3') || lowerCaseName.includes('dualshock 3')) && controller.id === 'ps3-dualshock3'
      ) {
        return controller;
      }
    }
  }
  
  return null;
}

// Enhanced controller identification using vendor/product database
export async function enhancedControllerIdentification(gamepadId: string): Promise<ControllerModel | null> {
  // First try the regular identification
  const regularIdentification = controllerDatabase.find(controller => 
    controller.identifiers.some(id => gamepadId.toLowerCase().includes(id.toLowerCase()))
  );
  
  if (regularIdentification) {
    return regularIdentification;
  }
  
  // If that fails, try using the vendor/product database
  try {
    const vendorProductId = extractVendorProductId(gamepadId);
    if (!vendorProductId) return null;
    
    const database = await buildVendorProductDatabase();
    return mapVendorProductIdToController(vendorProductId, database);
  } catch (error) {
    console.error('Error in enhanced controller identification:', error);
    return null;
  }
}

// Extract vendor/product ID from gamepad ID string
function extractVendorProductId(gamepadId: string): string | null {
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
