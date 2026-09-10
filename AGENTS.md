# 智能体协作规则

本文件是仓库级智能体规则的唯一入口。详细规范位于 `docs/agent/`，只按当前任务需要加载，避免一次读取全部规则。

## 语言与基本约定

- 与用户沟通、规则、进度和交接使用简体中文；代码标识符、文件名、协议字段和第三方 API 保留英文。
- 代码注释只解释职责、原因、边界和外部约束，不复述实现步骤。
- 命令默认从仓库根目录执行。包管理器只使用 pnpm，不生成其他锁文件。
- Node.js 版本以 `.nvmrc` 为准，pnpm 版本以根 `package.json#packageManager` 为准。

## 项目速览

| 区域                       | 技术栈                                       | 职责                      |
| -------------------------- | -------------------------------------------- | ------------------------- |
| `apps/servers/*`           | 当前为 NestJS、TypeScript、PostgreSQL        | API、任务和后台进程       |
| `apps/mobiles/*`           | Expo、React Native、NativeWind               | 移动端应用                |
| `apps/webs/*`              | Next.js、React、Tailwind CSS                 | Web 应用                  |
| `apps/tools/*`             | 按工具选择，默认 TypeScript                  | 浏览器扩展、CLI、桌面工具 |
| `packages/contracts`       | Zod、TypeScript                              | 跨端数据契约              |
| `packages/design-system/*` | shadcn/ui、NativeWind                        | Web 与移动端设计系统      |
| `packages/env`             | Zod、dotenv                                  | 环境变量加载与校验        |
| `packages/config/*`        | ESLint、Vitest、Playwright、TypeScript、tsup | 共享工具配置              |

目录职责按顺序判断：无界面的运行单元进入 `servers`；移动端进入 `mobiles`；Web 页面进入 `webs`；可独立发布的开发者工具进入 `tools`；只有稳定跨应用复用的能力进入 `packages`。不得恢复 `apps/<workspace>` 的扁平布局。

## 启动流程（Startup Workflow）

开始修改前按顺序执行：

1. 确认仓库根目录并运行 `git status --short`；已有改动默认属于用户，不覆盖、不回退。
2. 完整阅读本文件和根 `feature_list.json`；有未完成交接时再读 `session-handoff.md`。
3. 使用 `pnpm -r list --depth -1 --json` 确认受影响 workspace，并读取各 workspace 根目录的 `progress.md`。
4. 在 `feature_list.json` 中只保留一个 `in-progress` 功能，确认其依赖与验收条件。
5. 读取距离目标文件最近的 `AGENTS.md`，再按下方路由读取必要规范。
6. 首次检出运行 `./init.ps1 -Mode quick`（Windows）或 `./init.sh --mode quick`（macOS/Linux）；日常任务至少运行相关 workspace 的基线检查。
7. 搜索已有实现、契约、设计系统组件和测试后再修改。

## 上下文路由

- 任意代码实现：读取 `docs/agent/general/rules.md`。
- 调试、测试设计、评审、重构、技术文档或依赖变更：额外读取 `docs/agent/general/quality-rules.md`。
- `apps/servers/*`：读取 `apps/servers/AGENTS.md` 和 `docs/agent/backend/rules.md`。
- `apps/mobiles/*`：读取 `apps/mobiles/AGENTS.md` 和 `docs/agent/frontend/rules.md`。
- `apps/webs/*`：读取 `apps/webs/AGENTS.md` 和 `docs/agent/frontend/rules.md`。
- `apps/tools/*`：读取 `apps/tools/AGENTS.md`；有 UI 时再读前端规范。
- Web 设计系统：额外读取 `packages/design-system/web/AGENTS.md`。
- 共享契约、环境变量或组件库：读取通用规范中的“共享包规则”。

## 状态与范围（Stay in scope）

- `feature_list.json` 是功能范围、依赖、状态、验收条件和验证证据的唯一事实来源。
- 每个 pnpm workspace 在自身根目录维护 `progress.md`；只更新受当前任务影响的 workspace。
- `session-handoff.md` 只记录跨会话仍未完成的工作、阻塞、关键文件和下一步。
- One feature at a time：同一时间只允许一个 `in-progress` 功能；不顺手处理无关问题。
- 新增 workspace 时同步创建 `progress.md`；`pnpm harness:check` 必须能够发现它。

## 工程不变量

- TypeScript 保持严格类型。外部输入先以 `unknown` 接收并校验，禁止用 `any`、`@ts-ignore` 或无范围的 `eslint-disable` 掩盖问题。
- 跨 Web、Mobile、API 的数据结构定义在 `@repo/contracts`，不重复声明 DTO。
- 环境变量集中在 `@repo/env` 声明和校验，并同步 `.env.example`；秘密不得进入客户端 bundle 或仓库。
- 通用 UI 原语优先复用设计系统；含接口、权限、路由或业务流程的组合组件留在应用内部。
- Web 保持 Server/Client Component 边界；API 保持 `presentation → application → domain ← infrastructure` 依赖方向。
- 新增依赖前确认现有能力不能满足需求，使用 `workspace:*` 引用内部包并同步锁文件。
- 缺陷修复补充能够复现问题的测试；无法自动化时记录手工验证和剩余风险。

## 安全与变更边界

- 不读取、输出或提交真实密钥；本地 `.env.*` 从 `.env.example` 生成并保持忽略。
- 不使用 `git reset --hard`、`git checkout --` 或批量覆盖清理未知改动。
- 删除数据、回滚迁移、生产部署、发布包等高风险操作必须先获得用户明确授权。
- 未经用户明确要求不得提交、推送、创建 PR、发布或部署。

## 验证命令与完成定义（Verification Commands / Definition of Done）

按风险选择最小充分验证：

```bash
pnpm --filter <workspace> lint
pnpm --filter <workspace> typecheck
pnpm --filter <workspace> test:unit
pnpm --filter <workspace> build
pnpm harness:check
pnpm verify:quick
pnpm verify
```

只有在目标行为实现、相关格式/lint/类型/测试/构建实际通过、状态与进度文件更新、无法运行项及风险明确记录后，功能才能标记为 `done`。UI 改动还需真实浏览器或设备验证；API、数据库和基础设施改动需要相应集成验证。

## 会话结束（End of Session）

1. 更新 `feature_list.json` 的状态和命令级证据。
2. 更新所有受影响 workspace 的 `progress.md`。
3. 未完成或跨 workspace 的长任务更新 `session-handoff.md`。
4. 重新运行最终验证并检查 `git diff`、`git status`，确保没有凭据、产物或无关文件。

按以上记录即可保持 clean、restartable 的交接路径。
