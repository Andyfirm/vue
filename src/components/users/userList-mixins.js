export default {
  data() {
    // 自定义校验邮箱规则
    const ckeckEmail = (rule, value, callback) => {
      if (!value.trim()) return callback(new Error('请添加邮箱地址'))
      if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }
    return {
      // 用户列表数据
      userList: [],
      // 查询参数对象
      queryInfo: {
        // 搜索条件
        query: '',
        // 当前显示页数
        pagenum: 1,
        // 每页显示的数据条数
        pagesize: 2
      },
      // 总计录条数
      total: 0,
      // 添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { validator: ckeckEmail, trigger: 'blur' },
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async stateChanged(id, state, user) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state
        return this.$message.error('修改用户状态失败！')
      }
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false
        this.getUserList()
      })
    }
  }
}
