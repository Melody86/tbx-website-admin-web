<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="isActive">
        <el-select
          v-model="queryParams.isActive"
          placeholder="请选择是否启用"
          clearable
        >
          <el-option label="启用" value="1" />
          <el-option label="停用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:homeBanner:add']"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:homeBanner:remove']"
        >
          删除
        </el-button>
      </el-col>
      <right-toolbar @queryTable="getList" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="dataList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="ID" width="60" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="类型" align="center" prop="type">
        <template #default="scope">
          <span>{{ scope.row.type === 'video' ? '视频' : '图片' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="图片地址"
        align="center"
        prop="imageUrl"
        show-overflow-tooltip
      />
      <el-table-column
        label="视频地址"
        align="center"
        prop="videoUrl"
        show-overflow-tooltip
      />
      <el-table-column
        label="链接"
        align="center"
        prop="linkUrl"
        show-overflow-tooltip
      />
      <el-table-column label="排序" align="center" prop="sortOrder" />
      <el-table-column label="是否启用" align="center" prop="isActive">
        <template #default="scope">
          <span>{{ scope.row.isActive === '1' ? '启用' : '停用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startAt" />
      <el-table-column label="结束时间" align="center" prop="endAt" />
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(row)"
            v-hasPermi="['system:homeBanner:edit']"
          >
            修改
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(row)"
            v-hasPermi="['system:homeBanner:remove']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page="queryParams.pageNum"
      :limit="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog
      :title="dialogTitle"
      v-model="open"
      width="600px"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="image">图片</el-radio>
            <el-radio label="video">视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="图片上传"
          prop="imageUrl"
          v-if="form.type === 'image'"
        >
          <ImageUpload
            v-model="form.imageUrl"
            :modelValue="form.imageUrl"
            :limit="1"
            :fileSize="10"
            :fileType="['png', 'jpg', 'jpeg', 'gif', 'webp']"
          />
          <div class="el-upload__tip" style="margin-top: 4px; color: #909399;">
            支持 png/jpg/jpeg/gif/webp，超过 1MB 将自动压缩
          </div>
        </el-form-item>
        <el-form-item
          label="视频上传"
          prop="videoUrl"
          v-if="form.type === 'video'"
        >
          <FileUpload
            v-model="form.videoUrl"
            :modelValue="form.videoUrl"
            :limit="1"
            :fileSize="500"
            :fileType="['mp4', 'webm', 'mov']"
          />
          <div class="el-upload__tip" style="margin-top: 4px; color: #909399;">
            支持 mp4/webm/mov，单个视频不超过 500MB（可在配置中修改 videoMaxSizeMB）
          </div>
        </el-form-item>
        <el-form-item label="链接地址" prop="linkUrl">
          <el-input v-model="form.linkUrl" placeholder="请输入跳转链接" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number
            v-model="form.sortOrder"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="isActive">
          <el-switch
            v-model="form.isActive"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startAt">
          <el-date-picker
            v-model="form.startAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endAt">
          <el-date-picker
            v-model="form.endAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择结束时间"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="homeBanner">
import { getCurrentInstance, ref } from 'vue'
import {
  listhomeBanner,
  gethomeBanner,
  addhomeBanner,
  updatehomeBanner,
  delhomeBanner,
} from '@/api/tbx/home-banner'
import ImageUpload from '@/components/ImageUpload'
import FileUpload from '@/components/FileUpload'

const { proxy } = getCurrentInstance()

const loading = ref(false)
const total = ref(0)
const dataList = ref([])
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const open = ref(false)
const dialogTitle = ref('')

const queryRef = ref(null)
const formRef = ref(null)

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  title: undefined,
  isActive: undefined,
})

const form = ref({
  id: undefined,
  type: 'image',
  title: '',
  description: '',
  imageUrl: '',
  videoUrl: '',
  linkUrl: '',
  sortOrder: 0,
  isActive: '1',
  startAt: undefined,
  endAt: undefined,
})

const rules = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
}

const getList = () => {
  loading.value = true
  listhomeBanner(queryParams.value).then(({ data }) => {
    dataList.value = data.list || data
    total.value = data.total || 0
    loading.value = false
  })
}

const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

const resetQuery = () => {
  proxy.resetForm('queryRef')
  handleQuery()
}

const resetFormData = () => {
  form.value = {
    id: undefined,
    type: 'image',
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    linkUrl: '',
    sortOrder: 0,
    isActive: '1',
    startAt: undefined,
    endAt: undefined,
  }
  if (formRef.value) {
    proxy.resetForm('formRef')
  }
}

const handleSelectionChange = selection => {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

const handleAdd = () => {
  resetFormData()
  dialogTitle.value = '新增首页轮播图'
  open.value = true
}

const handleUpdate = row => {
  resetFormData()
  const id = row.id
  gethomeBanner(id).then(res => {
    form.value = { ...form.value, ...(res.data || res) }
    dialogTitle.value = '修改首页轮播图'
    open.value = true
  })
}

const submitForm = () => {
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (!valid) return
    if (form.value.id) {
      updatehomeBanner(form.value).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        open.value = false
        getList()
      })
    } else {
      addhomeBanner(form.value).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        open.value = false
        getList()
      })
    }
  })
}

const cancel = () => {
  open.value = false
}

const handleDelete = row => {
  const bannerIds = row && row.id ? [row.id] : ids.value
  if (!bannerIds.length) return
  proxy.$modal
    .confirm(`是否确认删除编号为"${bannerIds.join(',')}"的数据项?`)
    .then(() => delhomeBanner(bannerIds.join(',')))
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

getList()
</script>

<style scoped lang="scss">
.el-button + .el-button {
  margin: 0;
}
</style>

