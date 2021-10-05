import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://f5ccc3eddf4b4c7cb656355f0af02b6b@o431302.ingest.sentry.io/5992031",
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
});

ReactDOM.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={<p>An error occurred, and has been reported</p>}
    >
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
