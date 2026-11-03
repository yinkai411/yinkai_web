// 合作伙伴 logo(官网首页合作伙伴区)——文件名映射表见 ./assets
import { partnerLogos, ol2iGallery } from './assets'
// partnerLogos 的键是完整文件名(p1.png,供数据库文件名解析用);下方种子按短键(pN)引用,在此还原键形态
const partnerImgs = Object.fromEntries(
  Object.entries(partnerLogos).map(([f, url]) => [f.replace(/\.png$/, ''), url])
)

// 动态内容数据(新闻/职位/产品/荣誉/伙伴)导出为 reactive:src/api/data.js 启动时
// 尝试从后端拉取并原位替换内容,失败时保持这里的静态数据兜底
import { reactive } from 'vue'

// API 仅返回中文({zh}),水合时会按业务键用 *Seed 里的 en 字段补回英文(见 src/api/data.js),
// 故种子与 reactive 兜底副本必须相互独立:水合只替换副本,种子保持原样
const cloneData = (v) =>
  Array.isArray(v)
    ? v.map(cloneData)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).map(([k, val]) => [k, cloneData(val)]))
      : v

// 核心业务数据(光伏边框自动化 + 汽车焊装装备,双语)
export const services = [
  {
    id: 'pv-line',
    icon: 'SetUp',
    name: { zh: '光伏边框自动生产线', en: 'PV Frame Production Lines' },
    desc: {
      zh: 'YK 系列产线集自动上料、送料、切割、冲孔、铆压于一体，仅需 1 人上料；加工 1500-2500mm，节拍最快数秒一支，切割/孔距精度 ±0.1mm。',
      en: 'The YK series integrates auto feeding, conveying, cutting, punching and riveting with just one operator; 1500-2500mm frames at seconds per piece with ±0.1mm precision.',
    },
  },
  {
    id: 'online-vision',
    icon: 'View',
    name: { zh: '在线视觉检测系统', en: 'Inline Vision Inspection' },
    desc: {
      zh: 'YK-OL 系列在线检测长度、扭曲度、漏加工及碰伤、划伤、变形等十余类外观瑕疵并自动分拣，节拍 ≤1.7 秒，换型 ≤20 分钟。',
      en: 'The YK-OL series inspects length, twist, missed operations and a dozen-plus surface defects with auto sorting, at a cycle ≤1.7s and changeover ≤20min.',
    },
  },
  {
    id: 'offline-vision',
    icon: 'Search',
    name: { zh: '离线视觉检测系统', en: 'Offline Vision Inspection' },
    desc: {
      zh: 'YK-OF 系列离线全尺寸检测（长度、角度、卡槽、冲孔、铆压等），约 1 分钟/件，自动打印检测报告，结果长期可追溯。',
      en: 'The YK-OF series performs full-size offline inspection (length, angle, slots, punching, riveting) at ~1 min/piece with automatic reports and long-term traceability.',
    },
  },
  {
    id: 'biw',
    icon: 'OfficeBuilding',
    name: { zh: '汽车焊装交钥匙工程', en: 'Automotive Welding Turnkey' },
    desc: {
      zh: '白车身焊装线、分拼线、工装夹具、检具与输送线的规划设计制造，及机器人系统集成，服务大众、通用、上汽等主流主机厂。',
      en: 'Design and manufacturing of BIW welding lines, hemming lines, fixtures, gauges and conveyors with robot integration, serving VW, GM, SAIC and more.',
    },
  },
]

// 产品分类(依据企业画册设备内容归类,图片源自官网产品图,双语)
import yk6aImg from '../assets/products/yk-6a_banner.png'
import yk6bImg from '../assets/products/yk-6b_banner.jpg'
import yk6wImg from '../assets/products/yk-6w_banner.jpg'
import ykFc3cImg from '../assets/products/yk-fc-3c_banner.jpg'
import ykFc3dImg from '../assets/products/yk-fc-3d_banner.jpg'
import ykFc3jImg from '../assets/products/yk-fc-3j_banner.jpg'
import yk3eImg from '../assets/products/yk-3e_banner.jpg'
import yk3fImg from '../assets/products/yk-3f_banner.jpg'
import ykAl1Img from '../assets/products/yk-al-1_banner.png'
import ykOl2iImg from '../assets/products/yk-ol-2i_banner.png'
import ykOl3iImg from '../assets/products/yk-ol-3i_banner.png'
import ykLawanImg from '../assets/products/yk-xingcailawanji_banner.png'
import ykLuomuImg from '../assets/products/yk-zidongsuoluomushengchanxian_banner.jpg'

// YK-OL-2I 多图画廊(本地图片库,按文件名顺序)——映射表见 ./assets
const ykOl2iImages = ol2iGallery

// 产品视频(github.com/yinkai411/vedios 直链,零仓库成本)。
// jsDelivr 对 GitHub 文件上限 20MB(ERR-022):超标段只能走 raw.githubusercontent.com(大陆可用性差,属已知取舍);
// 未超标段 jsDelivr 优先、raw 兜底,由 <video><source> 多源链自动回退
const ghVideo = (dir, file, over20mb = false) => {
  const path = `${encodeURIComponent(dir)}/${file}`
  const raw = `https://raw.githubusercontent.com/yinkai411/vedios/main/${path}`
  return over20mb ? [raw] : [`https://cdn.jsdelivr.net/gh/yinkai411/vedios@main/${path}`, raw]
}

