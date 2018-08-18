export default {
  data() {
    return {
      // 分类参数项
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: [],
      // 定义表格的列数
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cate_deleted',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
          width: '200px'
        }
      ],
      addCateDialogVisible: false,
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 添加表单的验证规则对象
      addFormRules: {
        cat_name: [{ required: true, message: '请添加分类名称', trigger: 'blur' }]
      },
      // 父级分类列表
      parentCateList: [],
      cascaderProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateList: [],
      editCateDialogVisible: false,
      editForm: {
        cat_name: ''
      },
      editFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 根据分页参数查询分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败！')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 页码值改变函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    async showAddCateDialog() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.message.error('获取父级分类失败！')
      this.parentCateList = res.data
      this.addCateDialogVisible = true
    },
    cascaderChanged() {
      console.log(this.selectedCateList)
      if (this.selectedCateList.length === 0) {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        this.addForm.cat_pid = this.selectedCateList[this.selectedCateList.length - 1]
        this.addForm.cat_level = this.selectedCateList.length
      }
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.selectedCateList = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    addCate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        this.addCateDialogVisible = false
        this.getCateList()
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！')
      this.editForm = res.data
      this.editCateDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    saveCateInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, {
          cat_name: this.editForm.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error('更新分类失败！')
        this.$message.success('更新分类成功！')
        this.editCateDialogVisible = false
        this.getCateList()
      })
    },
    async remove(id) {
      const conformResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (conformResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.errror('删除分类失败！')
      this.$message.success('删除分类成功！')
      this.getCateList()
    }
  }
}
