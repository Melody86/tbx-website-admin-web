<template>
  <div class="product-wrap">
    <h2>{{ title }}</h2>
    <el-divider></el-divider>

    <el-form :model="form" label-width="auto" ref="formRef" :rules="rules">
      <el-form-item label="产品名称" required>
        <el-input
          placeholder="请输入产品名称"
          v-model="form.productname"
          style="max-width: 400px"
        ></el-input>
      </el-form-item>

      <el-form-item label="产品分类" prop="category">
        <el-select v-model="form.category" placeholder="请输入产品分类">
          <el-option
            v-for="dict in tbx_product_category"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="产品图集" prop="image_gallery">
        <ImageUpload :limit="7" v-model="form.image_gallery" :modelValue="form.image_gallery" />
      </el-form-item>

      <el-form-item label="单位" prop="unit">
        <el-input
          type="string"
          style="max-width: 200px"
          v-model="form.unit"
          placeholder="请输入单位"
        />
      </el-form-item>

      <el-form-item label="型号" prop="model">
        <el-input v-model="form.model" placeholder="请输入型号" style="max-width: 200px" />
      </el-form-item>

      <el-form-item label="重量" prop="weight">
        <el-input
          type="number"
          style="max-width: 200px"
          v-model="form.weight"
          placeholder="请输入重量"
        />
      </el-form-item>

      <el-form-item label="单价" prop="unitprice">
        <el-input
          type="number"
          style="max-width: 200px"
          v-model="form.unitprice"
          placeholder="请输入单价"
        />
      </el-form-item>

      <el-form-item label="市场价" prop="marketprice">
        <el-input
          type="number"
          style="max-width: 200px"
          v-model="form.marketprice"
          placeholder="请输入市场价"
        />
      </el-form-item>

      <el-form-item label="售价" prop="saleprice">
        <el-input
          type="number"
          style="max-width: 200px"
          v-model="form.saleprice"
          placeholder="请输入售价"
        />
      </el-form-item>

      <el-form-item label="是否上架" required>
        <el-switch v-model="form.display" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
      </el-form-item>

      <el-form-item label="文章内容" prop="detail">
        <editor v-model="form.detail" width="100%" :min-height="492" />
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="cancel" class="defauleButton">取 消</el-button>
      <el-button type="primary" @click="confirm"> 确 定 </el-button>
    </div>
  </div>
</template>

<script setup name="ProductAdd">
import ImageUpload from '@/components/ImageUpload'
import { addproduct, updateproduct, getproduct } from '@/api/tbx/product'
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const { tbx_product_category } = proxy.useDict('tbx_product_category')
const route = useRoute()
const { query } = route

const title = query.id ? '修改产品' : '新增产品'
const formRef = ref(null)
const form = ref({
  category: '',

  unit: '',

  model: '',

  image_gallery: [],

  weight: null,

  unitprice: null,

  marketprice: null,

  display: true,

  saleprice: null,

  description: '',

  productname: '',

  detail: ''
})
const rules = ref({})

const getProductDetail = () => {
  if (query.id) {
    getproduct(query.id).then(res => {
      console.log('res', res)
      if (res.data) {
        const val = Object.assign({}, res.data)
        if (val.image_gallery) {
          val.image_gallery = val.image_gallery.split(',')
        } else {
          val.image_gallery = []
        }
        form.value.display = form.value.display === '1'
        form.value = val
      }
    })
  }
}
getProductDetail()

const cancel = () => proxy.$tab.closePage()

const confirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const args = { ...form.value }
      args.id = Number(args.id)
      args.display = args.display ? '1' : '2' // 1显示 2隐藏
      if (args.weight) {
        args.weight = Number(args.weight)
      }
      if (args.unitprice) {
        args.unitprice = Number(args.unitprice)
      }
      if (args.marketprice) {
        args.marketprice = Number(args.marketprice)
      }
      if (args.saleprice) {
        args.saleprice = Number(args.saleprice)
      }
      args.display = args.display ? '1' : '2' // 1显示 2隐藏
      console.log('args.image_gallery', args.image_gallery, typeof args.image_gallery)
      if (Array.isArray(args.image_gallery) && args.image_gallery.length > 0) {
        args.image_gallery = args.image_gallery.join(',')
      }
      console.log('args.image_gallery after', args.image_gallery)
      const action = form.value.id ? updateproduct : addproduct

      action(args).then(() => {
        proxy.$modal.msgSuccess('操作成功')
        setTimeout(() => {
          proxy.$tab.closePage()
        }, 1000)
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.product-wrap {
  margin: 20px 30px 100px;
  .footer {
    margin: 60px auto 20px;
    width: 100%;
    text-align: center;
  }
}
</style>
