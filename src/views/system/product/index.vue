<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="品牌" prop="brand">
        <el-input
          v-model="queryParams.brand"
          placeholder="请输入品牌"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系列" prop="series">
        <el-input
          v-model="queryParams.series"
          placeholder="请输入系列"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="尺寸/大小" prop="size">
        <el-input
          v-model="queryParams.size"
          placeholder="请输入尺寸/大小"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="适用性别" prop="applicableGender">
        <el-input
          v-model="queryParams.applicableGender"
          placeholder="请输入适用性别"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="适用人群" prop="applicableCrowd">
        <el-input
          v-model="queryParams.applicableCrowd"
          placeholder="请输入适用人群"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:product:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:product:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:product:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:product:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="productList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <!-- <el-table-column label="商品首页图" align="center" prop="picture" /> -->
      <el-table-column label="商品首页图" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.picture"
            :preview-src-list="[scope.row.picture]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center" prop="brand" />
      <el-table-column label="系列" align="center" prop="series" />
      <el-table-column label="型号" align="center" prop="model" />
      <el-table-column label="尺寸/大小" align="center" prop="size" />
      <el-table-column
        label="适用性别"
        align="center"
        prop="applicableGender"
      />
      <el-table-column label="适用人群" align="center" prop="applicableCrowd" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:product:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:product:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改产品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品首页图" prop="picture">
          <el-upload
            class="avatar-uploader"
            action="/ry/system/app/upload"
            :show-file-list="false"
            :on-success="uploadSuccess"
          >
            <img v-if="form.picture" :src="form.picture" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="品牌" prop="brandId">
          <el-select v-model="form.brandId" placeholder="请选择品牌">
            <el-option
              v-for="(item, index) in brandType"
              :label="item.brand"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系列" prop="seriesId">
          <el-select v-model="form.seriesId" placeholder="请选择系列">
            <el-option
              v-for="(item, index) in seriesType"
              :label="item.series"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入系列" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number
            style="width: 220px"
            :min="10000"
            :max="999999"
            v-model="form.price"
            @change="handleChangePrice"
            placeholder="请输入价格"
          />
        </el-form-item>
        <el-form-item label="尺寸/大小" prop="size">
          <el-select v-model="form.size" placeholder="请选择尺寸/大小">
            <el-option
              v-for="(item, index) in sizeType"
              :label="item.dictLabel"
              :value="item.dictLabel"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用性别" prop="applicableGender">
          <el-select
            v-model="form.applicableGender"
            placeholder="请选择适用性别"
          >
            <el-option
              v-for="(item, index) in sexType"
              :label="item.dictLabel"
              :value="item.dictLabel"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="适用人群" prop="applicableCrowd">
          <el-select
            v-model="form.applicableCrowd"
            placeholder="请选择适用人群"
          >
            <el-option
              v-for="(item, index) in forCrowd"
              :label="item.dictLabel"
              :value="item.dictLabel"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品轮播图" prop="list">
          <div ref="imglist">
            <VueDraggable
              v-if="form.list && form.list.length > 0"
              v-model="form.list"
              target=".sort-target"
              animation="150"
            >
              <table>
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>文件名</th>
                    <th>图片</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody class="sort-target">
                  <tr
                    v-for="(item, index) in form.list"
                    :key="item.fileName"
                    class="cursor-move"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.fileName }}</td>
                    <td>
                      <el-image
                        style="width: 148px; height: 148px"
                        :src="item.filePath"
                        :preview-src-list="[item.filePath]"
                      >
                      </el-image>
                    </td>
                    <td>
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        @click="handleRemove(index)"
                        >删除</el-button
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </VueDraggable>
          </div>
          <el-upload
            action="/ry/system/app/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="uploadCardSuccess"
            :file-list="form.list"
            :show-file-list="false"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueDraggable, vDraggable } from "vue-draggable-plus";
import {
  listProduct,
  getProduct,
  delProduct,
  addProduct,
  updateProduct,
  allBrand,
  allSeries,
  allSizeList,
} from "@/api/system/product";

