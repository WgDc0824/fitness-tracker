export interface UserSettings {
  restTime: number;
  enableNotifications: boolean;
  notificationTime?: string;
  theme: 'dark' | 'light';
}

export const DEFAULT_SETTINGS: UserSettings = {
  restTime: 90,
  enableNotifications: false,
  theme: 'dark'
};