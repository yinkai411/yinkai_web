# errorlog.md — 问题与解决的唯一事实来源

> 🟢 已解决条目压缩为一行摘要(§4.1),完整版在 `archive/history-2026-09-errorlog.md`;🔴🟡 条目与防回归清单保留完整版。

## 错误条目

### ERR-022 jsDelivr 对 GitHub 文件上限实为 20MB,超标视频 403
- **错误现象**: 产品视频接入 jsDelivr 直链后,9 段中 5 段(>20MB:yk_3f_2/yk_of_3_1/2/3 等)HEAD 返回 403,响应体「File size exceeded the configured limit of 20 MB」,视频无法播放
- **发生上下文**: 产品视频任务浏览器验证阶段,页面内 fetch HEAD 403 触发排查(2026-11-03)
- **根本原因**: 方案设计时按「jsDelivr 单文件 50MB」旧印象评估(50MB 是 npm 通道的口径,/gh/ GitHub 通道现为 20MB),且未先用真实文件实测;计划审批时的「最大 34.4MB 满足」为错误前提
- **解决方式**: ghVideo() 改返回源数组——≤20MB 段 [jsDelivr, raw] 双源(原生 <source> 链自动回退),>20MB 段直接 [raw](jsDelivr 对其必然 403 不再浪费请求);数据层集中一处,后续切换自托管只改该函数
- **验证结果**: curl 全量 9 URL:4 小文件 jsDelivr 200、5 大文件 raw 200;浏览器实测(静态 preview):五产品 currentSrc 选源正确(4 小=jsDelivr、大=raw),YK-3E(60s/jsDelivr)与 YK-OF-3I(165s/raw)loadedmetadata+readyState 4 真实可播;页面内模拟第一源 404 → 自动回退 raw 加载成功(40s)
- **教训**: 第三方 CDN/托管选型必须先用**真实目标文件**实测 HEAD/GET 再定方案,不能凭记忆中的配额;多源 <source> 是零成本回退手段
- **状态**: 🟢 已解决(2026-11-03)

### ERR-021 Git Bash 下 `VITE_BASE=/` 被 MSYS 路径转换,构建产物资源路径全变 `/Git/assets/`
- **错误现象**: 为 VPS 根路径部署执行 `VITE_BASE=/ npm run build`,dist/index.html 资源引用变成 `/Git/assets/...`,部署后必然白屏
- **发生上下文**: 整站 VPS 部署适配任务,本机 Windows Git Bash 构建验证(2026-11-02)
- **根本原因**: Git Bash(MSYS2)会把以 `/` 开头、形似 POSIX 路径的命令行参数与环境变量值自动转换为 Windows 路径,`/` 被转成 MSYS 根目录 `D:/Git/`(实测 `VITE_BASE=/ node -e` 打印 `"D:/Git/"`),Vite 再归一化为 `/Git/`。Linux 服务器上不会发生,属 Windows 本地构建专属坑
- **解决方式**: 放弃用路径值传参,改为枚举 token:`VITE_DEPLOY=vps` → vite.config.js 取 base `/`;update-server.sh、deploy/README 同步改写。备选:`MSYS_NO_PATHCONV=1 VITE_BASE=/ ...` 可关闭转换,但易被遗忘,不采用
- **验证结果**: `VITE_DEPLOY=vps npm run build` → index.html 资源为 `/assets/...`;默认 `npm run build` 仍为 `/yinkaish/assets/...`(GitHub Pages 不受影响);两次 build 均通过
- **教训**: Git Bash 里传给 node 的环境变量/参数不要使用以 `/` 开头的路径形态值;部署开关一律用枚举 token 而非路径字面量;构建产物必须检查 index.html 的资源前缀,不能只看 build 成功
- **状态**: 🟢 已解决(2026-11-02)

