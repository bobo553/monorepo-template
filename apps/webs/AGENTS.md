# Web 目录规则

本文件适用于 `apps/webs/*`，继承根 `AGENTS.md`、`docs/agent/frontend/rules.md` 和 `docs/agent/frontend/pc-web-rules.md`。

## 目录职责

- 官网、内容站、用户门户、交易/业务应用、数据工作台和 Admin 等 PC Web 项目放入 `apps/webs/<workspace>`；Admin 是 PC Web 的一种，不是整个目录的默认形态。
- 当前 `apps/webs/web` 是通用 PC Web 起点，`apps/webs/admin` 是管理后台示例；两者均使用 Next.js App Router、React、Tailwind CSS、Vitest 和 Playwright。
- 页面仅因视觉布局不同不拆 workspace；只有部署域名、认证边界、环境配置、发布节奏或所有权确实独立时才拆成新应用。
- 移动端进入 `apps/mobiles/*`，服务端进入 `apps/servers/*`，浏览器扩展与独立工具进入 `apps/tools/*`。

## 实现规则

- Next.js 默认使用 Server Component，只有明确的客户端能力需要时才添加 `"use client"`。
- 业务按 `features/` 聚合，跨功能能力放 `shared/`，第三方初始化放 `lib/`，Provider 集中在 `providers/`。
- Web UI 原语统一由 `@repo/design-system-web` 提供；含权限、导航、接口或业务流程的组合组件留在应用。
- 官网/内容页、应用工作台与 Admin 使用适合自身任务的信息架构和 App Shell，不复制一个万能侧栏布局覆盖所有 PC 页面。
- API 请求统一管理 base URL、认证 Header、错误映射和取消信号；字段变化先更新 `@repo/contracts`。
- 页面验证语义化 HTML、键盘、可见焦点、桌面与窄屏、长文本、空数据、加载、错误和无权限状态。

## 验证要求

```bash
pnpm --filter <workspace-name> lint
pnpm --filter <workspace-name> typecheck
pnpm --filter <workspace-name> test:unit
pnpm --filter <workspace-name> test:e2e
pnpm --filter <workspace-name> build
```

修改 `@repo/design-system-web` 时至少验证 `web` 和 `admin` 两个现有消费者；应用级改动只验证受影响 workspace。UI 改动还需在真实浏览器验证关键路径、Console、Network、键盘和该应用声明的 PC/窄屏视口矩阵。
