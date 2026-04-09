<!-- 组件：顶部导航栏 -->
<template>
  <header class="workbench-topbar">
    <div class="workbench-topbar__left">
      <div class="workbench-topbar__brand">
        <span class="workbench-topbar__brand-mark" aria-hidden="true">
          <svg
            viewBox="0 0 149 148"
            class="workbench-topbar__brand-mark-svg"
          >
            <defs>
              <linearGradient id="topbarLogoGradPrimary" x1="0" y1="0" x2="149" y2="148" gradientUnits="userSpaceOnUse">
                <stop offset="0" style="stop-color: var(--el-color-primary)" />
                <stop offset="1" style="stop-color: var(--el-color-primary-dark-2)" />
              </linearGradient>
              <linearGradient id="topbarLogoGradBlock" x1="0" y1="0" x2="40" y2="39" gradientUnits="userSpaceOnUse">
                <stop offset="0" style="stop-color: var(--el-color-primary-dark-2)" />
                <stop offset="1" style="stop-color: var(--el-color-primary)" />
              </linearGradient>
            </defs>
            <path
              fill="url(#topbarLogoGradPrimary)"
              d="M0 0 C12.87 0 25.74 0 39 0 C39 12.54 39 25.08 39 38 C51.21 38 63.42 38 76 38 C76 25.46 76 12.92 76 0 C99.14995421 1.78076571 117.43763819 9.34070787 132.8359375 27.1875 C145.3887865 43.50167198 151.10844585 63.39806421 148.50390625 83.90625 C145.20846489 104.57156852 134.84554767 122.34339846 118 135 C105.41139882 143.73841431 90.90826972 148.18553705 75.60791016 148.11352539 C74.37764603 148.11374443 74.37764603 148.11374443 73.12252808 148.1139679 C70.42801208 148.11327462 67.73356633 148.10550972 65.0390625 148.09765625 C63.16433754 148.09578999 61.2896121 148.09436707 59.41488647 148.09336853 C54.49284507 148.08955973 49.57083341 148.07974346 44.64880371 148.06866455 C38.73662429 148.05661154 32.8244349 148.0520404 26.9122467 148.04621124 C17.94147715 148.0365308 8.97077279 148.01736279 0 148 C0 124.24 0 100.48 0 76 C12.87 76 25.74 76 39 76 C39 63.79 39 51.58 39 39 C26.13 39 13.26 39 0 39 C0 26.13 0 13.26 0 0 Z M77 39 C77 51.54 77 64.08 77 77 C64.46 77 51.92 77 39 77 C39 87.56 39 98.12 39 109 C44.94154821 109.09227599 50.88056942 109.17177872 56.82226562 109.21972656 C58.83960435 109.23973216 60.8568859 109.2669456 62.87402344 109.30175781 C65.78855573 109.35076577 68.70231559 109.37307964 71.6171875 109.390625 C72.95062698 109.42159271 72.95062698 109.42159271 74.31100464 109.45318604 C84.23353484 109.45667133 92.74310039 105.7407839 100 99 C106.44261101 92.21437961 110.13272389 83.81930381 110.4375 74.4375 C109.94270548 63.8668898 106.23351 55.76800581 99 48 C92.27829507 42.61877855 85.70646763 39 77 39 Z"
            />
            <path
              fill="url(#topbarLogoGradBlock)"
              d="M0 0 C12.87 0 25.74 0 39 0 C39.33 12.87 39.66 25.74 40 39 C26.8 39 13.6 39 0 39 C0 26.13 0 13.26 0 0 Z"
            />
          </svg>
        </span>
        <span class="workbench-topbar__brand-title">{{ cockpitBrandTitle }}</span>
      </div>
      <nav class="workbench-topbar__nav" aria-label="一级导航">
        <button
          v-for="item in navItems"
          :key="item.key"
          type="button"
          class="workbench-topbar__nav-item"
          :class="{ 'is-active': activeNav === item.key }"
          @click="handleNavSelect(item.key)"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>
    <div class="workbench-topbar__actions">
      <button type="button" class="ai-assistant-entry" aria-label="AI助手" title="AI助手">
        <span class="ai-assistant-entry__aurora" aria-hidden="true" />
        <span class="ai-assistant-entry__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2.75l1.58 4.67a1 1 0 0 0 .63.63L18.88 9.6l-4.67 1.58a1 1 0 0 0-.63.63L12 16.48l-1.58-4.67a1 1 0 0 0-.63-.63L5.12 9.6l4.67-1.55a1 1 0 0 0 .63-.63L12 2.75z" fill="currentColor" />
            <path d="M18.5 14.5l.75 2.25a.8.8 0 0 0 .5.5l2.25.75-2.25.75a.8.8 0 0 0-.5.5l-.75 2.25-.75-2.25a.8.8 0 0 0-.5-.5l-2.25-.75 2.25-.75a.8.8 0 0 0 .5-.5l.75-2.25z" fill="currentColor" opacity="0.9" />
          </svg>
        </span>
        <span class="ai-assistant-entry__label">AI助手</span>
      </button>
      <span class="workbench-topbar__divider" aria-hidden="true" />
      <button type="button" class="workbench-topbar__icon-btn" aria-label="导出中心">
        <el-icon><Download /></el-icon>
      </button>
      <button type="button" class="workbench-topbar__icon-btn" aria-label="消息中心">
        <el-icon><Bell /></el-icon>
      </button>
      <button type="button" class="workbench-topbar__icon-btn" aria-label="帮助中心">
        <el-icon><Service /></el-icon>
      </button>
      <button
        type="button"
        class="workbench-topbar__icon-btn"
        aria-label="主题设置"
        title="主题设置"
        @click="handleThemeDrawerOpen"
      >
        <el-icon><Setting /></el-icon>
      </button>
      <button
        type="button"
        class="workbench-topbar__icon-btn"
        aria-label="切换暗黑模式"
        title="切换暗黑模式"
        @click="handleDarkModeToggle"
      >
        <el-icon><MoonNight /></el-icon>
      </button>
      <span class="workbench-topbar__divider" aria-hidden="true" />
      <button type="button" class="workbench-topbar__user-trigger" aria-label="用户信息">
        <span class="workbench-topbar__user-avatar">
          <el-icon><UserFilled /></el-icon>
        </span>
        <span class="workbench-topbar__user-meta">
          <span class="workbench-topbar__user-name">{{ cockpitDemoUser.name }}</span>
          <span class="workbench-topbar__user-role">{{ cockpitDemoUser.role }}</span>
        </span>
        <el-icon class="workbench-topbar__user-arrow"><ArrowDown /></el-icon>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowDown, Bell, Download, MoonNight, Service, Setting, UserFilled } from "@element-plus/icons-vue";
import { cockpitBrandTitle, cockpitDemoUser } from "./mock-data";

interface NavItem {
  key: string;
  label: string;
}

interface Props {
  navItems: NavItem[];
  activeNav: string;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:activeNav": [value: string];
  "open-theme-drawer": [];
  "toggle-dark": [];
}>();

function handleNavSelect(key: string): void {
  emit("update:activeNav", key);
}

function handleDarkModeToggle(): void {
  emit("toggle-dark");
}

function handleThemeDrawerOpen(): void {
  emit("open-theme-drawer");
}
</script>