export const productCategoriesSeed = [
  {
    id: 'pv-alu',
    name: { zh: '光伏边框铝型材料自动生产线', en: 'PV Frame Aluminium Profile Lines' },
    desc: {
      zh: '面向长边/短边铝型材边框的自动冲切、铆接全线装备，自动送料、切割、冲压、铆接、检测全流程覆盖。',
      en: 'Complete lines for long/short aluminium PV frames covering auto feeding, cutting, stamping, riveting and inspection.',
    },
    products: [
      {
        model: 'YK-6A',
        tag: { zh: '立冲长边', en: 'Vertical Punch, Long Edge' },
        image: yk6aImg,
        desc: {
          zh: '适用边框长度 1500-2600mm，节拍 1.8-2.1 秒/支，12 小时产能 18000-20000 支，加工精度 ±0.1mm，稼动率 98%。',
          en: 'For 1500-2600mm frames at 1.8-2.1s per piece, 18,000-20,000 pcs per 12h, ±0.1mm precision, 98% uptime.',
        },
      },
      {
        model: 'YK-6B',
        tag: { zh: '卧冲短边', en: 'Horizontal Punch, Short Edge' },
        image: yk6bImg,
        desc: {
          zh: '适用边框长度 850-1500mm，节拍 1.8-2.1 秒/支，12 小时产能 18000-20000 支，加工精度 ±0.1mm，稼动率 98%。',
          en: 'For 850-1500mm frames at 1.8-2.1s per piece, 18,000-20,000 pcs per 12h, ±0.1mm precision, 98% uptime.',
        },
      },
      {
        model: 'YK-6W',
        tag: { zh: '卧冲长边', en: 'Horizontal Punch, Long Edge' },
        image: yk6wImg,
        desc: {
          zh: '适用边框长度 1500-2600mm，节拍 1.8-2.1 秒/支，加工精度 ±0.1mm，稼动率 98%，装机容量 10.8 吨。',
          en: 'For 1500-2600mm frames at 1.8-2.1s per piece, ±0.1mm precision, 98% uptime, 10.8t overall weight.',
        },
      },
    ],
  },
  {
    id: 'pv-fc',
    name: { zh: '光伏边框复合材料自动生产线', en: 'PV Frame Composite Material Lines' },
    desc: {
      zh: '复合材料边框长边/短边自动线与角码装配机，精度 ±0.15mm，稼动率 98%。',
      en: 'Long/short-edge composite frame lines and corner-key assembly machines with ±0.15mm precision and 98% uptime.',
    },
    products: [
      {
        model: 'YK-FC-3C',
        tag: { zh: '长边自动线', en: 'Long-Edge Line' },
        image: ykFc3cImg,
        desc: {
          zh: '适用边框长度 1500-2600mm，加工精度 ±0.15mm，45° 切角精度，稼动率 98%。',
          en: 'For 1500-2600mm composite frames, ±0.15mm precision with 45° mitre accuracy, 98% uptime.',
        },
      },
      {
        model: 'YK-FC-3D',
        tag: { zh: '短边自动线', en: 'Short-Edge Line' },
        image: ykFc3dImg,
        desc: {
          zh: '适用边框长度 850-1500mm，结构紧凑，稼动率 98%，装机容量 8.3 吨。',
          en: 'For 850-1500mm frames in a compact footprint, 98% uptime, 8.3t overall weight.',
        },
      },
      {
        model: 'YK-FC-3J',
        tag: { zh: '角码装配机', en: 'Corner-Key Assembly Machine' },
        image: ykFc3jImg,
        desc: {
          zh: '边框角码自动装配，外形 4500×3800×1500mm，装机容量仅 1.5 吨，稼动率 98%。',
          en: 'Automatic corner-key assembly, footprint 4500×3800×1500mm, only 1.5t overall weight, 98% uptime.',
        },
      },
    ],
  },
  {
    id: 'stacker',
    name: { zh: '自动码垛机', en: 'Automatic Stacking Machines' },
    desc: {
      zh: '长边/短边边框成品自动码垛，替代人工整理，稼动率 98%。',
      en: 'Automatic stacking of long/short finished frames, replacing manual handling, 98% uptime.',
    },
    products: [
      {
        model: 'YK-3E',
        tag: { zh: '长边自动码垛机', en: 'Long-Edge Stacker' },
        image: yk3eImg,
        videos: [ghVideo('长边码垛', 'yk_3e_1.mp4')],
        desc: {
          zh: '适用 1500-2600mm 长边框自动码垛，外形 7000×6300×2500mm，稼动率 98%。',
          en: 'Automatic stacking for 1500-2600mm long frames, footprint 7000×6300×2500mm, 98% uptime.',
        },
      },
      {
        model: 'YK-3F',
        tag: { zh: '短边自动码垛机', en: 'Short-Edge Stacker' },
        image: yk3fImg,
        videos: [ghVideo('短边码垛', 'yk_3f_1.mp4'), ghVideo('短边码垛', 'yk_3f_2.mp4', true)],
        desc: {
          zh: '适用 850-1500mm 短边框自动码垛，外形 5000×7200×2500mm，稼动率 98%。',
          en: 'Automatic stacking for 850-1500mm short frames, footprint 5000×7200×2500mm, 98% uptime.',
        },
      },
    ],
  },
  {
    id: 'feeder',
    name: { zh: '自动上料机', en: 'Automatic Feeding Machine' },
    desc: {
      zh: '边框原材料自动上料与缓存，保障深加工设备连续生产。',
      en: 'Automatic feeding and buffering of frame raw material for continuous downstream production.',
    },
    products: [
      {
        model: 'YK-AL-1',
        tag: { zh: '桁架式自动上料', en: 'Gantry-Type Auto Feeding' },
        image: ykAl1Img,
        videos: [ghVideo('自动上料', 'yk_al_1.mp4')],
        desc: {
          zh: '适用原料长 3900-7500mm、宽 30-45mm、高 11-35mm；最大承重 3000kg（含托盘），托盘存放 360 支，上料节拍 2 秒/支，缓冲区可存 50 支确保不停机换框，稼动率 ≥85%。',
          en: 'For raw material 3900-7500mm long, 30-45mm wide, 11-35mm high; 3000kg max load (incl. pallet), 360 pcs per pallet, 2s feeding cycle, 50-pc buffer for non-stop changeover, ≥85% uptime.',
        },
      },
    ],
  },
  {
    id: 'vision',
    name: { zh: '自动视觉检测系统', en: 'Automatic Vision Inspection' },
    desc: {
      zh: '在线/离线视觉检测，十余类瑕疵自动识别分拣，检测数据全程可追溯。',
      en: 'Inline/offline vision inspection with auto sorting of a dozen-plus defect types and full traceability.',
    },
    products: [
      {
        model: 'YK-OL-2I',
        tag: { zh: '在线视觉检测', en: 'Inline Inspection' },
        image: ykOl2iImg,
        images: ykOl2iImages,
        videos: [ghVideo('外观检测', 'VI_1.mp4'), ghVideo('外观检测', 'VI_2.mp4')],
        desc: {
          zh: '设备与上一工位对接，加工后的产品自动输送到设备内部待检测，本设备自动检测产品的长度、漏加工、外观瑕疵。检测后的产品自动分类输送到下一工位。',
          en: 'Docking with the upstream station, processed products are automatically conveyed inside for inspection. The machine automatically checks length, missed operations and surface defects, then sorts and conveys products to the next station.',
        },
      },
      {
        model: 'YK-OF-3I',
        tag: { zh: '离线视觉检测', en: 'Offline Inspection' },
        image: ykOl3iImg,
        videos: [ghVideo('全尺寸检测', 'yk_of_3_1.mp4', true), ghVideo('全尺寸检测', 'yk_of_3_2.mp4', true), ghVideo('全尺寸检测', 'yk_of_3_3.mp4', true)],
        desc: {
          zh: '离线式检测站，外形 3900×1550×2500mm，全尺寸检测并自动生成可追溯报告。',
          en: 'Offline inspection station, footprint 3900×1550×2500mm, full-size inspection with traceable reports.',
        },
      },
    ],
  },
  {
    id: 'automotive',
    name: { zh: '汽车轻量化设备', en: 'Automotive Lightweight Equipment' },
    desc: {
      zh: '面向车身轻量化结构件的型材成形与连接装备，支持 FSW 搅拌摩擦焊与 CMT 冷金属过渡焊工艺。',
      en: 'Forming and joining equipment for lightweight automotive structures, supporting FSW and CMT welding processes.',
    },
    products: [
      {
        model: '型材拉弯机',
        tag: { zh: '型材拉弯成形', en: 'Profile Stretch Bending' },
        image: ykLawanImg,
        desc: {
          zh: '适用型材宽度 900-3200mm，拉弯速度 0-100mm/s，成形精度 0.02mm，单件节拍约 40 秒。',
          en: 'For profiles 900-3200mm wide, bending speed 0-100mm/s, 0.02mm forming precision, ~40s per piece.',
        },
      },
      {
        model: '自动锁螺母生产线',
        tag: { zh: '螺母自动压装', en: 'Nut Auto-Insertion Line' },
        image: ykLuomuImg,
        desc: {
          zh: '轻量化结构件螺母自动锁定生产线，配合 FSW/CMT 焊接工艺，服务汽车白车身轻量化制造。',
          en: 'Automatic nut-insertion line for lightweight structures with FSW/CMT welding, serving BIW lightweight manufacturing.',
        },
      },
    ],
  },
]

export const productCategories = reactive(cloneData(productCategoriesSeed))

// 产品参数表(画册"设备参数"转录;键为产品型号;值=label/value 双语行数组)
const p = (lzh, len, vzh, ven) => ({ label: { zh: lzh, en: len }, value: { zh: vzh, en: ven ?? vzh } })