### ERR-020 首页伙伴墙 20 个 logo 全部裂图(静态兜底图片引用键失配)
- **错误现象**: 首页「服务与合作伙伴」20 个 logo 格全部显示裂图+alt 文字(用户截图反馈)
- **发生上下文**: 本地 dev(后端/MySQL 已停,走静态兜底)与线上静态部署均复现(2026-11-02)
- **根本原因**: e1fdc27(2026-09-29)把 `partnerImgs` 从"短键映射(p1)"改为直接别名 `partnerLogos`(键为完整文件名 p1.png),但 src/data/index.js 里 20 处 `partnerImgs.pN` 引用未同步 → 静态兜底 logo 全为 undefined。此前一直被后端水合掩盖(DB 存 p1.png 经 resolveImage 命中映射),后端一停/纯静态部署即全裂;线上站点自 2026-09-29 起即处于裂图状态
- **解决方式**: index.js 在别名处由 partnerLogos 重建短键映射(`f.replace(/\.png$/,'')`),恢复数据引用的键契约;数据本身不动
- **验证结果**: build 通过;`npm run preview` 静态路径浏览器实测 20/20 img naturalWidth>0、零裂图,截图确认彩色 logo 正常渲染
- **教训**: 抽取共享映射/常量模块时,必须核对所有既有消费方的键契约;另外「水合掩盖静态兜底缺陷」极具欺骗性——兜底路径(后端停机/纯静态部署)必须独立验证
- **状态**: 🟢 已解决(2026-11-02)

### ERR-019 英文界面动态内容全部回退中文(API 水合覆盖静态双语兜底)
- **错误现象**: 切英文后新闻/职位/产品/荣誉/伙伴页内容仍显示中文(导航等模板文案正常英文);用户截图反馈新闻页
- **发生上下文**: 本地 dev(后端 3001 运行中)验证英文版新闻页(2026-10-23)
- **根本原因**: 8bedaec 删除全部 `_en` 列后 API 仅返回 `{zh}`;src/api/data.js 水合时原位替换 src/data 的 reactive 数组,静态兜底里已有的英文翻译被一并丢弃,`pick()` 缺 en 回退 zh。线上纯静态部署无后端不受影响,仅 dev/部署后端后出现
- **解决方式**: src/data/index.js 拆出双语种子(`*Seed`)导出,reactive 兜底改为种子深拷贝(cloneData);data.js 水合时 `withEn()` 按业务键(新闻/职位 id、伙伴 slug、产品分类 slug/型号/参数 label.zh、荣誉 name.zh)把种子 en 字段合并回 API 行;匹配不到种子的行(管理端新增)保持 `{zh}` 回退
- **验证结果**: build 通过;浏览器实测 EN 新闻列表/详情/职位/产品参数全英文,并证实 /api/news|products 请求确实发生且 API 行仅含 zh(英文确来自合并而非静态兜底);中文模式不受影响
- **教训**: 「静态兜底」与「API 水合」共存时,兜底数据里独有而 API 不提供的字段(如翻译)会在整组替换时静默丢失;替换式水合必须显式保留或回填 API 缺失的字段
- **状态**: 🟢 已解决(2026-10-23)

### ERR-010 管理端密码错误一次即整页跳转白屏(401 处理未含站点 base)
- **错误现象**:管理端登录时密码输错一次,页面整页跳转到脱离 base 的 /admin/login 白屏,而非仅弹错误提示
- **发生上下文**:排查"无法正常登录"时由 Explore 代理核实 src/api/admin.js 发现(2026-09-30)
- **根本原因**:401 处理用 location.pathname.startsWith('/admin/login') 判断是否已在登录页,但站点 base 为 /yinkaish/(vite base + GH Pages),实际 pathname 是 /yinkaish/admin/login,永不匹配;任何 401 都会 location.href 跳到脱离 base 的路径
- **解决方式**:改用 import.meta.env.BASE_URL 拼接 LOGIN_PATH 判断与跳转(api/admin.js)
- **验证结果**:npm run build 通过;待后端恢复后浏览器复核(2026-09-30 浏览器实测登录链路正常)
- **教训**:涉及 location.pathname 的判断必须考虑站点 base,统一用 import.meta.env.BASE_URL 拼接
- **状态**:🟡 规避中(待复测错误密码分支后转🟢)

