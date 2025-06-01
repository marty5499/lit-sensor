# IoT LED 控制專案

這個專案包含了基於 Web Components 的 LED 控制元件，支援本地控制和 MQTT 遠端控制。

## 檔案說明

### 核心檔案
- `iotDevice.js` - IoT 設備的 MQTT 通訊核心類別
- `led-light.js` - LED Web Component（使用 Lit 框架，支援 MQTT）
- `led-mqtt.html` - 原生 Web Components 的 LED 示例
- `led-mqtt-test.html` - 完整的 MQTT LED 測試頁面

### 設定檔案
- `package.json` - npm 依賴設定
- `_sds.md` - 系統設計規格書

## 功能特色

### 1. 基本 LED 控制
```html
<led-light id="myLed" color="red" diameter="40"></led-light>
```

### 2. MQTT 遠端控制 ⭐ 新功能
```html
<led-light id="myLed" color="red" diameter="40" mqtt-sub="led1"></led-light>
```

當加入 `mqtt-sub` 屬性後，LED 元件會：
- 自動連接到 MQTT broker
- 訂閱 `{mqtt-sub}/command` topic
- 接收遠端控制指令
- 顯示連接狀態指示器

## MQTT 控制指令

### 支援的指令格式

#### 字串指令
發送到 topic: `led1/command`
```json
{
  "command": "on()"
}
```

#### 支援的方法
- `on()` - 開啟 LED
- `off()` - 關閉 LED  
- `toggle()` - 切換開關狀態
- `setColor('blue')` - 設定顏色
- `setSize(60)` - 設定大小（直徑 px）
- `getState()` - 取得目前狀態

#### 範例指令
```javascript
// 開啟 LED
{ "command": "on()" }

// 設定藍色
{ "command": "setColor('blue')" }

// 設定大小為 80px
{ "command": "setSize(80)" }

// 切換狀態
{ "command": "toggle()" }
```

## 使用方式

### 1. 本地測試
```bash
# 安裝依賴
npm install

# 啟動本地伺服器（如果需要）
python -m http.server 8000
# 或使用 Node.js
npx http-server
```

### 2. 測試頁面
- `led-mqtt.html` - 基本功能測試
- `led-mqtt-test.html` - 完整 MQTT 功能測試

### 3. MQTT 設定
元件預設連接到：
- Broker: `wss://mqtt-edu.webduino.io/mqtt`
- 使用者名稱: `hsh2025`
- 密碼: `hsh2025`

## 程式範例

### 基本使用
```html
<!DOCTYPE html>
<html>
<head>
    <script type="importmap">
        {
            "imports": {
                "lit": "https://cdn.jsdelivr.net/npm/lit@3/index.js"
            }
        }
    </script>
</head>
<body>
    <!-- 基本 LED -->
    <led-light color="red" diameter="30"></led-light>
    
    <!-- MQTT LED -->
    <led-light id="mqttLed" color="green" diameter="40" mqtt-sub="device1"></led-light>
    
    <script type="module">
        import './led-light.js';
        
        // 監聽 MQTT 連接事件
        document.addEventListener('mqtt-connected', (event) => {
            console.log('MQTT 已連接:', event.detail);
        });
        
        // 監聽 LED 狀態變化
        document.addEventListener('led-change', (event) => {
            console.log('LED 狀態變化:', event.detail);
        });
    </script>
</body>
</html>
```

### 發送 MQTT 指令
```javascript
// 使用 IoTDevice 發送指令
import { IoTDevice } from './iotDevice.js';

const sender = new IoTDevice('controller');
await sender.connect();

// 開啟 LED
sender.pub('device1.command', { command: 'on()' });

// 設定顏色
sender.pub('device1.command', { command: "setColor('purple')" });
```

## 元件屬性

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `color` | String | 'red' | LED 顏色 |
| `diameter` | Number | 30 | LED 直徑（px） |
| `on` | Boolean | false | LED 開關狀態 |
| `mqtt-sub` | String | '' | MQTT 訂閱的 topic 名稱 |

## 元件事件

| 事件 | 說明 | 事件資料 |
|------|------|----------|
| `led-change` | LED 狀態改變 | `{ on, color, diameter }` |
| `mqtt-connected` | MQTT 連接成功 | `{ deviceId, topic }` |
| `mqtt-error` | MQTT 連接錯誤 | `{ error }` |

## 技術架構

### Web Components
- 使用 Lit 框架建立可重用的 LED 元件
- 支援屬性反映和事件發送
- Shadow DOM 封裝樣式

### MQTT 通訊
- 基於 `iotDevice.js` 的 MQTT 客戶端
- 支援 WebSocket over MQTT
- 自動重連和錯誤處理

### 視覺指示
- LED 發光效果（CSS box-shadow）
- MQTT 連接狀態指示器
- 滑鼠懸停效果

## 故障排除

### 常見問題

1. **MQTT 連接失敗**
   - 檢查網路連線
   - 確認 broker 位址正確
   - 查看 console 錯誤訊息

2. **指令無法執行**
   - 確認指令格式正確
   - 檢查 topic 是否匹配
   - 驗證 JSON 格式

3. **元件無法載入**
   - 確認有正確引入 `led-light.js`
   - 檢查瀏覽器是否支援 ES modules
   - 查看 console 錯誤訊息

### 除錯方式
- 開啟瀏覽器開發者工具 Console
- 查看 MQTT 連接和訊息日誌
- 使用測試按鈕驗證功能

## 授權
MIT License