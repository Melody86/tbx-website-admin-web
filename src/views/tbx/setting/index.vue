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

      <el-form
        ref="formRef"
        :model="form"
        label-width="140px"
        v-loading="loading"
      >
        <el-form-item label="首页关于区块" prop="home_about">
          <el-input
            v-model="form.home_about"
            type="textarea"
            :rows="4"
            placeholder="请输入首页关于区块文案"
          />
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

const form = ref({
  home_about: '',
  home_video: '',
  company_about: '',
})

// 记录各 key 对应的 Setting 实体（包含 id）
const settingMap = ref<Record<string, any>>({})

const loadOne = async key => {
  try {
    const res = await getsetting(key)
    const data = res.data || res
    if (data && Object.prototype.hasOwnProperty.call(data, 'value')) {
      form.value[key] = data.value
      settingMap.value[key] = data
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

const handleSubmit = async () => {
  const payloads = []

  ;['home_about', 'home_video', 'company_about'].forEach(key => {
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

