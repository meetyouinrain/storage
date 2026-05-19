import type { OrderRecord } from "@mvp/shared";

export const orders: OrderRecord[] = [
  {
    orderNo: "CS20260501001",
    customerName: "张敏",
    productName: "AirGlow 智能加湿器",
    status: "shipped",
    createdAt: "2026-05-01 10:15",
    trackingNo: "SF1234567890",
    amount: 299
  },
  {
    orderNo: "CS20260503008",
    customerName: "李哲",
    productName: "NovaSound 蓝牙耳机",
    status: "delivered",
    createdAt: "2026-05-03 14:22",
    trackingNo: "YT9988776655",
    amount: 499
  },
  {
    orderNo: "CS20260505013",
    customerName: "王悦",
    productName: "LumaDesk 护眼台灯",
    status: "refund_pending",
    createdAt: "2026-05-05 19:40",
    amount: 199
  }
];

export const policies = {
  refund: [
    "签收后7天内可申请无理由退货，商品需保持完好。",
    "若商品存在质量问题，支持优先退款或补发。",
    "退款审核通过后，原支付方式预计1-3个工作日到账。"
  ],
  logistics: [
    "发货后可根据物流单号查询最新配送状态。",
    "若超过48小时无物流更新，可升级为人工复核工单。",
    "已签收订单若用户未收到，建议优先核验签收人与配送地址。"
  ],
  invoice: [
    "电子发票默认在订单完成后开具。",
    "企业发票需补充抬头、税号和邮箱信息。"
  ],
  complaint: [
    "涉及态度投诉或重复问题未解决的会话，建议优先转人工。",
    "高风险负面情绪会话应在首轮回复中表达安抚并说明处理时限。"
  ]
};

export const faqEntries = [
  {
    title: "退款到账时间",
    keywords: ["退款", "到账", "多久", "退货"],
    answer: "退款审核通过后，一般会在1到3个工作日内按原支付路径退回。"
  },
  {
    title: "物流查询",
    keywords: ["物流", "快递", "发货", "单号"],
    answer: "系统支持根据订单号或物流单号查询发货状态与最新轨迹。"
  },
  {
    title: "发票开具",
    keywords: ["发票", "开票", "电子发票", "企业发票"],
    answer: "电子发票通常在订单完成后开具，企业发票需补充开票信息。"
  },
  {
    title: "商品质量问题",
    keywords: ["坏了", "质量", "故障", "损坏"],
    answer: "若商品存在质量问题，可优先走售后复核流程，并支持退款或补发。"
  }
];
