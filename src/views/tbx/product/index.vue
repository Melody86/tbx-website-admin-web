<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
      <el-form-item label="产品分类" prop="category">
        <el-input
          v-model="queryParams.category"
          placeholder="请输入产品分类"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="单位" prop="unit">
        <el-input
          v-model="queryParams.unit"
          placeholder="请输入单位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="型号" prop="model">
        <el-input
          v-model="queryParams.model"
          placeholder="请输入型号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="重量" prop="weight">
        <el-input
          v-model="queryParams.weight"
          placeholder="请输入重量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="单价" prop="unitprice">
        <el-input
          v-model="queryParams.unitprice"
          placeholder="请输入单价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="市场价" prop="marketprice">
        <el-input
          v-model="queryParams.marketprice"
          placeholder="请输入市场价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="售价" prop="saleprice">
        <el-input
          v-model="queryParams.saleprice"
          placeholder="请输入售价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="产品名称" prop="productname">
        <el-input
          v-model="queryParams.productname"
          placeholder="请输入产品名称"
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:product:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          @click="handleDelete"
          v-hasPermi="['system:product:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:product:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="id" width="45" align="center" prop="id" />
      <el-table-column label="产品名称" align="center" prop="productname" />
      <el-table-column label="产品分类" align="center" prop="category">
        <template #default="scope">
          <dict-tag :options="tbx_product_category" :value="scope.row.category" />
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="型号" align="center" prop="model" />
      <el-table-column label="重量" align="center" prop="weight" />
      <el-table-column label="单价" align="center" prop="unitprice" />
      <el-table-column label="市场价" align="center" prop="marketprice" />
      <el-table-column label="售价" align="center" prop="saleprice" />
      <el-table-column label="是否上架" align="center" prop="display">
        <template #default="scope">
          <span>{{ scope.row.display === '1' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
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
            icon="Delete"
            @click="handleDelete(row)"
            v-hasPermi="['system:product:remove']"
            >删除</el-button
          >
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(row)"
            v-hasPermi="['system:product:edit']"
            >修改</el-button
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

<script setup name="product">
import { listproduct, delproduct } from '@/api/tbx/product'
import { getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'
import DetailModal from './detail-modal.vue'

const { proxy } = getCurrentInstance()
const { tbx_product_category } = proxy.useDict('tbx_product_category')
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
const multipleSelection = ref([])

const queryHandler = () => {
  queryParams.value.pageNum = 1
  getList()
}
const getList = () => {
  loading.value = true
  listproduct(queryParams.value).then(({ data }) => {
    dataList.value = data.list
    console.log('dataList', dataList, data.list)
    total.value = data.total
    loading.value = false
  })
}
const resetQuery = () => {
  proxy.resetForm('queryRef')
  queryHandler()
}
const handleQuery = () => {
  getList()
}
const handleUpdate = row => {
  router.push(`/product/add?id=${row.id}`)
}
const handleAdd = () => {
  router.push(`/product/add`)
}
const handleDelete = row => {
  if (row.id) {
    proxy.$modal
      .confirm('是否确认删除编号为"' + row.id + '"的数据项?')
      .then(function () {
        return delproduct(row.id)
      })
      .then(() => {
        getList()
        proxy.$modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  } else {
    console.log('multipleSelection', multipleSelection.value)
    // 多选删除
    proxy.$modal
      .confirm('是否确认删除编号为"' + multipleSelection.value.join(', ') + '"的数据项?')
      .then(function () {
        return delproduct(row.id)
      })
      .then(() => {
        getList()
        proxy.$modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }
}
const handleDetail = row => {
  showDetailModal.value = true
  detailModalInfo.value = row
}
const handleExport = () => {
  proxy.download(
    'tbx/product/export',
    { ...queryParams.value },
    `product_${new Date().getTime()}.xlsx`
  )
}
const handleSelectionChange = val => {
  multipleSelection.value = val
}
getList()
</script>
<style lang="scss" scoped>
.el-button + .el-button {
  margin: 0;
}
</style>
