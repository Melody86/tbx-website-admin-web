<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
      <el-form-item label="文章标题" prop="contentTitle">
        <el-input
          v-model="queryParams.contentTitle"
          placeholder="请输入文章标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="文章类型" prop="contentType">
        <el-select v-model="queryParams.contentType" placeholder="请选择文章类型" clearable>
          <el-option
            v-for="dict in tbx_news_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否上架" prop="contentDisplay">
        <el-select v-model="queryParams.contentDisplay" placeholder="请选择上下架状态" clearable>
          <el-option key="1" label="上架" value="1" />
          <el-option key="2" label="下架" value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="发布时间" style="width: 308px">
        <el-date-picker
          v-model="queryParams.contentDatetime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
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
          v-hasPermi="['system:content:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          @click="handleDelete"
          v-hasPermi="['system:content:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:content:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" width="55" align="center" prop="id" />
      <el-table-column label="文章标题" width="230" align="center" prop="contentTitle" />
      <el-table-column label="关键字" align="center" prop="contentKeyword" />
      <el-table-column
        label="描述"
        align="center"
        width="300"
        prop="contentDescription"
        show-overflow-tooltip
      />
      <el-table-column label="上下架状态" align="center" prop="contentDisplay">
        <template #default="scope">
          <span>{{ Number(scope.row.contentDisplay) === 1 ? '上架' : '下架' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章类型" align="center" prop="contentType">
        <template #default="scope">
          <dict-tag :options="tbx_news_type" :value="scope.row.contentType" />
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="contentDatetime" />
      <el-table-column label="点击次数" align="center" prop="contentHit" />
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-slot="{ row }">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(row)"
            v-hasPermi="['system:content:edit']"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(row)"
            v-hasPermi="['system:content:remove']"
            >删除</el-button
          >
          <el-button link type="primary" icon="View" @click="handleDetail(row)">详情</el-button>
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

    <DetailModal v-model="showDetailModal" :detailInfo="detailModalInfo" />
  </div>
</template>

<script setup name="news">
import { listcontent, delcontent } from '@/api/tbx/news-content'
import { getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'
import DetailModal from './detail-modal.vue'

const { proxy } = getCurrentInstance()
const { tbx_news_type } = proxy.useDict('tbx_news_type')
const router = useRouter()

const queryParams = ref({
  pageNum: 1,
  pageSize: 10
})
const loading = ref(true)
const showDetailModal = ref(false)
const detailModalInfo = ref(null)
const total = ref(0)
const dataList = ref([])
const queryRef = ref(null)

const queryHandler = () => {
  queryParams.value.pageNum = 1
  getList()
}

const getList = () => {
  loading.value = true
  const args = JSON.parse(JSON.stringify(queryParams.value))
  if (args.contentDatetime) {
    args.contentDatetimeStart = args.contentDatetime[0]
    args.contentDatetimeEnd = args.contentDatetime[1]
    delete args.contentDatetime
  }
  listcontent(args).then(({ data }) => {
    dataList.value = data.list
    total.value = data.total
    loading.value = false
  })
}

const handleQuery = () => {
  getList()
}
const resetQuery = () => {
  proxy.resetForm('queryRef')
  queryHandler()
}
const handleUpdate = row => {
  router.push(`/news/info-add?id=${row.id}`)
}
const handleAdd = () => {
  router.push(`/news/info-add`)
}
const handleDelete = row => {
  proxy.$modal
    .confirm('是否确认删除编号为"' + row.id + '"的数据项?')
    .then(function () {
      return delcontent(row.id)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}
const handleDetail = row => {
  showDetailModal.value = true
  detailModalInfo.value = row
}

const handleExport = () => {
  proxy.download(
    'tbx/content/export',
    { ...queryParams.value },
    `content_${new Date().getTime()}.xlsx`
  )
}
getList()
</script>
<style lang="scss" scoped>
.el-button + .el-button {
  margin: 0;
}
</style>
