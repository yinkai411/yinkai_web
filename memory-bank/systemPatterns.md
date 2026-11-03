# systemPatterns.md — 架构与技术决策

## 架构
Vue 3(`<script setup>`)+ Vite SPA:
- `App.vue` = AppNavbar + AppFooter + `<router-view>`
- 路由:`/`(Home)、`/about`、`/products`(原 `/services`,2026-09-22 改,旧路径重定向)、`/news`、`/news/:id`、`/careers`、`/contact`;createWebHistory
- i18n:vue-i18n 实例单例,locale 持久化 localStorage(key: `locale`),Element Plus locale 经 computed 跟随
- 数据流:`src/data/index.js` 导出常量数组(services/milestones/team/news/jobs/welfares)→ views/components 只读消费;`src/data/lang.js` 提供 `pick(field, locale)` 取双语字段
- 首页顶部:`components/HeroCarousel.vue`(el-carousel 全宽轮播,slides 数组图片 + i18n key,图片素材在 `src/assets/`)

## 关键技术决策
1. Element Plus 按需引入:unplugin-vue-components + ElementPlusResolver;函数式组件(ElMessage 等)单独引入样式
2. 主题:覆盖 Element Plus CSS 变量(--el-color-primary 系列)于 `assets/styles/main.css`,品牌主色 #00a651 绿色系(呼应公司 logo);禁 `!important` 硬覆盖
3. 样式:design tokens CSS 变量(:root)+ scoped 页面样式;断点 ≤768 / 769–1024 / >1024;**弹性布局硬约束见 AGENTS.md §11 v1.2**——容器 max-width、多列 fr/minmax、大高度/字号 clamp() 流式(根字号 clamp 惯例)、导航抽屉断点 1024(7 链接+长品牌名在更窄区间放不下)
4. 双语字段:静态数据 `{ zh: '', en: '' }`;**数据库/后端 API 仅存/返回中文(`{zh}`,2026-09-30 起)**,但水合时按业务键把静态种子(src/data 的 `*Seed`)的 en 字段合并回 API 行(src/api/data.js `withEn`,2026-10-23,ERR-019)——英文界面显示英文,仅管理端新增且无种子翻译的内容由 `pick(field, locale)` 回退 zh;模板文案全部走 i18n key(`页面.区块.字段`)
5. 管理端 CRUD:server/src/routes/admin/content.js 的 `crud()` 按表配置 allowEdit 白名单+SHOW COLUMNS 过滤,新增列只需改白名单;news/jobs 主键非自增,新增自动 MAX(id)+1
6. 表单双通道(2026-11-02):`src/api/forms.js` 先 POST 自建后端(`/api/contact`、`/api/apply` → SMTP 邮件),以「是否拿到 JSON 应答」判断后端存在——有 JSON 即最终结论(含 4xx/5xx),否则回退 Netlify Forms 影子表单。同一份构建在 VPS/Netlify/GitHub Pages 三平台行为正确,无需构建期开关
7. 部署形态:一套代码三平台,只靠构建参数区分(VPS `VITE_DEPLOY=vps` 根路径;Netlify 自带 NETLIFY;GitHub Pages 默认 /yinkaish/)。VPS 为 Nginx 同源反代(/api、/uploads → 127.0.0.1:3001),前端相对路径零改动;物料在 `deploy/`,后端 pm2 定义在 `server/ecosystem.config.cjs`

## 已知陷阱与规避模式
- **部署开关用枚举 token,不用路径字面量(ERR-021)**:Git Bash/MSYS 会把 `/` 开头的环境变量值转成 Windows 路径;构建成功 ≠ 产物正确,必须核对 dist/index.html 资源前缀。反代后端须 `trust proxy`,否则限速按 Nginx IP 计且 express-rate-limit 直接抛错
- **第三方 CDN/托管配额须用真实文件实测(ERR-022)**:文档口径分通道(jsDelivr npm 50MB vs /gh/ 20MB),凭印象评估会翻车;外部媒体用多源 <source> 链可零成本回退
- **映射重构须核对消费方键契约(ERR-020)**:抽取共享映射(assets.js 文件名键)到公共模块时,既有数据的引用键(pN 短键)必须同步或在别名处重建键形态;「水合掩盖静态兜底缺陷」——兜底路径(后端停机/纯静态部署)必须独立验证,不能只测带后端的 dev
- **网格/flex 轨道被 min-content 撑破(ERR-002)**:`1fr` 轨道实际是 `minmax(auto,1fr)`,轨道内含不可收缩内容(如 flex-shrink:0 的横滚缩略图行)会把轨道撑到内容宽、整页横向溢出;修法=网格项加 `min-width: 0`,让内部 overflow-x:auto 生效
- **布局禁用 100vw(ERR-003)**:有纵向滚动条时 100vw 比可用宽大一个滚动条宽,间距用 % / clamp
- **外部素材入库**:第三方图/svg 先核验许可(如引入则建 `src/assets/CREDITS.md` 署名,素材移除时文件一并清理);网络下载的大 SVG 可能被截断,先验 XML 完整性(或改用 npm pack)
- **动态重渲染需重扫入场观察器(ERR-006)**:`useReveal` 返回 `{ rescan }`;v-for 分页/筛选等 DOM 更新后(nextTick)调用,新 `[data-reveal]` 节点按 `data-reveal-bound` 去重纳入观察
- **地理地图慎用**:世界地图涉及边界表达合规风险(未经官方审图),本项目已整体移除;如需恢复须选经审图的地图数据源
