# Progress

## Current State

Next.js 应用已迁移到 `apps/webs/web`，workspace 名保持 `web`，并作为官网、内容、门户和普通业务页面的通用 PC Web 起点。

## Completed

- 更新 Docker、文档和 workspace 路径。
- 保留原有 Web 源码与测试。
- 接入 PC Web 通用页面规范，与 Admin 共用设计系统但不强制使用后台 App Shell。

## Verification

- `pnpm verify`：通过 Web lint、类型检查、单元测试和 Next.js 生产构建。
- PC Web 规则优化后，Web lint、类型检查、4 个单元测试和生产构建通过。

## Risks and Next Steps

- 实现具体 PC 页面时需按 workspace 声明的视口矩阵在真实浏览器验证布局、键盘、Console 与 Network。
