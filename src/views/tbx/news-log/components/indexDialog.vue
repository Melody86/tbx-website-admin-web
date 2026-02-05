<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500">
    <el-form
      :model="form"
      label-width="auto"
      style="max-width: 600px"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="文章编号">
        <editor v-model="form.contentId" :min-height="192" />
      </el-form-item>

      <el-form-item label="用户id" prop="peopleId">
        <el-input v-model="form.peopleId" placeholder="请输入用户id" />
      </el-form-item>

      <el-form-item label="浏览ip" prop="hlIp">
        <el-input v-model="form.hlIp" placeholder="请输入浏览ip" />
      </el-form-item>

      <el-form-item label="是否为移动端" prop="hlIsMobile">
        <el-input v-model="form.hlIsMobile" placeholder="请输入是否为移动端" />
      </el-form-item>

      <el-form-item label="修改时间" prop="updateDate">
        <el-date-picker
          clearable
          v-model="form.updateDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择修改时间"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="修改人" prop="updateBy">
        <el-input v-model="form.updateBy" placeholder="请输入修改人" />
      </el-form-item>

      <el-form-item label="创建时间" prop="createDate">
        <el-date-picker
          clearable
          v-model="form.createDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="创建人" prop="createBy">
        <el-input v-model="form.createBy" placeholder="请输入创建人" />
      </el-form-item>

      <el-form-item label="删除标记" prop="del">
        <el-input v-model="form.del" placeholder="请输入删除标记" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel" class="defauleButton">取消</el-button>
        <el-button type="primary" @click="confirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { addlog, updatelog } from "@/api/tbx/news-log";
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref(null);
const emit = defineEmits(["update"]);
const form = ref({
  contentId: "",

  peopleId: "",

  hlIp: "",

  hlIsMobile: "",

  updateDate: "",

  updateBy: "",

  createDate: "",

  createBy: "",

  del: "",
});
const rules = ref({});
const cancel = () => close();
const confirm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const action = form.value.id ? updatelog : addlog;
      action(form.value).then(() => {
        proxy.$modal.msgSuccess("操作成功");
        emit("update");
        close();
      });
    }
  });
};
const close = () => (dialogVisible.value = false);
const reset = () => {
  form.value = {
    contentId: "",

    peopleId: "",

    hlIp: "",

    hlIsMobile: "",

    updateDate: "",

    updateBy: "",

    createDate: "",

    createBy: "",

    del: "",
  };
  proxy.resetForm("formRef");
};
const init = (row) => {
  reset();
  dialogTitle.value = row
    ? "修改新闻资讯-文章浏览记录"
    : "新增新闻资讯-文章浏览记录";
  form.value = row ? { ...row } : {};
};
const openDialog = (row = null) => {
  dialogVisible.value = true;
  init(row);
};
defineExpose({ openDialog });
</script>
