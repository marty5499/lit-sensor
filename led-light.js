// led-light.js
import { LitElement, html, css } from 'lit';
import { IoTDevice } from './iotDevice.js';

export class LedLight extends LitElement {
  static get properties() {
    return {
      on: { type: Boolean, reflect: true },       // LED 是否亮起
      color: { type: String, reflect: true },     // LED 顏色 (e.g. 'red', '#00FF00')
      diameter: { type: Number, reflect: true },  // LED 圓直徑 (以 px 為單位，可選)
      mqttSub: { type: String, attribute: 'mqtt-sub' } // MQTT 訂閱的 topic
    };
  }

  constructor() {
    super();
    this.on = false;
    this.color = 'red';
    this.diameter = 30; // 預設直徑 30px
    this.mqttSub = '';
    this.iotDevice = null;
    this.isConnected = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    // 確保從 HTML 屬性中讀取值
    if (!this.hasAttribute('color') && !this.color) {
      this.color = 'red';
    }
    if (!this.hasAttribute('diameter') && !this.diameter) {
      this.diameter = 30;
    }

    // 如果有 mqtt-sub 屬性，則設定 MQTT 連接
    if (this.mqttSub) {
      await this.setupMqttConnection();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // 元件被移除時清理 MQTT 連接
    if (this.iotDevice) {
      this.iotDevice.disconnect();
    }
  }

  async setupMqttConnection() {
    try {
      // 使用唯一的設備 ID（結合元素 ID 或生成隨機 ID）
      const effectiveDeviceId = this.mqttSub;
      this.iotDevice = new IoTDevice(effectiveDeviceId);
      
      console.log(`🔗 正在連接 MQTT... (Device ID: ${effectiveDeviceId})`);
      await this.iotDevice.connect();
      
      // 註冊訊息處理器
      this.iotDevice.proc('command', (message) => this.handleMqttCommand(message));
      
      this.isConnected = true;
      console.log(`✅ LED MQTT 連接成功! 可以發送訊息到 ${effectiveDeviceId}/command`);
      
      // 觸發連接成功事件
      this.dispatchEvent(new CustomEvent('mqtt-connected', {
        detail: { deviceId: effectiveDeviceId, topic: this.mqttSub },
        bubbles: true,
        composed: true
      }));
      
    } catch (error) {
      console.error('❌ MQTT 連接失敗:', error);
      this.dispatchEvent(new CustomEvent('mqtt-error', {
        detail: { error: error.message },
        bubbles: true,
        composed: true
      }));
    }
  }

  handleMqttCommand(message) {
    try {
      const command = message.payload?.command || message.payload;
      console.log(`📨 收到 MQTT 指令:`, command);
      
      if (typeof command === 'string') {
        this.executeCommand(command);
      } else if (typeof command === 'object' && command.method) {
        // 支援物件格式 { method: 'on', params: [] }
        this.executeCommand(command.method, command.params || []);
      }
      
      return { success: true, state: this.getState() };
    } catch (error) {
      console.error('❌ 執行 MQTT 指令失敗:', error);
      return { success: false, error: error.message };
    }
  }

  executeCommand(commandStr, params = []) {
    // 解析指令字串，例如 "on()" 或 "setSize(100)"
    if (typeof commandStr === 'string') {
      // 移除空格
      commandStr = commandStr.trim();
      
      // 解析方法名稱和參數
      const methodMatch = commandStr.match(/^(\w+)\((.*)\)$/);
      if (methodMatch) {
        const methodName = methodMatch[1];
        const paramStr = methodMatch[2].trim();
        
        // 解析參數
        if (paramStr) {
          try {
            // 簡單的參數解析：支援字串、數字、布林值
            const parsedParams = paramStr.split(',').map(p => {
              p = p.trim();
              // 移除引號
              if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
                return p.slice(1, -1);
              }
              // 布林值
              if (p === 'true') return true;
              if (p === 'false') return false;
              // 數字
              if (!isNaN(p)) return Number(p);
              // 其他視為字串
              return p;
            });
            params = parsedParams;
          } catch (e) {
            console.warn('參數解析失敗，使用原始字串:', paramStr);
            params = [paramStr];
          }
        }
        
        this.callMethod(methodName, params);
      } else {
        // 沒有括號的情況，視為無參數方法
        this.callMethod(commandStr, []);
      }
    } else {
      // 直接呼叫方法
      this.callMethod(commandStr, params);
    }
  }

