import React, { createContext, FC, useContext } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import * as Sentry from "@sentry/react";

type OfflineContextType = {
  needsRefresh: boolean;
  offlineReady: boolean;
  update: () => void;
};

const defaultOfflineContext: OfflineContextType = {
  needsRefresh: false,
  offlineReady: false,
  update: () => {},
};

const OfflineContext = createContext<OfflineContextType>(defaultOfflineContext);

export function useOffline() {
  return useContext(OfflineContext);
}

export const OfflineProvider: FC = ({ children }) => {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError: (err) => {
      Sentry.captureException(err);
    },
  });

  return (
    <OfflineContext.Provider
      value={{
        needsRefresh: needRefresh,
        offlineReady,
        update: () => updateServiceWorker(true),
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};
