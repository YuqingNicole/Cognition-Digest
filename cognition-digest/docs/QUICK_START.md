# 快速开始：前后端对接

## 1. 环境配置（2分钟）

创建 `.env.local`：

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

## 2. 后端要求

### Cookie 配置
```python
# 开发环境
response.set_cookie("session", token, httponly=True, samesite="lax")

# 生产环境
response.set_cookie("session", token, httponly=True, secure=True, samesite="none")
```

### CORS 配置
```python
CORS(app, 
     origins=["http://localhost:3000"], 
     allow_credentials=True)
```

### 必需端点
- `GET /auth/google/login?redirect_uri=<前端URL>`
- `GET /auth/google/callback` → Set-Cookie → 重定向前端
- `GET /auth/me` → 返回用户信息或 401
- `POST /auth/logout` → 清除 Cookie

## 3. 前端使用

### 登录
```tsx
import { loginWithGoogle } from "@/lib/auth"

<button onClick={() => loginWithGoogle("/dashboard")}>
  Sign in with Google
</button>
```

### 调用 API
```tsx
import { listSubscriptions, createSubscription } from "@/lib/api"

// 自动携带 Cookie，无需手动处理认证
const subs = await listSubscriptions()
```

### 使用 Hooks
```tsx
import { useSubscriptions } from "@/hooks/use-api"

function MyComponent() {
  const { subscriptions, loading, updateSubscription } = useSubscriptions()
  // ...
}
```

## 4. 示例组件

已创建可直接使用的组件：

- **`<UserMenu />`** - 用户菜单（显示邮箱、登出）
- **`<GenerateReportForm />`** - 一次性报告生成
- **`<SubscriptionManager />`** - 订阅管理（CRUD）

## 5. 路由保护

`middleware.ts` 自动保护以下路径：
- `/dashboard/*`
- `/report/*`
- `/newsletter/*`
- `/account/*`
- `/subscriptions/*`

未登录用户自动重定向到 `/onboarding`。

## 6. 测试流程

1. 启动后端：`python main.py` (确保 4000 端口)
2. 启动前端：`npm run dev`
3. 访问 `http://localhost:3000/onboarding`
4. 点击 "Sign in with Google"
5. 完成 OAuth 后应重定向回前端并设置 Cookie
6. 访问 `http://localhost:3000/dashboard` 查看订阅管理

## 7. 故障排查

### 登录后仍被重定向
- 检查后端是否正确设置 Cookie
- 检查 CORS `allow_credentials=True`
- 浏览器开发者工具 → Application → Cookies 查看是否有 `session`

### API 返回 401
- 确认 `credentials: "include"` 已设置（已在 `lib/api.ts` 中配置）
- 确认后端 CORS 允许前端域名

### CORS 错误
- 后端 `origins` 必须精确匹配前端 URL（包括端口）

## 完整文档

详见 `docs/API_INTEGRATION.md`
