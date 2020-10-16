<template>
  <div id="q-app" class="q-pa-md full-height justify-center">
    <frmHead />
    <div style="padding:15px 1px;">
      <q-table
        :data="noticeList"
        :columns="columnInfo"
        row-key="board_seq"
        hide-bottom
        :rows-per-page-options="[0]"
        :loading="loading"
      >
        <template v-slot:body="props">
          <q-tr
            class="cursor-pointer"
            :props="props"
            @click.native="onRowClick(props.row)"
          >
            <q-td key="no" :props="props">
              {{ props.rowIndex + 1 }}
            </q-td>
            <q-td key="board_title" :props="props">
              {{ props.row.board_title }}
            </q-td>
            <q-td key="reg_nm" :props="props">
              {{ props.row.reg_nm }}
            </q-td>
            <q-td key="reg_dt" :props="props">
              {{ formatDate(props.row.reg_dt) }}
            </q-td>
            <q-td key="read_cnt" :props="props">
              {{ props.row.read_cnt }}
            </q-td>
            <q-td key="attach_cnt" :props="props">
              {{ props.row.attach_cnt }}
            </q-td>
          </q-tr>
        </template>
      </q-table>

      How to achieve Master-Details with quasar is qtable
      https://stackoverflow.com/questions/59875698/how-to-achieve-master-details-with-quasar-is-qtable
    </div>
  </div>
</template>

<script>
import * as take from "@/libs/take";
import { date } from "quasar";
import frmHead from "@/pages/frm/frmHead.vue";

import CM010P02 from "@/pages/mod/CM010P02.vue";
import CM010P03 from "@/pages/mod/CM010P03.vue";

import CM010P04 from "@/pages/mod/CM010P04.vue";

export default {
  components: { frmHead },
  data() {
    return {
      loading: false,
      columnInfo: [
        {
          name: "no",
          label: "순번",
          align: "center",
          field: "",
          headerStyle: "width: 10px"
        },
        {
          name: "board_title",
          label: "제목",
          align: "left",
          field: "board_title"
        },
        { name: "reg_nm", label: "작성자", align: "center", field: "reg_nm" },
        { name: "reg_dt", label: "작성일자", align: "center", field: "reg_dt" },
        {
          name: "read_cnt",
          label: "조회 수",
          align: "center",
          field: "read_cnt",
          headerStyle: "width: 10px"
        },
        {
          name: "attach_cnt",
          label: "파일 수",
          align: "center",
          field: "attach_cnt",
          headerStyle: "width: 10px"
        }
      ],
      noticeList: [],
      searchData: [
        {
          aNameSpace: "BoardManagement.boardInfoList",
          sInDs: "noticeList",
          sParam: {
            project_cd: process.env.projectCd,
            menu_cd: "M0028"
          }
        }
      ]
    };
  },
  mounted() {
    this.fnSearch();
  },
  methods: {
    fnSearch(data) {
      data = data || this.searchData;
      this.loading = true;
      take
        .transelect(data)
        .then(res => {
          this.noticeList = res.data.data.noticeList;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async onRowClick(selectedInfo) {
      //내가 구현했던 예전방식
      //이미 quasar에 custom template을 사용한 방식이 구현되어 있어 대체함
      //this.openPopup(selectedInfo);
      this.openViewPopup(selectedInfo);
    },
    formatDate(timeStamp) {
      return date.formatDate(timeStamp, "YYYY-MM-DD");
    },

    openPopup(selectedInfo) {
      this.$popup.open(CM010P02, {
        selectedInfo
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
        .onDismiss(ret => {
          //finally
          if (ret) {
            this.openEditPopup(selectedInfo);
          }
          this.fnSearch();
        });
    },
    openEditPopup(selectedInfo) {
      this.$q
        .dialog({
          component: CM010P03,
          parent: this,
          selectedInfo
        })
        .onOk(ret => {})
        .onCancel(() => {})
        .onDismiss(ret => {
          this.fnSearch();
        });
    }
  }
};
</script>
