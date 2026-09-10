# 后端工程规范

本规范适用于 `apps/servers/*`。当前模板的服务端 workspace 为 NestJS；新增其他技术栈前先确认架构、运维和团队约束。

## 分层与模块

- 模块遵循 `presentation → application → domain ← infrastructure`。
- Domain 保存实体、值对象、仓储接口和业务不变量，不依赖 NestJS、ORM 或网络框架。
- Application 编排用例和事务边界，只依赖 Domain 端口。
- Infrastructure 实现数据库、缓存、队列和外部服务适配器；Presentation 负责 HTTP、鉴权、序列化和协议映射。
- 模块只通过公开端口或事件协作，不跨模块直接访问内部 ORM Entity 或 Repository 实现。

## API 与输入

- 所有外部输入均不可信。优先复用 `@repo/contracts` 的 Zod Schema，在边界完成校验、标准化和拒绝。
- DTO 不重复跨端数据形状；分页、排序、过滤、错误码和时间格式保持一致并写入契约。
- Controller 保持薄，只处理协议和用例调用；业务判断进入 Domain 或 Application。
- 错误响应稳定、可追踪且不泄露堆栈、SQL、凭据或内部拓扑。

## 数据与可靠性

- Migration 可审阅、可回滚或明确说明不可逆原因；生产代码不依赖 ORM 自动同步 Schema。
- 事务边界覆盖业务不变量，但不在数据库事务中执行不可控的远程调用。
- 写操作考虑幂等、并发和重试；队列消费者、Webhook 与定时任务必须能够安全重复执行。
- 超时、取消、重试和熔断放在明确边界；重试有上限、退避和可观测性，不放大故障。
- 日志使用结构化字段并脱敏；健康检查区分进程存活与依赖就绪。

## 安全

- 身份认证、资源授权和租户边界在服务端执行，默认拒绝。
- 密码、Token、私钥、支付数据和个人信息不得进入日志或错误响应。
- 数据库查询参数化；文件、URL、Header 和序列化输入执行白名单校验与大小限制。
- CORS、Helmet、限流和代理信任按部署环境显式配置，不用宽泛默认值替代设计。

## 验证

```bash
pnpm --filter api lint
pnpm --filter api typecheck
pnpm --filter api test:unit
pnpm --filter api test:e2e
pnpm --filter api build
```

涉及数据库、外部服务或协议时追加真实集成/契约测试，并记录依赖环境与结果。
