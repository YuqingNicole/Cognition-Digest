# API Integration Guide

本文档说明前端如何与后端 Google OAuth 和 RESTful API 对接。

## 目录
- [环境配置](#环境配置)
- [认证流程](#认证流程)
- [API 客户端使用](#api-客户端使用)
- [React Hooks](#react-hooks)
- [示例组件](#示例组件)
- [路由保护](#路由保护)

---

## 环境配置

### 1. 创建 `.env.local` 文件

```bash
# 后端 API 地址
# 开发环境
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

# 生产环境（部署时修改）
# NEXT_PUBLIC_BACKEND_URL=https://api.cognitiondigest.com/v1
```

### 2. 后端 CORS 配置要求

后端必须配置以下 CORS 设置：

```python
# 示例（FastAPI/Flask）
CORS(
    app,
    origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,  # 关键：允许携带 Cookie
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)
```

### 3. 后端 Cookie 配置

- **开发环境**（同域 localhost）：
  ```python
  response.set_cookie(
      "session",
      value=session_token,
      httponly=True,
      samesite="lax",
      path="/",
  )
  ```

- **生产环境**（跨域）：
  ```python
  response.set_cookie(
      "session",
      value=session_token,
      httponly=True,
      secure=True,        # HTTPS only
      samesite="none",    # 允许跨站
      path="/",
      domain=".yourdomain.com"  # 可选：共享子域
  )
  ```

---

## 认证流程

### Google OAuth 登录流程

```
┌─────────┐      ①重定向       ┌─────────┐
│ 前端    │ ───────────────→  │ 后端    │
│         │                    │ /auth/  │
│         │                    │ google/ │
│         │                    │ login   │
└─────────┘                    └─────────┘
                                    │
                                    │ ②重定向到 Google
                                    ↓
                              ┌──────────┐
                              │  Google  │
                              │  OAuth   │
                              └──────────┘
                                    │
                                    │ ③用户授权后回调
                                    ↓
                              ┌─────────┐
                              │ 后端    │
                              │ /auth/  │
                              │ google/ │
                              │ callback│
                              └─────────┘
                                    │
                                    │ ④Set-Cookie + 重定向
                                    ↓
┌─────────┐      ⑤带 Cookie      ┌─────────┐
│ 前端    │ ←─────────────────  │ 后端    │
│ /dash   │                      │         │
│ board   │                      │         │
└─────────┘                      └─────────┘
```

### 前端代码

#### 1. 登录按钮（`app/onboarding/page.tsx`）

```tsx
import { loginWithGoogle } from "@/lib/auth"

function LoginButton() {
  return (
    <button onClick={() => loginWithGoogle("/dashboard")}>
      Sign in with Google
    </button>
  )
}
```

#### 2. 获取当前用户

```tsx
import { getCurrentUser } from "@/lib/auth"

async function checkAuth() {
  const user = await getCurrentUser()
  if (user) {
    console.log("Logged in as:", user.email)
  } else {
    console.log("Not authenticated")
  }
}
```

#### 3. 登出

```tsx
import { logout } from "@/lib/auth"

function LogoutButton() {
  return <button onClick={logout}>Log out</button>
}
```

---

## API 客户端使用

所有 API 函数位于 `lib/api.ts`，自动携带认证信息（Cookie 或 Bearer token）。

### Sources API

```tsx
import { parseYouTubeUrl, listSources, createSource } from "@/lib/api"

// 解析 YouTube URL
const source = await parseYouTubeUrl("https://www.youtube.com/@channel")
// => { id, youtube_id, type: "channel", title, ... }

// 列出所有 sources
const sources = await listSources()

// 创建 source
const newSource = await createSource({
  youtube_id: "UCxxxxxx",
  type: "channel",
  title: "My Channel"
})
```

### Subscriptions API

```tsx
import {
  listSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from "@/lib/api"

// 列出订阅
const subs = await listSubscriptions()

// 创建订阅
const sub = await createSubscription({
  source_id: "source-123",
  frequency: "weekly",
  status: "active"
})

// 更新订阅
await updateSubscription("sub-123", {
  frequency: "monthly",
  status: "paused"
})

// 删除订阅
await deleteSubscription("sub-123")
```

### Reports API

```tsx
import { generateOneTimeReport, listReports, getReport } from "@/lib/api"

// 生成一次性报告
const task = await generateOneTimeReport({
  video_url: "https://www.youtube.com/watch?v=xyz",
  lang: "zh"
})
// => { task_id: "...", status: "queued" }

// 列出报告（带过滤）
const reports = await listReports({
  source_id: "source-123",
  from: "2024-01-01",
  to: "2024-12-31"
})

// 获取单个报告
const report = await getReport("report-123")
```

### Feedback API

```tsx
import { submitFeedback } from "@/lib/api"

await submitFeedback({
  report_id: "report-123",
  issue_type: "inaccuracy",
  section: "tldr",
  note: "第二条总结有误"
})
```

---

## React Hooks

使用 `hooks/use-api.ts` 中的 hooks 简化状态管理。

### useCurrentUser

```tsx
import { useCurrentUser } from "@/hooks/use-api"

function UserProfile() {
  const { user, loading, error } = useCurrentUser()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>Not logged in</div>

  return <div>Welcome, {user.name}!</div>
}
```

### useSubscriptions

```tsx
import { useSubscriptions } from "@/hooks/use-api"

function SubscriptionList() {
  const {
    subscriptions,
    loading,
    error,
    updateSubscription,
    deleteSubscription
  } = useSubscriptions()

  const handlePause = async (id: string) => {
    await updateSubscription(id, { status: "paused" })
  }

  return (
    <div>
      {subscriptions.map(sub => (
        <div key={sub.id}>
          {sub.source_id} - {sub.frequency}
          <button onClick={() => handlePause(sub.id)}>Pause</button>
        </div>
      ))}
    </div>
  )
}
```

### useGenerateReport

```tsx
import { useGenerateReport } from "@/hooks/use-api"

function GenerateForm() {
  const { generate, loading, taskId } = useGenerateReport()

  const handleSubmit = async (url: string) => {
    const result = await generate(url, "en")
    console.log("Task ID:", result.task_id)
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit(e.currentTarget.url.value)
    }}>
      <input name="url" placeholder="YouTube URL" />
      <button disabled={loading}>Generate</button>
      {taskId && <p>Task queued: {taskId}</p>}
    </form>
  )
}
```

---

## 示例组件

### 1. UserMenu（`components/user-menu.tsx`）

显示当前用户信息和登出按钮的下拉菜单。

**使用的 API**：
- `getCurrentUser()` - 获取用户信息
- `logout()` - 登出

### 2. GenerateReportForm（`components/generate-report-form.tsx`）

一次性报告生成表单。

**使用的 API**：
- `generateOneTimeReport()` - 提交生成任务

### 3. SubscriptionManager（`components/subscription-manager.tsx`）

订阅管理界面，支持修改频率、暂停/恢复、删除。

**使用的 API**：
- `listSubscriptions()` - 列出订阅
- `updateSubscription()` - 更新订阅
- `deleteSubscription()` - 删除订阅
- `listSources()` - 获取 source 标题

### 4. Dashboard（`app/dashboard/page.tsx`）

整合以上组件的主面板页面。

---

## 路由保护

### middleware.ts

`middleware.ts` 自动保护需要登录的路由：

```typescript
// 受保护的路径（需要登录）
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/report/:path*",
    "/newsletter/:path*",
    "/api/report/:path*",
    "/account/:path*",
    "/subscriptions/:path*"
  ],
}
```

**认证检查逻辑**：
1. 检查 legacy token（`DIGEST_TOKEN` 环境变量）
2. 检查后端设置的 session cookie（`session`、`digest-token`、`connect.sid`）
3. 未认证 → 重定向到 `/onboarding?from=<当前路径>`

### 公开路径

以下路径无需登录：
- `/` - 首页
- `/onboarding` - 登录页
- `/sample-report` - 示例报告
- `/health` - 健康检查

---

## 后端接口要求

### 必需实现的端点

1. **`GET /auth/google/login`**
   - 重定向到 Google OAuth
   - 接受 `redirect_uri` 查询参数（登录成功后跳转）

2. **`GET /auth/google/callback`**
   - 处理 Google 回调
   - 设置 session cookie
   - 重定向到前端（`redirect_uri` 或默认页面）

3. **`GET /auth/me`**
   - 返回当前用户信息
   - 401 如果未登录

4. **`POST /auth/logout`**
   - 清除 session cookie
   - 返回 200

### Cookie 名称约定

前端 middleware 会检查以下 cookie 名称（按优先级）：
1. `session`
2. `digest-token`
3. `connect.sid`

建议后端使用 `session` 作为 cookie 名。

---

## 故障排查

### 1. 登录后仍然被重定向到 /onboarding

**原因**：Cookie 未正确设置或前端无法读取。

**检查**：
- 后端是否设置了 `httponly` cookie？
- CORS 是否配置了 `allow_credentials=True`？
- 生产环境是否使用 `secure=True` 和 `samesite="none"`？
- 前端 fetch 是否使用 `credentials: "include"`？

### 2. API 请求返回 401

**原因**：Cookie 未随请求发送。

**检查**：
- `lib/api.ts` 中 `http()` 函数是否设置 `credentials: "include"`？
- 后端 CORS 是否允许前端域名？

### 3. CORS 错误

**原因**：后端未正确配置 CORS。

**解决**：
```python
# 后端必须精确匹配前端域名
origins=["http://localhost:3000"]  # 开发
origins=["https://app.yourdomain.com"]  # 生产
```

### 4. Cookie 在浏览器中不可见

**原因**：`httponly=True` 的 cookie 无法通过 JavaScript 访问（这是正常且安全的）。

**验证方法**：
- 打开浏览器开发者工具 → Application/Storage → Cookies
- 检查是否存在 `session` cookie

---

## 部署清单

### 前端

- [ ] 设置 `NEXT_PUBLIC_BACKEND_URL` 环境变量指向生产后端
- [ ] 确保前端域名在后端 CORS 白名单中

### 后端

- [ ] 配置 CORS：`allow_credentials=True`，`origins` 包含前端域名
- [ ] Cookie 设置：`secure=True`，`samesite="none"`（跨域）或 `"lax"`（同域）
- [ ] 实现 `/auth/google/login`、`/auth/google/callback`、`/auth/me`、`/auth/logout`
- [ ] 确保所有需要认证的接口检查 session cookie

---

## 相关文件

- `lib/api.ts` - API 客户端函数
- `lib/auth.ts` - 认证辅助函数
- `hooks/use-api.ts` - React hooks
- `middleware.ts` - 路由保护
- `app/onboarding/page.tsx` - 登录页
- `components/user-menu.tsx` - 用户菜单示例
- `components/generate-report-form.tsx` - 报告生成表单示例
- `components/subscription-manager.tsx` - 订阅管理示例