export default {
  name: "Product",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 图片的顺序
      sort: 0,
      //品牌类型
      brandType: [],
      // 系列
      seriesType: [],
      //尺寸类型
      sizeType: [],
      // 性别
      sexType: [],
      // 适用人群
      forCrowd: [],
      applicableCrowd: [],
      applicableGender: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 产品表格数据
      productList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        picture: null,
        brand: null,
        brandId: null,
        series: null,
        seriesId: null,
        size: null,
        model: null,
        applicableGender: null,
        applicableCrowd: null,
        list: [],
      },
      // 表单参数
      form: {
        picture: null,
        brand: null,
        brandId: null,
        series: null,
        seriesId: null,
        size: null,
        model: null,
        applicableGender: null,
        applicableCrowd: null,
        list: [],
        price: 10000,
      },
      // 表单校验
      rules: {},
    };
  },
  components: { VueDraggable, vDraggable },
  created() {
    this.getList();
  },
  methods: {
    handleChangePrice(value) {
      console.log(value);
      this.from.price = value;
    },
    //上传商品图成功
    uploadSuccess(res, file) {
      if (res.code !== 200) {
        this.$message.error(res.message);
      }
      if (res.code === 200) {
        this.$message.success("上传图片成功");
        this.queryParams.picture = res.imagesUrl;
        this.form.picture = res.imagesUrl;
      }
    },
    //删除轮播图片
    handleRemove(index) {
      this.form.list.splice(index, 1);
      //   判断是否是正确格式图片才能执行删除
      // if (file && file.status === "success") {
      //   let Pics = this.form.list;
      //   console.log(file, Pics, fileList);
      //   Pics.forEach((item, index) => {
      //     if (file.name == item.name) {
      //       Pics.splice(index, 1);
      //     }
      //   });
      // this.form.list = fileList;
      // }
    },
    //处理图片预览效果
    handlePreview(index) {
      this.previewPath = this.form.list[index].imgUrl;
      this.previewVisible = true;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片墙上传成功
    uploadCardSuccess(res, file) {
      if (res.code !== 200) {
        this.$message.error(res.message);
      }
      if (res.code === 200) {
        this.sort = this.sort + 1;
        this.$message.success("上传图片成功");
        this.dialogImageUrl = file.response.imagesUrl;

        this.form.list = [
          ...this.form.list,
          {
            fileName: file.response.fileName,
            filePath: file.response.imagesUrl,
            sort: this.sort,
          },
        ];
      }
    },
    /** 查询产品列表 */
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then((response) => {
        this.productList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 查询所有品牌
    getAllBrand() {
      allBrand().then((response) => {
        this.brandType = response.data;
      });
    },
    // 查询所有系列
    getAllSeries() {
      allSeries().then((response) => {
        this.seriesType = response.data;
      });
    },
    // 查询所有尺寸
    getAllSize() {
      allSizeList({
        dictType: "sys_size",
        pageNum: "1",
        pageSize: "1000",
      }).then((response) => {
        this.sizeType = response.rows;
      });
    },
    // 查询所有性别
    getAllSex() {
      allSizeList({
        dictType: "applicable_gender",
        pageNum: "1",
        pageSize: "1000",
      }).then((response) => {
        this.sexType = response.rows;
      });
    },
    // 查询所有适用人群
    getAllCrowd() {
      allSizeList({
        dictType: "applicable_crowd",
        pageNum: "1",
        pageSize: "1000",
      }).then((response) => {
        this.forCrowd = response.rows;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        picture: null,
        brand: null,
        brandId: null,
        series: null,
        seriesId: null,
        size: null,
        applicableGender: null,
        applicableCrowd: null,
        createTime: null,
        model: null,
        list: [],
        price: 10000,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.getAllBrand();
      this.getAllSeries();
      this.getAllSize();
      this.getAllSex();
      this.getAllCrowd();
      this.reset();
      this.open = true;
      this.title = "添加产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.getAllBrand();
      this.getAllSeries();
      this.getAllSize();
      this.getAllSex();
      this.getAllCrowd();
      this.reset();
      const id = row.id || this.ids;
      getProduct(id).then((response) => {
        console.log(response.data);
        this.form = response.data;
        this.form.list = response.data.list.map((item) => {
          item.url = item.filePath;
          return item;
        });
        response.data.list.map((item) => {
          this.sort = item.sort > this.sort ? item.sort : this.sort;
        });
        this.open = true;
        this.title = "修改产品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            this.form.list = this.form.list.map((item, index) => {
              item.sort = index;
              return item;
            });
            updateProduct(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除产品编号为"' + ids + '"的数据项？')
        .then(function () {
          return delProduct(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/product/export",
        {
          ...this.queryParams,
        },
        `product_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-form-item__label {
  width: 100px !important;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}

.avatar {
  width: 148px;
  height: 148px;
  display: block;
}

.el-dialog img {
  position: relative !important;
}
.el-dialog .image-index {
  position: absolute;
  bottom: 27px;
  left: 120px;
  background-color: #13ce66;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  color: #fff;
}
.el-form-item__content {
  margin-left: 100px !important;
}
.el-input__inner {
  width: 218px;
}
</style>
