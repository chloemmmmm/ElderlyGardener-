---
version: alpha
name: "康护园"
description: "以园艺康复的亲和感连接可穿戴传感器证据的康复师工作台"
colors:
  primary: "#176B55"
  fir: "#17231F"
  fog: "#F4F7F5"
  mint: "#DDEAE4"
  signal: "#5C519C"
  amber: "#92580D"
  white: "#FFFFFF"
  muted-text: "#5D6B66"
  danger: "#B42318"
  danger-soft: "#FCE8E6"
  signal-soft: "#EFECFD"
  amber-soft: "#FFF3DB"
typography:
  body:
    fontFamily: "Noto Sans SC, Microsoft YaHei, sans-serif"
    fontSize: "0.9375rem"
    lineHeight: "1.6"
  display:
    fontFamily: "IBM Plex Sans Condensed, Noto Sans SC, sans-serif"
    fontSize: "2rem"
    lineHeight: "1.15"
  data:
    fontFamily: "IBM Plex Mono, Noto Sans SC, monospace"
    fontSize: "0.8125rem"
    lineHeight: "1.45"
rounded:
  sm: "0.375rem"
  DEFAULT: "0.5rem"
  lg: "0.625rem"
spacing:
  xs: "0.375rem"
  sm: "0.625rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    height: "2.5rem"
    rounded: "{rounded.DEFAULT}"
  button-primary-hover:
    backgroundColor: "{colors.fir}"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.muted-text}"
    height: "2.625rem"
    rounded: "{rounded.DEFAULT}"
  panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.fir}"
    rounded: "{rounded.lg}"
  table:
    backgroundColor: "{colors.fog}"
    textColor: "{colors.fir}"
    height: "3.5rem"
  navigation:
    backgroundColor: "{colors.fir}"
    textColor: "{colors.mint}"
  signal-badge:
    backgroundColor: "{colors.signal-soft}"
    textColor: "{colors.signal}"
    rounded: "{rounded.sm}"
  attention-badge:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.amber}"
    rounded: "{rounded.sm}"
  danger-banner:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.sm}"
---

# 康护园 Design System

## Overview

### Creative North Star

界面应像一张被康复师持续使用的“园艺康复观察台”：有温和的植物线索，但信息组织更接近精确的训练观察记录。亲和感来自雾灰、薄荷和松针绿；技术感来自信号紫、窄体数字和证据之间的结构连线，而不是深色控制台或炫技动画。

### Product context and register

- **Audience and primary job:** 使用桌面设备工作的康复师；快速发现需要处理的居家训练对象，核对训练依据并记录人工判断。
- **Target market(s) and evidence:** 中文作品集概念原型；业务事实来自《老年锻炼 2.0 课程汇报》，后台能力属于明确标注的设计延展。
- **Locale(s) and language policy:** 界面使用简体中文 `zh-CN`；专业缩写保留英文并在首次出现时给出中文含义。
- **Usage scene:** 1280–1440px 桌面为主要场景，信息密度中高；1024px 保持完整操作，窄屏用于评审浏览。
- **Register:** 产品型后台。任务清晰、状态完整和证据可追溯优先于品牌表达。
- **Memorable signature:** “证据轨道”连接用户反馈、动作数据、传感器质量、系统判定和康复师决定。
- **Restraint:** 表格、表单和确认流程采用熟悉的后台结构；不为差异化牺牲扫描效率。
- **Anti-references:** 不使用通用医院蓝、暗色硬件控制台、暖米色杂志风、卡片套卡片、无依据的健康评分或装饰性渐变。
- **Token ownership/runtime mapping:** Runtime CSS variables in `src/styles/tokens.css` are canonical (Model B). This file mirrors those accepted values and explains intent. `pnpm design:lint` and the premium audit guard drift.

## Colors

松针绿 `primary` 只承担品牌、主要安全操作和确认状态。信号紫 `signal` 专用于传感器、系统判定及 AI 证据，不与品牌操作混用。提醒琥珀 `amber` 表示需要关注且可恢复的状态；危险红 `danger` 只用于错误和不可继续的状态。雾灰 `fog` 为应用背景，白色为主要工作表面，边框而非阴影承担大部分分层。

