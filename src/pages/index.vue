<template>
  <div class="fit row wrap justify-center content-center">
    <div class="col-10" style="padding:10px 0px">
      <q-img src="@/assets/img_WF_mainBg01.png" />
    </div>

    <div class="col-5 board" style="padding:10px 10px;min-width:35vh">
      <q-table
        title="공지사항"
        :data="noticeList"
        :columns="columnInfo"
        row-key="board_seq"
        hide-header
        hide-bottom
        class="no-shadow"
      >
        <template v-slot:top-right>
          <q-btn
            flat
            round
            dense
            icon="more_horiz"
            @click="viewdetail('M0028')"
          />
        </template>
        <template v-slot:body="props">
          <q-tr
            class="cursor-pointer"
            :props="props"
            @click.native="onRowClick(props.row)"
          >
            <q-td key="board_title" :props="props">
              {{ props.row.board_title }}
            </q-td>
            <q-td key="reg_dt" :props="props">
              {{ formatDate(props.row.reg_dt) }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <div
      class="col-5 q-col-gutter-none board"
      style="padding:10px 10px;min-width:35vh"
    >
      <q-table
        title="게시판"
        :data="boardList"
        :columns="columnInfo"
        row-key="board_seq"
        hide-header
        hide-bottom
        class="no-shadow"
      >
        <template v-slot:top-right>
          <q-btn
            flat
            round
            dense
            icon="more_horiz"
            @click="viewdetail('M0028')"
          />
        </template>
        <template v-slot:body="props">
          <q-tr
            class="cursor-pointer"
            :props="props"
            @click.native="onRowClick(props.row)"
          >
            <q-td key="board_title" :props="props">
              {{ props.row.board_title }}
            </q-td>
            <q-td key="reg_dt" :props="props">
              {{ formatDate(props.row.reg_dt) }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { getBoardList } from "@/service/main";
import { date } from "quasar";
import CM010P02 from "@/pages/mod/CM010P02.vue";

export default {
  // components: { BoardPopup },
  data() {
    return {
      columnInfo: [
        {
          name: "board_title",
          label: "board_title",
          align: "left",
          field: "board_title"
        },
        { name: "reg_dt", label: "reg_dt", align: "center", field: "reg_dt" }
      ],
      noticeList: [],
      boardList: []
    };
  },
  mounted() {
    this.request({
      project_cd: process.env.projectCd,
      menu_cd: "M0028"
    });
  },
  methods: {
    async request(query) {
      let dataRes = await getBoardList(query);
      this.boardList = dataRes.data.data.boardList;
      this.noticeList = dataRes.data.data.noticeList;
    },
    onRowClick(selectedInfo) {
      this.openViewPopup(selectedInfo);
    },
    formatDate(timeStamp) {
      return date.formatDate(timeStamp, "YYYY-MM-DD");
    },
    viewdetail(sMenuCd) {
      this.$router.push({
        name: sMenuCd
      });
    },
    openViewPopup(selectedInfo) {
      this.$q
        .dialog({
          component: CM010P02,
          parent: this,
          selectedInfo
        })
        .onOk(ret => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    }
  }
};
</script>

<style lang="sass" scoped>
.board
  overflow: auto;
.my-card
  width: 100%
</style>
