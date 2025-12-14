# 🔧 PillarWallet 二次开发定制指南

## 📋 目录
1. [法律与许可](#法律与许可)
2. [品牌化改造](#品牌化改造)
3. [技术配置](#技术配置)
4. [功能定制](#功能定制)
5. [部署发布](#部署发布)

---

## 📜 法律与许可

### GPL v2 许可证要求
- ✅ **可以**：修改、商业化、重新发布
- ⚠️ **必须**：保留版权声明、开源修改后的代码
- ⚠️ **建议**：在 README 中明确说明基于 PillarWallet

### 推荐做法
```markdown
# YourWallet

基于 [PillarWallet](https://github.com/pillarwallet/pillarwallet) 开发
许可证: GPL v2
```

---

## 🎨 品牌化改造

### 步骤 1：修改应用名称和包名

**1.1 修改 app.json**
```json
{
  "name": "YourWalletName",
  "displayName": "Your Wallet"
}
```

**1.2 修改 Android 包名**

`android/app/src/main/AndroidManifest.xml`
```xml
<manifest package="com.yourcompany.wallet">
```

`android/app/build.gradle`
```gradle
applicationId "com.yourcompany.wallet"
```

**1.3 修改 iOS Bundle ID**

`ios/pillarwallet/Info.plist`
```xml
<key>CFBundleIdentifier</key>
<string>com.yourcompany.wallet</string>
```

### 步骤 2：替换 Logo 和图标

**位置**：
- `assets/images/pillarx-logo.png` → 替换为您的 Logo
- Android 图标：`android/app/src/main/res/mipmap-*/`
- iOS 图标：`ios/pillarwallet/Images.xcassets/AppIcon.appiconset/`

**工具**：
- 使用 [App Icon Generator](https://appicon.co/) 生成所有尺寸

### 步骤 3：修改品牌颜色

`src/utils/themes/light.js` 和 `dark.js`
```javascript
export default {
  colors: {
    primary: '#YOUR_PRIMARY_COLOR',
    secondary: '#YOUR_SECONDARY_COLOR',
    // ... 其他颜色
  }
}
```

### 步骤 4：更新启动画面

- Android: `android/app/src/main/res/drawable/splash_screen.xml`
- iOS: `ios/pillarwallet/LaunchScreen.storyboard`

---

## ⚙️ 技术配置

### 步骤 1：创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目
3. 添加 Android 和 iOS 应用
4. 下载配置文件：
   - Android: `google-services.json` → `android/app/`
   - iOS: `GoogleService-Info.plist` → `ios/pillarwallet/`

### 步骤 2：配置 Remote Config

在 Firebase Console → Remote Config 中设置：

```json
{
  "pillarx_endpoint": "https://your-dashboard-url.com",
  "infura_project_id": "YOUR_INFURA_ID",
  "app_support_email": "support@yourwallet.com"
}
```

### 步骤 3：注册第三方服务

**Infura（必需）**
- 注册：https://infura.io/
- 获取 Project ID
- 在 Firebase Remote Config 中配置

**Web3Auth（可选 - 社交登录）**
- 注册：https://web3auth.io/
- 创建项目
- 配置回调 URL

**Etherspot（可选 - 账户抽象）**
- 注册：https://etherspot.io/
- 获取 API Key

---

## 🔧 功能定制

### 选项 A：保留 WebView Dashboard

**如果您有 Web 应用源码**：
1. 修改 Web 应用品牌
2. 部署到自己的域名
3. 在 Firebase Remote Config 更新 `pillarx_endpoint`

**如果没有 Web 应用源码**：
需要开发自己的 Dashboard，可选方案：
- 使用 DeFi 开源模板（Uniswap Interface）
- 雇佣开发团队
- 使用第三方 Dashboard 服务

### 选项 B：移除 WebView，使用原生界面

**修改 `src/screens/Home/Home.js`**：
```javascript
// 移除 WebView，改为原生 Dashboard
import NativeDashboard from './components/NativeDashboard';

function Home() {
  return (
    <SafeArea>
      <NativeDashboard />
    </SafeArea>
  );
}
```

**开发 NativeDashboard 组件**：
- 资产列表
- 发送/接收按钮
- 交易历史
- 余额图表

### 移除不需要的功能

**编辑 `src/constants/remoteConfigConstants.js`**：
```javascript
export const INITIAL_REMOTE_CONFIG = {
  // 关闭不需要的功能
  [REMOTE_CONFIG.FEATURE_PLR_STAKING]: false,
  [REMOTE_CONFIG.FEATURE_LIQUIDITY_POOLS]: false,
  [REMOTE_CONFIG.VISIBILE_WEB3_AUTH]: false,
  // ... 其他配置
};
```

---

## 🚀 部署发布

### Android 发布

**1. 生成签名密钥**
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-wallet.keystore \
  -alias my-wallet-key -keyalg RSA -keysize 2048 -validity 10000
```

**2. 配置签名**

`android/app/build.gradle`
```gradle
signingConfigs {
    release {
        storeFile file('my-wallet.keystore')
        storePassword 'YOUR_PASSWORD'
        keyAlias 'my-wallet-key'
        keyPassword 'YOUR_PASSWORD'
    }
}
```

**3. 构建 APK/AAB**
```bash
cd android
./gradlew bundleRelease
```

**4. 上传到 Google Play**
- 访问 [Google Play Console](https://play.google.com/console)
- 创建应用
- 上传 AAB：`android/app/build/outputs/bundle/release/app-release.aab`

### iOS 发布

**1. 配置签名**
- 打开 `ios/pillarwallet.xcworkspace` 在 Xcode 中
- 设置 Team 和 Provisioning Profile

**2. 构建归档**
```bash
cd ios
xcodebuild -workspace pillarwallet.xcworkspace \
  -scheme pillarwallet -configuration Release archive
```

**3. 上传到 App Store**
- 使用 Xcode → Organizer
- 或使用 Transporter 应用

---

## 🎯 推荐改造路线

### 最小可行产品（MVP - 2周）

**Week 1**:
- [x] 修改品牌名称、Logo、颜色
- [x] 修改包名和 Bundle ID
- [x] 配置 Firebase 项目
- [x] 注册 Infura

**Week 2**:
- [x] 移除 WebView Dashboard
- [x] 实现简单的原生 Dashboard
- [x] 测试发送/接收功能
- [x] 构建测试版本

### 完整产品（3-4个月）

**Month 1: 基础功能**
- MVP 内容
- 完善原生界面
- 添加图表和统计

**Month 2: 高级功能**
- 开发 Web Dashboard
- 集成更多 DeFi 协议
- 添加交换功能

**Month 3: 优化和测试**
- 性能优化
- 安全审计
- Beta 测试

**Month 4: 发布和营销**
- 应用商店上架
- 用户文档
- 社区建设

---

## 💡 技术建议

### 安全考虑
- ✅ 使用硬件安全模块存储私钥
- ✅ 实施 Pin 码和生物识别
- ✅ 定期安全审计
- ✅ 实施速率限制和防欺诈措施

### 性能优化
- ✅ 使用 Redux Persist 缓存数据
- ✅ 优化图片资源
- ✅ 延迟加载非关键功能
- ✅ 使用 Hermes JavaScript 引擎

### 用户体验
- ✅ 完善的错误处理
- ✅ 离线模式支持
- ✅ 清晰的交易确认流程
- ✅ 多语言支持

---

## 🔍 常见问题

### Q1: 是否需要开源？
A: 根据 GPL v2，如果发布应用，需要开源修改后的代码。

### Q2: 可以商业化吗？
A: 可以，GPL v2 允许商业使用。

### Q3: 如何处理更新？
A: 可以定期从原仓库合并更新，或完全独立维护。

### Q4: 需要多少开发资源？
A: 最小改造：1-2 名开发者 2-4 周
   完整产品：2-3 名开发者 3-4 个月

### Q5: 维护成本？
A: 小规模：$50-200/月（服务器、API）
   中等规模：$500-2000/月（含开发者）

---

## 📞 获取帮助

如果需要专业的二次开发服务，可以考虑：
- 联系 Web3 开发公司
- 雇佣 React Native 开发者
- 加入区块链开发者社区

---

## ✅ 检查清单

改造前请确认：
- [ ] 理解 GPL v2 许可证要求
- [ ] 确定功能需求和范围
- [ ] 评估开发资源和预算
- [ ] 准备好第三方服务账号
- [ ] 设计新的品牌标识
- [ ] 制定测试和发布计划

---

**祝您的钱包项目成功！** 🚀
