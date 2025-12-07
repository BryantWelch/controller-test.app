import { useState, useEffect, useCallback, useRef } from 'react';

// WebHID types
interface HIDDevice {
  opened: boolean;
  vendorId: number;
  productId: number;
  productName: string;
  collections: HIDCollectionInfo[];
  open(): Promise<void>;
  close(): Promise<void>;
  sendReport(reportId: number, data: BufferSource): Promise<void>;
  sendFeatureReport(reportId: number, data: BufferSource): Promise<void>;
  receiveFeatureReport(reportId: number): Promise<DataView>;
  addEventListener(type: string, listener: (event: HIDInputReportEvent) => void): void;
  removeEventListener(type: string, listener: (event: HIDInputReportEvent) => void): void;
}

interface HIDCollectionInfo {
  usage: number;
  usagePage: number;
  inputReports: HIDReportInfo[];
  outputReports: HIDReportInfo[];
  featureReports: HIDReportInfo[];
}

interface HIDReportInfo {
  reportId: number;
  items: HIDReportItem[];
}

interface HIDReportItem {
  isAbsolute: boolean;
  isArray: boolean;
  isRange: boolean;
  hasNull: boolean;
  usages: number[];
  usageMinimum: number;
  usageMaximum: number;
  reportSize: number;
  reportCount: number;
  logicalMinimum: number;
  logicalMaximum: number;
}

interface HIDInputReportEvent extends Event {
  device: HIDDevice;
  reportId: number;
  data: DataView;
}

interface HID {
  getDevices(): Promise<HIDDevice[]>;
  requestDevice(options: { filters: Array<{ vendorId?: number; productId?: number; usagePage?: number; usage?: number }> }): Promise<HIDDevice[]>;
  addEventListener(type: string, listener: (event: HIDConnectionEvent) => void): void;
  removeEventListener(type: string, listener: (event: HIDConnectionEvent) => void): void;
}

interface HIDConnectionEvent extends Event {
  device: HIDDevice;
}

// DualSense/DualShock vendor and product IDs
const SONY_VENDOR_ID = 0x054c;
const DUALSENSE_PRODUCT_ID = 0x0ce6;
const DUALSENSE_EDGE_PRODUCT_ID = 0x0df2;
const DUALSHOCK4_PRODUCT_ID = 0x05c4;
const DUALSHOCK4_V2_PRODUCT_ID = 0x09cc;

// Motion sensor data
export interface MotionData {
  gyroscope: { x: number; y: number; z: number };
  accelerometer: { x: number; y: number; z: number };
  orientation: { pitch: number; roll: number; yaw: number };
}

// Touchpad data
export interface TouchpadData {
  touches: Array<{
    id: number;
    x: number;
    y: number;
    active: boolean;
  }>;
  pressed: boolean;
}

// Battery data
export interface BatteryData {
  level: number; // 0-100
  charging: boolean;
  status: 'full' | 'charging' | 'discharging' | 'unknown';
}

// LED data
export interface LEDData {
  r: number;
  g: number;
  b: number;
  brightness: number;
}

export interface WebHIDState {
  supported: boolean;
  connected: boolean;
  device: HIDDevice | null;
  deviceType: 'dualsense' | 'dualsense-edge' | 'dualshock4' | 'unknown';
  motion: MotionData;
  touchpad: TouchpadData;
  battery: BatteryData;
  led: LEDData;
}

const initialMotion: MotionData = {
  gyroscope: { x: 0, y: 0, z: 0 },
  accelerometer: { x: 0, y: 0, z: 0 },
  orientation: { pitch: 0, roll: 0, yaw: 0 },
};

const initialTouchpad: TouchpadData = {
  touches: [],
  pressed: false,
};

const initialBattery: BatteryData = {
  level: 0,
  charging: false,
  status: 'unknown',
};

const initialLED: LEDData = {
  r: 0,
  g: 0,
  b: 255,
  brightness: 100,
};

