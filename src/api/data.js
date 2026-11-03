// 启动时尝试从后端 API 拉取动态内容并原位替换 src/data 中的 reactive 数组;
// 任一接口失败(无后端/超时)则保持静态兜底数据,官网功能不受影响
import {
  news, jobs, productCategories, productParams, honors, partners,
  newsSeed, jobsSeed, honorsSeed, partnersSeed, productCategoriesSeed, productParamsSeed,
} from '../data'
import { productBanners, partnerLogos, honorImages, ol2iGalleryByName, resolveImage } from '../data/assets'

const TIMEOUT_MS = 2500

async function getJSON(path) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(path, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

// 原位替换 reactive 数组内容(保持引用不变,已渲染的 computed 会响应更新)
function replaceList(list, items) {
  list.splice(0, list.length, ...items)
}

// 库/接口仅存中文({zh}),静态种子保留了同一批内容的英文翻译:
// 水合时按业务键把种子里的 en 字段补回 API 行,英文界面不回退中文;
// 管理端新增、或库内容已改而种子未同步的行匹配不到种子,保持 {zh} 由 pick() 回退中文
function withEn(row, seed) {
  if (!seed) return row
  const out = { ...row }
  for (const [k, v] of Object.entries(seed)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && v.en && out[k] && typeof out[k] === 'object') {
      out[k] = { ...out[k], en: v.en }
    }
  }
  return out
}

// 数据库图片列存文件名(素材)或 /uploads 路径(后端上传),这里解析为可显示 URL
const productImage = (name) => resolveImage(name, productBanners)
const galleryImages = (names) =>
  Array.isArray(names) && names.length ? names.map((n) => resolveImage(n, ol2iGalleryByName)).filter(Boolean) : undefined

export async function hydrateNews() {
  const { news: rows } = await getJSON('/api/news')
  const seedById = new Map(newsSeed.map((n) => [String(n.id), n]))
  replaceList(news, rows.map((r) => withEn(r, seedById.get(String(r.id)))))
}

export async function hydrateJobs() {
  const { jobs: rows } = await getJSON('/api/jobs')
  const seedById = new Map(jobsSeed.map((j) => [String(j.id), j]))
  replaceList(jobs, rows.map((r) => withEn(r, seedById.get(String(r.id)))))
}

export async function hydrateProducts() {
  const { categories } = await getJSON('/api/products')
  const catSeed = new Map(productCategoriesSeed.map((c) => [c.id, c]))
  const prodSeed = new Map(productCategoriesSeed.flatMap((c) => c.products.map((p) => [p.model, p])))
  // 参数种子键为去连字符型号(与静态表一致),行内按中文 label 定位
  const paramsSeedByModel = (model) =>
    new Map((productParamsSeed[model] || productParamsSeed[model.replaceAll('-', '')] || []).map((r) => [r.label.zh, r]))
  replaceList(
    productCategories,
    categories.map((c) =>
      withEn(
        {
          id: c.id,
          name: c.name,
          desc: c.desc,
          products: c.products.map((p) =>
            withEn(
              {
                model: p.model,
                tag: p.tag,
                image: productImage(p.image),
                images: galleryImages(p.gallery),
                desc: p.desc,
                // API 不提供视频,由静态种子按型号透传,防止 replaceList 丢弃(ERR-019 同类)
                videos: prodSeed.get(p.model)?.videos,
              },
              prodSeed.get(p.model)
            )
          ),
        },
        catSeed.get(c.id)
      )
    )
  )
  // 参数表按型号重建,同时提供去连字符键(Services 页两种取法都兼容)
  const next = {}
  for (const c of categories) {
    for (const p of c.products) {
      const enRows = paramsSeedByModel(p.model)
      const rows = (p.params || []).map((r) => withEn(r, enRows.get(r.label?.zh)))
      next[p.model] = rows
      next[p.model.replaceAll('-', '')] = rows
    }
  }
  Object.keys(productParams).forEach((k) => delete productParams[k])
  Object.assign(productParams, next)
}

export async function hydrateHonors() {
  const { honors: rows } = await getJSON('/api/honors')
  // 荣誉接口无 id,以中文名作为种子匹配键
  const seedByName = new Map(honorsSeed.map((h) => [h.name.zh, h]))
  replaceList(
    honors,
    rows.map((r) => withEn({ ...r, image: resolveImage(r.image, honorImages) }, seedByName.get(r.name?.zh)))
  )
}

export async function hydratePartners() {
  const { partners: rows } = await getJSON('/api/partners')
  const seedBySlug = new Map(partnersSeed.map((p) => [p.id, p]))
  replaceList(
    partners,
    rows.map((r) => withEn({ ...r, image: resolveImage(r.image, partnerLogos) }, seedBySlug.get(r.id)))
  )
}

// 汇总水合;静默失败(纯静态部署属预期)
export function hydrateAll() {
  const tasks = [
    ['news', hydrateNews],
    ['jobs', hydrateJobs],
    ['products', hydrateProducts],
    ['honors', hydrateHonors],
    ['partners', hydratePartners],
  ]
  for (const [name, fn] of tasks) {
    fn().catch((err) => console.info(`[data] ${name} 使用静态兜底数据(${err.message})`))
  }
}
