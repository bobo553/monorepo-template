# Progress

## Current State

Web 设计系统向 Next.js 应用提供通用 shadcn 风格 UI 原语与样式。

## Completed

- 新增就近 `AGENTS.md` 规则。
- 纳入 workspace 级进度与 Harness 管理。
- 为 B 端模板新增 Badge、Card、Input、Separator 和 Skeleton 原语。

## Verification

- `pnpm verify`：lint、类型检查、测试和包构建通过。
- `pnpm --filter @repo/design-system-web lint && pnpm --filter @repo/design-system-web typecheck && pnpm --filter @repo/design-system-web build`：新增原语后通过。

## Risks and Next Steps

- 组件变更需验证 Web 消费者和可访问性。
- 业务组件继续放入 app 的 feature 目录，避免设计系统承载业务语义。
