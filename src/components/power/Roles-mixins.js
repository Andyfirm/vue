export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      editFormRules: {
        roleName: [{ required: true, message: '请填写角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请填写角色描述', trigger: 'blur' }]
      },
      setRightDialogVisible: false,
      rightTree: [],
      treeProp: {
        label: 'authName',
        children: 'children'
      },
      defaultCheckedKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
    },
    addDialogClosed() {
      this.$refs.addFormRef.reseFields()
    },
    addRoles() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败！')
        this.$message.success('添加角色成功！')
        this.addDialogVisible = false
      })
    },
    // 点击编辑按钮显示弹出层且获取数据
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置
    editDialogClosed() {
      this.$refs.editFormRef.reseFields()
    },
    // 点击编辑方法
    saveRolesInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('编辑失败！')
        this.$message.success('编辑角色信息成功！')
        this.getRolesList()
        this.editDialogVisible = false
      })
    },
    // 点击删除方法
    async removeRoles(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    // 根据权限id，删除指定角色的指定权限
    async removeRight(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
      role.children = res.data
    },
    // 分配权限对话框列表
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取所有权限列表失败！')
      this.rightTree = res.data
      // 调用递归
      const keys = []
      this.getLeafId(role, keys)
      this.defaultCheckedKeys = keys
      this.setRightDialogVisible = true
    },
    // 定义递归方法
    getLeafId(node, keyArr) {
      if (!node.children) {
        return keyArr.push(node.id)
      }
      node.children.forEach(item => this.getLeafId(item, keyArr))
    },
    async saveRights() {
      const k1 = this.$refs.tree.getCheckedKeys()
      const k2 = this.$refs.tree.getHalfCheckedKeys()
      const idstr = [...k1, ...k2].join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idstr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
