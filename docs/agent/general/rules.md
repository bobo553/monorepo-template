# 通用工程规范

## 编码规则

- 变量、函数、类、组件和文件使用有意义的英文名称；公共 API、跨层边界和复杂返回值显式声明类型。
- 外部输入、反序列化结果和异常值以 `unknown` 接收，通过 Zod 或类型守卫收窄后再使用。
- 函数和组件保持单一职责。注释解释决策、兼容性或不变量，不逐行翻译代码。
- 内部包使用 `workspace:*`。新增依赖前搜索仓库现有能力，并放入正确 workspace 的依赖区域。
- Barrel 文件只暴露稳定公共 API；跨功能导入经过公开入口，不深层依赖实现文件。
- 只整理本次改动直接触及的代码，不以“顺手清理”为由扩大范围。

## 共享包规则

### `@repo/contracts`

- 跨 Web、Mobile、API 的 Zod Schema 与推导类型以本包为唯一事实来源。
- Schema 使用 PascalCase；推导类型沿用项目既有的 `T` 前缀。
- 新契约从模块和包根入口导出；需要子路径导入时同步 `tsup.config.ts` 与 `package.json#exports`。
- 修改后构建 contracts，并类型检查所有消费者。

### 设计系统

- Web 原语来自 `@repo/design-system-web`，Mobile 原语来自 `@repo/design-system-mobile`。
- 无业务逻辑且跨页面复用的原语进入设计系统；含接口、权限、导航或领域流程的组件留在应用。
- Mobile 色板以 `packages/design-system/shared/theme.ts` 为事实来源，Web CSS 变量保持相同语义。

### `@repo/env`

- 新环境变量先加入 `packages/env/src/env.schema.ts`，再更新 `.env.example` 和使用方文档。
- 服务端秘密不得使用 `NEXT_PUBLIC_*` 或 `EXPO_PUBLIC_*` 暴露。
- 各应用变量按需校验，不因无关应用的变量缺失阻止当前应用启动。

## 目录与依赖边界

- 运行应用使用 `apps/<servers|mobiles|webs|tools>/<workspace>` 两级结构。
- 应用不得反向成为共享包依赖；共享包不得导入 `apps/*`。
- 跨应用功能先用 `@repo/contracts` 固化边界，再分别验证生产者和消费者。
- 新增 workspace 时更新 `pnpm-workspace.yaml`（若现有 glob 不覆盖）、锁文件、README 和 `progress.md`。

## 质量与版本管理

- 验证顺序为格式、lint、类型检查、单元测试、消费者构建；高风险或合并前运行 `pnpm verify`。
- 单元/组件测试使用 `*.test.ts(x)`，浏览器 E2E 使用 `*.spec.ts(x)`。
- 提交信息遵循 Conventional Commits。修改可发布包时评估 Changeset，纯内部规则和 Harness 变更通常不需要。
- 提交前检查凭据、环境文件、构建产物和无关文件；只有用户明确要求时才提交或推送。
