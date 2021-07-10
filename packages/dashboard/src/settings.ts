export enum TrajectoryAnimation {
  None,
  Follow,
}

export enum ThemeMode {
  Light,
  Dark,
}

export enum UseTheme {
  True,
  False,
}

export interface Settings {
  trajectoryAnimation: TrajectoryAnimation;
  themeMode: ThemeMode;
  useTheme: UseTheme;
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem('settings', JSON.stringify(settings));
}

export function loadSettings(): Settings {
  const settingsStr = localStorage.getItem('settings');
  if (!settingsStr) {
    return defaultSettings();
  }
  return JSON.parse(settingsStr);
}

export function defaultSettings(): Settings {
  return {
    trajectoryAnimation: TrajectoryAnimation.Follow,
    themeMode: ThemeMode.Light,
    useTheme: UseTheme.False,
  };
}
