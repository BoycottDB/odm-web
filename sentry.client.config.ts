import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Supprimer toute donnée potentiellement personnelle
    if (event.user) {
      delete event.user;
    }
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  }
});