export const productParamsSeed = {
  YK6A: [
    p('名称', 'Name', '铝材长边立冲生产线', 'Aluminium long-edge vertical-punch line'),
    p('加工范围 mm', 'Processing Range', '1500-2600'),
    p('原材料兼容尺寸(长度)', 'Raw Material Length', '≤7.5m'),
    p('生产节拍(支/秒)', 'Production Cycle', '1.8-2.1(18000-20000支/12H)', '1.8-2.1s (18,000-20,000 pcs/12H)'),
    p('长度切割精度 mm', 'Cutting Accuracy', '±0.1'),
    p('孔距精度 mm', 'Hole Pitch Accuracy', '±0.1'),
    p('切角角度', 'Mitre Angle', '35°-55°可调', '35°-55° adjustable'),
    p('角度切割精度', 'Angle Accuracy', '±0.1°'),
    p('铆点精度 mm', 'Riveting Accuracy', '±0.1'),
    p('换模时间', 'Changeover Time', '<2H'),
    p('无故障运行率', 'Uptime', '98%'),
    p('装机容量 KW', 'Installed Capacity', '28'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '10700×6300×2300'),
    p('气源电力源', 'Air Supply', '2300L/min 5.0-6.0kgf/cm²'),
    p('设备电源', 'Power Supply', '380V 50HZ'),
    p('控制系统电源', 'Control Power', 'DC24V'),
    p('设备重量 T', 'Net Weight', '14.8'),
    p('设备方向', 'Layout Orientation', '可选择对称方向', 'Symmetric orientation optional'),
  ],
  YK6B: [
    p('名称', 'Name', '铝材短边卧冲生产线', 'Aluminium short-edge horizontal-punch line'),
    p('加工范围 mm', 'Processing Range', '850-1500'),
    p('原材料兼容尺寸(长度)', 'Raw Material Length', '≤7.5m'),
    p('生产节拍(支/秒)', 'Production Cycle', '1.8-2.1(18000-20000支/12H)', '1.8-2.1s (18,000-20,000 pcs/12H)'),
    p('长度切割精度 mm', 'Cutting Accuracy', '±0.1'),
    p('孔距精度 mm', 'Hole Pitch Accuracy', '±0.1'),
    p('切角角度', 'Mitre Angle', '35°-55°可调', '35°-55° adjustable'),
    p('角度切割精度', 'Angle Accuracy', '±0.1°'),
    p('铆点精度 mm', 'Riveting Accuracy', '±0.1'),
    p('换模时间', 'Changeover Time', '<2H'),
    p('无故障运行率', 'Uptime', '98%'),
    p('装机容量 KW', 'Installed Capacity', '27'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '10700×7070×2300'),
    p('气源电力源', 'Air Supply', '2300L/min 5.0-6.0kgf/cm²'),
    p('设备电源', 'Power Supply', '380V 50HZ'),
    p('控制系统电源', 'Control Power', 'DC24V'),
    p('设备重量 T', 'Net Weight', '11.7'),
    p('设备方向', 'Layout Orientation', '可选择对称方向', 'Symmetric orientation optional'),
  ],
  YK6W: [
    p('名称', 'Name', '铝材长边卧冲生产线', 'Aluminium long-edge horizontal-punch line'),
    p('加工范围 mm', 'Processing Range', '1500-2600'),
    p('原材料兼容尺寸(长度)', 'Raw Material Length', '≤7.5m'),
    p('生产节拍(支/秒)', 'Production Cycle', '1.8-2.1(18000-20000支/12H)', '1.8-2.1s (18,000-20,000 pcs/12H)'),
    p('长度切割精度 mm', 'Cutting Accuracy', '±0.1'),
    p('孔距精度 mm', 'Hole Pitch Accuracy', '±0.1'),
    p('切角角度', 'Mitre Angle', '35°-55°可调', '35°-55° adjustable'),
    p('角度切割精度', 'Angle Accuracy', '±0.1°'),
    p('铆点精度 mm', 'Riveting Accuracy', '±0.1'),
    p('换模时间', 'Changeover Time', '<2H'),
    p('无故障运行率', 'Uptime', '98%'),
    p('装机容量 KW', 'Installed Capacity', '28'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '10700×6300×2300'),
    p('气源电力源', 'Air Supply', '2300L/min 5.0-6.0kgf/cm²'),
    p('设备电源', 'Power Supply', '380V 50HZ'),
    p('控制系统电源', 'Control Power', 'DC24V'),
    p('设备重量 T', 'Net Weight', '10.8'),
    p('设备方向', 'Layout Orientation', '可选择对称方向', 'Symmetric orientation optional'),
  ],
  'YK-FC-3C': [
    p('名称', 'Name', '复合材料长边自动生产线', 'Composite long-edge automatic line'),
    p('加工范围 mm', 'Processing Range', '1500-2600'),
    p('原材料兼容尺寸(长度)', 'Raw Material Length', '≤7.5m'),
    p('生产节拍(支/秒)', 'Production Cycle', '4.5'),
    p('长度切割精度 mm', 'Cutting Accuracy', '±0.15'),
    p('孔距精度 mm', 'Hole Pitch Accuracy', '±0.15'),
    p('切角角度', 'Mitre Angle', '45°'),
    p('角度切割精度', 'Angle Accuracy', '-0.3°~0°'),
    p('换模时间', 'Changeover Time', '3H'),
    p('无故障运行率', 'Uptime', '98%'),
    p('装机容量 KW', 'Installed Capacity', '28'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '10700×6200×2400'),
    p('气源电力源', 'Air Supply', '2000L/min 5.0-6.0kgf/cm²'),
    p('设备电源', 'Power Supply', '380V 50HZ'),
    p('控制系统电源', 'Control Power', 'DC24V'),
    p('设备重量 T', 'Net Weight', '9.5'),
  ],
  'YK-FC-3D': [
    p('名称', 'Name', '复合材料短边自动生产线', 'Composite short-edge automatic line'),
    p('加工范围 mm', 'Processing Range', '850-1500'),
    p('生产节拍(支/秒)', 'Production Cycle', '1.7'),
    p('换模时间', 'Changeover Time', '0.5H'),
    p('无故障运行率', 'Uptime', '98%'),
    p('装机容量 KW', 'Installed Capacity', '11'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '10700×12700×2400'),
    p('气源电力源', 'Air Supply', '500L/min 5.0-6.0kgf/cm²'),
    p('设备电源', 'Power Supply', '380V 50HZ'),
    p('控制系统电源', 'Control Power', 'DC24V'),
    p('设备重量 T', 'Net Weight', '8.3'),
  ],
  'YK-FC-3J': [
    p('名称', 'Name', '复合材料角码装配机', 'Composite corner-key assembly machine'),
    p('加工范围 mm', 'Processing Range', '850-1500'),
    p('生产节拍(支/秒)', 'Production Cycle', '2.5'),
    p('换模时间', 'Changeover Time', '0.5H'),
    p('无故障运行率', 'Uptime', '98%'),
    p('装机容量 KW', 'Installed Capacity', '6'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '4500×3800×1500'),
    p('气源电力源', 'Air Supply', '200L/min 5.0-8.0kgf/cm²'),
    p('设备电源', 'Power Supply', '380V 50HZ'),
    p('控制系统电源', 'Control Power', 'DC24V'),
    p('设备重量 T', 'Net Weight', '1.5'),
  ],
  'YK-3E': [
    p('名称', 'Name', '长边自动码垛机', 'Long-edge automatic stacker'),
    p('加工范围 mm', 'Processing Range', '1500-2600'),
    p('生产节拍(支/秒)', 'Production Cycle', '1.7'),
    p('换模时间', 'Changeover Time', '0.5H'),
    p('无故障运行率', 'Uptime', '98%'),
    p('装机容量 KW', 'Installed Capacity', '11'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '7000×6300×2500'),
    p('气源电力源', 'Air Supply', '500L/min 5.0-6.0kgf/cm²'),
    p('设备电源', 'Power Supply', '380V 50HZ'),
    p('控制系统电源', 'Control Power', 'DC24V'),
    p('设备重量 T', 'Net Weight', '4.2'),
  ],
  'YK-3F': [
    p('名称', 'Name', '短边自动码垛机', 'Short-edge automatic stacker'),
    p('加工范围 mm', 'Processing Range', '850-1500'),
    p('生产节拍(支/秒)', 'Production Cycle', '2'),
    p('换模时间', 'Changeover Time', '0.5H'),
    p('无故障运行率', 'Uptime', '98%'),
    p('装机容量 KW', 'Installed Capacity', '11'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '5000×7200×2500'),
    p('气源电力源', 'Air Supply', '500L/min 5.0-6.0kgf/cm²'),
    p('设备电源', 'Power Supply', '380V 50HZ'),
    p('控制系统电源', 'Control Power', 'DC24V'),
    p('设备重量 T', 'Net Weight', '3.7'),
  ],
  'YK-AL-1': [
    p('名称', 'Name', '自动上料机', 'Automatic feeding machine'),
    p('适用边框原材料尺寸', 'Raw Material Size', '长 3900-7500mm，宽 30-45mm，高 11-35mm', 'L 3900-7500mm, W 30-45mm, H 11-35mm'),
    p('最大重量(含托盘)', 'Max Load (incl. pallet)', '3000kg'),
    p('托盘原材料存放数量', 'Pallet Capacity', '360 支', '360 pcs'),
    p('上料节拍', 'Feeding Cycle', '2 秒/支', '2s per pc'),
    p('上料缓冲区', 'Feed Buffer', '≥50 支', '≥50 pcs'),
    p('设备稼动率', 'Uptime', '≥85%'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '8000×6500×3000'),
  ],
  'YK-OL-2I': [
    p('名称', 'Name', '在线视觉检测系统', 'Inline vision inspection system'),
    p('检测方式', 'Inspection Mode', '产线在线全检', 'Inline full inspection'),
    p('检测项目', 'Inspection Items', '长度、扭曲度、漏加工及碰伤、划伤、变形等十余类', 'Length, twist, missed ops, dents, scratches, deformation and more'),
    p('生产节拍(支/秒)', 'Production Cycle', '≤1.7'),
    p('换型时间', 'Changeover Time', '≤20 分钟', '≤20 min'),
    p('分拣方式', 'Sorting', 'OK/NG 自动分拣', 'Automatic OK/NG sorting'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '3550×2900×2500'),
  ],
  'YK-OF-3I': [
    p('名称', 'Name', '离线视觉检测系统', 'Offline vision inspection system'),
    p('检测方式', 'Inspection Mode', '离线全尺寸检测', 'Offline full-size inspection'),
    p('检测项目', 'Inspection Items', '长度、角度、卡槽、冲孔、铆压等', 'Length, angle, slots, punching, riveting, etc.'),
    p('生产节拍', 'Cycle Time', '约 1 分钟/件', '~1 min per pc'),
    p('检测报告', 'Reports', '自动打印,结果长期可追溯', 'Auto-printed, long-term traceable'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '3900×1550×2500'),
  ],
  型材拉弯机: [
    p('名称', 'Name', '型材拉弯机', 'Profile stretch-bending machine'),
    p('适用型材宽度 mm', 'Profile Width', '900-3200'),
    p('拉弯速度', 'Bending Speed', '0-100mm/s'),
    p('单件节拍', 'Cycle Time', '约 40 秒', '~40s'),
    p('成形精度 mm', 'Forming Accuracy', '0.02'),
    p('弯曲角度范围', 'Bending Angle Range', '5°-85°'),
    p('装机容量 KVA', 'Installed Capacity', '75'),
    p('设备电源', 'Power Supply', '380V±10% 50-60HZ'),
    p('无故障运行率', 'Uptime', '99.8%'),
    p('外形尺寸mm(长×宽×高)', 'Dimensions (L×W×H)', '6300×1200×1800'),
  ],
  自动锁螺母生产线: [
    p('名称', 'Name', '自动锁螺母生产线', 'Automatic nut-insertion line'),
    p('工艺支持', 'Processes', 'FSW 搅拌摩擦焊 / CMT 冷金属过渡焊', 'FSW / CMT welding'),
    p('应用领域', 'Application', '汽车白车身轻量化结构件', 'BIW lightweight structures'),
    p('生产方式', 'Production Mode', '自动上料 + 锁螺母 + 焊接集成', 'Integrated feeding, nut insertion and welding'),
  ],
}