### ERR-016 express-rate-limit 选项名不兼容,启动即崩
- **错误现象**:server 启动抛 `ERR_ERL_UNKNOWN_OPTION: requestHandler`,且 3001 被旧 dev 进程占用时冒烟请求实际打到旧进程,得出"安全头/CORS 未生效"的假结论
- **发生上下文**:管理端安全加固安装 express-rate-limit 后首启(2026-09-30)
- **根本原因**:当前版本只认 `handler`,不认 `requestHandler`(不同大版本选项名有差异);另 EADDRINUSE 时新进程退出、旧进程继续服务,冒烟结果失真
- **解决方式**:统一改用 `handler` 选项;冒烟前先 `netstat` 确认/杀掉旧进程再测
- **验证结果**:429 限速、403 跨源、helmet 三项头均实测生效
- **教训**:第三方库选项以安装版本为准(报错信息会给官方文档链接);端口被占时旧进程会"顶替"新代码响应,集成测试前必须确认被测进程就是最新代码
- **状态**:🟢 已解决(2026-09-30)

### ERR-017 冒烟测试用真实行做破坏性写,覆盖线上数据
- **错误现象**:验证富文本消毒时 PUT 覆盖 news id=1/2 的 content_zh 为测试串/空串,真实正文丢失
- **发生上下文**:同一安全加固任务的接口冒烟(2026-09-30)
- **根本原因**:直接对真实数据行做 PUT 测试且无备份;且第一次断言用错字段名(`content_zh` 平铺,公开接口实际返回 `{zh}` 嵌套),没能及时发现覆盖
- **解决方式**:从 sql/seed.sql 解析原文(utf8mb4 文件直读,node mysql2 写回)恢复 id 1/2 正文,API 复核一致
- **验证结果**:GET /api/news 两条正文与种子一致
- **教训**:对写接口做验证一律用临时/专门测试行(测完删除),禁止拿真实数据行当测试夹具;断言前先确认响应数据形状
- **状态**:🟢 已解决(2026-09-30)

### ERR-018 前端端口 5174 被 CORS 白名单拦截,登录报 origin not allowed
- **错误现象**:管理端登录提示 "origin not allowed"(此前服务未启动时同页面报 HTTP 500,属另一回事:3001 无进程)
- **发生上下文**:本地开发登录管理端(2026-10-14);前端 5173 被占用,Vite 自动改用 5174 端口
- **根本原因**:security.js 开发模式 CORS 白名单硬编码 5173/4173,未含 Vite 顺延端口 5174
- **解决方式**:开发白名单补 5173/5174 的 localhost+127.0.0.1 四个源,重启后端;实测 Origin: 5174 登录 200
- **验证结果**:curl 带 Origin http://localhost:5174 POST /api/admin/login → 200
- **教训**:Vite 端口被占会静默顺延,CORS 白名单须覆盖顺延端口;登录类报错先区分「服务没起(500/连接失败)」与「CORS 拦截(origin not allowed)」两类原因
- **状态**:🟢 已解决(2026-10-14)

## 🟢 已解决(一行摘要,详情见 archive/history-2026-09-errorlog.md)
- **ERR-001** 页脚生产渲染丢失:vue-i18n 消息含 `@` 必须转义 `{'@'}`,生产渲染失败是静默的,须有全局 errorHandler
- **ERR-002** 荣誉相册 375px 横向溢出:网格项加 `min-width: 0` 防 min-content 撑破轨道,弹性验收必做 ≤375 普测
- **ERR-003** 导航 1280px 溢出 7px:布局间距禁用 100vw(含滚动条宽),用 % / clamp
- **ERR-004** 世界地图标记全错位:坐标类定位禁止目测,必须由数据源计算;容器比例须与素材一致(该功能后已移除)
- **ERR-005** 刷新首页骨架闪现:大图压缩+LQIP、主落地页路由静态导入、scrollRestoration=manual
- **ERR-006** 新闻翻页第二页空白:v-for 动态重渲染后必须调用 useReveal 的 rescan()
- **ERR-007** Windows 国旗 emoji 不显示:国旗一律用 SVG 图片(flag-icons),禁用 emoji 旗帜
- **ERR-008** mysql 客户端全不可用:my.ini 各段选项有归属,服务端选项误入 [client] 段会瘫痪所有客户端
- **ERR-009** 滑块缺口不显示:canvas 传 NaN 坐标静默失败,ref 重构后须全局 grep .value 使用点,视觉验证要像素采样
- **ERR-011** 富文本编辑器两处样式坑:第三方组件内联 height:100% 时要在父容器定高;全局 reset(list-style:none)会波及 v-html 富文本,需 `list-style: revert` 恢复
- **ERR-012** 刷新 /admin 页闪现官网导航/页脚:main.js 先挂载后路由解析,首帧 route.path 为 '/' → isAdmin 误判;`router.isReady().then(() => app.mount())` 后挂载即正确(2026-09-30,详情见 archive)
- **ERR-013** 删除确认框(ElMessageBox)无样式缩在左上角+按钮英文:函数式组件样式未显式引入(main.js 补 message/message-box css);EP 内置文案未接 locale(App.vue 加 el-config-provider 跟随 i18n)(2026-09-30,详情见 archive)
- **ERR-014** YK-6A 参数变乱码:控制台内联中文发 PUT 被编码污染覆盖库数据;恢复须从 seed.sql 提取行生成带引号 SQL 文件走 mysql --default-character-set=utf8mb4,中文写库禁走控制台内联(2026-09-30,详情见 archive)
- **ERR-015** 上传 logo 在首页伙伴墙不显示:img width/height auto 时未加载 intrinsic 为 0 → 0×0 元素被 loading=lazy 判定无可视区永不加载(死锁);修法=img 用 CSS 占满定尺寸容器(100%/100%+contain)(2026-09-30,详情见 archive)

