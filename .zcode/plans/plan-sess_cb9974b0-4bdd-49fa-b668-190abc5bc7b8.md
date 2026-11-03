# 产品视频介绍：接入 GitHub 视频仓库（jsDelivr 直链）

## Context
用户在公司 GitHub 仓库 https://github.com/yinkai411/vedios 上传了 9 段设备视频（约 189MB），希望在官网「业务与产品」页为对应设备新增视频介绍。已确认：视频走 **jsDelivr CDN 直链**（不入本仓库），多段视频用**单播放器+序号切换**。

**视频 ↔ 产品对应关系**（由目录/文件名确认）：
| 产品型号 | 目录/文件 | 段数 |
|---|---|---|
| YK-3E 长边码垛机 | 长边码垛/yk_3e_1.mp4 | 1 |
| YK-3F 短边码垛机 | 短边码垛/yk_3f_1.mp4、yk_3f_2.mp4 | 2 |
| YK-AL-1 龙门式自动上料 | 自动上料/yk_al_1.mp4 | 1 |
| YK-OL-2I 在线视觉检测 | 外观检测/VI_1.mp4、VI_2.mp4 | 2 |
| YK-OF-3I 离线全尺寸检测 | 全尺寸检测/yk_of_3_1/2/3.mp4 | 3 |

URL 形态：`https://cdn.jsdelivr.net/gh/yinkai411/vedios@main/<URL编码目录>/<文件>`（中文目录名需编码；jsDelivr 单文件 50MB 上限，最大 34.4MB 满足）。

## 实施步骤

### 1. `src/data/index.js` — 种子加 videos 字段
`productCategoriesSeed` 中上述 5 个产品各加 `videos: ['https://cdn.jsdelivr.net/gh/...', ...]`（可选字段，其余 8 个产品不加）。视频 URL 为普通字符串，无需 import。

### 2. `src/api/data.js` — 水合透传（关键，防 ERR-019/020 类静默丢失）
`hydrateProducts` 的产品映射对象中显式补一行：
```js
videos: prodSeed.get(p.model)?.videos,
```
否则后端在线时 `replaceList` 会把静态种子的 `videos` 字段整个丢弃（与英文翻译被水合覆盖同类的坑）。管理端新增产品无种子匹配时 `videos` 为 undefined，前端 `v-if` 自然隐藏。

### 3. `src/views/Services.vue` — 详情面板视频卡片
- 位置：`.svc-detail` 内，`.detail-head`（名称/简介）之后、`.detail-params`（参数表）之前；
- 结构：i18n 标题 + 原生 `<video controls preload="metadata">`（沿用 About.vue 宣传片模式，不引入播放器库）+ 多段时的序号按钮（1/2/3）；
- `<video>` 加 `:key="selectedProd.model + '-' + videoIdx"`，切换序号/切换产品强制重建元素换源；
- script：`videoIdx = ref(0)`，在现有 `watch(selectedProd, ...)`（重置 figIdx 处，约 133 行）一并重置；`videos` computed 取 `selectedProd.value.videos ?? []`；
- 样式：复用 `.detail-fig` 卡片质感（白底/边框/圆角/阴影），播放器 `width:100%; aspect-ratio:16/9; background:#000`（同 About.vue `.video-player`）；序号按钮品牌绿高亮态；列内自适应无需额外断点处理。

### 4. `src/i18n/zh.js` + `en.js` — 同步新增 key
`services.videoTitle`：zh「设备视频」/ en「Equipment Videos」，加在两文件 services 块（约 110–117 行），保持双语同步。

### 5. 不改动的部分
- 管理端/数据库不加视频列（视频属静态种子内容，管理页无需感知）；
- `deploy/`、后端、其他页面均不动。

## 验证
1. `npm run build` 通过；
2. 浏览器（`npm run dev`，当前后端停机走静态路径）验证 `/products`：
   - YK-3E/YK-AL-1 显示 1 段；YK-3F、YK-OL-2I 显示 2 个序号按钮；YK-OF-3I 显示 3 个；
   - 点击播放，Network 面板确认 jsDelivr URL 返回 200/206（video 元素 preload=metadata 仅拉头部，点播放才全量加载）；
   - 切换序号换源正常；切换产品视频区跟随并复位到第 1 段；无视频产品（如 YK-6A）不显示视频区；
   - EN 语言标题为「Equipment Videos」；375px 宽度无横向溢出（§11 弹性自查）；
3. 水合路径：启动本地 MySQL + server（3001）后在 dev 下重复上述抽查，确认后端在线时视频仍在（验证透传行）——若不便启动服务，则以代码逻辑核对代替并在交付说明中注明；
4. P4 记忆库同步：activeContext（焦点）、progress（0.16.0）、techContext（外部素材依赖：jsDelivr 直链 + 对方仓库须保持 public 的约束）；其余文件核对后按「无需更新+原因」记录；
5. P5：`git add -A` → commit → push，汇报哈希。

## 风险与备注
- jsDelivr 在大陆可用性有波动，且依赖 yinkai411/vedios 仓库保持 public 与文件不删除/改名；后续若上 VPS 可平滑切换为自托管（把 URL 常量改为本地路径即可，改动集中在种子一处）；
- 仓库无新增体积；视频流量在用户点击播放后才产生。
