<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>官网配置</span>
          <el-button
            type="primary"
            size="small"
            icon="Refresh"
            @click="loadSettings"
            v-hasPermi="['system:setting:list']"
          >
            刷新
          </el-button>
        </div>
      </template>

      <el-form ref="formRef" :model="form" label-width="140px" v-loading="loading">
        <el-form-item label="首页关于标题">
          <el-input
            v-model="homeAboutTitle"
            placeholder="请输入首页关于区块标题，如“关于土八鲜”"
          />
        </el-form-item>

        <el-form-item label="首页关于内容">
          <!-- 使用富文本编辑器，支持段落、加粗、图片等 -->
          <Editor v-model="homeAboutContent" :minHeight="220" />
          <div style="font-size: 12px; color: #999; margin-top: 4px">
            支持富文本，保存时会自动兼容生成原有 paragraphs 字段
          </div>
        </el-form-item>

        <el-form-item label="首页视频地址" prop="home_video">
          <el-input
            v-model="form.home_video"
            placeholder="例如 /info.mp4 或完整 URL"
          />
        </el-form-item>

        <el-form-item label="公司介绍" prop="company_about">
          <el-input
            v-model="form.company_about"
            type="textarea"
            :rows="6"
            placeholder="请输入公司介绍"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit"
            v-hasPermi="['system:setting:edit']"
          >
            保存配置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup name="setting" lang="ts">
import { getCurrentInstance, ref } from 'vue'
import { getsetting, updatesetting } from '@/api/tbx/setting'

const { proxy } = getCurrentInstance()

const loading = ref(false)
const formRef = ref(null)

// 其他简单文本配置
const form = ref({
  home_video: '',
  company_about: '',
})

// 首页关于区块：标题 + 富文本内容（内部仍存为 JSON 字符串，兼容 paragraphs）
const homeAboutTitle = ref('')
const homeAboutContent = ref('')

// 记录各 key 对应的 Setting 实体（包含 id）
const settingMap = ref<Record<string, any>>({})

const parseHomeAbout = (raw: string | null | undefined) => {
  if (!raw) {
    homeAboutTitle.value = ''
    homeAboutContent.value = ''
    return
  }
  try {
    const obj = JSON.parse(raw)
    if (obj && typeof obj === 'object') {
      homeAboutTitle.value = obj.title || ''
      if (obj.content) {
        homeAboutContent.value = obj.content
      } else if (Array.isArray(obj.paragraphs)) {
        // 兼容旧数据：段落数组转为简单的 <p> 段落
        homeAboutContent.value = obj.paragraphs.map((p: string) => `<p>${p}</p>`).join('')
      } else {
        homeAboutContent.value = ''
      }
      return
    }
  } catch (e) {
    // 非 JSON，按纯文本处理
  }
  // 兜底：原始字符串作为正文内容
  homeAboutTitle.value = ''
  homeAboutContent.value = String(raw)
}

const loadOne = async (key: string) => {
  try {
    const res = await getsetting(key)
    const data = (res && res.data) || res
    if (data && Object.prototype.hasOwnProperty.call(data, 'value')) {
      settingMap.value[key] = data
      if (key === 'home_about') {
        parseHomeAbout(data.value)
      } else if (Object.prototype.hasOwnProperty.call(form.value, key)) {
        // 仅将已在 form 中声明的字段写入，避免意外覆盖
        form.value[key] = data.value
      }
    }
  } catch (e) {
    // ignore not found
  }
}

const loadSettings = async () => {
  loading.value = true
  settingMap.value = {}
  await Promise.all([
    loadOne('home_about'),
    loadOne('home_video'),
    loadOne('company_about'),
  ])
  loading.value = false
}

const buildHomeAboutValue = () => {
  const title = homeAboutTitle.value || '关于土八鲜'
  const content = homeAboutContent.value || ''

  // 从富文本中尽量提取纯文本段落，兼容旧的 paragraphs 字段
  const text = content
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
  const paragraphs = text
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)

  return JSON.stringify({
    title,
    content,
    paragraphs,
  })
}

const handleSubmit = async () => {
  const payloads: any[] = []

  // home_about：标题 + 富文本内容，序列化为 JSON，兼容旧结构
  const homeEntity = settingMap.value['home_about']
  if (homeEntity && homeEntity.id) {
    payloads.push({
      id: homeEntity.id,
      key: 'home_about',
      value: buildHomeAboutValue(),
      description: homeEntity.description,
    })
  }

  // 其他简单文本配置保持原有结构
  ;['home_video', 'company_about'].forEach(key => {
    const entity = settingMap.value[key]
    if (entity && entity.id) {
      payloads.push({
        id: entity.id,
        key,
        value: form.value[key],
        description: entity.description,
      })
    }
  })

  if (!payloads.length) {
    proxy.$modal.msgWarning('暂无可更新的配置项')
    return
  }

  try {
    await Promise.all(payloads.map(item => updatesetting(item)))
    proxy.$modal.msgSuccess('保存成功')
    loadSettings()
  } catch (e) {
    // ignore
  }
}

loadSettings()
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

