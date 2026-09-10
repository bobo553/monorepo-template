# Progress

## Current State

MONOREPO-007 已完成，项目创建 CLI 可基于 Web、Admin、API 和 Mobile 模板生成新 workspace。

## Completed

- 新增 `@repo/create-project` workspace 和根命令。
- 完成模板发现、安全复制、名称/端口冲突拒绝和原子落盘。
- 完成 package、Docker、Playwright、Expo、README 与进度文件改写。
- 支持交互模式、非交互参数、模板列表、帮助和 dry-run。

## Verification

- CLI lint、严格类型检查、13 个单元测试和 tsup 构建通过。
- 四种真实模板的根命令 dry-run 与非法路径拒绝验证通过。
- `pnpm verify:quick` 和全仓 `pnpm build` 通过。

## Risks and Next Steps

- 生成项目后仍需替换示例业务、标识和环境变量占位符，并执行目标 workspace 门禁。
