<template>
  <el-dialog title="文章详情" :visible.sync="modelValue" width="80%">
    <el-divider />
    <el-form label-width="160px">
      <el-form-item label="产品名称：">
        <el-tag>{{ detailInfo.productname }}</el-tag>
      </el-form-item>
      <el-form-item label="产品分类：">
        <dict-tag :options="tbx_product_category" :value="detailInfo.category" />
      </el-form-item>
      <el-form-item label="描述：">
        <div v-html="detailInfo.description"></div>
      </el-form-item>
      <el-form-item label="产品图集：">
        <img
          v-for="item in imageList"
          :src="item"
          :key="item"
          style="width: 100px; height: auto; max-height: 100px; margin-right: 10px"
        />
      </el-form-item>
      <el-form-item label="单位：">
        <span>{{ detailInfo.unit }}</span>
      </el-form-item>
      <el-form-item label="型号：">
        <span>{{ detailInfo.model }}</span>
      </el-form-item>
      <el-form-item label="重量：">
        <span>{{ detailInfo.weight }}</span>
      </el-form-item>
      <el-form-item label="单价：">
        <span>{{ detailInfo.unitprice }}</span>
      </el-form-item>
      <el-form-item label="市场价：">
        <span>{{ detailInfo.marketprice }}</span>
      </el-form-item>
      <el-form-item label="售价：">
        <span>{{ detailInfo.saleprice }}</span>
      </el-form-item>
      <el-form-item label="是否上架：">
        <span>{{ detailInfo.display === '1' ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item label="更新时间：">
        <span>{{ detailInfo.updateTime || '--' }}</span>
      </el-form-item>
      <el-form-item label="详细内容：">
        <div v-html="detailInfo.detail"></div>
      </el-form-item>
    </el-form>
    <!-- <template #footer>
      <el-button @click="modelValue = false">关闭</el-button>
    </template> -->
  </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance, defineProps, computed } from 'vue'
const { proxy } = getCurrentInstance()
const { tbx_product_category } = proxy.useDict('tbx_product_category')

const modelValue = ref(false)
const props = defineProps({
  detailInfo: null
})

const { tbx_news_type } = proxy.useDict('tbx_news_type')
const imageList = computed(() => {
  if (!props.detailInfo) {
    return []
  } else if (typeof props.detailInfo.image_gallery === 'string') {
    return props.detailInfo.image_gallery.split(',')
  } else if (Array.isArray(props.detailInfo.image_gallery)) {
    return props.detailInfo.image_gallery
  }
  return []
})
</script>

<style scoped>
/* 你可以在这里添加一些样式 */
</style>
