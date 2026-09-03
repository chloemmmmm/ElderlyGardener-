# UX Contract

## Product context

- Audience: 负责居家上肢训练随访的康复师。
- Primary jobs: 发现需要处理的对象、核对训练证据、复盘异常、调整计划、记录人工判断。
- Target market(s): 中文作品集概念原型，不表示实际地区部署。
- Active locales: `zh-CN`。
- Language/content register and native-review policy: 简体中文、专业但直接；最终交付由用户复核作品集表述。
- Timezone/calendar policy: 数据统一使用 `Asia/Shanghai`，公历，24 小时制。
- Accessibility target: WCAG 2.2 AA。

## Business-context sources

| Domain / scope          | Authoritative source                                                         | Source type        | Reviewed date |
| ----------------------- | ---------------------------------------------------------------------------- | ------------------ | ------------- |
| 原型训练与反馈事实      | `F:/论文C 老年/老年锻炼2.0 课程汇报.pdf`                                     | 课程项目证据       | 2026-08-31    |
| 后台范围、AI 与安全边界 | `docs/superpowers/specs/2026-08-31-rehabilitation-therapist-admin-design.md` | 已批准产品设计规范 | 2026-08-31    |
| 可访问性目标            | `https://www.w3.org/TR/WCAG22/`                                              | W3C Recommendation | 2026-08-31    |

权限、计费、删除/保留和法律文案不在本概念原型范围内；应用不实现真实账户、真实个人信息或不可逆数据操作。

## Visual contract

- Project `DESIGN.md`: `DESIGN.md`。
- Token ownership model: 已有运行时令牌为 canonical，`DESIGN.md` 镜像（Model B）。
- Runtime design-system/token source: `src/styles/tokens.css`。
- Mapping/export/adapters: CSS 语义变量直接供共享组件消费；功能样式不得引用核心原始 hex。
- Token drift gate: `pnpm design:lint`、premium strict audit 和浏览器 computed-style 检查。
- Supported themes: 浅色主题与系统 forced-colors；不提供暗色主题。
- Design-context owner/review policy: 系统级视觉变更必须同时更新 `DESIGN.md`、运行时令牌和共享组件。

## Canonical UI Map

| Capability     | Canonical owner                                | Source of truth      | Allowed variants                 | Verification        |
| -------------- | ---------------------------------------------- | -------------------- | -------------------------------- | ------------------- |
| Select/Listbox | `components/forms/SelectField`（Radix Select） | 本文件 + `DESIGN.md` | authored                         | 键盘 + 浏览器打开态 |
| Form           | React Hook Form + Zod + 共享字段               | 本文件               | edit                             | 验证组件测试 + E2E  |
| Scrollbar      | `styles/global.css`                            | `DESIGN.md`          | stable-gutter geometry exception | computed style      |
| Toast          | `components/feedback/ToastProvider`            | 本文件               | success / warning / info / error | live-region test    |
| CRUD           | `services/rehabilitation.ts` + 路由约定        | 设计规范             | return-to-client / stay-note     | full-flow E2E       |

## Component behavior

| Component   | Default           | Hover            | Focus                | Active              | Disabled         | Busy           | Error                         |
| ----------- | ----------------- | ---------------- | -------------------- | ------------------- | ---------------- | -------------- | ----------------------------- |
| Button      | 稳定尺寸          | 语义色加深       | 双层可见焦点         | 轻微下压            | 降低对比且无事件 | 原位指示器     | 不以按钮代替错误说明          |
| Icon button | 中文可访问名称    | 背景提示         | 可见焦点             | 背景加深            | 无事件           | 原位指示器     | 相邻文字说明                  |
| Input       | 边框 + 可见标签   | 边框加深         | 信号紫焦点           | n/a                 | 低对比           | 预留尾部空间   | `aria-invalid` + 关联错误文本 |
| Search      | 清除 + 300ms 防抖 | 清除按钮可见反馈 | 输入与清除按钮均可见 | Enter 非 IME 时提交 | n/a              | 保留指示器位置 | 结果区域内重试                |
| Textarea    | `resize: none`    | 边框加深         | 信号紫焦点           | n/a                 | 低对比           | 保留输入内容   | 关联错误文本                  |
| Table/list  | 56px 行高         | 行背景轻变       | 行内真实控件获焦     | n/a                 | 分页边界保留控件 | 表头和框架稳定 | 面板内重试                    |

## Dataset navigation

- Admin tables: 服务端分页。
- Exploratory lists: 不适用。
- URL state: 搜索、筛选、排序、页码和 pageSize 全部使用 URL 查询参数。
- Page size: 10 / 20 / 50，默认 10。
- Empty/no-results/error/loading treatment: 空数据解释内容；无结果提供清除筛选；错误提供重试；加载保留表格框架。
- Back/scroll restoration: URL 恢复列表状态；从档案返回时浏览器恢复列表滚动位置。
- Selection scope: 首版不提供批量选择或批量操作。

## Flow ledger

