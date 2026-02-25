/**
 * Axios interceptor that returns demo data for all API calls.
 * Only active when VITE_APP_NETWORK !== "army".
 */
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  demoUserUnit,
  demoFamilies,
  demoParams,
  demoTsavIrgunRoutine,
  demoTsavIrgunEmergency,
  demoOperations,
  demoEmergencyGduds,
  demoDashboardEquipments,
  demoZadiksData,
  demoKshirutData,
  demoScreens,
  demoCategories,
  demoMaterials,
  demoVariants,
  demoScreenComponents,
  demoComponentSettings,
  demoComponentData,
  demoTopViewData,
  demoTopViewDynamicFilters,
  demoFaultData,
  demoTags,
  demoTagOptions,
  demoLogs,
  demoSummaryFaults,
  demoScreenCreators,
  demoSharedScreens,
} from "./demoData";

function mockResponse(
  data: any,
  config: InternalAxiosRequestConfig,
): AxiosResponse {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: { "x-csrf-token": "demo-token" },
    config,
  };
}

/** Strip baseURL prefix and leading slashes to get the clean endpoint path */
function getUrl(config: InternalAxiosRequestConfig): string {
  let url = config.url || "";
  // Remove baseURL prefix if present
  if (config.baseURL && url.startsWith(config.baseURL)) {
    url = url.slice(config.baseURL.length);
  }
  // Remove leading slashes
  return url.replace(/^\/+/, "");
}

function getParam(
  config: InternalAxiosRequestConfig,
  key: string,
): string | undefined {
  return config.params?.[key]?.toString();
}

