# dsh-client-ui-question-anchors

DeepSeek Harness Web 客户端插件：**右侧提问锚点面板**。

在当前会话的对话中，把每一个用户提问（`user` / `steering` 消息）收集为右侧浮动面板中的一个锚点条目，显示提问序号和文字预览。点击条目，聊天区平滑滚动到对应提问处并短暂高亮该消息；滚动聊天区时面板会同步高亮当前所在提问（scroll-spy）。面板可收起为右侧的小圆钮，圆钮上实时显示提问数量。

## 效果

- 右侧浮动卡片：标题「提问锚点」+ 提问计数 + 收起按钮
- 每个条目：序号 + 提问文字预览（最多 3 行）
- 点击条目：`scrollIntoView` 式平滑滚动 + 2px 品牌色描边闪烁 1.6s
- 滚动聊天区：自动高亮当前阅读位置的提问
- 收起后：40px 圆钮，带提问数量徽标
- 无会话或无提问时不显示
- 右侧详情面板打开时自动让位（测量 `data-details-collapsed` + details 列宽度）
- 中英双语（跟随 dsh 界面语言，缺省回退中文）

## 架构

纯浏览器插件（host 半场为空桩），复用现有 DSH 客户端机制，无任何侵入式改动：

- 通过 `dsh.client` 声明被 `@deepseek-ai/dsh-client-modules` 扫描进 `window.__DSH_BOOT__` 引导图
- 注册进布局壳声明的 **`shell.overlay`**（root 作用域 list 槽）——AppFrame 专为浮动 UI 提供的覆盖层（`position:absolute; inset:0; z-index:20`，`pointer-events:none`，面板自身 `pointer-events:auto`）
- 数据源：`ctx.sessions.binding(sessionId).session`（`ObservableSnapshot<ConversationSnapshot>`，与 `useSession` 同一来源），经注册时的 inject 工厂注入组件，组件用 `useSyncExternalStore` 订阅当前会话
- 当前会话 id：标准套件 `useSessions(s => s.current)`（root 作用域自带）
- 锚点键：`snapshot.chat.order` + `chat.nodes.get(key)`，筛选 `kind === 'user' | 'steering'`；DOM 行由 `[data-chat-anchor-key]` 标识（与 `data-chat-flow-key` 同源，均为 Conversation Context key），滚动用 `[data-conversation-scroll]` 滚动容器 + `getBoundingClientRect` 差值计算，与 `ui-conversation` 内置逻辑一致
- 样式：自带 `<style data-plugin-css>` 标签注入（materialization 时创建，HMR 可回收），全部使用 `--dsw-alias-*` / `--dsw-shadow-lv2` 设计 token，自动适配深浅主题

## 文件

```
dsh-question-anchors/
├── package.json          # dsh.client 声明（platform: web, inject 依赖边）
├── lib/
│   ├── index.js          # host 半场（空桩）
│   └── client.js         # 浏览器插件（__ModuleLoader__.load 格式，无需构建）
├── scripts/
│   └── install.sh        # 安装到 web profile（幂等）
└── README.md
```

客户端 bundle 是手写的 `window.__ModuleLoader__.load({id, factory})` 格式（与仓库内其他 `lib/client.js` 产物一致），只 `require` 平台 seed 词（`react`、`react/jsx-runtime`），因此**不需要 tsdown/构建步骤**。

## 安装

```sh
# 1. 把插件挂进 web profile（软链到 profile 的 node_modules，源目录保持唯一）
./scripts/install.sh

# 2. 重启 dsh web（插件集变更需重启；热更新链只覆盖已存在的 bundle 内容变更）
#    重启 dsh web 服务后刷新页面生效
```

安装脚本做两件事（均幂等，可重复执行）：

1. `node_modules/dsh-client-ui-question-anchors` → 软链到本目录
2. 向 profile 的 `cordis.patch.yml`（`$DSH_HOME/profiles/web/cordis.patch.yml`，默认即 `~/.dsh/profiles/web/cordis.patch.yml`）追加一行插件行：