export const productParams = reactive(cloneData(productParamsSeed))

// 发展历程(真实大事记)
export const milestones = [
  { year: '2004', text: { zh: '上海寅铠精密机械制造有限公司成立，深耕汽车焊装装备。', en: 'Yinkai founded in Shanghai, focusing on automotive welding equipment.' } },
  { year: '2005', text: { zh: '通过德国莱茵 TÜV 认证，获 ISO9001 质量管理体系认证。', en: 'ISO9001 quality management system certified by TÜV Rheinland.' } },
  { year: '2011', text: { zh: '迁入嘉定安亭新厂区，厂房面积一万多平方米。', en: 'Relocated to the new plant in Anting, Jiading, covering 10,000+ m².' } },
  { year: '2024', text: { zh: '发布光伏边框在线/离线视觉检测新品，设备出口美国市场。', en: 'Launched inline/offline vision inspection products; equipment exported to the US.' } },
  { year: '2026', text: { zh: '持续拓展光伏边框自动化产线全球市场。', en: 'Continuing to expand the global market for PV frame automation lines.' } },
]

// 公司简介(About 页,双语段落)
export const intro = [
  {
    title: { zh: '公司概况', en: 'Company Profile' },
    text: {
      zh: '上海寅铠精密机械制造有限公司成立于2004年6月，位于上海市嘉定区安亭镇园区路567号，厂房及工业园占地面积约10000平方米，现有员工150余人，是一家专注于工业自动化装备研发、制造与服务的高新技术企业。公司起步于汽车焊装设备领域，凭借在汽车自动化行业多年积累的设计、制造与集成经验，形成了扎实的技术底蕴和项目管理能力。2005年，公司通过德国莱茵TÜV现场审核，获得ISO9001质量管理体系认证，企业管理与国际先进水平全面接轨。',
      en: 'Founded in June 2004 in Anting, Jiading, Shanghai, Yinkai operates a plant and industrial park of about 10,000 m² with 150+ employees, dedicated to the R&D, manufacturing and service of industrial automation equipment. Starting from automotive welding equipment, the company built solid technical expertise and project management capabilities. In 2005, it passed the TÜV Rheinland audit and obtained ISO9001 certification.',
    },
  },
  {
    title: { zh: '深耕汽车焊装', en: 'Automotive Heritage' },
    text: {
      zh: '公司成立初期深耕汽车焊装装备领域，主营汽车白车身焊接生产线交钥匙工程，涵盖焊装线、分拼线、工装夹具、检具与输送线及机器人系统集成，先后服务于上海大众、上海通用、上汽、长城、吉利、PSA、华晨、北汽等主流主机厂，并与ABB、KUKA、COMAU、西门子等知名企业长期合作。2007-2019年年均交付8-10个项目，累计超百项；2014年完成北汽、华晨白车身整线项目。2011年迁入新厂区，配备FARO激光跟踪仪等设备，精度控制在±0.1毫米级，为进军光伏领域奠定了坚实基础。',
      en: 'In its early years, Yinkai specialized in turnkey automotive BIW welding lines — welding, hemming, fixtures, gauges, conveyors and robot integration — serving SVW, SGM, SAIC, Great Wall, Geely, PSA, Jinbei, BAIC and partners such as ABB, KUKA and COMAU. From 2007 to 2019 it delivered 8-10 projects per year, over 100 in total, including full BIW lines for BAIC and Jinbei in 2014. In 2011 the company moved to its new plant with FARO laser trackers, holding precision at ±0.1 mm.',
    },
  },
  {
    title: { zh: '战略转型光伏', en: 'Strategic PV Expansion' },
    text: {
      zh: '2017年，公司成立光伏事业部，正式进入光伏边框自动化设备领域，开启了从汽车自动化向光伏新能源装备的战略拓展。依托汽车行业的丰富经验，公司自主研发、生产并销售优质的光伏边框自动化设备，逐步发展成为国内领先的光伏边框自动化设备制造商，致力于推动光伏边框行业全自动无人化工厂发展。',
      en: 'In 2017, Yinkai founded its PV division and entered the photovoltaic frame automation field, a strategic expansion from automotive automation. Leveraging its automotive expertise, the company developed high-quality PV frame automation equipment and has become a leading domestic manufacturer, committed to fully-unmanned PV frame factories.',
    },
  },
  {
    title: { zh: '核心产品', en: 'Core Products' },
    text: {
      zh: '公司主要产品涵盖光伏边框铝型材自动化生产线、复合材料自动化生产线、自动码垛机、自动上料机及自动视觉检测系统等，集自动上料、送料、切割、冲孔、铆压于一体，以柔性化、模块化设计为核心。从早期设备到第六代光伏边框自动化生产线，生产节拍和加工精度不断提升；2024年持续推进视觉检测项目的研发与推广。公司光伏业务已服务于爱康集团等客户，并在行业内获得广泛认可。',
      en: 'Main products cover PV frame aluminum/composite automatic lines, palletizers, feeders and vision inspection systems, integrating feeding, conveying, cutting, punching and riveting with flexible modular design. From early models to the 6th-generation line, cycle time and precision keep improving; in 2024 vision inspection R&D advanced further. PV clients include Akcome and more.',
    },
  },
  {
    title: { zh: '资质与愿景', en: 'Qualifications & Vision' },
    text: {
      zh: '公司拥有多项专利，获得高新技术企业、上海市“专精特新”中小企业、安全生产标准化三级企业等荣誉，并参与国家/行业标准制定，具备从工艺规划、设计、制造到装配调试、售后服务的全流程一体化能力。公司秉持“成为全球工业自动化产业的一流供应商”的愿景，以“寅领行业，铠创未来”为使命，坚持“敬畏客户、勇于创新、尊重个人、结果导向”的核心价值观，持续为全球客户提供智能、可靠、高效的自动化解决方案。',
      en: 'Yinkai holds multiple patents and honors including National High-Tech Enterprise and Shanghai "Specialized & Innovative" SME, and participates in national/industry standard setting, offering full-process capabilities from planning and design to manufacturing, commissioning and after-sales service. With the vision of becoming a first-class global supplier of industrial automation, the mission of "Leading the industry, Creating the future", and values of customer respect, innovation, individual respect and result orientation, Yinkai keeps delivering intelligent, reliable and efficient automation solutions worldwide.',
    },
  },
]

