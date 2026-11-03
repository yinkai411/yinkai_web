<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="section-title">{{ $t('services.title') }}</h1>
        <p class="section-subtitle">{{ $t('services.subtitle') }}</p>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container svc-layout">
        <!-- 左侧:产品列表栏(桌面常开,手机手风琴) -->
        <aside class="svc-side">
          <div v-for="cat in productCategories" :key="cat.id" class="svc-group" :class="{ 'svc-group--open': isCatOpen(cat.id) }">
            <button class="svc-group__head" type="button" @click="toggleCat(cat.id)">
              <span>{{ pick(cat.name, locale) }}</span>
              <span class="svc-group__count">{{ cat.products.length }}</span>
            </button>
            <ul class="svc-group__list">
              <li v-for="prod in cat.products" :key="prod.model">
                <button
                  class="svc-item"
                  :class="{ 'svc-item--active': selected.model === prod.model }"
                  type="button"
                  @click="select(cat, prod)"
                >
                  <span class="svc-item__model">{{ prod.model }}</span>
                  <span class="svc-item__tag">{{ pick(prod.tag, locale) }}</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- 右侧:产品详情(大图 + 简介 + 参数表格) -->
        <div class="svc-detail">
          <div class="detail-fig" @mouseenter="figHover = true" @mouseleave="figHover = false">
            <img :src="currentImages[figIdx]" :alt="selectedProd.model" />
            <template v-if="currentImages.length > 1">
              <button class="fig-arrow fig-arrow--left" type="button" aria-label="previous" @click="stepFig(-1)">‹</button>
              <button class="fig-arrow fig-arrow--right" type="button" aria-label="next" @click="stepFig(1)">›</button>
              <span class="fig-counter">{{ figIdx + 1 }} / {{ currentImages.length }}</span>
            </template>
          </div>
          <div class="detail-head">
            <span class="detail-cat">{{ pick(selectedCat.name, locale) }}</span>
            <div class="detail-title-row">
              <h2>{{ selectedProd.model }}</h2>
              <span class="detail-tag">{{ pick(selectedProd.tag, locale) }}</span>
            </div>
            <p class="detail-desc">{{ pick(selectedProd.desc, locale) }}</p>
          </div>

          <!-- 设备视频:jsDelivr CDN 直链,多段时序号切换;preload=metadata 点开才加载 -->
          <div v-if="videos.length" class="detail-video">
            <div class="detail-video__head">
              <span>{{ $t('services.videoTitle') }}</span>
              <div v-if="videos.length > 1" class="detail-video__tabs">
                <button
                  v-for="(_, i) in videos"
                  :key="i"
                  type="button"
                  class="detail-video__tab"
                  :class="{ 'is-active': i === videoIdx }"
                  @click="videoIdx = i"
                >{{ i + 1 }}</button>
              </div>
            </div>
            <!-- 多源链:jsDelivr 失败(如超 20MB 403/CDN 波动)时浏览器自动回退下一个 source(raw) -->
            <video
              :key="`${selectedProd.model}-${videoIdx}`"
              class="detail-video__player"
              controls
              preload="metadata"
            >
              <source v-for="(s, i) in videos[videoIdx]" :key="i" :src="s" type="video/mp4" />
            </video>
          </div>

          <div class="detail-params">
            <div class="params-head">
              <span>{{ $t('services.paramsTitle') }}</span>
              <span class="params-head__en">EQUIPMENT PARAMETERS</span>
            </div>
            <table class="params-table">
              <tbody>
                <tr v-for="(row, i) in currentParams" :key="i">
                  <th>{{ pick(row.label, locale) }}</th>
                  <td>{{ pick(row.value, locale) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container cta-band__inner">
        <div class="cta-band__text">
          <h2>{{ $t('services.ctaTitle') }}</h2>
          <p>{{ $t('services.ctaDesc') }}</p>
          <el-button type="primary" size="large" round @click="$router.push('/contact')">
            {{ $t('services.ctaBtn') }}
          </el-button>
        </div>
        <cta-visual class="cta-band__visual" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { productCategories, productParams } from '../data'
import { pick } from '../data/lang'
import CtaVisual from '../components/CtaVisual.vue'

const { locale } = useI18n()

const selected = ref({ catId: productCategories[0].id, model: productCategories[0].products[0].model })
// 手机手风琴:默认展开选中分类,桌面端该状态无效果(样式常开)
const openCat = ref(productCategories[0].id)

const selectedCat = computed(() => productCategories.find((c) => c.id === selected.value.catId))
const selectedProd = computed(() => selectedCat.value.products.find((x) => x.model === selected.value.model))
const currentParams = computed(() => productParams[selectedProd.value.model.replaceAll('-', '')] ?? productParams[selectedProd.value.model] ?? [])

/* 详情图查看器:多图按序单张显示,3.5s 自动轮播,无缩略图 */
const figIdx = ref(0)
const currentImages = computed(() => (selectedProd.value.images?.length ? selectedProd.value.images : [selectedProd.value.image]))
const stepFig = (d) => {
  figIdx.value = (figIdx.value + d + currentImages.value.length) % currentImages.value.length
  restartFigTimer()
}

/* 设备视频:多段时序号切换,:key 重建 video 元素强制换源 */
const videoIdx = ref(0)
const videos = computed(() => selectedProd.value.videos ?? [])

const select = (cat, prod) => {
  selected.value = { catId: cat.id, model: prod.model }
  openCat.value = cat.id
}
const toggleCat = (id) => {
  openCat.value = openCat.value === id ? '' : id
}
const isCatOpen = (id) => openCat.value === id

let figTimer = null
const figHover = ref(false)
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const startFigTimer = () => {
  clearInterval(figTimer)
  if (prefersReducedMotion() || currentImages.value.length < 2) return
  figTimer = setInterval(() => {
    // 悬停图片时暂停自动切换,移开后恢复
    if (document.hidden || figHover.value) return
    stepFig(1)
  }, 3500)
}
watch(selectedProd, () => {
  figIdx.value = 0
  videoIdx.value = 0
  startFigTimer()
})
onMounted(() => {
  if (currentImages.value.length > 1) startFigTimer()
})
onBeforeUnmount(() => clearInterval(figTimer))
</script>

<style scoped>
.svc-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 36px;
  align-items: start;
}

/* ---------- 左侧列表栏 ---------- */
.svc-side {
  position: sticky;
  top: 108px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.svc-group {
  background: #fff;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.svc-group__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 13px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--c-text);
  text-align: left;
}

/* 分类名单行显示 */
.svc-group__head > span:first-child {
  white-space: nowrap;
}

.svc-group__count {
  flex: none;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--c-primary);
  background: var(--c-primary-light);
  border-radius: 999px;
  padding: 1px 9px;
}

.svc-group__list {
  display: none;
  flex-direction: column;
  padding: 0 8px 8px;
}

.svc-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  color: var(--c-text-secondary);
  transition: background 0.15s, color 0.15s;
}

