# i18n Short-Term Plan (Execution)

Date: 2025-11-27

Scope: High-priority zh-CN fixes only. Small, safe substitutions verified against current file contents.

## Target keys and replacements

- units
  - 1e6: "{{value}}米" -> "{{value}} 百万"
  - 1e9: "{{value}}乙" -> "{{value}} 十亿"
  - 1e12: "{{value}}T" -> "{{value}} 万亿"
- time strings
  - timeDaysHours: "{{days}}d {{hours}}h" -> "{{days}} 天 {{hours}} 小时"
  - timeHoursMinutes: "{{hours}}h {{minutes}} 米" -> "{{hours}} 小时 {{minutes}} 分钟"
  - timeDaysHoursMinutes: "{{days}}d {{hours}}h {{minutes}} 米" -> "{{days}} 天 {{hours}} 小时 {{minutes}} 分钟"
  - inTimeDaysHoursMinutes: "在 {{days}}d {{hours}}h {{minutes}} 米" -> "在 {{days}} 天 {{hours}} 小时 {{minutes}} 分钟"
- titles/labels
  - title.publicAddress: "公共广播" -> "公开地址"
  - title.editContact: "更改联系资料" -> "编辑联系人"
  - title.failed: "失败的" -> "失败"
  - label.activated: "活性" -> "已激活"
  - label.completed or list.completed: "完全的" -> "已完成"
  - chain_explorer: "{{title}} 探索者" -> "{{title}} 区块浏览器"
- liquidity pools wording
  - assetCategories.liquidityPools: "流动资金池" -> "流动性池"
  - assetCategoriesShort.liquidityPools: "游泳池" -> "流动性池"
  - liquidityPoolsContent.title.liquidityPools: "流动资金池" -> "流动性池"
  - insights.liquidityPools.title: "流动资金池" -> "流动性池"

Validation: Each replacement matches exact current strings in src/locales/zh-CN/common.json.
