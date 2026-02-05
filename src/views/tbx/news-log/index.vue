<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="类型" prop="targetType">
        <el-select v-model="queryParams.targetType" placeholder="全部" clearable>
          <el-option label="文章" value="content" />
          <el-option label="产品" value="product" />
        </el-select>
      </el-form-item>
      <el-form-item label="目标ID" prop="targetId">
        <el-input
          v-model="queryParams.targetId"
          placeholder="文章/产品ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="peopleId">
        <el-input
          v-model="queryParams.peopleId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="浏览ip" prop="hlIp">
        <el-input
          v-model="queryParams.hlIp"
          placeholder="请输入浏览ip"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="是否为移动端" prop="hlIsMobile">
        <el-input
          v-model="queryParams.hlIsMobile"
          placeholder="请输入是否为移动端"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="修改时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeUpdateDate"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="创建时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeCreateDate"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="删除标记" prop="del">
        <el-input
          v-model="queryParams.del"
          placeholder="请输入删除标记"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:log:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:log:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-alert type="info" :closable="false" class="mb8">
      访问记录仅由门户访问文章/产品时自动产生，不支持新增与修改。
    </el-alert>
    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="id" align="center" prop="id" width="80" />
      <el-table-column label="类型" align="center" prop="targetType" width="80">
        <template #default="{ row }">{{ row.targetType === 'product' ? '产品' : '文章' }}</template>
      </el-table-column>
      <el-table-column label="目标ID" align="center" prop="targetId" width="90" />
      <el-table-column label="标题/名称" align="center" prop="targetTitle" min-width="160" show-overflow-tooltip />
      <el-table-column label="用户id" align="center" prop="peopleId" width="90" />
      <el-table-column label="浏览ip" align="center" prop="hlIp" />
      <el-table-column label="移动端" align="center" prop="hlIsMobile" width="80" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="160" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
        <template v-slot="{ row }">
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(row)"
            v-hasPermi="['system:log:remove']"
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
  </div>
</template>

<script setup name="log">
import { listlog, dellog } from '@/api/tbx/news-log'
import { getCurrentInstance, ref } from 'vue'
const { proxy } = getCurrentInstance()

const showSearch = ref(true)
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  targetType: undefined,
  targetId: undefined,
})
const daterangeUpdateDate = ref([])
const daterangeCreateDate = ref([])
const loading = ref(true)
const total = ref(0)
const dataList = ref([])
const multiple = ref(false)
const queryRef = ref(null)
const queryHandler = () => {
  queryParams.value.pageNum = 1
  getList()
}
const getList = () => {
  loading.value = true
  listlog(queryParams.value).then((res) => {
    const d = res.data || res
    dataList.value = d.list ?? []
    total.value = d.total ?? 0
    loading.value = false
  })
}
const resetQuery = () => {
  proxy.resetForm('queryRef')
  queryHandler()
}
const handleDelete = row => {
  proxy.$modal
    .confirm('是否确认删除编号为"' + row.id + '"的数据项?')
    .then(function () {
      return dellog(row.id)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}
const handleExport = () => {
  proxy.download('system/log/export', { ...queryParams.value }, `log_${new Date().getTime()}.xlsx`)
}
getList()
</script>
