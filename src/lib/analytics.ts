/* Analytics wrapper for Umami
 * Envs: local | prod (NEXT_PUBLIC_APP_ENV)
 * - local: logs only (no network)
 * - prod: sends events
 */

export type AppEnv = 'local' | 'prod';

export const getEnv = (): AppEnv => {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV;
  if (appEnv === 'local' || appEnv === 'prod') return appEnv;
  return process.env.NODE_ENV === 'development' ? 'local' : 'prod';
};

export const safeTrack = (event: string, data?: Record<string, unknown>) => {
  try {
    if (getEnv() === 'local') {
      // Do not send in local; just log
      console.debug(`📊 [LOCAL] ${event}`, data);
      return;
    }

    if (typeof window !== 'undefined') {
      const w = window as unknown as {
        umami?: ((event: string, data?: Record<string, unknown>) => void) | {
          track: (event: string, data?: Record<string, unknown>) => void
        }
      };
      const umami = w.umami;

      // Support both API shapes: function or object with .track
      if (typeof umami === 'function') {
        umami(event, data);
      } else if (umami && typeof umami === 'object' && 'track' in umami && typeof umami.track === 'function') {
        umami.track(event, data);
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Analytics tracking failed:', e);
  }
};
