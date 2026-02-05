<template>
  <div class="news-wrap">
    <h2>{{ title }}</h2>
    <el-divider></el-divider>
    <el-form :model="form" label-width="auto" ref="formRef" :rules="rules">
      <el-form-item label="文章标题" required>
        <el-input v-model="form.contentTitle" style="max-width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="文章类型" prop="contentType">
        <el-select v-model="form.contentType" placeholder="请选择文章类型">
          <el-option
            v-for="dict in tbx_news_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-checkbox-group v-model="formContentKeyword">
          <el-checkbox
            v-for="keyword in keywords"
            :label="keyword"
            :value="keyword"
            :key="keyword"
            >{{ keyword }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="自定义顺序">
        <el-input v-model="form.contentSort" type="number" style="max-width: 100px"></el-input>
      </el-form-item>
      <el-form-item label="封面">
        <!-- <ImageUpload :limit="1" v-model="form.contentImg" /> -->
        <FileUpload
          :limit="1"
          v-model="form.contentImg"
          :fileSize="200"
          :fileType="fileUploadType"
        />
      </el-form-item>

      <el-form-item label="是否上架" required>
        <el-switch v-model="form.contentDisplay" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="简要描述">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入简要描述"
          style="max-width: 700px"
          v-model="form.contentDescription"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="文章内容" required>
        <editor v-model="form.contentDetails" width="100%" :min-height="492" />
      </el-form-item>
    </el-form>

    <div class="footer">
      <el-button @click="cancelBtn" style="margin: 0 40px"> 返 回 </el-button>
      <el-button type="primary" @click="confirm"> 提 交 </el-button>
    </div>

    <!-- 预览缩略图 -->
    <el-dialog :visible.sync="previewDialogVisible">
      <img width="100%" :src="form.contentImg" alt="" />
    </el-dialog>
  </div>
</template>

<script setup name="ContentAdd">
import ImageUpload from '@/components/ImageUpload'
import FileUpload from '@/components/FileUpload'
import { addcontent, updatecontent, getcontent } from '@/api/tbx/news-content'
import { ref, getCurrentInstance } from 'vue'
const route = useRoute()
const { query } = route
const { proxy } = getCurrentInstance()
const { tbx_news_type } = proxy.useDict('tbx_news_type')

const title = query.id ? '修改新闻资讯' : '新增新闻资讯'
const keywords = ['国际', '金融', '食品', '乡村振兴']
const fileUploadType = ref(['png', 'jpeg', 'jpg', 'mp4', 'avi'])
const defaultForm = {
  contentDetails: '',

  contentTitle: '',

  contentUrl: '',

  contentKeyword: [],

  contentDescription: '',

  contentImg: '',

  contentSource: '',

  contentAuthor: '',

  contentDisplay: true, // 1显示（默认）, 2不显示

  contentType: '',

  contentDatetime: '',

  contentSort: '',

  contentHit: '',

  updateDate: '',

  updateBy: '',

  createDate: '',

  createBy: '',

  del: ''
}

const previewDialogVisible = ref(false)
const formRef = ref(null)
const form = ref(defaultForm)
const rules = ref({})
const formContentKeyword = ref([])

const getNewsDetail = () => {
  if (query.id) {
    getcontent(query.id).then(res => {
      console.log('res', res)
      if (res.data) {
        form.value = Object.assign({}, res.data)
        form.value.contentDisplay = form.value.contentDisplay === '1'
        if (form.value.contentKeyword) {
          formContentKeyword.value = form.value.contentKeyword.split(',')
        }
      }
    })
  }
}
getNewsDetail()

const confirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const args = { ...form.value }
      if (formContentKeyword.value.length > 0 && Array.isArray(args.contentKeyword)) {
        args.contentKeyword = formContentKeyword.value.join(',')
      } else {
        args.contentKeyword = ''
      }
      Object.keys(args).forEach(item => {
        if (args[item] === '') {
          delete args[item]
        }
      })
      if (form.value.contentSort !== '') {
        args.contentSort = Number(form.value.contentSort)
      }
      args.id = Number(args.id)
      args.contentDisplay = args.contentDisplay ? '1' : '2' // 1显示 2隐藏
      const action = form.value.id ? updatecontent : addcontent
      action(args).then(() => {
        proxy.$modal.msgSuccess('操作成功')
        setTimeout(() => {
          proxy.$tab.closePage()
        }, 1000)
      })
    }
  })
}
const cancelBtn = () => {
  proxy.$tab.closePage()
}
</script>

<style lang="scss" scoped>
.news-wrap {
  margin: 20px 30px 100px;
  .footer {
    margin: 60px auto 20px;
    width: 100%;
    text-align: center;
  }
}
</style>