.svc-item:hover {
  background: var(--c-bg-soft);
  color: var(--c-primary);
}

.svc-item--active {
  background: var(--c-primary-light);
  color: var(--c-primary);
  font-weight: 700;
}

.svc-item__model {
  font-size: 0.9375rem;
}

.svc-item__tag {
  font-size: 0.75rem;
  white-space: nowrap;
}

/* ---------- 右侧详情 ---------- */
.svc-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.detail-fig {
  position: relative;
  background: #fff;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.detail-fig img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: contain;
  padding: 28px;
  display: block;
}

/* 多图查看器:左右箭头 + 计数 */
.fig-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s;
}

.fig-arrow:hover {
  background: rgba(0, 0, 0, 0.55);
}

.fig-arrow--left {
  left: 14px;
}

.fig-arrow--right {
  right: 14px;
}

.fig-counter {
  position: absolute;
  right: 16px;
  bottom: 12px;
  font-size: 0.8125rem;
  color: var(--c-text-secondary);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  padding: 2px 12px;
}

.detail-fig img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: contain;
  padding: 28px;
  display: block;
}

.detail-head {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-cat {
  align-self: flex-start;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--c-primary);
  background: var(--c-primary-light);
  border-radius: 999px;
  padding: 3px 14px;
}

.detail-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.detail-title-row h2 {
  font-size: clamp(24px, 2.4vw, 32px);
  color: var(--c-primary);
  letter-spacing: 1px;
}

