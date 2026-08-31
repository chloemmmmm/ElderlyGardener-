import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export function RouteErrorPage() {
  const error = useRouteError();
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="route-error">
      <span aria-hidden="true">⌁</span>
      <p className="eyebrow">
        {missing ? "Page not found" : "Something went wrong"}
      </p>
      <h1>{missing ? "没有找到这个页面" : "页面暂时无法显示"}</h1>
      <p>
        {missing
          ? "链接可能已经变化，请从工作台重新开始。"
          : "当前操作没有保存到服务器。你可以返回工作台后重试。"}
      </p>
      <Link className="primary-button link-button" to="/dashboard">
        返回工作台
      </Link>
    </main>
  );
}
