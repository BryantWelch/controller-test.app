import { useMemo } from 'react';
import { detectBrowser, BrowserCompatibilityInfo } from '../../utils/gamepadUtils';

/**
 * Custom hook to get browser compatibility information for the Gamepad API.
 * Uses useMemo to ensure detectBrowser is called only once.
 */
export const useBrowserCompatibility = (): BrowserCompatibilityInfo => {
  const browserInfo = useMemo(() => detectBrowser(), []);
  return browserInfo;
};
