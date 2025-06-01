我想要做一個專案，是關於 micropython 原本是運行在開發板上(例如esp32)，透過 GPIO 讀取/控制 傳感器，我要做一個模擬器，使用 pyodide 運行 micropython ，複寫micropython 的一些API , 讓 micropython 程式可以在網頁上運行，然後網頁上透過 html + css 模擬開發板和傳感器/控制器，可以執行 micropython 進行控制，你分析該如何分階段實作

## index.html
載入 micropython 的程式，並且執行
使用 pyodide 運行 micropython ，複寫micropython 的一些API , 讓 micropython 程式可以在網頁上運行，然後使用 @led-light 元件，模擬控制LED閃爍