export const useWebHID = () => {
  const [state, setState] = useState<WebHIDState>({
    supported: false,
    connected: false,
    device: null,
    deviceType: 'unknown',
    motion: initialMotion,
    touchpad: initialTouchpad,
    battery: initialBattery,
    led: initialLED,
  });

  const deviceRef = useRef<HIDDevice | null>(null);
  const orientationRef = useRef({ pitch: 0, roll: 0, yaw: 0 });

  // Check if WebHID is supported
  useEffect(() => {
    const supported = 'hid' in navigator;
    setState(prev => ({ ...prev, supported }));
  }, []);

  // Store device type for parsing
  const deviceTypeRef = useRef<'dualsense' | 'dualshock4' | 'unknown'>('unknown');

  // Parse DualShock 4 input report (USB: 64 bytes, BT: 78 bytes with report ID 0x11)
  const parseDualShock4Report = useCallback((data: DataView, isUSB: boolean) => {
    // DS4 USB report starts at byte 0, BT report 0x11 starts at byte 2
    const offset = isUSB ? 0 : 2;
    
    // Motion data - DS4 format
    // Gyroscope: bytes 13-18 (signed 16-bit, little endian)
    const gyroX = data.getInt16(13 + offset, true) / 1024;
    const gyroY = data.getInt16(15 + offset, true) / 1024;
    const gyroZ = data.getInt16(17 + offset, true) / 1024;
    
    // Accelerometer: bytes 19-24 (signed 16-bit, little endian)
    const accelX = data.getInt16(19 + offset, true) / 8192;
    const accelY = data.getInt16(21 + offset, true) / 8192;
    const accelZ = data.getInt16(23 + offset, true) / 8192;

    // Calculate orientation from accelerometer
    const pitch = Math.atan2(accelY, Math.sqrt(accelX * accelX + accelZ * accelZ)) * (180 / Math.PI);
    const roll = Math.atan2(-accelX, accelZ) * (180 / Math.PI);
    
    // Integrate gyro for yaw
    orientationRef.current.yaw += gyroZ * 0.016;
    if (orientationRef.current.yaw > 180) orientationRef.current.yaw -= 360;
    if (orientationRef.current.yaw < -180) orientationRef.current.yaw += 360;

    // Touchpad data - DS4 format (bytes 35-42)
    // Each touch point is 4 bytes
    const touch1Byte0 = data.getUint8(35 + offset);
    const touch1Byte1 = data.getUint8(36 + offset);
    const touch1Byte2 = data.getUint8(37 + offset);
    const touch1Byte3 = data.getUint8(38 + offset);
    
    const touch1Active = (touch1Byte0 & 0x80) === 0;
    const touch1X = ((touch1Byte2 & 0x0F) << 8) | touch1Byte1;
    const touch1Y = (touch1Byte3 << 4) | ((touch1Byte2 & 0xF0) >> 4);
    
    const touch2Byte0 = data.getUint8(39 + offset);
    const touch2Byte1 = data.getUint8(40 + offset);
    const touch2Byte2 = data.getUint8(41 + offset);
    const touch2Byte3 = data.getUint8(42 + offset);
    
    const touch2Active = (touch2Byte0 & 0x80) === 0;
    const touch2X = ((touch2Byte2 & 0x0F) << 8) | touch2Byte1;
    const touch2Y = (touch2Byte3 << 4) | ((touch2Byte2 & 0xF0) >> 4);

    // Battery: byte 30 (USB) or 32 (BT)
    const batteryByte = data.getUint8(isUSB ? 30 : 32);
    const batteryLevel = Math.min(((batteryByte & 0x0F) + 1) * 10, 100);
    const charging = (batteryByte & 0x10) !== 0;

    // Touchpad button: byte 7, bit 1
    const touchpadPressed = (data.getUint8(7 + offset) & 0x02) !== 0;

    return {
      motion: {
        gyroscope: { x: gyroX, y: gyroY, z: gyroZ },
        accelerometer: { x: accelX, y: accelY, z: accelZ },
        orientation: { 
          pitch, 
          roll, 
          yaw: orientationRef.current.yaw 
        },
      },
      touchpad: {
        touches: [
          { id: 0, x: touch1X / 1920, y: touch1Y / 942, active: touch1Active },
          { id: 1, x: touch2X / 1920, y: touch2Y / 942, active: touch2Active },
        ].filter(t => t.active),
        pressed: touchpadPressed,
      },
      battery: {
        level: batteryLevel,
        charging,
        status: charging ? 'charging' : batteryLevel === 100 ? 'full' : 'discharging',
      } as BatteryData,
    };
  }, []);

  // Parse DualSense input report
  const parseDualSenseReport = useCallback((data: DataView, isUSB: boolean) => {
    const offset = isUSB ? 0 : 1;
    
    // Motion data - DualSense format
    const gyroX = data.getInt16(15 + offset, true) / 1024;
    const gyroY = data.getInt16(17 + offset, true) / 1024;
    const gyroZ = data.getInt16(19 + offset, true) / 1024;
    
    const accelX = data.getInt16(21 + offset, true) / 8192;
    const accelY = data.getInt16(23 + offset, true) / 8192;
    const accelZ = data.getInt16(25 + offset, true) / 8192;

    const pitch = Math.atan2(accelY, Math.sqrt(accelX * accelX + accelZ * accelZ)) * (180 / Math.PI);
    const roll = Math.atan2(-accelX, accelZ) * (180 / Math.PI);
    
    orientationRef.current.yaw += gyroZ * 0.016;
    if (orientationRef.current.yaw > 180) orientationRef.current.yaw -= 360;
    if (orientationRef.current.yaw < -180) orientationRef.current.yaw += 360;

    // Touchpad - DualSense format (bytes 33-40)
    const touch1Byte0 = data.getUint8(33 + offset);
    const touch1Byte1 = data.getUint8(34 + offset);
    const touch1Byte2 = data.getUint8(35 + offset);
    const touch1Byte3 = data.getUint8(36 + offset);
    
    const touch1Active = (touch1Byte0 & 0x80) === 0;
    const touch1X = ((touch1Byte2 & 0x0F) << 8) | touch1Byte1;
    const touch1Y = (touch1Byte3 << 4) | ((touch1Byte2 & 0xF0) >> 4);
    
    const touch2Byte0 = data.getUint8(37 + offset);
    const touch2Byte1 = data.getUint8(38 + offset);
    const touch2Byte2 = data.getUint8(39 + offset);
    const touch2Byte3 = data.getUint8(40 + offset);
    
    const touch2Active = (touch2Byte0 & 0x80) === 0;
    const touch2X = ((touch2Byte2 & 0x0F) << 8) | touch2Byte1;
    const touch2Y = (touch2Byte3 << 4) | ((touch2Byte2 & 0xF0) >> 4);

    // Battery
    const batteryByte = data.getUint8(53 + offset);
    const batteryLevel = Math.min((batteryByte & 0x0F) * 10 + 10, 100);
    const charging = ((batteryByte >> 4) & 0x0F) === 0x02;

    // Touchpad button
    const touchpadPressed = (data.getUint8(8 + offset) & 0x02) !== 0;

    return {
      motion: {
        gyroscope: { x: gyroX, y: gyroY, z: gyroZ },
        accelerometer: { x: accelX, y: accelY, z: accelZ },
        orientation: { pitch, roll, yaw: orientationRef.current.yaw },
      },
      touchpad: {
        touches: [
          { id: 0, x: touch1X / 1920, y: touch1Y / 1080, active: touch1Active },
          { id: 1, x: touch2X / 1920, y: touch2Y / 1080, active: touch2Active },
        ].filter(t => t.active),
        pressed: touchpadPressed,
      },
      battery: {
        level: batteryLevel,
        charging,
        status: charging ? 'charging' : batteryLevel === 100 ? 'full' : 'discharging',
      } as BatteryData,
    };
  }, []);

  // Handle input reports
  const handleInputReport = useCallback((event: HIDInputReportEvent) => {
    const { data, reportId } = event;
    
    try {
      let parsed: { motion: MotionData; touchpad: TouchpadData; battery: BatteryData };
      
      if (deviceTypeRef.current === 'dualshock4') {
        // DS4: USB report is 64 bytes (reportId 0x01), BT is 78 bytes (reportId 0x11)
        const isUSB = reportId === 0x01 || data.byteLength === 64;
        parsed = parseDualShock4Report(data, isUSB);
      } else {
        // DualSense: USB report is 64 bytes, BT varies
        const isUSB = data.byteLength === 64;
        parsed = parseDualSenseReport(data, isUSB);
      }
      
      setState(prev => ({
        ...prev,
        motion: parsed.motion,
        touchpad: parsed.touchpad,
        battery: parsed.battery,
      }));
    } catch (error) {
      console.error('Error parsing HID report:', error);
    }
  }, [parseDualShock4Report, parseDualSenseReport]);

  // Connect to device
  const connect = useCallback(async () => {
    if (!state.supported) {
      console.warn('WebHID not supported');
      return false;
    }

    try {
      const hid = (navigator as Navigator & { hid: HID }).hid;
      
      // Request DualSense or DualShock 4
      const devices = await hid.requestDevice({
        filters: [
          { vendorId: SONY_VENDOR_ID, productId: DUALSENSE_PRODUCT_ID },
          { vendorId: SONY_VENDOR_ID, productId: DUALSENSE_EDGE_PRODUCT_ID },
          { vendorId: SONY_VENDOR_ID, productId: DUALSHOCK4_PRODUCT_ID },
          { vendorId: SONY_VENDOR_ID, productId: DUALSHOCK4_V2_PRODUCT_ID },
        ],
      });

      if (devices.length === 0) {
        console.warn('No compatible device selected');
        return false;
      }

      const device = devices[0];
      
      if (!device.opened) {
        await device.open();
      }

      // Determine device type
      let deviceType: WebHIDState['deviceType'] = 'unknown';
      if (device.productId === DUALSENSE_PRODUCT_ID) {
        deviceType = 'dualsense';
        deviceTypeRef.current = 'dualsense';
      } else if (device.productId === DUALSENSE_EDGE_PRODUCT_ID) {
        deviceType = 'dualsense-edge';
        deviceTypeRef.current = 'dualsense';
      } else if (device.productId === DUALSHOCK4_PRODUCT_ID || device.productId === DUALSHOCK4_V2_PRODUCT_ID) {
        deviceType = 'dualshock4';
        deviceTypeRef.current = 'dualshock4';
      }

      device.addEventListener('inputreport', handleInputReport);
      deviceRef.current = device;

      console.log(`WebHID: Connected to ${device.productName} (${deviceType})`);
      console.log(`WebHID: Vendor ID: 0x${device.vendorId.toString(16)}, Product ID: 0x${device.productId.toString(16)}`);

      setState(prev => ({
        ...prev,
        connected: true,
        device,
        deviceType,
      }));

      return true;
    } catch (error) {
      console.error('Error connecting to HID device:', error);
      return false;
    }
  }, [state.supported, handleInputReport]);

  // Disconnect from device
  const disconnect = useCallback(async () => {
    if (deviceRef.current) {
      try {
        deviceRef.current.removeEventListener('inputreport', handleInputReport);
        await deviceRef.current.close();
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
      deviceRef.current = null;
    }

    setState(prev => ({
      ...prev,
      connected: false,
      device: null,
      deviceType: 'unknown',
      motion: initialMotion,
      touchpad: initialTouchpad,
      battery: initialBattery,
    }));
  }, [handleInputReport]);

  // Set LED color
  const setLEDColor = useCallback(async (r: number, g: number, b: number, brightness: number = 100) => {
    if (!deviceRef.current || !state.connected) return false;

    try {
      const adjustedR = Math.round(r * (brightness / 100));
      const adjustedG = Math.round(g * (brightness / 100));
      const adjustedB = Math.round(b * (brightness / 100));

      if (deviceTypeRef.current === 'dualshock4') {
        // DualShock 4 output report (USB: report 0x05, 32 bytes)
        const reportData = new Uint8Array(32);
        reportData[0] = 0xFF; // Rumble flags (none)
        reportData[1] = 0x00; // Right motor
        reportData[2] = 0x00; // Left motor
        reportData[3] = adjustedR; // LED Red
        reportData[4] = adjustedG; // LED Green
        reportData[5] = adjustedB; // LED Blue
        reportData[6] = 0x00; // Flash on duration
        reportData[7] = 0x00; // Flash off duration

        await deviceRef.current.sendReport(0x05, reportData);
      } else {
        // DualSense output report (USB: report 0x02, 48 bytes)
        const reportData = new Uint8Array(48);
        reportData[0] = 0x02; // Valid flag 0
        reportData[1] = 0x04; // Valid flag 1 - LED
        reportData[2] = 0x00; // Valid flag 2
        // Bytes 3-43 are various settings
        reportData[44] = adjustedR; // LED Red
        reportData[45] = adjustedG; // LED Green
        reportData[46] = adjustedB; // LED Blue

        await deviceRef.current.sendReport(0x02, reportData);
      }
      
      setState(prev => ({
        ...prev,
        led: { r, g, b, brightness },
      }));

      return true;
    } catch (error) {
      console.error('Error setting LED color:', error);
      return false;
    }
  }, [state.connected]);

  // Reset orientation
  const resetOrientation = useCallback(() => {
    orientationRef.current = { pitch: 0, roll: 0, yaw: 0 };
    setState(prev => ({
      ...prev,
      motion: {
        ...prev.motion,
        orientation: { pitch: 0, roll: 0, yaw: 0 },
      },
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (deviceRef.current) {
        deviceRef.current.removeEventListener('inputreport', handleInputReport);
        deviceRef.current.close().catch(console.error);
      }
    };
  }, [handleInputReport]);

  return {
    ...state,
    connect,
    disconnect,
    setLEDColor,
    resetOrientation,
  };
};

export default useWebHID;