// 公司荣誉(About 页,按重要程度排序;honor4/honor5 中英文认证并列)
import honor01 from '../assets/honors/honor-01.jpg'
import honor02 from '../assets/honors/honor-02.jpg'
import honor03 from '../assets/honors/honor-03.jpg'
import honor04 from '../assets/honors/honor-04.jpg'
import honor05 from '../assets/honors/honor-05.jpg'
import honor06 from '../assets/honors/honor-06.jpg'
import honor07 from '../assets/honors/honor-07.jpg'

export const honorsSeed = [
  {
    image: honor01,
    name: { zh: '综合资质证书', en: 'Certificates Overview' },
    desc: { zh: '高新技术企业、安全生产标准化、SEC 年度确认及多项专利证书。', en: 'High-tech enterprise, work safety standardization, SEC annual confirmation and multiple patents.' },
  },
  {
    image: honor02,
    name: { zh: '上海市"专精特新"中小企业', en: 'Shanghai "Specialized & Innovative" SME' },
    desc: { zh: '上海市经济和信息化委员会认定,聚焦细分领域的专业化标杆。', en: 'Recognized by Shanghai SME Commission as a specialized and innovative enterprise.' },
  },
  {
    image: honor03,
    name: { zh: '质量管理体系认证', en: 'QMS Certification' },
    desc: { zh: '通过 SEC 质量管理体系认证,质量管理与国际接轨。', en: 'Certified quality management system (SEC), aligned with international standards.' },
  },
  {
    image: honor04,
    name: { zh: 'ISO Quality Certification', en: 'ISO Quality Certification' },
    desc: { zh: '面向国际客户的质量管理体系认证(英文版)。', en: 'Quality management system certification for international clients.' },
  },
  {
    image: honor05,
    name: { zh: '安全生产标准化三级企业', en: 'Work Safety Standardization Level 3' },
    desc: { zh: '机械行业安全生产标准化三级企业认证。', en: 'Level-3 work safety standardization (machinery industry).' },
  },
  {
    image: honor06,
    name: { zh: '实用新型专利证书', en: 'Utility Model Patents' },
    desc: { zh: '拥有多项实用新型专利,覆盖光伏边框生产与检测设备。', en: 'Multiple utility model patents covering PV frame production and inspection equipment.' },
  },
  {
    image: honor07,
    name: { zh: '专利登记簿副本', en: 'Patent Register' },
    desc: { zh: '国家知识产权局专利登记簿副本,专利权属清晰可查。', en: 'Patent register copies from CNIPA with clear ownership records.' },
  },
]

export const honors = reactive(cloneData(honorsSeed))

// 发展历程时间线(About 页纵向图文时间线,双语;image 为可选配图)
import imgT2004 from '../assets/timeline/t-2004.jpg'
import imgT2007 from '../assets/timeline/t-2007.jpg'
import imgT2011 from '../assets/timeline/t-2011.jpg'
import imgT2014 from '../assets/timeline/t-2014.jpg'
import imgT2017 from '../assets/timeline/t-2017.jpg'
import imgT2018 from '../assets/timeline/t-2018.jpg'
import imgT2022 from '../assets/timeline/t-2022.jpg'
import imgT2023 from '../assets/timeline/t-2023.jpg'
import imgT2024 from '../assets/timeline/t-2024.jpg'
import imgT2026 from '../assets/timeline/t-2026.jpg'
import imgCompany from '../assets/banner-company.webp'

export const timeline = [
  { year: '2004', image: imgT2004, title: { zh: '寅铠成立', en: 'Yinkai Founded' }, desc: { zh: '公司于上海成立，切入汽车白车身焊装装备领域。', en: 'Founded in Shanghai, entering automotive BIW welding equipment.' } },
  { year: '2005', image: null, title: { zh: 'TÜV 认证', en: 'TÜV Certified' }, desc: { zh: '通过德国莱茵 TÜV 认证，获 ISO9001 质量管理体系认证。', en: 'ISO9001 certified by TÜV Rheinland.' } },
  { year: '2007-2010', image: imgT2007, title: { zh: '快速交付期', en: 'Rapid Delivery' }, desc: { zh: '年均交付 8-10 个项目，绑定主流主机厂配套体系。', en: '8-10 projects per year, tied into major OEM supply chains.' } },
  { year: '2011', image: imgT2011, title: { zh: '新厂区启用', en: 'New Plant' }, desc: { zh: '迁入嘉定安亭新厂区，厂房面积一万多平方米。', en: 'Relocated to a 10,000+ m² plant in Anting, Jiading.' } },
  { year: '2014', image: imgT2014, title: { zh: '整线交付', en: 'Full-Line Delivery' }, desc: { zh: '交付北汽、华晨白车身焊接生产线等整线项目。', en: 'Delivered full BIW lines for BAIC and Jinbei.' } },
  { year: '2017', image: imgT2017, title: { zh: 'YK-15 启航', en: 'YK-15 Kickoff' }, desc: { zh: '启动 YK-15 研发，探索非标自动化产品化路径。', en: 'Started YK-15 R&D, moving toward productized automation.' } },
  { year: '2018-2019', image: imgT2018, title: { zh: '累计破百', en: '100+ Projects' }, desc: { zh: 'YK-2/YK-3/YK-44 相继推出，累计交付项目突破 100。', en: 'YK-2/YK-3/YK-44 released; cumulative projects topped 100.' } },
  { year: '2020', image: null, title: { zh: 'YK-53 发布', en: 'YK-53 Released' }, desc: { zh: 'YK-53 系列推出，光伏边框产线持续迭代。', en: 'YK-53 series launched, iterating PV frame lines.' } },
  { year: '2022', image: imgT2022, title: { zh: '2.5 秒节拍', en: '2.5s Cycle' }, desc: { zh: 'YK-5 系列实现 2.5 秒级节拍突破。', en: 'YK-5 series achieved a 2.5-second cycle breakthrough.' } },
  { year: '2023', image: imgT2023, title: { zh: 'YK-62 发布', en: 'YK-62 Released' }, desc: { zh: 'YK-62 新一代机型推出。', en: 'Next-generation YK-62 model introduced.' } },
  { year: '2024', image: imgT2024, title: { zh: '检测+出海', en: 'Inspection & Export' }, desc: { zh: 'YK-OL-2I/YK-OF-3I 视觉检测系统发布，设备出口美国。', en: 'YK-OL-2I/YK-OF-3I vision systems released; exported to the US.' } },
  { year: '2026', image: imgT2026, title: { zh: '面向全球', en: 'Going Global' }, desc: { zh: '持续拓展光伏边框自动化产线全球市场。', en: 'Continuing to expand PV frame automation worldwide.' } },
]

