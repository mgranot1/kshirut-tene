import { CacheProvider } from "@emotion/react";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./main.scss";
import { queryClient } from "./queryClient";
import AuthService from "./report/services/auth.service";
import cacheRtl from "./rtl-plugin";

(async () => {
  if (import.meta.env.VITE_APP_NETWORK === "army") {
    await AuthService.getCSRFToken();
  }
})();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={cacheRtl}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </CacheProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
