import { GamepadState } from '../hooks/useGamepad';

export const exportControllerDataUtil = (activeGamepad: GamepadState | null) => {
  if (!activeGamepad) return;

  const exportData = {
    controller: {
      id: activeGamepad.id,
      type: activeGamepad.type,
      mapping: activeGamepad.mapping,
      model: activeGamepad.modelInfo ? activeGamepad.modelInfo.name : 'Unknown',
      manufacturer: activeGamepad.modelInfo ? activeGamepad.modelInfo.manufacturer : 'Unknown',
    },
    buttons: activeGamepad.buttons.map((button, index) => ({
      index,
      pressed: button.pressed,
      value: button.value
    })),
    axes: activeGamepad.axes.map((axis, index) => ({
      index,
      value: axis
    })),
    stickDrift: activeGamepad.stickDrift ?? {
      leftStick: { detected: false, value: { x: 0, y: 0 } },
      rightStick: { detected: false, value: { x: 0, y: 0 } }
    },
    diagnostics: {
      pollingRate: activeGamepad.pollingData?.rate ?? 0,
      latency: activeGamepad.latencyData?.averageLatency ?? 0,
      browser: `${activeGamepad.browserCompatibility?.name ?? 'Unknown'} ${activeGamepad.browserCompatibility?.version ?? ''}`
    },
    timestamp: new Date().toISOString()
  };

  const jsonString = JSON.stringify(exportData, null, 2);

  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `controller-data-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};
