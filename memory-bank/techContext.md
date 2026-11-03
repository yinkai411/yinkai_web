# techContext.md — 技术栈与环境

## 技术栈
- Node v24 / npm 11(Windows,Git Bash)
- Vue 3 + Vite 5;vue-router@4;vue-i18n@9
- element-plus@2(按需:unplugin-vue-components + ElementPlusResolver)+ @element-plus/icons-vue
- flag-icons(MIT,国旗 SVG 素材包):**已卸载依赖,51 面所用旗帜 SVG 已复制入 `src/assets/flags/`**(仓库自持,import.meta.glob 按需加载);用于联系页区号自动匹配国旗(见 ERR-007,emoji 旗帜 Windows 不可用);区号数据表在 `src/data/dialCodes.js`
- 样式:原生 CSS + design tokens,无预处理器;品牌素材(logo/轮播图)在 `src/assets/`
- **产品视频(2026-11-03)**:github.com/yinkai411/vedios 直链(零仓库成本),URL 构造集中在 src/data/index.js 的 ghVideo();**jsDelivr /gh/ 对 GitHub 文件上限 20MB(ERR-022)**——≤20MB [jsDelivr,raw] 双源(原生 <source> 自动回退),>20MB 直走 raw(大陆可用性差属已知取舍);依赖 vedios 仓库保持 public 且文件不改名;切自托管只需改 ghVideo() 一处;管理端/库无视频字段,水合由 api/data.js 按型号从种子透传
- **构建约束**:`vite.config.js` 已设 `build.minify:false`——esbuild 压缩在本项目会产生变量名冲突(页脚组件渲染丢失,见 errorlog ERR-001);产物约 641KB(gzip 150KB),官网可接受,勿随意改回
- **i18n 约束**:消息含 `@` 等保留字符需 `{'@'}` 转义(邮箱地址);main.js 的 app.config.errorHandler 用于生产排错

## 环境与工具约束
- 仓库:D:\yinkai_web,远程 git@github.com:20010811yu/yinkaish.git,分支 main
- 规则文件:仓库根 AGENTS.md(工作流 P0–P5 + 项目规范)
- 构建验证:`npm run build` 必须通过;本地验证 `npm run dev`
- **部署(三平台,共用一套代码,靠构建参数区分)**:
  - GitHub Pages:GitHub Actions(.github/workflows/deploy.yml)push main 自动构建并发布;站点 https://20010811yu.github.io/yinkaish/ ;SPA 深链靠 dist/404.html 回退(workflow 中 cp)
  - Netlify:Git 连接持续部署(main),站点 https://yinkai.netlify.app ;netlify.toml 定义 build(npm run build)/publish(dist)/SPA 通配 redirect 200
  - **VPS 整站(方案一,2026-11-02 代码适配+物料就绪,待用户上机)**:手册 `deploy/README.md`;Nginx 托管 dist(根路径)+ 反代 `/api`、`/uploads` → pm2 进程 `yinkai-api`(`server/ecosystem.config.cjs`,cwd 固定 server/ 供 dotenv 读 .env,注入 NODE_ENV=production),MySQL 同机仅 127.0.0.1;站点模板 `deploy/nginx.conf`(占位 `__DOMAIN__`,client_max_body_size 12m,gzip,assets 长缓存,index.html no-cache,certbot 加 TLS);发版脚本 `deploy/update-server.sh`(git pull → `VITE_DEPLOY=vps npm run build` → server npm ci → pm2 reload → health);server/.env 上线必填 JWT_SECRET/FRONTEND_ORIGIN(站点域名)/SMTP_*/MAIL_TO;`.gitattributes` 强制 `*.sh`/`*.conf` LF
  - **Netlify Forms 联系表单**:index.html 内置隐藏影子表单(name=contact, data-netlify)供部署时注册;邮件通知在 Netlify 后台 Forms→Settings 配置(lukecao@ykautomus.com / lujiacao@163.com);**纯静态托管下仅 Netlify 生效,GitHub Pages 版提交会失败**
  - **Netlify Forms 职位申请表单(含附件)**:index.html 影子表单 name=job(position/name/phone/email/message 隐藏字段 + `<input type="file" name="resume">`);简历限 pdf/doc/docx、≤10MB(Netlify 单次提交上限,自建后端同限)
  - **表单双通道(2026-11-02)**:`src/api/forms.js` 的 `submitContact`/`submitApplication` 先 POST 自建后端 `/api/contact`(JSON)/`/api/apply`(FormData),拿不到 JSON 应答(静态托管回 index.html/404)或网络失败才回退 Netlify 影子表单;后端一旦给出 JSON(含 4xx/5xx)即最终结论,不再回退。Contact.vue/Careers.vue 只调这两个函数
  - **vite base 按部署目标**:`process.env.VITE_DEPLOY === 'vps' || process.env.NETLIFY ? '/' : '/yinkaish/'`——VPS 构建传枚举 `VITE_DEPLOY=vps`;**禁止 `VITE_BASE=/` 之类路径值**(Git Bash/MSYS 会把 `/` 开头的环境变量值转成 Windows 路径 `D:/Git/`,见 ERR-021;必要时 `MSYS_NO_PATHCONV=1` 可关闭转换);改仓库名需同步改 /yinkaish/

