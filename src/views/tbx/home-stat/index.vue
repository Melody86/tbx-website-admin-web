<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="标题" prop="label">
        <el-input
          v-model="queryParams.label"
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
          v-hasPermi="['system:homeStat:add']"
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
          v-hasPermi="['system:homeStat:remove']"
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
      <el-table-column label="图标" align="center" prop="icon" />
      <el-table-column label="数值" align="center" prop="value" />
      <el-table-column label="标题" align="center" prop="label" />
      <el-table-column
        label="描述"
        align="center"
        prop="description"
        show-overflow-tooltip
      />
      <el-table-column label="排序" align="center" prop="sortOrder" />
      <el-table-column label="是否启用" align="center" prop="isActive">
        <template #default="scope">
          <span>{{ scope.row.isActive === '1' ? '启用' : '停用' }}</span>
        </template>
      </el-table-column>
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
            v-hasPermi="['system:homeStat:edit']"
          >
            修改
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(row)"
            v-hasPermi="['system:homeStat:remove']"
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
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标标识" />
        </el-form-item>
        <el-form-item label="数值" prop="value">
          <el-input v-model="form.value" placeholder="例如 7000万+" />
        </el-form-item>
        <el-form-item label="标题" prop="label">
          <el-input v-model="form.label" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
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

<script setup name="homeStat">
import { getCurrentInstance, ref } from 'vue'
import {
  listhomeStat,
  gethomeStat,
  addhomeStat,
  updatehomeStat,
  delhomeStat,
} from '@/api/tbx/home-stat'

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
  label: undefined,
  isActive: undefined,
})

const form = ref({
  id: undefined,
  icon: '',
  value: '',
  label: '',
  description: '',
  sortOrder: 0,
  isActive: '1',
})

const rules = {
  icon: [{ required: true, message: '图标不能为空', trigger: 'blur' }],
  value: [{ required: true, message: '数值不能为空', trigger: 'blur' }],
  label: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
}

const getList = () => {
  loading.value = true
  listhomeStat(queryParams.value).then(({ data }) => {
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
    icon: '',
    value: '',
    label: '',
    description: '',
    sortOrder: 0,
    isActive: '1',
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
  dialogTitle.value = '新增核心数据'
  open.value = true
}

const handleUpdate = row => {
  resetFormData()
  const id = row.id
  gethomeStat(id).then(res => {
    form.value = { ...form.value, ...(res.data || res) }
    dialogTitle.value = '修改核心数据'
    open.value = true
  })
}

const submitForm = () => {
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (!valid) return
    if (form.value.id) {
      updatehomeStat(form.value).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        open.value = false
        getList()
      })
    } else {
      addhomeStat(form.value).then(() => {
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
  const statIds = row && row.id ? [row.id] : ids.value
  if (!statIds.length) return
  proxy.$modal
    .confirm(`是否确认删除编号为"${statIds.join(',')}"的数据项?`)
    .then(() => delhomeStat(statIds.join(',')))
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