// 新闻(真实事件 + 行业内容)
export const newsSeed = [
  {
    id: 1,
    tag: { zh: '公司动态', en: 'Company News' },
    date: '2026-08-20',
    title: { zh: '寅铠光伏边框自动生产线再获海外订单', en: 'Yinkai Wins Another Overseas Order for PV Frame Production Lines' },
    summary: { zh: '海外客户对 ±0.1mm 加工精度与数秒级节拍给予高度认可。', en: 'The overseas customer highly recognized the ±0.1mm precision and second-level cycle time.' },
    content: {
      zh: '近日，寅铠与海外客户签订光伏边框自动生产线订单。该产线延续 YK 系列模块化设计，集自动上料、切割、冲孔、铆压于一体，节拍最快数秒一支，切割与孔距精度达 ±0.1mm。客户表示，寅铠设备的高稳定性与快速换型能力是本次合作的关键因素。',
      en: 'Yinkai recently signed an order for PV frame production lines with an overseas customer. Continuing the modular YK series design, the line integrates auto feeding, cutting, punching and riveting with a cycle of seconds per frame and ±0.1mm precision. The customer cited Yinkai\'s stability and fast changeover as key factors.',
    },
  },
  {
    id: 2,
    tag: { zh: '技术迭代', en: 'Technology' },
    date: '2026-05-12',
    title: { zh: 'YK-OL 在线视觉检测系统完成新一轮迭代升级', en: 'New Iteration of the YK-OL Inline Vision Inspection System Released' },
    summary: { zh: '检测节拍提升至 1.7 秒以内，新增多类瑕疵识别模型。', en: 'Cycle improved to under 1.7 seconds with new defect recognition models.' },
    content: {
      zh: '寅铠研发团队完成 YK-OL 系列在线视觉检测系统新一轮迭代。系统可在线检测长度、扭曲度、漏加工及碰伤、划伤、变形、脏污、铝屑等十余类外观瑕疵并自动分拣，节拍 ≤1.7 秒，换型时间 ≤20 分钟，检测数据可保存追溯，进一步巩固了公司在光伏边框检测领域的技术优势。',
      en: 'Yinkai\'s R&D team completed a new iteration of the YK-OL inline vision inspection system. It inspects length, twist, missed operations and over a dozen surface defects (dents, scratches, deformation, dirt, aluminum chips) with auto sorting at ≤1.7s cycle and ≤20min changeover, with traceable data storage, reinforcing Yinkai\'s technical edge in PV frame inspection.',
    },
  },
  {
    id: 3,
    tag: { zh: '项目交付', en: 'Project Delivery' },
    date: '2026-03-02',
    title: { zh: '美国光伏边框产线项目顺利通过终验收', en: 'US PV Frame Line Project Passes Final Acceptance' },
    summary: { zh: '涵盖边框生产与在线视觉尺寸检测的整线方案获客户认可。', en: 'The complete line with production and inline dimension inspection was accepted by the customer.' },
    content: {
      zh: '寅铠为美国客户提供的光伏边框生产与视觉检测设备项目顺利通过终验收。项目包含边框自动生产线与在线视觉尺寸检测工位，采用 2500 万像素远心镜头双相机进行直线度与弯扭检测，检测数据以 Excel 保存并可追溯。这标志着寅铠光伏装备的国际化交付能力再上台阶。',
      en: 'Yinkai\'s PV frame production and vision inspection equipment project for a US customer passed final acceptance. The project included an automatic frame line and an inline dimension inspection station with dual 25MP telecentric cameras for straightness and bend/twist detection, with Excel-exported traceable data — another milestone in Yinkai\'s global delivery capability.',
    },
  },
  {
    id: 4,
    tag: { zh: '展会活动', en: 'Exhibitions' },
    date: '2025-11-15',
    title: { zh: '寅铠亮相国际光伏装备展会', en: 'Yinkai Exhibited at an International PV Equipment Show' },
    summary: { zh: '现场展示光伏边框自动生产线核心技术方案。', en: 'Showcased core technologies of the PV frame production line on site.' },
    content: {
      zh: '寅铠携光伏边框自动生产线核心技术方案亮相行业展会，重点展示弹性夹具系统、旋转切割刀头等自主技术，以及"切冲铆一气呵成"的整线设计理念，吸引众多国内外客户驻足交流。',
      en: 'Yinkai showcased its PV frame production line technologies at an industry expo, highlighting proprietary innovations such as the elastic clamping system and rotary cutting head, and the one-flow cutting-punching-riveting line concept, attracting many domestic and international customers.',
    },
  },
  {
    id: 5,
    tag: { zh: '质量体系', en: 'Quality' },
    date: '2025-06-18',
    title: { zh: '公司通过 ISO9001 质量管理体系换版审核', en: 'Yinkai Passed the ISO9001 Recertification Audit' },
    summary: { zh: '自 2005 年首次认证以来持续保持质量体系有效运行。', en: 'Maintaining an effective quality system since first certification in 2005.' },
    content: {
      zh: '寅铠顺利通过 ISO9001 质量管理体系换版审核。公司自 2005 年获得德国莱茵 TÜV 颁发的 ISO9001 认证以来，始终严格执行质量管理体系标准，为汽车与光伏两大行业客户提供稳定可靠的装备与服务。',
      en: 'Yinkai passed the ISO9001 recertification audit. Since first receiving ISO9001 from TÜV Rheinland in 2005, the company has strictly maintained its quality management system, providing reliable equipment and services to customers in both automotive and PV industries.',
    },
  },
  {
    id: 6,
    tag: { zh: '公司动态', en: 'Company News' },
    date: '2025-01-10',
    title: { zh: '汽车焊装业务稳步推进，多条产线同步交付', en: 'Steady Progress in Automotive BIW Business with Multiple Lines Delivered' },
    summary: { zh: '延续大众、通用等主机厂长期合作关系。', en: 'Continuing long-term partnerships with OEMs such as VW and GM.' },
    content: {
      zh: '寅铠汽车白车身焊装业务保持稳健发展，年内多条焊装线、分拼线及工装夹具项目按期交付。公司自 2004 年成立以来累计服务上海大众、上海通用、上汽、吉利、长城等众多主机厂与一级供应商，以宝马级制造标准赢得行业口碑。',
      en: 'Yinkai\'s BIW welding business remained solid, with multiple welding lines, hemming lines and fixture projects delivered on schedule this year. Since 2004, Yinkai has served many OEMs and Tier-1 suppliers including SVW, SGM, SAIC, Geely and Great Wall, earning industry recognition with BMW-grade manufacturing standards.',
    },
  },
  {
    id: 7,
    tag: { zh: '项目交付', en: 'Project Delivery' },
    date: '2024-09-26',
    title: { zh: '东南亚光伏组件基地边框产线完成验收', en: 'PV Frame Lines for Southeast Asia Module Plant Passed Acceptance' },
    summary: { zh: '海外第二基地建设再下一城，产线稼动率达 98%。', en: 'Another overseas milestone with line uptime reaching 98%.' },
    content: {
      zh: '寅铠为东南亚某大型光伏组件基地提供的边框自动生产线项目完成终验收。产线涵盖自动上料、切割、冲孔、铆压与在线检测全流程，投产后稼动率达 98%，单线日产能满足组件基地配套需求。客户对设备的稳定性与寅铠工程师团队的远程支持能力给予高度评价，双方就后续二期扩产达成初步合作意向。',
      en: 'The PV frame automatic lines supplied by Yinkai for a large module plant in Southeast Asia passed final acceptance. Covering auto feeding, cutting, punching, riveting and inline inspection, the line reached 98% uptime after commissioning with daily output matching the plant\'s needs. The customer highly praised equipment stability and Yinkai\'s remote support, and both parties reached preliminary intent for phase-two expansion.',
    },
  },
  {
    id: 8,
    tag: { zh: '技术迭代', en: 'Technology' },
    date: '2024-06-15',
    title: { zh: 'YK-FC 复合材料产线实现多材质兼容切换', en: 'YK-FC Composite Lines Now Support Multi-Material Quick Changeover' },
    summary: { zh: '换型时间缩短至 20 分钟以内，支持玻纤/聚氨酯共线生产。', en: 'Changeover under 20 minutes, supporting fiberglass/PU co-production.' },
    content: {
      zh: 'YK-FC 系列复合材料边框自动生产线完成技术升级，实现玻纤、聚氨酯等多材质边框的共线兼容生产，换型时间缩短至 20 分钟以内。升级后的产线在保证 ±0.15mm 加工精度的同时，可满足组件客户小批量、多品种的柔性生产需求，已在多家客户现场稳定运行。',
      en: 'The YK-FC composite frame line series has been upgraded for co-production of fiberglass and polyurethane frames, cutting changeover to under 20 minutes. While maintaining ±0.15mm precision, the upgraded line meets customers\' flexible needs for small-batch, multi-variety production and has been running stably at multiple customer sites.',
    },
  },
  {
    id: 9,
    tag: { zh: '展会活动', en: 'Exhibitions' },
    date: '2024-05-20',
    title: { zh: 'SNEC 光伏展完美收官，现场达成多项合作意向', en: 'SNEC PV Power Expo Concluded with Multiple Cooperation Intentions' },
    summary: { zh: 'YK 系列全线产品集中亮相，观众超十万人次。', en: 'Full YK lineup on show with over 100,000 visitors.' },
    content: {
      zh: '寅铠携 YK 系列光伏边框自动生产线、视觉检测系统等全线产品亮相 SNEC 国际太阳能光伏与智慧能源大会。展台现场观众超十万人次，团队与数十家组件企业就产线规划、设备升级展开深入交流，达成多项合作意向。展会期间发布的 YK-7 系列新一代高速产线成为全场焦点。',
      en: 'Yinkai showcased its full YK series — PV frame automatic lines and vision inspection systems — at the SNEC International Solar PV & Smart Energy Conference. The booth attracted over 100,000 visitors. The team held in-depth exchanges with dozens of module companies on line planning and upgrades, reaching multiple cooperation intentions. The newly released YK-7 high-speed line series was a highlight of the show.',
    },
  },
  {
    id: 10,
    tag: { zh: '质量体系', en: 'Quality' },
    date: '2024-02-28',
    title: { zh: '获得高新技术企业认定，研发投入持续加码', en: 'Certified as High-Tech Enterprise with Rising R&D Investment' },
    summary: { zh: '累计授权专利 60 余项，研发人员占比超 30%。', en: '60+ patents granted; R&D staff over 30% of headcount.' },
    content: {
      zh: '寅铠顺利通过国家高新技术企业认定。公司累计获得授权专利 60 余项，其中发明专利占比持续提升；研发人员占员工总数超过 30%。未来公司将持续加大在视觉检测算法、高速运动控制与产线数字化方向的研发投入，为客户提供更具竞争力的智能制造装备。',
      en: 'Yinkai officially obtained the national High-Tech Enterprise certification. The company holds 60+ granted patents with a rising share of invention patents, and R&D staff account for over 30% of the workforce. Yinkai will continue increasing investment in vision inspection algorithms, high-speed motion control and line digitalization to deliver more competitive smart manufacturing equipment.',
    },
  },
  {
    id: 11,
    tag: { zh: '公司动态', en: 'Company News' },
    date: '2023-11-08',
    title: { zh: '二期厂房扩建竣工，产能迈上新台阶', en: 'Phase-II Plant Expansion Completed, Capacity on a New Level' },
    summary: { zh: '新增装配工位 20 余个，年交付产线能力提升 40%。', en: '20+ new assembly stations; annual line delivery up 40%.' },
    content: {
      zh: '寅铠二期厂房扩建工程正式竣工投用，新增标准化装配工位 20 余个、大型加工设备 8 台，年交付产线能力提升约 40%。新厂房配备整机老化测试区与模拟产线验证区，出厂前可对整线进行 72 小时连续运行测试，进一步保障交付设备的可靠性。',
      en: 'Yinkai\'s phase-II plant expansion has been completed and put into operation, adding 20+ standardized assembly stations and 8 large machining machines, raising annual line delivery capacity by about 40%. The new plant features an aging test area and a simulated line validation zone, allowing 72-hour continuous full-line testing before shipment to further ensure delivery reliability.',
    },
  },
  {
    id: 12,
    tag: { zh: '项目交付', en: 'Project Delivery' },
    date: '2023-07-12',
    title: { zh: '中东光伏产业园项目顺利投产', en: 'Middle East PV Industrial Park Project Commissioned' },
    summary: { zh: '高温环境定制设计，连续运行稳定性获客户认可。', en: 'Custom design for high-temperature environments earns recognition.' },
    content: {
      zh: '寅铠为中东某光伏产业园定制设计的边框自动生产线顺利投产。针对当地高温、高粉尘环境，产线在散热系统、密封防护与除尘结构上做了专项设计，投产后连续运行稳定，各项指标达到合同要求。该项目的落地进一步拓展了公司在"一带一路"沿线市场的布局。',
      en: 'The customized PV frame automatic lines supplied by Yinkai for a PV industrial park in the Middle East were successfully commissioned. Special designs for cooling, sealing and dust protection were made for the local high-temperature, high-dust environment. The line has been running stably since commissioning with all indicators meeting contract requirements, further expanding Yinkai\'s presence along the Belt and Road markets.',
    },
  },
]

