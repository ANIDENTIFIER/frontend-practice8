# 个人技术整合练习（期末大作业原型）

## 运行说明
1. 无需安装依赖：`libs/` 内已包含本地 A-Frame、jQuery、Bootstrap、ECharts、Chart.js 等库，全程无需联网。
2. 用浏览器打开 `index.html` 即可运行；推荐用本地静态服务器（如 VS Code Live Server）打开，避免直接双击打开文件时 `fetch data/data.json` 被浏览器跨域策略拦截。
3. 页面分三个区块：任务清单（添加任务、点击切换完成、按全部/未完成/已完成筛选，数据存浏览器本地）、借阅看板（读取 data/data.json 画图）、校园一角（三维场景）。

## 资源来源说明
- 交互模块（任务添加、完成状态切换、三种筛选、localStorage 保存）：来自课堂作业五 `frontend-practice5/todo-app`；
- 图表模块（借阅看板、ECharts 柱状图、Chart.js 折线图及联动）：来自课堂作业六 `frontend-practice6/dashboard`；
- 三维模块（校园一角：教学楼、旗杆旗帜、路灯、天空草地）：来自课堂作业七 `frontend-practice7/three-d/campus.html`；
- 数据文件 `data/data.json`：来自课堂作业六 `frontend-practice6/dashboard/data/books.json`；
- 第三方库：A-Frame、jQuery、Bootstrap、ECharts、Chart.js（均为课堂提供的本地文件，位于 `libs/`，不使用 CDN）。
