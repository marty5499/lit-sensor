# LED 元件使用手冊

## 🔆 簡介

`led-light` 是一個基於 LitElement 建立的自訂 Web 元件，用於模擬 LED 燈光效果。這個元件提供了豐富的自訂選項和互動功能，適合用於 IoT 儀表板、狀態指示器或教學示範。

## 📦 安裝與引入

### 1. 引入元件

```html
<!-- 在 HTML 中引入元件 -->
<script type="module" src="./led-light.js"></script>
```

### 2. 使用 npm（如果發佈到 npm）

```bash
npm install your-led-component
```

```javascript
import './node_modules/your-led-component/led-light.js';
```

## 🚀 基本使用

### 簡單範例

```html
<!DOCTYPE html>
<html>
<head>
    <title>LED 元件範例</title>
</head>
<body>
    <!-- 基本 LED -->
    <led-light></led-light>
    
    <!-- 自訂顏色的 LED -->
    <led-light color="blue"></led-light>
    
    <!-- 預設開啟的綠色 LED -->
    <led-light color="#00FF00" on></led-light>
    
    <!-- 大尺寸紅色 LED -->
    <led-light color="red" diameter="50"></led-light>
    
    <script type="module" src="./led-light.js"></script>
</body>
</html>
```

## 📋 屬性 (Properties)

| 屬性名稱 | 類型 | 預設值 | 說明 | 範例 |
|----------|------|--------|------|------|
| `on` | Boolean | `false` | LED 是否亮起 | `<led-light on></led-light>` |
| `color` | String | `'red'` | LED 顏色（支援所有 CSS 顏色格式） | `<led-light color="blue"></led-light>` |
| `diameter` | Number | `30` | LED 直徑（像素單位） | `<led-light diameter="40"></led-light>` |

### 顏色格式支援

```html
<!-- 顏色名稱 -->
<led-light color="red"></led-light>
<led-light color="blue"></led-light>
<led-light color="green"></led-light>

<!-- 十六進位色碼 -->
<led-light color="#FF0000"></led-light>
<led-light color="#00FF00"></led-light>
<led-light color="#0066CC"></led-light>

<!-- RGB 格式 -->
<led-light color="rgb(255, 0, 0)"></led-light>
<led-light color="rgba(0, 255, 0, 0.8)"></led-light>

<!-- HSL 格式 -->
<led-light color="hsl(120, 100%, 50%)"></led-light>
```

## 🎛️ 程式控制

### 取得元件參考

```javascript
// 透過 ID 取得
const led = document.getElementById('myLed');

// 透過查詢選擇器
const led = document.querySelector('led-light');
const allLeds = document.querySelectorAll('led-light');
```

### 控制 LED 狀態

```javascript
const led = document.querySelector('led-light');

// 開啟 LED
led.on = true;

// 關閉 LED
led.on = false;

// 切換狀態
led.on = !led.on;

// 改變顏色
led.color = '#00FF00';
led.color = 'blue';
led.color = 'rgb(255, 165, 0)';

// 改變大小
led.diameter = 50;

// 連鎖設定
led.on = true;
led.color = 'purple';
led.diameter = 60;
```

### 批量控制

```javascript
// 控制多個 LED
const allLeds = document.querySelectorAll('led-light');

// 全部開啟
allLeds.forEach(led => led.on = true);

// 全部關閉
allLeds.forEach(led => led.on = false);

// 隨機狀態
allLeds.forEach(led => {
    led.on = Math.random() > 0.5;
});

// 依序點亮
allLeds.forEach((led, index) => {
    setTimeout(() => {
        led.on = true;
    }, index * 500);
});
```

## 🎯 事件處理

### 監聽 LED 狀態變化

```javascript
// 監聽特定 LED
const led = document.querySelector('#myLed');
led.addEventListener('led-change', (event) => {
    console.log('LED 狀態改變:', event.detail.on);
    console.log('LED 顏色:', event.detail.color);
});

// 監聽所有 LED 變化（使用事件冒泡）
document.addEventListener('led-change', (event) => {
    const ledElement = event.target;
    console.log(`LED 編號: ${ledElement.id || '未命名'}`);
    console.log(`狀態: ${event.detail.on ? '開啟' : '關閉'}`);
    console.log(`顏色: ${event.detail.color}`);
});
```