| Operation   | Trigger      | Pending          | Success destination                    | Success feedback | Failure recovery         | Focus outcome          | Source ref    |
| ----------- | ------------ | ---------------- | -------------------------------------- | ---------------- | ------------------------ | ---------------------- | ------------- |
| Edit plan   | 保存计划     | 固定尺寸忙碌按钮 | `/clients/:clientId?tab=interventions` | “训练计划已更新” | 保留值 + 表单错误 + 重试 | 干预记录标题           | 设计规范 §5.5 |
| Add note    | 保存干预备注 | 固定尺寸忙碌按钮 | 留在训练复盘                           | “干预备注已记录” | 保留草稿 + 重试          | 新备注                 | 设计规范 §6   |
| Search      | 搜索康复对象 | 表格框架稳定     | 同一路由查询参数                       | 结果数实时区域   | 搜索区域内错误 + 重试    | 保持输入焦点           | 设计规范 §5.2 |
| Cancel/back | 取消 / 返回  | 无               | 来源上下文                             | 通常无           | 脏表单打开未保存对话框   | 来源触发位置或页面标题 | 设计规范 §5.5 |

## Navigation and responsive behavior

- Route document title policy: `{页面}｜康护园`；加载、404 和错误页面使用真实状态标题。
- Route error / 403 page behavior: 404 和路由错误保留应用导航并提供返回工作台；首版无权限模型，因此不模拟 403。
- Breadcrumb/tab/route-state policy: 档案标签使用 `tab` 查询参数；训练复盘与计划编辑显示真实层级面包屑。
- Sidebar/drawer/bottom-sheet transformation: ≥1024px 侧栏；760–1023px 图标轨道；<760px 顶部导航。
- Responsive table strategy: <760px 转换为带字段标签的记录卡片，不静默隐藏操作与状态。
- Truncation/full-value access: 关键原因和用户姓名换行；只在稳定表格几何需要时截断，并提供聚焦可见全文。
- Focus restoration and sticky-obstruction policy: 页面导航后聚焦主标题；粘性区域设置 `scroll-padding`，不能遮挡焦点。

## Overlays and feedback

- Dialog primitive: Radix AlertDialog/Dialog 的共享封装。
- Destructive confirmation levels: 首版无删除；未保存离开使用中性警告，默认聚焦“继续编辑”。
- Toast placement/duration/deduplication: 右上角；常规 5 秒；错误保持到关闭；2 秒内相同提示去重；最多 3 个。
- Alert/banner scope and persistence: 概念视频入口为应用级常驻标记；数据错误留在受影响面板。
- Tooltip delay/dismissal: 300ms，悬停与键盘焦点打开，Escape 关闭。
- Unsaved-changes behavior: 应用内路由使用对话框；真实页面关闭只使用 `beforeunload`。
- Layer/z-index contract: dropdown 200，popover 300，sticky 400，backdrop 500，dialog 600，toast 900。

## Async and resilience

- Mutation default: 悲观保存，服务确认后才更新和提示成功。
- Idempotency and duplicate-submit policy: mutation pending 时阻止重复提交。
- Auto-save/draft recovery: 不自动保存；保存失败时保留当前表单值。
- Offline/read-stale/write behavior: 可读取 Query 缓存；写入失败保留草稿并提供重试，不排队。
- Retry/backoff/timeout behavior: 查询最多一次自动重试；写入不自动重试。
- Version conflict and multi-tab behavior: MSW API 无并发写；不声称支持多用户冲突合并。
- Session expiry/re-authentication: 不适用，首版无认证。
- Long-running progress and return path: 不适用。
- Stale-request cancellation/invalidation and pending-state ownership: Query key 与 AbortSignal 取消旧请求；清除搜索即时取消并重置页码。
- Dialog/form preservation and retry after mutation failure: 对话框或表单保持打开，输入不丢失。

## Validation

- Schema/validation layer: React Hook Form + Zod。
- Trigger timing: 首次提交时验证；已有错误字段在修改/失焦时重新验证。
- Error summary/inline policy: 计划表单提供顶部摘要和逐字段错误；短备注只用逐字段错误。
- Server error mapping: 字段错误写入字段；网络/服务错误为持久表单状态，不塞进 Toast。
- Sensitive-value handling: 本项目无密码、密钥或真实个人数据。
- `noValidate`, first-invalid focus, duplicate-submit prevention, unsaved changes, and submit recovery: 所有产品表单必须执行。

## Permission and clipboard

- Permission UI strategy: 不适用，首版无角色和服务端授权。
- Clipboard copy policy: 首版不提供复制个人或传感器原始数据功能。
- Disabled-state explanation: 无法操作时保留控件并显示中文原因。

## Verification

- Required static commands: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test:run`, `pnpm build`, premium strict audit。
- Browser/device/locale/theme matrix: 1440×1000、1024×768、390×844；`zh-CN`；浅色、forced-colors、reduced-motion。
- Accessibility checks: jest-axe、Playwright 键盘流程、人工焦点与对比检查。
- Native-language/domain review and target-user evidence: 用户复核中文作品集表述；不宣称康复师可用性验证。
- Component-state/visual regression coverage: 工作台、列表、档案、复盘和计划编辑的正常/加载/空/错误截图。
- Canonical sibling flow used for comparison: 计划编辑与备注保存共享按钮、Toast、错误与返回规则。
- Project audit command/result: `audit_project.py . --mode strict`，结果写入 `work/verification/premium-ui-audit.json`。
- CRUD full-flow evidence: `e2e/therapist-workflow.spec.ts`。
- Failure-path evidence: 计划保存失败、工作台局部失败、列表无结果的组件与浏览器测试。
