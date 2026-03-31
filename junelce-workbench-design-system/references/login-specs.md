# 登录页规范

> Workbench风格登录页完整规范。支持企微扫码+账号密码两种模式。

## 整体布局

```
┌─────────────────────────────────────────────────────────┐
│                     渐变背景 + 光晕 + 网格               │
│                                                         │
│  ┌────────────────────────┬──────────────────────────┐  │
│  │                        │                          │  │
│  │     品牌轮播区域        │    双层卡片登录区域        │  │
│  │     (左侧，约50%)      │    (右侧，约50%)         │  │
│  │                        │                          │  │
│  │  ┌──────────────────┐  │  ┌──────────────────────┐│  │
│  │  │  品牌Slogan文案   │  │  │ 底层三角色块         ││  │
│  │  │  自动轮播+指示器   │  │  │ ┌────────────────┐  ││  │
│  │  │                  │  │  │ │ 登录表单区域    │  ││  │
│  │  └──────────────────┘  │  │ │ (白色缺角卡片)  │  ││  │
│  │                        │  │ │                │  ││  │
│  │                        │  │ └────────────────┘  ││  │
│  │                        │  │ 右上角：模式切换按钮  ││  │
│  │                        │  └──────────────────────┘│  │
│  │                        │                          │  │
│  └────────────────────────┴──────────────────────────┘  │
│                                                         │
│                    底部版权信息                           │
└─────────────────────────────────────────────────────────┘
```

## 背景动画

```css
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 50%, #ecfeff 100%);
  position: relative;
  overflow: hidden;
}

/* 光晕效果 */
.login-page::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--el-color-primary-rgb), 0.15), transparent 70%);
  top: -200px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

/* 网格背景 */
.login-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}
```

## 双层卡片结构

### 底层：三角色块

```css
.login-card-outer {
  position: relative;
  width: 420px;
  height: 480px;
}

/* 底层三角形 */
.login-card-triangle {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
  clip-path: polygon(60% 0, 100% 0, 100% 40%);
  border-radius: 16px;
}
```

### 顶层：缺角白色卡片

```css
.login-card-inner {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  clip-path: polygon(0 0, 72% 0, 100% 28%, 100% 100%, 0 100%);
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}
```

### 模式切换按钮

```css
/* 位于三角区域内的切换按钮 */
.login-mode-toggle {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-mode-toggle:hover {
  background: rgba(255, 255, 255, 0.5);
}
```

## 登录模式

### 扫码模式（默认）

```vue
<div class="qrcode-area">
  <div class="qrcode-title">企业微信扫码登录</div>
  <div class="qrcode-placeholder">
    <!-- 二维码占位 -->
    <div class="w-[180px] h-[180px] border rounded-lg flex items-center justify-center"
         style="border-color: var(--el-border-color-lighter);">
      <el-icon :size="48" style="color: var(--el-text-color-placeholder);">
        <Iphone />
      </el-icon>
    </div>
  </div>
  <div class="qrcode-tip">请使用企业微信扫描二维码</div>
</div>
```

### 密码模式

```vue
<el-form ref="formRef" :model="loginForm" :rules="loginRules" label-position="top">
  <el-form-item prop="account">
    <el-input
      v-model="loginForm.account"
      placeholder="请输入账号"
      :prefix-icon="User"
      size="large"
      :class="{ 'is-error-shake': shakingField === 'account' }"
    />
  </el-form-item>

  <el-form-item prop="password">
    <el-input
      v-model="loginForm.password"
      type="password"
      placeholder="请输入密码"
      :prefix-icon="Lock"
      size="large"
      show-password
    />
  </el-form-item>

  <!-- 验证码行 -->
  <el-form-item prop="captcha">
    <div class="flex gap-3 w-full">
      <el-input v-model="loginForm.captcha" placeholder="验证码" size="large" class="flex-1" />
      <el-button size="large" :disabled="countdown > 0" @click="sendCaptcha">
        {{ countdown > 0 ? `${countdown}s后重新获取` : '获取验证码' }}
      </el-button>
    </div>
  </el-form-item>

  <el-button type="primary" size="large" class="w-full" :loading="isLogging" @click="handleLogin">
    登录
  </el-button>
</el-form>
```

## 品牌轮播区

```vue
<div class="brand-carousel">
  <TransitionGroup name="slide-fade">
    <div v-for="slide in slides" v-show="currentSlide === slide.id" :key="slide.id"
         class="brand-slide">
      <h2 class="brand-slogan">{{ slide.slogan }}</h2>
      <p class="brand-description">{{ slide.description }}</p>
    </div>
  </TransitionGroup>

  <!-- 指示器 -->
  <div class="brand-indicators">
    <span v-for="(slide, i) in slides" :key="i"
          :class="['indicator-dot', { active: currentSlide === slide.id }]"
          @click="currentSlide = slide.id" />
  </div>
</div>
```

轮播文案示例：

| 系统 | Slogan | 描述 |
|------|--------|------|
| 天机 | 洞察先机，精准投放 | 智能投放平台，数据驱动增长 |
| 天问 | 让看数成为一个习惯 | 数据驱动精准决策 |

```css
.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.3s;
}
.indicator-dot.active {
  width: 24px;
  background: white;
}
```

## 表单验证

### 错误状态样式

```css
.el-input.is-error-shake .el-input__wrapper {
  border-color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.03) !important;
}

.el-input.is-error-shake .el-input__wrapper:focus-within {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}
```

### 抖动动画

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.is-error-shake {
  animation: shake 0.4s ease-out;
}
```

### 统一错误提示

```vue
<!-- 错误提示统一放在表单底部 -->
<div v-if="loginError" class="login-error-message">
  <el-icon><WarningFilled /></el-icon>
  {{ loginError }}
</div>
```

## 响应式断点

| 屏幕 | 布局 |
|------|------|
| ≥1200px | 左右双栏（品牌+登录） |
| 768-1199px | 居中单卡片（隐藏品牌轮播） |
| <768px | 全屏单卡片，padding减小 |

```css
@media (max-width: 1199px) {
  .brand-carousel { display: none; }
  .login-container { justify-content: center; }
}

@media (max-width: 767px) {
  .login-card-outer {
    width: 100%;
    max-width: 360px;
  }
  .login-card-inner {
    padding: 24px;
  }
}
```
