import { createContext, PropsWithChildren, useCallback, useContext, useRef, useState } from 'react';

import {
  NotificationBanner,
  NotificationData,
  NotificationType,
} from '@/components/ui/NotificationBanner';

type ShowNotificationArgs = {
  type: NotificationType;
  message: string;
  durationMs?: number;
};

type NotificationContextValue = {
  show: (args: ShowNotificationArgs) => void;
  hide: () => void;
};

const DEFAULT_DURATION_MS = 3000;

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearTimer();
    setNotification((prev) => (prev ? { ...prev, visible: false } : null));
  }, [clearTimer]);

  const show = useCallback(
    ({ type, message, durationMs = DEFAULT_DURATION_MS }: ShowNotificationArgs) => {
      clearTimer();
      setNotification({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type,
        message,
        visible: true,
      });
      timerRef.current = setTimeout(hide, durationMs);
    },
    [clearTimer, hide],
  );

  const onHidden = useCallback(() => setNotification(null), []);

  return (
    <NotificationContext.Provider value={{ show, hide }}>
      {children}
      <NotificationBanner notification={notification} onRequestClose={hide} onHidden={onHidden} />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};
