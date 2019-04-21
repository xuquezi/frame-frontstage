<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "登出名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ 'search' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        label="Name"
        prop="logoutName"/>
      <el-table-column
        label="Ip"
        prop="logoutIp"/>
      <el-table-column
        label="LogoutTime"
        prop="logoutTime"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ElDragSelect from '@/components/DragSelect'
import { fetchLogoutLogList } from '@/api/log'
export default {
  name: 'LogoutIndex',
  components: { Pagination, ElDragSelect },
  data() {
    return {
      listLoading: true,
      total: 0,
      list: null,
      listQuery: {
        page: 1,
        limit: 10,
        search: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchLogoutLogList(this.listQuery).then(response => {
        this.list = response.pageInfo.rows
        this.total = response.pageInfo.total
        // console.log(this.list)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