图表优先使用 primary、signal、amber 及其透明度变体，并提供文字标签、图例或数据表。强制色彩模式下让系统颜色接管可操作边界。

## Typography

Noto Sans SC 是中文正文、控件和表格的唯一主体字体。IBM Plex Sans Condensed 仅用于英文标题、页面数字和短标签，形成设备观察感；IBM Plex Mono 只用于传感器编号、时间戳和精确读数。正文基准 15px、行高 1.6，表格可降至 14px；中文不使用斜体、全大写或过紧字距。

## Layout

桌面采用 216px 导航侧栏与弹性内容区；内容最大宽度 1600px，主体使用 12 列逻辑网格。间距以 6/10/16/24/32/40px 的任务节奏构成，不为追求统一而强制每处 8px。应用壳保持自然页面滚动；只有明确的表格行区域可以拥有内部滚动。加载、帮助文本、滚动条和异步图表必须预留几何空间。

1024px 下侧栏收为 72px 图标轨道并保留可访问名称；760px 以下改为顶部导航，表格切换为带标签的记录列表，所有操作与状态均保留。

## Elevation & Depth

静态内容默认无阴影，通过白色表面、雾灰背景和 1px 边框分层。只有对话框、弹出列表、提示和当前悬浮操作可使用低幅阴影。粘性表头与表单操作条使用实色背景和边框，避免内容透叠。

## Shapes

控件使用 8px 圆角，主要容器使用 10px，紧凑标签使用 6px。状态标签不是可点击胶囊；只有筛选标签可使用接近胶囊的轮廓。图标采用 1.75px 线性笔画和圆角端点，避免拟物叶片或医疗十字装饰。

## Components

### Foundational visual states

默认、悬停、键盘焦点、按下、选中、禁用、忙碌、成功、提醒和错误状态均通过颜色、轮廓与文字共同表达。焦点环使用信号紫外环与白色隔离。默认加载为保留高度的应用内旋转指示器；不使用骨架屏。

### Buttons and actions

按钮由强调程度（solid/outline/ghost）与意图（brand/neutral/warning/danger）组合。每个决策区只保留一个主要操作。忙碌状态不改变按钮宽高；危险操作与普通操作保持空间分离。

### Navigation and data display

导航当前项同时使用左侧标记、背景和 `aria-current`。表格保留语义标签、真实排序按钮、稳定表头与分页。图表必须提供可读标题、图例、轴说明和相邻文本摘要。

### Forms and overlays

字段使用可见标签、帮助或错误文本和 42px 控件高度。选择器使用共享 Radix Select，弹层宽度与触发器一致。对话框、提示和 Toast 由共享组件提供焦点、层级、关闭和实时区域行为。

### Iconography

使用项目内 SVG 线性图标；16px 用于表格与输入，18–20px 用于导航和按钮。图标不能代替不熟悉操作的文字标签，图标按钮必须有中文可访问名称。

### Motion

交互反馈 150–220ms，弹层 200–250ms，使用 ease-out 或 ease-in-out。只在状态变化和层级转换时使用透明度与轻微位移。`prefers-reduced-motion: reduce` 下移除位移和交错延迟，保留不超过 100ms 的透明度反馈。

### Content and data visualization

文案使用直接、具体的动词：查看训练、采用为备注草稿、保存计划、重试保存。异常信息必须回答“发生了什么、依据是什么、下一步能做什么”。百分比取整数，持续时间标明单位，日期统一为 `YYYY年M月D日`，时间使用 24 小时制。

## Do's and Don'ts

- **Do:** 让证据轨道真正承载多模态依据和人工判断，不把它降级为装饰线。
- **Do:** 在所有页面复用相同的按钮、状态、加载、错误、Toast 和保存词汇。
- **Don't:** 使用通用蓝色医疗后台、无含义的大数字或 AI 生成式渐变作为视觉捷径。
- **Don't:** 只用红黄绿表达风险，或让 AI 建议在视觉上压过康复师判断。
