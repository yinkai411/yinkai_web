## 当前焦点(2026-11-03):产品页设备视频接入(已完成)
结果:业务与产品页 5 款设备新增视频区(简介后/参数前,绿色标题条+16:9 播放器+序号切换):YK-3E 1段、YK-3F 2段、YK-AL-1 1段、YK-OL-2I 2段、YK-OF-3I 3段,来源 github.com/yinkai411/vedios 直链(零仓库成本)。实施中踩 ERR-022:**jsDelivr 对 GitHub 文件上限实为 20MB**(计划误写 50MB),5 段超标——ghVideo() 改多源链:≤20MB [jsDelivr,raw] 自动回退,>20MB 直走 raw;曾就托管重选询问用户未获回复,按其原「零仓库成本」偏好采混合方案。水合透传 videos 字段(api/data.js,防 ERR-019 同类丢弃)。验证:build 过;13 产品全量核对恰好 5 款有视频、双通道 loadedmetadata 真实可播、404 模拟回退成功、EN 标题、375px 无溢出;**水合路径因 MySQL/server 停机未实测**(透传行与已实测的 withEn 同构,下次 dev 起后端时顺带复核)。
遗留:>20MB 的 5 段走 raw,大陆可用性差;若需全地域可靠,改 ghVideo() 一处切自托管(视频下载入仓库)。
下一步(候选):后端部署 VPS 上机;下次本地起 MySQL+server 后复核 /products 视频区(水合路径)。

## 上一焦点(2026-11-02,概要)
- 整站 VPS 部署适配(ERR-021):trust proxy+表单邮件接口+VITE_DEPLOY=vps+deploy/ 物料;待用户上机
- 首页伙伴墙 20 个 logo 全裂修复(ERR-020):partnerImgs 短键 pN 与 assets.js 映射键 pN.png 失配,被后端水合掩盖;index.js 重建短键映射,preview 静态路径实测 20/20 正常

## 上一焦点(2026-10-23,概要)
- 英文界面动态内容回退中文修复(ERR-019):水合 withEn 按业务键从静态双语种子合并 en 回 API 行,五模块生效;遗留=管理端新增无种子翻译的内容英文下回退中文,需补 src/data 种子