function routeRequest(
  config: InternalAxiosRequestConfig,
): AxiosResponse | null {
  const url = getUrl(config);
  const method = (config.method || "get").toLowerCase();

  console.log(`[MOCK] ${method.toUpperCase()} /${url}`);

  // HEAD requests (CSRF token fetch)
  if (method === "head") {
    return mockResponse(null, config);
  }

  // User unit
  if (url === "userunit") {
    if (method === "get") return mockResponse(demoUserUnit, config);
    if (method === "put") return mockResponse(null, config);
  }

  // Parameters
  if (url === "parameter") {
    const domain = getParam(config, "domain") || "";
    return mockResponse(demoParams[domain] || [], config);
  }

  // Families
  if (url === "family") {
    return mockResponse(demoFamilies, config);
  }

  // Tsav Irgun
  if (url === "tsav-irgun/routine") {
    return mockResponse(demoTsavIrgunRoutine, config);
  }
  if (url === "tsav-irgun/emergency") {
    return mockResponse(demoTsavIrgunEmergency, config);
  }
  if (url === "tsav-irgun/emergency-operation") {
    return mockResponse(
      demoOperations.map((o) => ({ code: o.code, description: o.description })),
      config,
    );
  }
  if (url === "tsav-irgun/emergency/gdud") {
    return mockResponse(demoEmergencyGduds, config);
  }
  if (url === "tsav-irgun/maneuvering") {
    if (method === "get") return mockResponse(true, config);
    if (method === "put") return mockResponse(true, config);
  }
  if (url === "tsav-irgun") {
    return mockResponse(demoTsavIrgunRoutine.slice(0, 2), config);
  }

  // Dashboard equipment data
  if (url === "equipment/dashboard") {
    if (method === "get") return mockResponse(demoDashboardEquipments, config);
    if (method === "put")
      return mockResponse(
        { equipments: demoDashboardEquipments, errors: [] },
        config,
      );
  }

  // Top view
  if (url === "equipment/top-view") {
    return mockResponse(demoTopViewData, config);
  }
  if (url === "equipment/top-view/filters") {
    return mockResponse(demoTopViewDynamicFilters, config);
  }
  if (url === "equipment/missing-hh") {
    return mockResponse([], config);
  }

  // Equipment / Zadik
  if (url === "equipment/family") {
    return mockResponse(demoZadiksData, config);
  }
  if (url === "equipment") {
    const eq = getParam(config, "equipment");
    const found = demoZadiksData.find((z) => z.equipment === eq);
    return mockResponse(found || demoZadiksData[0], config);
  }

  // Kshirut
  if (url === "kshirut") {
    if (method === "get") return mockResponse(demoKshirutData, config);
    if (method === "post") return mockResponse(demoKshirutData, config);
  }

  // Faults
  if (url === "fault/equipment") {
    return mockResponse(demoSummaryFaults, config);
  }
  if (url === "fault") {
    if (method === "get") return mockResponse(demoFaultData, config);
    if (method === "post") return mockResponse(demoFaultData, config);
    if (method === "put") return mockResponse(demoFaultData, config);
  }

  // Material HH/EMZ
  if (
    url.includes("material-hh/descriptions") ||
    url.includes("material-hh/description-by-mateial")
  ) {
    return mockResponse([], config);
  }
  if (url.startsWith("material-hh") || url.startsWith("material-emz")) {
    return mockResponse(true, config);
  }

  // Tags
  if (url === "tag/all") {
    return mockResponse(
      demoTagOptions.map((o) => ({ id: o.value, text: o.text })),
      config,
    );
  }
  if (url === "tag") {
    if (method === "get") return mockResponse(demoTags, config);
    if (method === "post") return mockResponse(null, config);
  }

  // Logs
  if (url === "log") {
    return mockResponse(demoLogs, config);
  }

  // View
  if (url === "view") {
    return mockResponse(null, config);
  }

  // Chat
  if (url.startsWith("chat")) {
    if (method === "get") return mockResponse([], config);
    if (method === "post")
      return mockResponse({ id: "CHAT01", messages: [] }, config);
  }

  // Screens
  if (url === "screen/creators") {
    return mockResponse(demoScreenCreators, config);
  }
  if (url === "screen/shared") {
    return mockResponse(demoSharedScreens, config);
  }
  if (url === "screen/share") {
    return mockResponse(true, config);
  }
  if (url === "screen/catalog") {
    return mockResponse(demoSharedScreens, config);
  }
  if (url === "screen/components") {
    return mockResponse(null, config);
  }
  if (url === "screen") {
    if (method === "get") return mockResponse(demoScreens, config);
    if (method === "post")
      return mockResponse({ ...demoScreens[0], id: "SCR_NEW" }, config);
  }

  // Categories
  if (url === "category") {
    return mockResponse(demoCategories, config);
  }

  // Materials
  if (url === "material") {
    return mockResponse(demoMaterials, config);
  }

  // Variants
  if (url.startsWith("variant/") && method === "delete") {
    return mockResponse(null, config);
  }
  if (url === "variant") {
    if (method === "get") return mockResponse(demoVariants, config);
    if (method === "post")
      return mockResponse({ ...demoVariants[0], variantId: 99 }, config);
  }

  // Components
  if (url === "component/drilldown") {
    return mockResponse({ components: [], total: 0 }, config);
  }
  if (url === "component/components") {
    return mockResponse(demoScreenComponents, config);
  }
  if (url === "component/data") {
    const compId = getParam(config, "componentId");
    const type = compId === "CMP02" ? "02" : compId === "CMP03" ? "03" : "01";
    return mockResponse(demoComponentData[type], config);
  }
  if (url === "component") {
    if (method === "get") {
      const compId = getParam(config, "componentId") || "CMP01";
      return mockResponse(
        demoComponentSettings[compId] || demoComponentSettings["CMP01"],
        config,
      );
    }
    if (method === "post" || method === "put")
      return mockResponse(
        { id: "SCR01", compHeader: [], compMeta: [] },
        config,
      );
  }

  // Fallback: log unhandled routes and return empty
  console.warn(`[MOCK] Unhandled route: ${method.toUpperCase()} /${url}`);
  return mockResponse(null, config);
}

export function installMockInterceptor(instance: AxiosInstance) {
  // Override the adapter on the instance to intercept all requests
  instance.defaults.adapter = (config: InternalAxiosRequestConfig) => {
    const response = routeRequest(config);
    if (response) {
      return Promise.resolve(response);
    }
    // Should never reach here since we have a fallback, but just in case
    return Promise.resolve(mockResponse(null, config));
  };
}