## 命令
- dev:`npm run dev`;build:`npm run build`(GitHub Pages 子路径)/ `VITE_DEPLOY=vps npm run build`(VPS 根路径);preview:`npm run preview`
- PDF 图片提取:`node scripts/extract-pdf-images.cjs <pdf> <outdir>`(对象级,支持 Flate+DCT 过滤器链);页面-图片映射:`node scripts/map-pdf-images.cjs <pdf>`(裸 Page 对象序即阅读序)

## 后端与数据库(2026-09-29 新增,2026-09-30 改为仅中文)
- **MySQL 8.0.29**(本机 Windows,服务名 `mysql`,端口 3306,安装目录 D:\mysql-8.0.29-winx64);库 `yinkai_web` utf8mb4;表:news/jobs/product_categories/products/product_params/honors/partners/admins;**内容表仅中文列(`_zh` 后缀,2026-09-30 起,原 `_en` 列已 ALTER TABLE DROP COLUMN 删除,admins 表保留)**,图片列存文件名;**发展历程(timeline/milestones)未入库(用户排除)**
- **中英文策略**:库与 API 只存/返回中文(`{zh}` 形态);前端水合时按业务键把静态双语种子(src/data 的 `*Seed`,reactive 兜底改为其深拷贝)的 en 字段合并回 API 行(src/api/data.js `withEn`,2026-10-23 ERR-019)——英文界面显示英文,仅无种子翻译的新增内容由 `pick()`(src/data/lang.js)回退中文
- **server/** 目录:Express + mysql2 + dotenv + cors(ESM),只读 GET 接口(/api/news|jobs|products|honors|partners),端口 3001;`npm run setup` 执行建库+种子(scripts/setup-db.mjs);`npm start` 起服务;**`app.set('trust proxy', 1)`(2026-11-02,Nginx 反代后限速器取真实 IP,不得移除)**
- **表单邮件后端(2026-11-02)**:`server/src/routes/forms.js`——POST /api/contact(JSON)与 /api/apply(multipart,multer 内存态收简历 pdf/doc/docx ≤10MB 作附件,**`defParamCharset:'utf8'` 否则 busboy 按 latin1 解码中文文件名乱码**),nodemailer@10 经 SMTP 发到 MAIL_TO,formLimiter 每 IP 15 分钟 10 次(两路由共享计数);SMTP_HOST/MAIL_TO 未配置返回 503;简历不落盘(server/uploads 为公开静态目录)
- **凭据**:server/.env(DB_PASSWORD、JWT_SECRET、FRONTEND_ORIGIN、SMTP_* 等,已 gitignore;模板 .env.example);**本机 mysql 客户端曾因 my.ini [client] 段 skip-grant-tables 全部不可用(已修,ERR-008)**
- **前端对接**:src/api/data.js 启动水合(2.5s 超时,失败保持 src/data 静态兜底);src/data 六个动态导出为 reactive;图片文件名→URL 映射在 src/data/assets.js;dev 代理 /api→localhost:3001(vite.config.js)
- **部署现状**:Netlify/GitHub Pages 仍是纯静态托管——线上走静态兜底数据;整站 VPS 方案(Nginx 同源反代,前端 /api 相对路径零改动命中真实数据)代码与物料已就绪,待用户按 deploy/README.md 上机

## 管理员端(2026-09-29 新增)
- **数据库**:admins 表(username 唯一/password_hash bcrypt/is_active);迁移命令 `cd server && npm run migrate`(幂等,空表时内置默认账号 admin/admin123,提醒首登改密)
- **后端**:jsonwebtoken(JWT 12h,密钥 server/.env 的 JWT_SECRET)+ bcryptjs;登录 POST /api/admin/login,鉴权中间件 requireAdmin 保护 /api/admin/*(除登录);CRUD 通用于 news/jobs/honors/partners/product-categories/products + 参数组整存整取(PUT products/:id/params);**news/jobs 主键非自增,新增时后端自动分配 MAX(id)+1**;news 管理列表用 DATE_FORMAT 输出日期(mysql2 DATE 默认转 Date 对象)
- **登录验证**:必填校验(el-form rules)+自实现滑块拼图验证(SlideVerify.vue,canvas 挖缺口/≤6px 容差/失败回弹重置/登录失败后重置防重放;dev 构建在根节点暴露 data-dev-target 供自动化测试,生产不输出);登录按钮始终可点,滑块未通过时点击提示「请先完成滑块验证」;登录失败经 api/admin.js 映射为双语「用户名或密码错误」(登录接口的 401 不走会话过期分流)
- **富文本编辑器(2026-09-30 新增)**:@wangeditor/editor@5 + @wangeditor/editor-for-vue@5(Vue3 绑定装 **@next** tag,默认 tag 是 Vue2 版会 ERESOLVE)。封装在 src/components/admin/RichEditor.vue(v-model HTML;工具栏排除 group-image/group-video,图片仍走素材文件名机制;菜单语言跟随 locale,`:key="locale"` 重建;dev 暴露 window.__ykEditor 供自动化)。**仅进 AdminNews 懒加载分包**(chunk 1.39MB/gzip 362KB),官网前台体积不受影响。正文存储:富文本 HTML 与存量换行纯文本共存于 content_zh,NewsDetail 按 `startsWith('<')` 判别 v-html 或按 \n 分段渲染;样式坑见 ERR-011
- **图片本地上传(2026-09-30 新增)**:后端 `POST /api/admin/upload`(multer 2.x,JWT 保护),存 `server/uploads/`(gitignore),**服务端自动重命名 `img-<yyyyMMdd-HHmmss>-<4位随机>.<ext>`**,白名单 png/jpg/jpeg/webp、≤5MB;Express `/uploads` 静态托管,DB 存 `/uploads/<name>` 路径。解析双轨:`assets.js` 的 `resolveImage(v, map)`(根路径/绝对 URL 原样,否则查素材映射),data.js 四处图片解析与管理端 urlOf 均走它;vite dev 代理含 `/uploads`。**产品/荣誉/伙伴三个管理页均已接入**,上传逻辑共用 `src/composables/useImageUpload.js`。**纯静态部署(无后端)时上传图不可显示**,属静态兜底机制的已知限制。坑①:router.post('/') 挂载在 /api/admin 下只匹配挂载根,须显式 router.post('/upload');坑②:lazy 图片必须有 CSS 非零尺寸(ERR-015)
- **前端**:/admin 独立布局(App.vue 对 /admin 前缀隐藏官网 Navbar/Footer);路由守卫查 localStorage yk_admin_token;src/api/admin.js 封装 fetch(401 清会话跳登录);管理页面 src/views/admin/(登录/布局/新闻/职位/产品三级/荣誉/伙伴);图片字段从 src/data/assets.js 的文件名映射下拉选择;admin.* 双语文案在 i18n zh/en 的独立导出,由 i18n/index.js 合并
- **安全加固(2026-09-30 新增)**:server 依赖 helmet / express-rate-limit / sanitize-html;`server/src/middleware/security.js` 集中管理——CORS 白名单(env `FRONTEND_ORIGIN` 逗号分隔,dev 自动放行 localhost;生产缺 `JWT_SECRET` 拒绝启动,auth.js 双重兜底)、helmet 安全头(CSP:img 允 data:/blob:,style 允 unsafe-inline 供 wangEditor/EP)、三级限速(登录 5 次/15min、上传 30 次/15min、全局 API 120 次/min,内存存储重启即清零);管理 CRUD 入库前统一 `sanitizeValue` 校验(数字字段强制 Number、字符串 ≤5000、富文本 content_zh ≤200KB 且 sanitize-html 白名单消毒,违规 400);密码策略 ≥8 位含字母+数字(仅约束改密接口,存量弱口令 admin/admin123 需人工改);netlify.toml 前端补 X-Frame-Options/nosniff/Referrer-Policy/Permissions-Policy。express-rate-limit 的 429/handler 选项坑见 ERR-016;上线部署 API 时须设 NODE_ENV=production、JWT_SECRET(强随机)、FRONTEND_ORIGIN,且必须走 HTTPS
