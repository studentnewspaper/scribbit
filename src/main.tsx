import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as Sentry from "@sentry/react";
import ErrorPage from "./layouts/Error";

const commit = import.meta.env.VITE_COMMIT ?? undefined;
if (commit != null) {
  console.log(`Running commit ${commit}`);
}

Sentry.init({
  dsn: "https://f5ccc3eddf4b4c7cb656355f0af02b6b@o431302.ingest.sentry.io/5992031",
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
  release: commit,
});

ReactDOM.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={ErrorPage}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