### 點擊事件

```javascript
// LED 元件內建點擊切換功能
// 額外的點擊事件處理
const led = document.querySelector('led-light');
led.addEventListener('click', () => {
    console.log('LED 被點擊了！');
});
```

## 🎨 樣式自訂

### CSS 變數

LED 元件使用 CSS 變數，可以透過外部 CSS 進行自訂：

```css
/* 自訂 LED 樣式 */
led-light {
    --led-border-width: 3px;
    --led-shadow-spread: 15px;
    margin: 10px;
}

/* 針對特定 LED */
#specialLed {
    --led-border-width: 5px;
    filter: brightness(1.2);
}

/* 懸停效果 */
led-light:hover {
    transform: scale(1.1);
    transition: transform 0.2s;
}
```

### 容器佈局

```css
/* LED 陣列佈局 */
.led-array {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 20px;
}

/* 水平排列 */
.led-row {
    display: flex;
    align-items: center;
    gap: 15px;
}

/* 垂直排列 */
.led-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
```

## 🔧 實用函數

### 建立 LED 控制器

```javascript
class LedController {
    constructor(selector) {
        this.leds = document.querySelectorAll(selector);
    }
    
    turnOn(indices = null) {
        const targets = indices ? 
            indices.map(i => this.leds[i]) : 
            this.leds;
        targets.forEach(led => led && (led.on = true));
    }
    
    turnOff(indices = null) {
        const targets = indices ? 
            indices.map(i => this.leds[i]) : 
            this.leds;
        targets.forEach(led => led && (led.on = false));
    }
    
    blink(interval = 500, times = 5) {
        let count = 0;
        const blinkInterval = setInterval(() => {
            this.leds.forEach(led => led.on = !led.on);
            count++;
            if (count >= times * 2) {
                clearInterval(blinkInterval);
            }
        }, interval);
    }
    
    wave(delay = 200) {
        this.leds.forEach((led, index) => {
            setTimeout(() => {
                led.on = true;
                setTimeout(() => led.on = false, delay);
            }, index * delay);
        });
    }
}

// 使用範例
const controller = new LedController('led-light');
controller.turnOn([0, 2, 4]); // 開啟第 0, 2, 4 個 LED
controller.blink(300, 3);      // 閃爍 3 次
controller.wave(150);          // 波浪效果
```

### 狀態管理器

```javascript
class LedStatusManager {
    constructor() {
        this.statusElement = document.getElementById('ledStatus');
        this.leds = document.querySelectorAll('led-light');
        this.init();
    }
    
    init() {
        document.addEventListener('led-change', () => {
            this.updateDisplay();
        });
        this.updateDisplay();
    }
    
    updateDisplay() {
        const status = Array.from(this.leds).map((led, index) => {
            const id = led.id || `LED-${index + 1}`;
            const state = led.on ? '🟢' : '🔴';
            const color = led.color || 'red';
            return `${id}: ${state} (${color})`;
        }).join('\n');
        
        if (this.statusElement) {
            this.statusElement.textContent = status;
        }
    }
    
    getActiveCount() {
        return Array.from(this.leds).filter(led => led.on).length;
    }
    
    getStatusSummary() {
        const total = this.leds.length;
        const active = this.getActiveCount();
        return `${active}/${total} LED 開啟中`;
    }
}

// 使用範例
const statusManager = new LedStatusManager();
console.log(statusManager.getStatusSummary());
```

## 🎮 動畫效果

### 呼吸燈效果

```javascript
function breathingEffect(led, duration = 2000) {
    let startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % duration) / duration;
        const opacity = (Math.sin(progress * Math.PI * 2) + 1) / 2;
        
        led.style.opacity = opacity;
        
        requestAnimationFrame(animate);
    }
    
    led.on = true;
    animate();
}

// 使用
const led = document.querySelector('led-light');
breathingEffect(led, 3000);
```

### 彩虹效果