.detail-tag {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-primary);
  border: 1px solid var(--c-primary);
  border-radius: 999px;
  padding: 3px 14px;
}

.detail-desc {
  color: var(--c-text-secondary);
  line-height: 1.8;
}

/* ---------- 设备视频 ---------- */
.detail-video__head {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(90deg, var(--c-primary-dark), var(--c-primary));
  color: #fff;
  border-radius: var(--radius) var(--radius) 0 0;
  padding: 12px 18px;
  font-size: 1.0625rem;
  font-weight: 700;
}

.detail-video__tabs {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.detail-video__tab {
  min-width: 28px;
  height: 24px;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 999px;
  background: transparent;
  color: #fff;
  font-size: 0.8125rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.detail-video__tab:hover {
  background: rgba(255, 255, 255, 0.18);
}

.detail-video__tab.is-active {
  background: #fff;
  border-color: #fff;
  color: var(--c-primary-dark);
  font-weight: 700;
}

.detail-video__player {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border: 1px solid var(--c-border);
  border-top: none;
  border-radius: 0 0 var(--radius) var(--radius);
}

/* ---------- 参数表格 ---------- */
.params-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  background: linear-gradient(90deg, var(--c-primary-dark), var(--c-primary));
  color: #fff;
  border-radius: var(--radius) var(--radius) 0 0;
  padding: 12px 18px;
  font-size: 1.0625rem;
  font-weight: 700;
}

.params-head__en {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.75;
  letter-spacing: 1px;
}

.params-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid var(--c-border);
  border-top: none;
  border-radius: 0 0 var(--radius) var(--radius);
  overflow: hidden;
}

.params-table th,
.params-table td {
  padding: 10px 18px;
  font-size: 0.875rem;
  text-align: left;
}

.params-table tr:nth-child(odd) {
  background: var(--c-bg-soft);
}

.params-table th {
  width: 42%;
  font-weight: 600;
  color: var(--c-text);
}

.params-table td {
  color: var(--c-text-secondary);
}

/* ---------- 底部咨询横带(无背景) ---------- */
.cta-band {
  background: var(--c-bg-soft);
  padding: clamp(48px, 6vw, 80px) 0;
  overflow: hidden;
}

.cta-band__inner {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(28px, 4vw, 64px);
  align-items: center;
}

.cta-band__text h2 {
  font-size: clamp(24px, 2.6vw, 34px);
  color: var(--c-text);
  margin-bottom: 14px;
}

.cta-band__text p {
  max-width: 480px;
  margin-bottom: 26px;
  color: var(--c-text-secondary);
  line-height: 1.9;
}

/* 右侧圆角块+光伏动画见 components/CtaVisual.vue;此处仅保留 ≤1024 顺序 */

@media (max-width: 1024px) {
  .cta-band__inner {
    grid-template-columns: 1fr;
  }

  .cta-band__visual {
    order: -1;
  }
}

/* ---------- 手风琴(≤768px):分类可折叠,列表在上 ---------- */
@media (max-width: 768px) {
  .svc-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .svc-side {
    position: static;
  }

  .svc-group--open .svc-group__list {
    display: flex;
  }
}

/* ---------- 平板收窄 ---------- */
@media (min-width: 769px) and (max-width: 1024px) {
  .svc-layout {
    grid-template-columns: 285px 1fr; /* 保证最长分类名单行显示 */
    gap: 24px;
  }
}

/* 桌面端列表常开 */
@media (min-width: 769px) {
  .svc-group__list {
    display: flex;
  }
}
</style>
