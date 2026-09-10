# Progress

## Current State

Next.js 应用已迁移到 `apps/webs/web`，workspace 名保持 `web`。

## Completed

- 更新 Docker、文档和 workspace 路径。
- 保留原有 Web 源码与测试。

## Verification

- `pnpm verify`：通过 Web lint、类型检查、单元测试和 Next.js 生产构建。

## Risks and Next Steps

- UI 变更需在真实浏览器中补充验证；本次仅迁移目录。
