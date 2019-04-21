<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "角色名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ 'search' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        label="Name"
        prop="roleName"/>
      <el-table-column
        label="Desc"
        prop="roleDesc"/>
      <el-table-column
        label="Update"
        prop="roleUpdateName"/>
      <el-table-column
        label="UpdateTime"
        prop="roleUpdate"
        width="100"/>
      <el-table-column label="Auths" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-for="item in scope.row.auths" :key="item.authId" in type="primary" size="mini" >{{ item.authName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roleStatus=='0'" :type="scope.row.roleStatus | statusFilter" >启用</el-tag>
          <el-tag v-if="scope.row.roleStatus=='1'" :type="scope.row.roleStatus | statusFilter" >停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">Edit</el-button>
          <el-button
            v-if="scope.row.roleStatus=='0'"
            size="mini"
            type="danger"
            @click="stopAndUse(scope.row)">Stop</el-button>
          <el-button
            v-if="scope.row.roleStatus=='1'"
            size="mini"
            type="success"
            @click="stopAndUse(scope.row)">Use</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'roleName'" prop="roleName" >
          <el-input v-model="temp.roleName"/>
        </el-form-item>

        <el-form-item :label="'roleDesc'" prop="roleDesc">
          <el-input v-model="temp.roleDesc"/>
        </el-form-item>

        <el-form-item :label="'auths'">
          <el-drag-select v-model="temp.authArray" style="width:500px;" multiple placeholder="请选择">
            <el-option v-for="item in authList" :label="item.label" :value="item.value" :key="item.value" />
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
import ElDragSelect from '@/components/DragSelect'
import { fetchList } from '@/api/role'
import { getAuths } from '@/api/auth'
export default {
  name: 'RoleTable',
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
      authList: [],
      // 输入规则限制
      rules: {
        roleName: [{ required: true, message: 'roleName is required', trigger: 'change' }],
        roleDesc: [{ required: true, message: 'roleDesc is required', trigger: 'change' }]
      },
      // 拷贝到编辑页面的临时数据
      temp: {
        roleId: '',
        roleName: '',
        authArray: [],
        roleDesc: ''
      }
    }
  },
  created() {
    this.getList()
    this.getAuths()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.pageInfo.rows
        this.total = response.pageInfo.total
        // console.log(this.list)
      })
    },
    getAuths() {
      getAuths().then(response => {
        response.list.forEach(item => {
          this.authList.push({
            value: item.authId,
            label: item.authName
          })
        })
        // console.log(this.authList)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      // 每次编辑前清空temp.auths
      this.temp.authArray = []
      this.temp.roleId = row.roleId
      this.temp.roleName = row.roleName
      this.temp.roleDesc = row.roleDesc
      for (const item of row.auths) {
        // 用item操作每一条数据。
        this.temp.authArray.push(item.authId)
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    stopAndUse(val) {
    }
  }
}
</script>

<style scoped>

</style>
