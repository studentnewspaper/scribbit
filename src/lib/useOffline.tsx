import React, { createContext, FC, useContext, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import * as Sentry from "@sentry/react";

type OfflineContextType = {
  offlineReady: boolean;
};

const defaultOfflineContext: OfflineContextType = {
  offlineReady: false,
};

const OfflineContext = createContext<OfflineContextType>(defaultOfflineContext);

export function useOffline() {
  return useContext(OfflineContext);
}

export const OfflineProvider: FC = ({ children }) => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered: (registration) => {
      if (registration != null) {
        console.log(`Service worker registered`);
        // Assume that we are now offline ready. Vite PWA only updates offlineReady on the first install, so we'll do this
        setOfflineReady(true);
      } else {
        console.warn(`Could not register service worker`);
      }
    },
    onNeedRefresh: () => {
      updateServiceWorker(true);
    },
    onRegisterError: (err) => {
      console.error(err);
      Sentry.captureException(err);
    },
  });

  return (
    <OfflineContext.Provider
      value={{
        offlineReady,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};
