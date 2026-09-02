/**
 * 研究方法补充数据
 *
 * 以下 heuristicEvaluation / emgValidation / survey 为演示样例，
 * 用于补全作品集的研究方法链路，不代表真实实验结果。
 */

export const methodMatrix = [
  {
    rq: "RQ1",
    question: "哪些上肢运动形式对居家老年人既安全有效，又容易被长期坚持？",
    method: "文献调研 + 动作分析",
    output: "5 类标准上肢训练动作与园艺任务映射表",
  },
  {
    rq: "RQ2",
    question: "园艺动作如何被转译为标准化、可量化的上肢康复训练？",
    method: "动作映射 + EMG 验证",
    output: "动作-肌肉-传感器判定规则与 EMG 验证数据",
  },
  {
    rq: "RQ3",
    question: "多模态反馈（气动、震动、视觉）如何帮助老人建立正确动作感知？",
    method: "硬件原型 + 用户测试",
    output: "反馈时机、强度与感官通道的设计原则",
  },
  {
    rq: "RQ4",
    question: "康复师在远程管理多名居家训练老人时，核心的决策痛点是什么？",
    method: "康复师访谈（演示样例）+ 竞品分析",
    output: "康复师画像、旅程地图与 B 端信息优先级",
  },
  {
    rq: "RQ5",
    question: "B 端管理后台应如何呈现证据，才能在「AI 辅助」与「人工决策」之间建立信任？",
    method: "用户旅程地图 + 可用性测试（演示样例）",
    output: "证据链可视化的交互方案与可用性指标",
  },
];

export const heuristicEvaluation = [
  {
    id: 1,
    principle: "系统状态可见性",
    issue: "B 端工作台需一眼区分「待复核」「已完成」「传感器异常」三种状态，否则康复师容易遗漏高优先级对象。",
    severity: "高",
  },
  {
    id: 2,
    principle: "系统与真实世界匹配",
    issue: "训练完成率不能区分「老人没做」与「传感器脱落」，需要暴露原始事实与不确定标记。",
    severity: "高",
  },
  {
    id: 3,
    principle: "用户控制与自由",
    issue: "AI 建议应支持「采纳 / 忽略 / 修改」三种操作，避免强制替换康复师经验判断。",
    severity: "中",
  },
  {
    id: 4,
    principle: "一致性与标准",
    issue: "计划版本对比需统一字段与颜色语义，降低多名治疗师协作时的理解成本。",
    severity: "中",
  },
  {
    id: 5,
    principle: "识别而非回忆",
    issue: "康复对象档案应把关键标签、最近异常、当前阶段目标直接呈现在卡片上，减少跨页跳转。",
    severity: "高",
  },
  {
    id: 6,
    principle: "防错与容错",
    issue: "调整训练参数时需给出安全范围提示，并记录修改原因，防止误操作无迹可寻。",
    severity: "中",
  },
];

export const emgValidation = [
  {
    action: "坐姿划船(耙土)",
    muscle: "背 / 肩后束",
    activation: 82,
    note: "斜方肌与三角肌后束激活明显，适合作为肩胛后缩训练。",
  },
  {
    action: "臂弯举(移栽)",
    muscle: "肱二头肌",
    activation: 88,
    note: "肘关节屈曲伴随前臂旋后，可针对性强化屈肘力量。",
  },
  {
    action: "侧平举(浇水)",
    muscle: "三角肌",
    activation: 79,
    note: "肩关节外展 0°–90° 区间内中束激活最高，需控制代偿。",
  },
  {
    action: "过头举(修剪)",
    muscle: "肩 / 上背",
    activation: 74,
    note: "肩袖肌群参与度高，适合恢复高位取物能力，但负荷需谨慎。",
  },
  {
    action: "握力训练(摘果)",
    muscle: "前臂 / 手部",
    activation: 71,
    note: "抓握肌群持续收缩，对捏力与手部精细控制有正向作用。",
  },
];

export const survey = [
  {
    item: "园艺任务比传统动作更有趣",
    value: 4.5,
    total: 5,
    unit: "分",
  },
  {
    item: "愿意每周完成 ≥3 次训练",
    value: 68,
    total: 100,
    unit: "%",
  },
  {
    item: "即时反馈有助于判断动作对错",
    value: 82,
    total: 100,
    unit: "%",
  },
  {
    item: "任务步骤切换清晰易懂",
    value: 41,
    total: 100,
    unit: "%",
  },
];