  callMethod(methodName, params = []) {
    console.log(`🎯 執行方法: ${methodName}(${params.join(', ')})`);
    
    switch (methodName) {
      case 'on':
        this.turnOn();
        break;
      case 'off':
        this.turnOff();
        break;
      case 'toggle':
        this.toggle();
        break;
      case 'setColor':
        if (params[0]) this.setColor(params[0]);
        break;
      case 'setSize':
        if (params[0]) this.setSize(params[0]);
        break;
      case 'getState':
        return this.getState();
      default:
        console.warn(`❓ 未知的方法: ${methodName}`);
        throw new Error(`未知的方法: ${methodName}`);
    }
  }

  // LED 控制方法
  turnOn() {
    this.on = true;
    console.log('💡 LED 開啟');
    this._triggerChangeEvent();
  }

  turnOff() {
    this.on = false;
    console.log('🔴 LED 關閉');
    this._triggerChangeEvent();
  }

  toggle() {
    this.on = !this.on;
    console.log(`🔄 LED ${this.on ? '開啟' : '關閉'}`);
    this._triggerChangeEvent();
  }

  setColor(newColor) {
    this.color = newColor;
    console.log(`🎨 LED 顏色設定為: ${newColor}`);
    this._triggerChangeEvent();
  }

  setSize(newDiameter) {
    this.diameter = Number(newDiameter);
    console.log(`📏 LED 大小設定為: ${newDiameter}px`);
    this._triggerChangeEvent();
  }

  getState() {
    return {
      on: this.on,
      color: this.color,
      diameter: this.diameter,
      mqttConnected: this.isConnected
    };
  }

  _triggerChangeEvent() {
    this.dispatchEvent(new CustomEvent('led-change', {
      detail: { on: this.on, color: this.color, diameter: this.diameter },
      bubbles: true,
      composed: true
    }));
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        margin: 5px;
        position: relative;
      }
      .led {
        border-radius: 50%;
        width: var(--led-diameter, 30px);
        height: var(--led-diameter, 30px);
        background-color: rgba(0, 0, 0, 0.2);
        box-shadow: 0 0 5px rgba(0,0,0,0.4);
        transition: background-color 0.2s, box-shadow 0.2s;
        border: 2px solid #333;
        cursor: pointer;
      }
      .led.on {
        /* 當 LED 開啟時，用 CSS 變數或屬性 color 設定發光顏色 */
        background-color: var(--led-color, red);
        box-shadow: 0 0 10px var(--led-color, red), 0 0 20px var(--led-color, red);
        border-color: var(--led-color, red);
      }
      .led:hover {
        opacity: 0.8;
      }
      .mqtt-indicator {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #4CAF50;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .mqtt-indicator.connected {
        opacity: 1;
      }
    `;
  }

  render() {
    // 這裡利用 inline style 將屬性值傳給 CSS 變數
    return html`
      <div
        class="led ${this.on ? 'on' : ''}"
        style="
          --led-color: ${this.color};
          --led-diameter: ${this.diameter}px;
        "
        @click="${this._toggleLed}"
      ></div>
      ${this.mqttSub ? html`
        <div class="mqtt-indicator ${this.isConnected ? 'connected' : ''}"></div>
      ` : ''}
    `;
  }

  _toggleLed() {
    this.toggle();
  }
}

// 註冊成自訂元素
customElements.define('led-light', LedLight); 