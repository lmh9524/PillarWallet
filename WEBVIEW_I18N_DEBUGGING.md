# WebView 中文化调试指南

## 🔍 问题现状

WebView 加载的界面（仪表盘、发送、接收、History 等）仍然显示英文，需要排查原因。

---

## 📝 调试步骤

### 步骤 1：查看日志输出

**在模拟器中重新加载应用**：
1. 在模拟器中按 **Ctrl+M**（Windows）或 **Cmd+M**（Mac）打开开发者菜单
2. 选择 **"Reload"**
3. 等待应用重新加载

**查看控制台日志**：
在运行 `yarn start` 的终端窗口中，查找以下日志：
```
🌐 WebView URL: https://...?devicePlatform=android&eoaAddress=...&lang=cn
🌍 Current Language: cn
```

**预期结果**：
- ✅ 如果看到 `lang=cn`，说明参数传递成功
- ❌ 如果看到 `lang=en` 或没有 `lang` 参数，说明语言切换未生效

---

### 步骤 2：验证语言切换

**确认当前语言设置**：
1. 在应用中进入 **Settings**（设置）
2. 查看 **Language**（语言）选项
3. 确认已选择 **"简体中文"**

**如果语言未切换**：
- 切换到简体中文
- 返回主界面
- 等待 WebView 重新加载

---

## 🎯 可能的原因和解决方案

### 原因 1：Web 应用不支持 `lang` 参数

**现象**：URL 中有 `lang=cn`，但界面仍显示英文

**原因**：Web 应用（staging 环境）可能：
- 不支持多语言
- 不识别 `lang` 参数
- 需要不同的参数格式（如 `locale=zh-CN` 或 `language=cn`）

**解决方案**：
1. **查找 Web 应用源码**：
   - 检查项目是否包含 Web 应用代码
   - 或者联系 Web 应用开发团队

2. **尝试不同参数格式**：
   修改 `Home.js` 的 URL 参数：
   ```javascript
   // 尝试 1: locale 参数
   const webviewUrl = `${baseUrl}?devicePlatform=${devicePlatform}&eoaAddress=${eoaAddress}&locale=zh-CN`;
   
   // 尝试 2: language 参数
   const webviewUrl = `${baseUrl}?devicePlatform=${devicePlatform}&eoaAddress=${eoaAddress}&language=zh`;
   ```

---

### 原因 2：Web 应用硬编码为英文

**现象**：无论传递什么参数，界面都是英文

**原因**：Web 应用可能：
- 只有英文版本
- 国际化未实现
- staging 环境不支持多语言

**解决方案**：
需要在 Web 应用中实现国际化：

1. **找到 Web 应用项目**：
   - 可能在同一个仓库的不同文件夹
   - 或者是独立的 Git 仓库

2. **添加中文翻译文件**：
   - 创建 `zh-CN.json` 或类似的翻译文件
   - 翻译所有界面文字

3. **实现语言切换逻辑**：
   - 读取 URL 参数 `lang`
   - 加载对应的语言包
   - 应用到界面

---

### 原因 3：缓存问题

**现象**：修改后仍显示旧内容

**解决方案**：
```bash
# 清除 Metro Bundler 缓存
yarn start --reset-cache

# 在模拟器中清除应用数据
adb shell pm clear com.pillarproject.wallet

# 重新安装应用
yarn android
```

---

## 🔧 进一步调试

### 方法 1：检查 Web 应用 URL

在 `Home.js` 的 WebView 组件中添加 `onLoadEnd` 日志：

```javascript
<WebView
  ref={webviewRef}
  source={{ uri: webviewUrl }}
  onLoadEnd={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.log('📍 WebView Loaded URL:', nativeEvent.url);
    setLoading(false);
  }}
  // ... 其他属性
/>
```

### 方法 2：注入 JavaScript 检查语言

在 WebView 中注入代码检查当前语言：

```javascript
injectedJavaScript={`
  (function() {
    console.log('WebView Language:', window.location.href);
    console.log('HTML Lang:', document.documentElement.lang);
    // 检查是否有国际化库
    console.log('i18n:', typeof window.i18n !== 'undefined');
    console.log('i18next:', typeof window.i18next !== 'undefined');
  })();
  true;
`}
```

---

## 📊 决策树

```
WebView 仍显示英文
    ↓
检查控制台日志
    ↓
是否有 "🌐 WebView URL" 日志？
    ├─ 否 → 重新加载应用（Ctrl+M → Reload）
    └─ 是 → URL 中是否包含 lang=cn？
        ├─ 否 → 检查语言是否已切换到简体中文
        └─ 是 → Web 应用不支持该参数
            ↓
        需要修改 Web 应用代码添加中文支持
        或者查找 Web 应用是否有其他语言参数格式
```

---

## 🎯 下一步行动

1. **立即执行**：
   - 在模拟器中重新加载应用（Ctrl+M → Reload）
   - 查看终端日志，确认 URL 是否包含 `lang=cn`

2. **如果参数正确传递**：
   - 说明 Web 应用本身不支持中文
   - 需要找到 Web 应用源码并实现国际化

3. **如果参数未传递**：
   - 检查 Settings 中是否已切换到简体中文
   - 尝试清除缓存后重新运行

---

## 📞 获取帮助

如果需要进一步协助，请提供：
1. 终端中的完整日志输出（包含 🌐 和 🌍 emoji 的行）
2. Web 应用的项目位置或仓库地址
3. 是否有权限修改 Web 应用代码