```yaml
- insert:
    - id: ui-question-anchors
      name: 'dsh-client-ui-question-anchors'
```

## 卸载

删除 `cordis.patch.yml` 里对应的 insert 行，删除 profile node_modules 里的软链，重启即可。

## 发布插件

插件就是一个标准 npm 包（`dsh.client` 声明 + `exports["./client"]` 客户端 bundle），发布流程与普通 npm 包一致。

### 方案 A：发布到 npm registry

```sh
npm login                       # 需要 npm 账号；私有 registry 先 npm config set registry <url>
npm publish                     # scoped 包（@yourname/...）加 --access public
```

> ⚠️ 若改成 scoped 包名，**必须同步修改** `lib/client.js` 里
> `window.__ModuleLoader__.load({ id: "dsh-client-ui-question-anchors", ... })` 的
> `id` 为新的包名——引导图条目 id 就是包名，二者不一致时浏览器会报
> "bundle loaded without registering"。

安装到任意机器 / 任意 profile：

```sh
dsh plugin --profile web add dsh-client-ui-question-anchors
```

然后在该 profile 的 `cordis.patch.yml` 追加插件行（只装包不会注册到 Loader）：

```yaml
- insert:
    - id: ui-question-anchors
      name: 'dsh-client-ui-question-anchors'
```

最后重启 dsh web 并硬刷新页面。

### 方案 B：不发 registry，直接分发 tarball

```sh
npm pack    # 生成 dsh-client-ui-question-anchors-0.1.0.tgz
```

把 tgz 发给对方，对方执行：

```sh
dsh plugin --profile web add /path/to/dsh-client-ui-question-anchors-0.1.0.tgz
```

同样追加 `cordis.patch.yml` 插件行并重启。

### 方案 C：本地目录直装（开发期）

```sh
dsh plugin --profile web add file:/path/to/dsh-question-anchors
```

同样追加 `cordis.patch.yml` 插件行并重启。

### 自动发布：GitHub Actions

仓库内置 `.github/workflows/publish.yml`：**推送到 `main` 分支自动触发 `npm publish`**（也支持手动 `workflow_dispatch` 触发）。

使用前提（一次性配置）：

1. 把仓库推到 GitHub（`main` 分支）
2. 在 npmjs.com 生成 **Publish 权限**的 Access Token，添加到仓库 Secrets，命名 `NPM_TOKEN`
3. 发布新版本前先在 `package.json` 里 `version` +1 再推送——npm 不允许覆盖已存在的版本，工作流检测到当前版本已发布会直接跳过（重复推送是绿色 no-op，不是红叉）

> 包无运行时依赖（仅 peerDependencies），工作流不需要 `npm ci`，直接 `npm publish`。

### 发布检查清单

- [x] `package.json` 无 `private: true`（已移除）
- [x] `files: ["lib"]` —— tarball 只含 `lib/`、README、package.json（`npm pack --dry-run` 已验证）
- [x] `dsh.client.platform: "web"` + `exports["./client"]` —— 客户端模块扫描入口
- [x] `lib/client.js` 内 loader `id` 与包名一致（改名时注意同步）
- [x] `peerDependencies`：`react`、`@deepseek-ai/cordis`
- [ ] 更新版本号：npm 不允许同版本覆盖，迭代时改 `version` 再 `npm publish`
- [ ] （可选）补充 `repository`、`author` 字段

依赖说明：`dsh.client.inject` 引用的 `@deepseek-ai/dsh-client-*` 是 `dsh-web-app` bundle 自带依赖，任何 web profile 都能解析，无需额外安装。

## 已知限制

- 插件行加入/移除需要重启 web 服务（`dsh-client-hmr` 只监听已存在 bundle 的内容变化，不监听插件集变化）
- 轨迹视图（trajectory tab）下聊天行未渲染，点击锚点无目标可滚（面板仍在，行不存在时点击为空操作）
- 面板宽度 252px，极小窗口下可能遮挡聊天内容（可自行收起）
