/* Analytics wrapper for Umami
 * Envs: local | prod (NEXT_PUBLIC_APP_ENV)
 * - local: logs only (no network)
 * - prod: sends events
 * Sampling: NEXT_PUBLIC_ANALYTICS_SAMPLE_SOURCE_CLICK (0..1)
 * Optional event toggle: NEXT_PUBLIC_ANALYTICS_ENABLE_SEARCH_ERROR ('1' to enable)
 */

export type AppEnv = 'local' | 'prod';

export const getEnv = (): AppEnv => {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV;
  if (appEnv === 'local' || appEnv === 'prod') return appEnv;
  return process.env.NODE_ENV === 'development' ? 'local' : 'prod';
};

const getSampleRate = (event: string): number => {
  if (event === 'source_click') {
    const v = Number(process.env.NEXT_PUBLIC_ANALYTICS_SAMPLE_SOURCE_CLICK ?? '1');
    return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 1;
  }
  return 1;
};

const isEventEnabled = (event: string): boolean => {
  if (event === 'search_error') {
    return (process.env.NEXT_PUBLIC_ANALYTICS_ENABLE_SEARCH_ERROR ?? '0') === '1';
  }
  return true;
};

export const safeTrack = (event: string, data?: Record<string, any>) => {
  try {
    if (!isEventEnabled(event)) {
      return;
    }

    if (getEnv() === 'local') {
      // Do not send in local; just log
      // eslint-disable-next-line no-console
      console.debug(`📊 [LOCAL] ${event}`, data);
      return;
    }

    // Sampling
    const sampleRate = getSampleRate(event);
    if (Math.random() > sampleRate) {
      return;
    }

    if (typeof window !== 'undefined') {
      const w: any = window as any;
      const umami = w.umami;

      // Support both API shapes: function or object with .track
      if (typeof umami === 'function') {
        umami(event, data);
      } else if (umami && typeof umami.track === 'function') {
        umami.track(event, data);
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Analytics tracking failed:', e);
  }
};
