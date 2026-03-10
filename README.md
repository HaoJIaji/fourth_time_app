# 时简 - 单机版时间管理APP

[![Build Android APK](https://github.com/YOUR_USERNAME/shijian-app/actions/workflows/build-android.yml/badge.svg)](https://github.com/YOUR_USERNAME/shijian-app/actions/workflows/build-android.yml)

> 一款简洁高效的个人时间管理工具，完全离线使用，数据本地存储。

## ✨ 功能特性

- 📝 **行为记录** - 记录学习、工作、锻炼等活动的时长
- ⏱️ **计时器模式** - 实时计时，自动计算时长
- 📊 **数据统计** - 可视化图表展示时间分配
- 🔍 **历史查询** - 筛选、搜索历史记录
- 💾 **数据备份** - 支持JSON格式导入导出
- 🔥 **连续记录** - 自动统计连续打卡天数
- 📱 **完全离线** - 无需网络，数据本地存储

## 📲 下载安装

### 从GitHub Actions下载（推荐）

1. 访问本仓库的 [Actions](../../actions) 页面
2. 选择最新的成功构建记录
3. 滚动到底部 **Artifacts** 区域
4. 下载 `app-debug-apk`
5. 解压并安装到手机

### 从Releases下载

访问 [Releases](../../releases) 页面下载最新版本。

## 🛠️ 技术栈

- **前端**: Ionic 7 + Angular 17 + TypeScript
- **移动端**: Capacitor 5
- **UI组件**: Ionic Framework
- **构建工具**: GitHub Actions CI/CD

## 🚀 本地开发

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/shijian-app.git
cd shijian-app

# 安装依赖
npm install

# 启动开发服务器
ionic serve

# 构建Web资源
npm run build

# 同步到Android项目
npx cap sync android

# 打开Android Studio
npx cap open android
```

## 📋 系统要求

| 平台 | 最低版本 | 说明 |
|------|---------|------|
| Android | 5.0 (API 21) | 完全支持 |
| HarmonyOS | 2.0+ | 兼容运行 |

## 🏗️ 自动构建

本项目使用 GitHub Actions 自动构建：

- **触发条件**: 推送到 main/master 分支
- **构建环境**: Ubuntu + Node.js 20 + JDK 17
- **输出产物**: 
  - `app-debug.apk` - 调试版本
  - `app-release-unsigned.apk` - 发布版本（未签名）

## 📸 界面预览

### 首页概览
- 时间维度切换（今日/本周/本月）
- 总时长、记录数、连续天数统计
- 时长分布图
- 每日趋势图

### 记录页面
- 分类选择（学习/工作/锻炼）
- 快捷模板
- 计时器/直接输入切换
- 备注功能

### 历史记录
- 筛选器（类型、时间范围）
- 实时搜索
- 删除功能

## 🔄 数据备份

1. **导出数据**: 设置 → 导出数据 → 下载JSON文件
2. **导入数据**: 设置 → 导入数据 → 选择备份文件

## 📝 版本历史

### v1.0.0 (2026-03-09)
- 初始版本发布
- 基础记录功能
- 数据统计与可视化
- 数据导入导出

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

Made with ❤️ by 时简团队