```javascript
function rainbowEffect(led, duration = 5000) {
    let startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % duration) / duration;
        const hue = progress * 360;
        
        led.color = `hsl(${hue}, 100%, 50%)`;
        led.on = true;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// 使用
const led = document.querySelector('led-light');
rainbowEffect(led, 4000);
```

## 🔗 與其他元件整合

### 與按鈕整合

```html
<div class="led-control">
    <led-light id="statusLed" color="green"></led-light>
    <button id="toggleBtn">切換狀態</button>
    <button id="colorBtn">改變顏色</button>
</div>

<script>
const led = document.getElementById('statusLed');
const toggleBtn = document.getElementById('toggleBtn');
const colorBtn = document.getElementById('colorBtn');

toggleBtn.addEventListener('click', () => {
    led.on = !led.on;
    toggleBtn.textContent = led.on ? '關閉' : '開啟';
});

const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
let colorIndex = 0;

colorBtn.addEventListener('click', () => {
    colorIndex = (colorIndex + 1) % colors.length;
    led.color = colors[colorIndex];
});
</script>
```

### 與滑桿整合

```html
<div class="led-control">
    <led-light id="sizeLed" color="blue"></led-light>
    <input type="range" id="sizeSlider" min="20" max="80" value="30">
    <span id="sizeDisplay">30px</span>
</div>

<script>
const led = document.getElementById('sizeLed');
const slider = document.getElementById('sizeSlider');
const display = document.getElementById('sizeDisplay');

slider.addEventListener('input', () => {
    const size = parseInt(slider.value);
    led.diameter = size;
    display.textContent = `${size}px`;
});
</script>
```

## 🐛 疑難排解

### 常見問題

1. **LED 顏色顯示為 undefined**
   ```javascript
   // 解決方案：確保元件已完全載入
   customElements.whenDefined('led-light').then(() => {
       // 在這裡操作 LED
       const led = document.querySelector('led-light');
       console.log(led.color); // 現在應該有正確的值
   });
   ```

2. **屬性設定沒有效果**
   ```javascript
   // 確保在 DOM 元素存在後設定
   window.addEventListener('DOMContentLoaded', () => {
       const led = document.querySelector('led-light');
       led.color = 'blue';
       led.on = true;
   });
   ```

3. **事件沒有觸發**
   ```javascript
   // 確保在元件註冊後綁定事件
   customElements.whenDefined('led-light').then(() => {
       document.addEventListener('led-change', (event) => {
           console.log('LED 狀態改變:', event.detail);
       });
   });
   ```

## 📚 進階使用案例

### IoT 儀表板

```html
<div class="iot-dashboard">
    <div class="sensor-status">
        <h3>感測器狀態</h3>
        <div class="sensor-item">
            <span>溫度感測器</span>
            <led-light id="tempSensor" color="green" diameter="25"></led-light>
        </div>
        <div class="sensor-item">
            <span>濕度感測器</span>
            <led-light id="humiditySensor" color="blue" diameter="25"></led-light>
        </div>
        <div class="sensor-item">
            <span>光線感測器</span>
            <led-light id="lightSensor" color="yellow" diameter="25"></led-light>
        </div>
    </div>
</div>
```

### 網路狀態指示器

```javascript
function updateNetworkStatus() {
    const networkLed = document.getElementById('networkLed');
    
    if (navigator.onLine) {
        networkLed.on = true;
        networkLed.color = 'green';
    } else {
        networkLed.on = true;
        networkLed.color = 'red';
    }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();
```

## 🎯 最佳實踐

1. **性能優化**
   - 避免頻繁的顏色變更
   - 使用 `requestAnimationFrame` 進行動畫
   - 適時清理事件監聽器

2. **可訪問性**
   - 提供適當的 `aria-label`
   - 考慮色盲使用者，提供額外的視覺指示

3. **響應式設計**
   - 使用相對單位設定大小
   - 考慮不同螢幕尺寸的顯示效果

```css
/* 響應式 LED 大小 */
@media (max-width: 768px) {
    led-light {
        --led-diameter: 20px;
    }
}

@media (min-width: 1200px) {
    led-light {
        --led-diameter: 40px;
    }
}
```

---

## 📄 授權

ISC License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個元件！