## 防回归清单(编码前必查)
1. Element Plus 禁全量引入(`app.use(ElementPlus)` + 全量样式),必须 resolver 按需;ElMessage 等函数式组件需单独引入样式
2. 文案禁止硬编码,必须入 i18n zh/en 双包;新增 key 中英同步
3. Element Plus locale 必须跟随 vue-i18n locale 切换
4. 模板中 Element Plus 组件统一 kebab-case
5. 使用图标需引入 @element-plus/icons-vue,数据中的图标名对应其组件
6. **i18n 消息含 `@`/`{`/`}`/`|`/`$` 必须用 `{'字符'}` 转义**(尤其邮箱),否则生产运行时解析报错、组件渲染丢失(见 ERR-001)
7. 全局 errorHandler(main.js)不得移除,渲染失败靠 window.__renderErr 排查
8. **弹性布局遵循 AGENTS.md §11**:容器 max-width、列宽 fr/minmax、大尺寸 clamp();网格项视需要加 `min-width: 0`(见 ERR-002);改样式后在 1280/1024/768/375 四档宽度自查无横向滚动条
9. **布局间距禁用 100vw**(见 ERR-003):有纵向滚动条时 100vw 偏大一个滚动条宽,用 % / clamp 代替
10. 外部 SVG 做素材时先校验 XML 完整性(网络下载可能被截断,jsdelivr 大文件曾缺尾部;用 npm pack 拿完整包),压缩空白时不得吞掉标签间必要分隔
11. **地图打点等坐标类定位禁止目测**(见 ERR-004):百分比必须由数据源计算;容器 aspect-ratio 必须与图片真实比例一致
12. **v-for 动态重渲染(分页/筛选/加载更多)后必须调用 useReveal 返回的 rescan()**(见 ERR-006),否则新节点停留在透明状态
13. **国旗一律用 SVG 图片(flag-icons),禁用 emoji 旗帜**(见 ERR-007):Windows 无旗帜字形,只会显示字母对
14. **数据库/后端仅存中文,API 返回 `{zh}`**:新增内容表列不再建 `_en`;前端取双语字段统一走 `pick()`(缺 en 自动回退 zh),禁止直接 `field.en`
15. **wangEditor 富文本**:Editor 根节点内联 height:100%,定高要放在父容器(RichEditor 根)上;新增 v-html 渲染富文本时逐项核对全局 reset 影响并 `:deep()` 恢复(见 ERR-011);工具栏保持排除图片/视频上传(图片走素材文件名机制)
16. **Git Bash 传给 node 的环境变量值禁用 `/` 开头的路径形态**(见 ERR-021):MSYS 会转成 Windows 路径;部署开关用枚举 token(`VITE_DEPLOY=vps`),构建后核对 index.html 资源前缀
17. **后端位于 Nginx 反代之后**:`server/src/index.js` 的 `app.set('trust proxy', 1)` 不得移除(限速器按真实 IP 计,express-rate-limit 否则抛 ERR_ERL_UNEXPECTED_X_FORWARDED_FOR);multer 接收用户文件名须 `defParamCharset: 'utf8'`(busboy 默认 latin1,中文名乱码)
