# 前端工程规范

## 类型与数据边界

- Props、Hook 参数、事件回调和公开 API 必须有可检查类型；API、URL、Storage、跨窗口消息和第三方 SDK 返回值先校验再使用。
- Props、State、Context 和查询缓存视为只读快照，不原地修改。
- 异步操作处理加载、空数据、失败、超时、取消和竞态；重复提交提供禁用、去重或幂等保护。

## React 与状态

- 渲染、Selector、Reducer 和数据转换保持纯净；Effect 只同步外部系统，不维护可在渲染期派生的重复状态。
- Effect 创建的监听、定时器、Observer、请求和订阅必须清理，请求使用 `AbortSignal`。
- 服务端数据进入查询缓存，可分享筛选进入 URL，跨会话偏好进入持久化存储，局部交互留在组件。
- 使用函数组件与 Hooks；组件优先组合，避免无必要的 HOC、Container 或全局状态。

## 组件、样式与可访问性

- 组件符号使用 PascalCase，Hook 使用 `useXxx`，内部处理器使用 `handleXxx`，事件 Props 使用 `onXxx`。
- 一个实现文件只公开一个主组件；按视图、状态、数据适配、类型和工具拆分大型组件。
- 使用设计令牌和既有 `cn`/CVA 方式，不在业务代码散落颜色、间距、圆角或阴影魔法值。
- 使用语义化 HTML、正确元素和可见焦点；交互支持键盘，图标按钮有可访问名称，表单错误与控件关联。
- 用户可见错误信息脱敏，不渲染不可信 HTML，不把 Token 或秘密写入 Storage、URL 或日志。

## Web 与 Next.js

- Next.js 默认使用 Server Component；只有交互、浏览器 API、客户端状态或客户端专属库需要时才添加 `"use client"`。
- 数据获取靠近服务端边界，避免客户端重复请求；客户端隐藏按钮不能替代服务端授权。
- 内部导航使用框架 Link/Router，保留新标签、复制链接、前进后退和中键点击行为。
- 验证深层 URL、刷新、404、加载、错误、无权限、窄屏、长文本和空数据。

## React Native 与 Expo

- 路由页面放在 `src/app`，领域功能放在 `src/features`，跨功能能力放在 `src/shared`。
- 样式优先使用 NativeWind 和设计令牌；平台 API、动画或运行时计算确有需要时才使用 `StyleSheet`。
- 处理安全区、键盘遮挡、触控区域、深色模式、弱网和 Android/iOS 差异。
- 导航、Linking、权限、推送和平台 API 留在应用组合层，不进入纯 UI 组件。

## 验证

- 运行目标 workspace 的 lint、typecheck、unit test 和 build。
- UI 改动在真实浏览器、模拟器或设备验证关键流程、Console、Network、响应式/安全区和键盘操作。
- 性能优化先测量再修改，并保存前后证据。
