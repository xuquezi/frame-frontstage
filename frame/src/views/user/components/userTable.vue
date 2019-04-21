<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "用户名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ 'search' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        label="Name"
        prop="username"/>
      <el-table-column
        label="Email"
        prop="userEmail"/>
      <el-table-column
        label="Mobile"
        prop="userMobile"/>
      <el-table-column
        label="Update"
        prop="userUpdateName"
        width="100"/>
      <el-table-column label="Roles" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-for="item in scope.row.roles" :key="item.roleId" in type="primary" size="mini" >{{ item.roleName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.userStatus=='0'" :type="scope.row.userStatus | statusFilter" >启用</el-tag>
          <el-tag v-if="scope.row.userStatus=='1'" :type="scope.row.userStatus | statusFilter" >停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">Edit</el-button>
          <el-button
            v-if="scope.row.userStatus=='0'"
            size="mini"
            type="danger"
            @click="stopAndUse(scope.row)">Stop</el-button>
          <el-button
            v-if="scope.row.userStatus=='1'"
            size="mini"
            type="success"
            @click="stopAndUse(scope.row)">Use</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'username'" prop="username" >
          <el-input v-model="temp.username"/>
        </el-form-item>

        <el-form-item :label="'userEmail'" prop="userEmail">
          <el-input v-model="temp.userEmail"/>
        </el-form-item>

        <el-form-item :label="'userMobile'" prop="userMobile" >
          <el-input v-model="temp.userMobile"/>
        </el-form-item>

        <el-form-item :label="'roles'">
          <el-drag-select v-model="temp.roleArray" style="width:500px;" multiple placeholder="请选择">
            <el-option v-for="item in roleList" :label="item.label" :value="item.value" :key="item.value" />
          </el-drag-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ 'cancel' }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ 'confirm' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { fetchList, stopAndUse, updateUser } from '@/api/user'
import { getRoles } from '@/api/role'
import ElDragSelect from '@/components/DragSelect'

export default {
  name: 'UserTable',
  components: { Pagination, ElDragSelect },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      total: 0,
      list: null,
      dialogFormVisible: false,
      dialogStatus: '',
      listQuery: {
        page: 1,
        limit: 10,
        search: ''
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      roleList: [],
      // 输入规则限制
      rules: {
        username: [{ required: true, message: 'username is required', trigger: 'change' }]
      },
      // 拷贝到编辑页面的临时数据
      temp: {
        userId: '',
        username: '',
        userEmail: '',
        userMobile: '',
        roleArray: []
      }
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    // 启用和停用
    stopAndUse(val) {
      stopAndUse(val).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    getRoles() {
      getRoles().then(response => {
        response.list.forEach(item => {
          this.roleList.push({
            value: item.roleId,
            label: item.roleName
          })
        })
        // console.log(this.roleList)
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.pageInfo.rows
        this.total = response.pageInfo.total
        // console.log(this.list)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      // 每次编辑前清空temp.roles
      this.temp.roleArray = []
      // console.log(row)
      this.temp.userId = row.userId
      this.temp.username = row.username
      // console.log(row.userName)
      this.temp.userEmail = row.userEmail
      this.temp.userMobile = row.userMobile
      // this.temp = Object.assign({}, row) // copy obj
      for (const item of row.roles) {
        // 用item操作每一条数据。
        this.temp.roleArray.push(item.roleId)
      }
      // console.log(this.temp.roles)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // console.log(this.temp.staffSex)
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