export const news = reactive(cloneData(newsSeed))

// 职位(desc:点击卡片展开的岗位详情,双语)
export const jobsSeed = [
  {
    id: 1,
    title: { zh: '机械设计工程师', en: 'Mechanical Design Engineer' },
    dept: { zh: '研发中心', en: 'R&D Center' },
    location: { zh: '上海·安亭', en: 'Anting, Shanghai' },
    desc: {
      zh: '岗位职责：负责非标自动化设备与产线的机械结构设计方案、图纸绘制及 BOM 编制，跟进装配调试并持续优化结构。\n任职要求：机械设计及相关专业，熟练使用 SolidWorks / AutoCAD，三年以上非标自动化设计经验，熟悉钣金、机加工工艺。',
      en: 'Responsibilities: Design mechanical structures for custom automation equipment and lines, produce drawings and BOMs, and support assembly, commissioning and optimization.\nRequirements: Degree in mechanical design or related field; proficient in SolidWorks / AutoCAD; 3+ years of non-standard automation design experience; familiar with sheet-metal and machining processes.',
    },
  },
  {
    id: 2,
    title: { zh: '电气调试工程师', en: 'Electrical Commissioning Engineer' },
    dept: { zh: '工程部', en: 'Engineering' },
    location: { zh: '上海·安亭', en: 'Anting, Shanghai' },
    desc: {
      zh: '岗位职责：负责自动化产线电气原理设计、PLC 程序编写与现场调试，配合机械完成整线联调并交付客户。\n任职要求：电气自动化相关专业，熟悉西门子 / 三菱 PLC 与伺服系统，能适应出差，有产线整线调试经验者优先。',
      en: 'Responsibilities: Design electrical schematics for automation lines, write PLC programs, commission on site and support full-line integration and customer delivery.\nRequirements: Degree in electrical automation; familiar with Siemens / Mitsubishi PLC and servo systems; willing to travel; line commissioning experience preferred.',
    },
  },
  {
    id: 3,
    title: { zh: '视觉算法工程师', en: 'Vision Algorithm Engineer' },
    dept: { zh: '研发中心', en: 'R&D Center' },
    location: { zh: '上海·安亭', en: 'Anting, Shanghai' },
    desc: {
      zh: '岗位职责：负责视觉检测系统的图像算法开发与优化（尺寸测量、外观瑕疵识别、分类分拣），跟进现场调试与算法迭代。\n任职要求：计算机 / 光电 / 自动化相关专业，熟练使用 OpenCV / Halcon，有深度学习瑕疵检测项目经验者优先。',
      en: 'Responsibilities: Develop and optimize image algorithms for vision inspection (dimension measurement, defect recognition and sorting), and iterate on-site.\nRequirements: Degree in CS / optoelectronics / automation; proficient in OpenCV / Halcon; deep-learning defect detection project experience preferred.',
    },
  },
  {
    id: 4,
    title: { zh: '测量工程师（FARO）', en: 'Metrology Engineer (FARO)' },
    dept: { zh: '质量部', en: 'Quality' },
    location: { zh: '上海·安亭', en: 'Anting, Shanghai' },
    desc: {
      zh: '岗位职责：使用 FARO 激光跟踪仪、关节臂等设备开展精密测量与数据分析，出具检测报告，参与设备精度验收。\n任职要求：测量 / 机械相关专业，熟悉 FARO 设备与三维测量软件，细心严谨，具备 ±0.1mm 级精度检测经验者优先。',
      en: 'Responsibilities: Perform precision measurement and data analysis with FARO laser trackers and measuring arms, issue inspection reports and join equipment accuracy acceptance.\nRequirements: Degree in metrology / mechanical engineering; familiar with FARO devices and 3D inspection software; detail-oriented; ±0.1mm-level inspection experience preferred.',
    },
  },
  {
    id: 5,
    title: { zh: '装配钳工', en: 'Assembly Fitter' },
    dept: { zh: '生产部', en: 'Production' },
    location: { zh: '上海·安亭', en: 'Anting, Shanghai' },
    desc: {
      zh: '岗位职责：按图纸完成自动化设备的机械装配、调试与出厂检验，配合现场安装与售后支持。\n任职要求：有钳工装配经验，能识读机械图纸，熟练使用各类量具与装配工具，责任心强，能配合出差。',
      en: 'Responsibilities: Assemble and commission automation equipment per drawings, carry out factory inspection, and support on-site installation and after-sales.\nRequirements: Fitting and assembly experience; able to read mechanical drawings; skilled with measuring and assembly tools; responsible and willing to travel.',
    },
  },
  {
    id: 6,
    title: { zh: '国际销售工程师', en: 'International Sales Engineer' },
    dept: { zh: '销售部', en: 'Sales' },
    location: { zh: '上海·安亭', en: 'Anting, Shanghai' },
    desc: {
      zh: '岗位职责：负责海外市场开拓与客户维护，参与技术方案沟通、报价与商务谈判，跟进项目签约与回款。\n任职要求：本科及以上，英语流利（可海外出差），了解光伏或汽车装备行业者优先，具备良好的沟通与抗压能力。',
      en: 'Responsibilities: Develop overseas markets and maintain client relationships, join technical discussions, quotations and negotiations, and follow up on contracts and payments.\nRequirements: Bachelor degree or above; fluent English and willing to travel abroad; PV or automotive equipment industry knowledge preferred; strong communication skills.',
    },
  },
]

