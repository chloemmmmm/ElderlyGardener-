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

function canUseLocalMock(input: string): boolean {
  if (!input.startsWith("/api/")) return false;
  if (!isDemoModeEnabled(import.meta.env.VITE_DEMO_MODE)) return false;
  // 仅生产构建才启用本地回退；测试/dev 仍由 MSW 或 dev server 接管。
  if (!import.meta.env.PROD) return false;
  return typeof window !== "undefined";
}

async function localMockResponse(
  input: string,
  init?: RequestInit,
): Promise<Response | null> {
  const request = new Request(new URL(input, window.location.href), init);
  return handleMockRequest(request);
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
  // 路径 A：SW 完全不可用（WebView 不支持 / 注册失败 / 尚未控制页面）→ 直接走本地 mock。
  if (canUseLocalMock(input) && !navigator.serviceWorker?.controller) {
    const mockResponse = await localMockResponse(input, init);
    if (mockResponse) return parseResponse<T>(mockResponse);
  }

  const response = await fetch(input, init);

  // 路径 B（启动竞态兜底）：SW 已控制页面但 MSW 尚未就绪（render-first 后台启动）
  // 时，请求会放行到真实服务器并 404。此时改用本地 mock，保证 B 端数据必定可载入。
  if (!response.ok && canUseLocalMock(input)) {
    const mockResponse = await localMockResponse(input, init);
    if (mockResponse) return parseResponse<T>(mockResponse);
  }

  return parseResponse<T>(response);
}
