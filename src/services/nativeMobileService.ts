import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';

export class NativeMobileService {
  private isNative: boolean;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  get isMobileApp(): boolean {
    return this.isNative;
  }

  get platformName(): string {
    return Capacitor.getPlatform();
  }

  // Initialize native status bar and system configurations
  async init(): Promise<void> {
    if (!this.isNative) return;

    try {
      // Set status bar to dark styling matching the UI
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#030712' }); // Slate-950
    } catch (err) {
      console.warn('StatusBar initialization skipped:', err);
    }

    try {
      // Request local notification permissions on native
      await this.requestNotificationPermissions();
    } catch (err) {
      console.warn('Notification permission request skipped:', err);
    }
  }

  // Request native Android/iOS notification permissions
  async requestNotificationPermissions(): Promise<boolean> {
    if (!this.isNative) return true;
    try {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') {
        return true;
      }
      const req = await LocalNotifications.requestPermissions();
      return req.display === 'granted';
    } catch (err) {
      console.warn('Failed to check/request local notification permissions:', err);
      return false;
    }
  }

  // Native Haptic / Vibration feedback
  async triggerHapticAlert(type: 'danger' | 'warning' | 'success' | 'tap' = 'tap'): Promise<void> {
    if (!this.isNative) {
      // Browser fallback using navigator.vibrate if supported
      if ('vibrate' in navigator) {
        if (type === 'danger') navigator.vibrate([200, 100, 200]);
        else if (type === 'warning') navigator.vibrate([150, 50, 150]);
        else navigator.vibrate(50);
      }
      return;
    }

    try {
      if (type === 'danger') {
        await Haptics.notification({ type: NotificationType.Error });
      } else if (type === 'warning') {
        await Haptics.notification({ type: NotificationType.Warning });
      } else if (type === 'success') {
        await Haptics.notification({ type: NotificationType.Success });
      } else {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
    } catch (err) {
      console.warn('Native haptic error:', err);
    }
  }

  // Schedule real Android System Notification
  async sendSystemNotification(title: string, body: string, id: number = Math.floor(Math.random() * 100000)): Promise<void> {
    if (!this.isNative) return;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            schedule: { at: new Date(Date.now() + 200) },
            sound: 'default',
            smallIcon: 'ic_launcher_round',
            extra: {
              type: 'spam_alert'
            }
          }
        ]
      });
    } catch (err) {
      console.warn('Could not post local native notification:', err);
    }
  }

  // Android Back Button Listener
  registerBackButtonHandler(onBack: () => void): () => void {
    if (!this.isNative) return () => {};

    let removeListener: (() => void) | undefined;

    App.addListener('backButton', () => {
      onBack();
    }).then(handler => {
      removeListener = () => handler.remove();
    }).catch(err => {
      console.warn('Back button listener registration failed:', err);
    });

    return () => {
      if (removeListener) removeListener();
    };
  }
}

export const nativeMobileService = new NativeMobileService();
