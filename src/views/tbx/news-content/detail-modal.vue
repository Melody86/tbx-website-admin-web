<template>
  <el-dialog title="文章详情" :visible.sync="modelValue" width="80%">
    <el-divider />
    <el-form label-width="160px">
      <el-form-item label="文章标题：">
        <el-tag>{{ detailInfo.contentTitle }}</el-tag>
      </el-form-item>
      <el-form-item label="关键字：">
        <span>{{ detailInfo.contentKeyword }}</span>
      </el-form-item>
      <el-form-item label="描述：">
        <div v-html="detailInfo.contentDescription"></div>
      </el-form-item>
      <el-form-item label="缩略图：">
        <video
          v-if="detailInfo.contentImg && /\.mp4$|\.avi$/.test(detailInfo.contentImg.toLowerCase())"
          style="max-width: 100%"
          :src="detailInfo.contentImg"
          muted
          autoplay
          loop
        ></video>
        <img v-else :src="detailInfo.contentImg" style="max-width: 100%" />
      </el-form-item>
      <el-form-item label="文章来源：">
        <span>{{ detailInfo.contentSource }}</span>
      </el-form-item>
      <el-form-item label="文章作者：">
        <span>{{ detailInfo.contentAuthor }}</span>
      </el-form-item>
      <el-form-item label="是否上架：">
        <span>{{ detailInfo.contentDisplay === '1' ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item label="文章类型：">
        <dict-tag :options="tbx_news_type" :value="detailInfo.contentType" />
      </el-form-item>
      <el-form-item label="发布时间：">
        <span>{{ detailInfo.contentDatetime || '--' }}</span>
      </el-form-item>
      <el-form-item label="点击次数：">
        <span>{{ detailInfo.contentHit }}</span>
      </el-form-item>
      <el-form-item label="文章跳转链接：">
        <a v-if="detailInfo.contentUrl" :href="detailInfo.contentUrl" target="_blank">{{
          detailInfo.contentUrl
        }}</a>
        <span v-else>--</span>
      </el-form-item>
      <el-form-item label="文章内容：">
        <div v-html="detailInfo.contentDetails"></div>
      </el-form-item>
    </el-form>
    <!-- <template #footer>
      <el-button @click="modelValue = false">关闭</el-button>
    </template> -->
  </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance, defineProps } from 'vue'
const { proxy } = getCurrentInstance()

const modelValue = ref(false)
const props = defineProps({
  detailInfo: null
})

const { tbx_news_type } = proxy.useDict('tbx_news_type')
</script>

<style scoped>
/* 你可以在这里添加一些样式 */
</style>
