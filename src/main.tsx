import { createRoot } from "react-dom/client";
import { FirebaseAppProvider, SuspenseWithPerf } from "reactfire";
import CourseCompassApp from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import config from "./config.ts";
import { OverlayProvider } from "react-aria";
import { Inline } from "./components/Inline.tsx";
import { SpinnerIcon } from "./components/Icons.tsx";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <OverlayProvider>
    <FirebaseAppProvider firebaseConfig={config.firebaseConfig} suspense>
      <Router>
        <SuspenseWithPerf
          traceId={"course-compass-auth-wait"}
          fallback={
            <Inline
              minHeight="screen"
              alignItems="center"
              justifyContent="center"
              gap="4"
            >
              <SpinnerIcon size="8" /> Loading...
            </Inline>
          }
        >
          <CourseCompassApp />
          <Toaster
            position="bottom-center"
            reverseOrder
            toastOptions={{
              style: {
                background: "#2c324b",
                color: "#fff",
              },
              success: {
                duration: 5000,
              },
            }}
          />
        </SuspenseWithPerf>
      </Router>
    </FirebaseAppProvider>
  </OverlayProvider>
);
