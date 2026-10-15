import { isDemoModeEnabled } from "../config/demo-mode";
import { handleMockRequest } from "../mocks/api-responses";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function shouldUseMockFallback(input: string): boolean {
  if (!input.startsWith("/api/")) return false;
  if (!isDemoModeEnabled(import.meta.env.VITE_DEMO_MODE)) return false;
  // 仅生产构建才启用本地回退；测试/dev 仍由 MSW 或 dev server 接管。
  if (!import.meta.env.PROD) return false;
  if (typeof window === "undefined") return false;

  const sw = navigator.serviceWorker;
  // WebView 不支持 SW（如微信 iOS）时 sw 为 undefined；
  // SW 注册失败或尚未控制页面时 controller 为 null。
  if (!sw || !sw.controller) return true;
  return false;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T | { message?: string };
  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : "请求失败，请稍后重试。";
    throw new ApiError(message, response.status);
  }
  return body as T;
}

export async function apiRequest<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  if (shouldUseMockFallback(input)) {
    const request = new Request(new URL(input, window.location.href), init);
    const mockResponse = await handleMockRequest(request);
    if (mockResponse) {
      return parseResponse<T>(mockResponse);
    }
  }

  const response = await fetch(input, init);
  return parseResponse<T>(response);
}
