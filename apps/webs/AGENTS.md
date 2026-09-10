# Web 目录规则

本文件适用于 `apps/webs/*`，继承根 `AGENTS.md` 和 `docs/agent/frontend/rules.md`。

## 目录职责

- 网站、PC 端页面与 B 端项目放入 `apps/webs/<workspace>`。
- 当前 `apps/webs/web` 使用 Next.js App Router、React、Tailwind CSS、Vitest 和 Playwright，workspace 名为 `web`。
- 移动端进入 `apps/mobiles/*`，服务端进入 `apps/servers/*`，浏览器扩展与独立工具进入 `apps/tools/*`。

## 实现规则

- Next.js 默认使用 Server Component，只有明确的客户端能力需要时才添加 `"use client"`。
- 业务按 `features/` 聚合，跨功能能力放 `shared/`，第三方初始化放 `lib/`，Provider 集中在 `providers/`。
- Web UI 原语统一由 `@repo/design-system-web` 提供；含权限、导航、接口或业务流程的组合组件留在应用。
- API 请求统一管理 base URL、认证 Header、错误映射和取消信号；字段变化先更新 `@repo/contracts`。
- 页面验证语义化 HTML、键盘、可见焦点、桌面与窄屏、长文本、空数据、加载、错误和无权限状态。

## 验证要求

```bash
pnpm --filter web lint
pnpm --filter web typecheck
pnpm --filter web test:unit
pnpm --filter web test:e2e
pnpm --filter web build
```

UI 改动还需在真实浏览器验证关键路径、Console、Network 和响应式布局。