export const jobs = reactive(cloneData(jobsSeed))

// 福利(占位)
export const welfares = [
  { icon: 'Opportunity', text: { zh: '导师制培养与清晰晋升通道', en: 'Mentorship program and clear promotion paths' } },
  { icon: 'Coin', text: { zh: '有竞争力的薪酬与项目奖励', en: 'Competitive salary and project bonuses' } },
  { icon: 'Umbrella', text: { zh: '五险一金与年度体检', en: 'Social insurance, housing fund and annual health check' } },
  { icon: 'AlarmClock', text: { zh: '带薪年假与弹性加班调休', en: 'Paid annual leave and flexible compensatory leave' } },
  { icon: 'Reading', text: { zh: '技术培训与海外项目机会', en: 'Technical training and overseas project opportunities' } },
  { icon: 'Watermelon', text: { zh: '工作餐补、团建与节日福利', en: 'Meal allowance, team events and holiday perks' } },
]

// 合作伙伴(logo 图片来自官网 www.yinkaish.com 首页合作伙伴区)
export const partnersSeed = [
  { id: 'xinbo', image: partnerImgs.p1, name: { zh: '鑫铂股份', en: 'Xinbo Co.' } },
  { id: 'jinkosolar', image: partnerImgs.p2, name: { zh: '晶科能源', en: 'JinkoSolar' } },
  { id: 'deyilong', image: partnerImgs.p3, name: { zh: '德毅隆', en: 'Deyilong' } },
  { id: 'cirs', image: partnerImgs.p4, name: { zh: 'CIRS', en: 'CIRS' } },
  { id: 'hongsheng', image: partnerImgs.p5, name: { zh: '鸿盛', en: 'Hongsheng' } },
  { id: 'jinkopower', image: partnerImgs.p6, name: { zh: '晶科科技', en: 'JinkoPower' } },
  { id: 'kejing', image: partnerImgs.p7, name: { zh: '合肥科晶', en: 'Hefei Kejing' } },
  { id: 'akcome', image: partnerImgs.p8, name: { zh: '爱康集团', en: 'AKCOME Group' } },
  { id: 'ysmetal', image: partnerImgs.p9, name: { zh: '源盛金属', en: 'YuanSheng Metal' } },
  { id: 'yuansheng', image: partnerImgs.p10, name: { zh: '源盛', en: 'Yuansheng' } },
  { id: 'krant', image: partnerImgs.p11, name: { zh: '科蓝特', en: 'Krant' } },
  { id: 'freemt', image: partnerImgs.p12, name: { zh: '复睿金属', en: 'FreeMt Metal' } },
  { id: 'yuejia', image: partnerImgs.p13, name: { zh: '江苏月嘉金属', en: 'Jiangsu Yuejia Metal' } },
  { id: 'shengxin', image: partnerImgs.p14, name: { zh: '生信', en: 'Shengxin' } },
  { id: 'gaoling', image: partnerImgs.p15, name: { zh: '高瓴新材料', en: 'Gaoling New Materials' } },
  { id: 'aina', image: partnerImgs.p16, name: { zh: '艾纳新能源', en: 'Aina New Energy' } },
  { id: 'partner17', image: partnerImgs.p17, name: { zh: '合作伙伴', en: 'Partner' } },
  { id: 'arctech', image: partnerImgs.p18, name: { zh: '中信博', en: 'Arctech' } },
  { id: 'pingmei', image: partnerImgs.p19, name: { zh: '平煤隆基', en: 'Pingmei Longji' } },
  { id: 'chuangjia', image: partnerImgs.p20, name: { zh: '创佳型材', en: 'Chuangjia' } },
]

export const partners = reactive(cloneData(partnersSeed))
