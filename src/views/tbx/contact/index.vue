<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="ID" align="center" prop="id" width="80" />
      <el-table-column label="姓名" align="center" prop="name" min-width="100" show-overflow-tooltip />
      <el-table-column label="联系电话" align="center" prop="phone" min-width="120" />
      <el-table-column label="邮箱" align="center" prop="email" min-width="140" show-overflow-tooltip />
      <el-table-column label="留言内容" align="center" prop="content" min-width="200" show-overflow-tooltip />
      <el-table-column label="提交时间" align="center" prop="createTime" width="170" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="140">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            icon="View"
            @click="handleDetail(row)"
            v-hasPermi="['system:contact:query']"
            >查看</el-button
          >
          <el-button
            link
            type="danger"
            icon="Delete"
            @click="handleDelete(row)"
            v-hasPermi="['system:contact:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog v-model="detailVisible" title="留言详情" width="560px" append-to-body>
      <el-descriptions :column="1" border v-if="detailRow">
        <el-descriptions-item label="姓名">{{ detailRow.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailRow.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ detailRow.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ detailRow.createTime }}</el-descriptions-item>
        <el-descriptions-item label="留言内容">
          <div class="whitespace-pre-wrap">{{ detailRow.content }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="contact">
import { listContact, getContact, delContact } from '@/api/tbx/contact'
import { getCurrentInstance, ref } from 'vue'

const { proxy } = getCurrentInstance()

const loading = ref(true)
const total = ref(0)
const dataList = ref([])
const queryRef = ref(null)
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  name: undefined,
  phone: undefined,
})

const detailVisible = ref(false)
const detailRow = ref(null)

const getList = () => {
  loading.value = true
  listContact(queryParams.value).then((res) => {
    const d = res.data || res
    dataList.value = d.list ?? []
    total.value = d.total ?? 0
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

const handleDetail = (row) => {
  detailRow.value = { ...row }
  detailVisible.value = true
}

const handleDelete = (row) => {
  proxy.$modal
    .confirm('是否确认删除该条留言？')
    .then(() => delContact(row.id))
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

getList()
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
