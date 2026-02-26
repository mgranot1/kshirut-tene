import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import cookie from "react-cookie";
import AuthService from "../../report/services/auth.service";
import { installMockInterceptor } from "../../mock/mockInterceptor";

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development")
    return import.meta.env.VITE_APP_DEVELOP_BASE_URL;
  if (import.meta.env.VITE_APP_NETWORK === "army") {
    const envName = window.location.origin.split(".")[1];
    const envNameForURL = envName === "erp" ? "" : "." + envName;
    const urlByEnvironment = `https://ecc${envNameForURL}.erp.idf`;

    return urlByEnvironment + import.meta.env.VITE_APP_BASE_URL;
  }

  return import.meta.env.VITE_APP_BASE_URL;
};

const baseURL = getBaseUrl();

const MAX_RETRY_ATTEMPTS = 3;

const getParams = () => {
  const params = {};

  if (baseURL?.includes("dev")) {
    params["sap-client"] = 120;
    params["saml2"] = "disabled";
    params["sap-language"] = "he";
  }

  if (baseURL?.includes("qas")) {
    params["saml2"] = "disabled";
    params["sap-language"] = "he";
  }

  return params;
};

const axiosConfig: AxiosRequestConfig = {
  baseURL,
  headers: {
    "Cache-Control": "no-cache",
  },
  params: import.meta.env.VITE_APP_NETWORK === "army" ? getParams() : {},
  withCredentials: true,
};

const AxiosInstance = axios.create(axiosConfig);

const methodNeedingCsrf = ["post", "put", "delete"];

AxiosInstance.interceptors.request.use((config) => {
  if (config.method && methodNeedingCsrf.includes(config.method)) {
    const csrfToken = cookie.load("X-CSRF-Token");
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const res = <AxiosResponse>{};
    const originalRequest = error.config;

    // if (!originalRequest || !originalRequest.retry)
    //   return Promise.reject(error);

    originalRequest.__retryCount = originalRequest.__retryCount || 0;
    console.log("error", error);

    // In case of unauthorized
    if (
      import.meta.env.VITE_APP_NETWORK === "army" &&
      (error.response?.status == "403" || error.response?.status == "401") &&
      originalRequest.__retryCount < MAX_RETRY_ATTEMPTS
    ) {
      originalRequest.__retryCount += 1;

      // renew csrf token
      try {
        cookie.remove();
        // cookie.remove("X-CSRF-Token", { path: "/" });
        // cookie.remove("MYSAPSSO2", { path: "/" });
        const newCsrfToken = await AuthService.getCSRFToken();

        AxiosInstance.defaults.headers["X-CSRF-Token"] = newCsrfToken;
        originalRequest.headers["X-CSRF-Token"] = newCsrfToken;

        // retry request
        return AxiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    } else if (
      import.meta.env.VITE_APP_NETWORK === "ts" &&
      error.response?.status === 401
    ) {
      const event = new CustomEvent("sessionEnded");
      window.dispatchEvent(event);

      return Promise.resolve();
    }

    return Promise.reject(error);
  },
);

// Install mock interceptor for demo/local mode (no backend needed)
if (import.meta.env.VITE_APP_NETWORK !== "army") {
  installMockInterceptor(AxiosInstance as any);
}

export default AxiosInstance;
