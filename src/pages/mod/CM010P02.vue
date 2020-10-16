<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
    id="qdial"
  >
    <q-card class="q-dialog-plugin" style="min-height:70vh; min-width: 60vw">
      <!-- header -->
      <q-bar class="bg-primary text-white">
        <q-item-label>공지사항</q-item-label>
        <q-space />

        <q-btn
          dense
          flat
          icon="minimize"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip
            v-if="maximizedToggle"
            content-class="bg-white text-primary"
            >Minimize</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          icon="crop_square"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip
            v-if="!maximizedToggle"
            content-class="bg-white text-primary"
            >Maximize</q-tooltip
          >
        </q-btn>
        <q-btn dense flat icon="close" @click="fnClose">
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <!-- content -->
      <q-card-section>
        <div class="text-h6">{{ boardInfo.board_title }}</div>
      </q-card-section>

      <!-- <q-card-section class="q-pt-none scroll" :style="test">
        <p v-html="boardInfo.board_txt"></p>
      </q-card-section> 
      
      -->
      <q-card-section class="q-pt-none scroll" style="height:50vh">
        <p v-html="boardInfo.board_txt"></p>
      </q-card-section>

      <q-card-section>
        <template v-for="fileInfo in fileList">
          <q-chip
            outline
            square
            clickable
            :key="fileInfo.file_seq"
            color="primary"
            text-color="black"
            :label="fileInfo.file_nm"
            :title="fileInfo.file_nm"
            @click="fnDownloadFile(fileInfo.file_seq)"
          />
        </template>

        <q-btn
          right
          color="amber"
          size="sm"
          label="일괄다운로드"
          @click="fnDownloadFileAll"
          v-if="fileList.length > 0"
        />
      </q-card-section>

      <!-- footer -->
      <div class="absolute-bottom text-subtitle1 text-center">
        <q-card-actions
          align="right"
          class="bg-primary text-white"
          position="bottom"
        >
          <q-btn
            color="white"
            text-color="black"
            label="Edit"
            @click="fnEdit"
          />
          <q-btn
            color="white"
            text-color="black"
            label="Close"
            @click="fnClose"
          />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { boardSelect } from "@/service/mod/CM010";

export default {
  name: "CM010P02",
  props: {
    selectedInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      maximizedToggle: false,
      boardInfo: {},
      fileList: [],
      targetList: []
    };
  },
  computed: {
    test() {
      console.log(
        "offsetHeight",
        document.getElementById("qdial").offsetHeight
      );
      return `height:calc(100%-96px); min-width: 60vw; border:1px solid black;`;
    }
  },
  mounted() {
    setTimeout(() => {
      this.fnSearch();
    }, 200);
  },

  methods: {
    show() {
      this.$refs.dialog.show();
    },

    hide() {
      this.$refs.dialog.hide();
    },

    //다이얼로그 닫히기 전에 호출 됨
    onDialogHide() {
      this.$emit("hide");
    },

    fnClose() {
      this.maximizedToggle = false;
      this.hide();
    },

    //조회
    fnSearch() {
      boardSelect(this.selectedInfo).then(res => {
        this.boardInfo = res.data.data.boardInfo;
        this.fileList = res.data.data.fileList;
        this.targetList = res.data.data.targetList;
      });
    },

    //수정화면 이동
    fnEdit() {
      this.$emit("ok", true);
      this.hide();
    },

    fnDownloadFile(fileSeq) {
      alert("파일다운로드 할 것 " + fileSeq);
    },

    fnDownloadFileAll() {
      alert("파일 일괄 다운로드");
    }
  }
};
</script>
<style lang="sass" scoped>
.example-container
  height: 80%
</style>
