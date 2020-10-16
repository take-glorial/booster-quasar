<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-dialog-plugin" style="min-height:85vh; min-width: 60vw">
      <!-- header -->
      <q-bar class="bg-primary text-white">
        <q-item-label>공지사항 수정</q-item-label>
        <q-item-label
          >https://offbyone.tistory.com/341 높이조절 참고</q-item-label
        >
        <q-item-label
          >https://app.sqldbm.com/PostgreSQL/Draft/ 높이조절 참고</q-item-label
        >
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
        <q-input v-model="boardInfo.board_title" label="제목" />
      </q-card-section>
      <q-card-section>
        <q-editor
          v-model="boardInfo.board_txt"
          ref="editor_ref"
          height="28vh"
          @paste.native="evt => pasteCapture(evt)"
          :toolbar="[
            ['left', 'center', 'right', 'justify'],
            ['bold', 'italic', 'underline', 'strike'],
            ['undo', 'redo'],
            ['customimagethingie'],
            ['print', 'fullscreen'],
            [
              {
                icon: $q.iconSet.editor.formatting,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
              },
              {
                icon: $q.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'size-1',
                  'size-2',
                  'size-3',
                  'size-4',
                  'size-5',
                  'size-6',
                  'size-7'
                ]
              },
              {
                icon: $q.iconSet.editor.font,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'default_font',
                  'arial',
                  'arial_black',
                  'comic_sans',
                  'courier_new',
                  'impact',
                  'lucida_grande',
                  'times_new_roman',
                  'verdana'
                ]
              },
              'removeFormat'
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
            ['viewsource']
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana'
          }"
        >
          <template v-slot:customimagethingie>
            <q-btn
              dense
              no-caps
              flat
              ref="custom"
              icon="insert_photo"
              size="sm"
              @click="insertImg"
            >
            </q-btn>
          </template>
        </q-editor>
      </q-card-section>

      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-item-label header>팝업공지여부</q-item-label>
          <q-item class="q-gutter-xl">
            <q-item-section avatar>
              <q-toggle
                color="blue"
                v-model="boardInfo.popup_yn"
                true-value="Y"
                false-value="N"
              />
            </q-item-section>
            <q-item-section top>
              <ComDate
                label="시작일"
                :readonly="boardInfo.popup_yn !== 'Y'"
                v-model="boardInfo.popup_start_dt"
              ></ComDate>
            </q-item-section>

            <q-item-section top>
              <ComDate
                label="종료일"
                :readonly="boardInfo.popup_yn !== 'Y'"
                v-model="boardInfo.popup_end_dt"
              ></ComDate>
            </q-item-section>

            <q-item-section top>
              <q-field bottom-slots label="팝업공지대상" stack-label readonly>
                <template v-slot:control v-for="targetInfo in targetList">
                  <q-chip
                    outline
                    square
                    removable
                    :key="targetInfo.target_seq"
                    color="primary"
                    text-color="black"
                    :label="targetInfo.target_nm"
                    @remove="fnDeleteTarget(targetInfo.target_seq)"
                    class="q-ma-none"
                  />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="search"
                    @click="fnSearchTarget"
                    class="cursor-pointer"
                    v-if="boardInfo.popup_yn === 'Y'"
                    dense
                  />
                </template>
              </q-field>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <q-list bordered class="rounded-borders">
          <template v-for="fileInfo in fileList">
            <q-chip
              outline
              square
              clickable
              removable
              :key="fileInfo.file_seq"
              color="primary"
              text-color="black"
              :label="fileInfo.file_nm"
              :title="fileInfo.file_nm"
              @click="fnDownloadFile(fileInfo.file_seq)"
              @remove="fnDeleteFile(fileInfo.file_seq)"
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

          <q-uploader class="q-ma-sm" />
        </q-list>
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
            label="Save"
            @click="fnSave"
          />
          <q-btn
            color="white"
            text-color="black"
            label="Delete"
            @click="fnDelete"
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
import * as take from "@/libs/take";
import ComDate from "@/components/ComDate.vue";

import { boardSelect, boardDelete } from "@/service/mod/CM010";

export default {
  components: {
    ComDate
  },
  name: "BoardPopup",
  props: {
    selectedInfo: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      maximizedToggle: false,
      boardInfo: {
        project_cd: null,
        menu_cd: null,
        board_seq: null,
        board_title: null,
        import_yn: null,
        popup_yn: null,
        popup_start_dt: null,
        popup_end_dt: null,
        board_attach: null,
        board_txt: null
      },
      fileList: [],
      targetList: []
    };
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

    //저장
    fnSave() {
      const data = [
        {
          aNameSpace: "BoardManagement.boardInfoUpdate",
          oOutDs: this.boardInfo,
          sParam: {
            project_cd: this.boardInfo.project_cd,
            menu_cd: this.boardInfo.menu_cd,
            board_seq: this.boardInfo.board_seq
          }
        }
      ];

      take.transave(data).then(res => {
        this.fnClose();
      });
    },

    //삭제
    fnDelete() {
      boardDelete(this.selectedInfo).then(res => {
        this.fnClose();
      });
    },

    //팝업공지대상
    fnSearchTarget() {
      if (this.boardInfo.popup_yn === "N") {
        return;
      }
      alert("target");
    },

    fnDeleteTarget(targetSeq) {
      alert("공지대상 삭제 할 것 " + targetSeq);
    },

    fnDownloadFile(fileSeq) {
      alert("파일다운로드 할 것 " + fileSeq);
    },

    fnDeleteFile(fileSeq) {
      alert("파일삭제처리 할 것 " + fileSeq);
    },

    fnDownloadFileAll() {
      alert("파일 일괄 다운로드");
    },

    pasteCapture(evt) {
      let text, onPasteStripFormattingIEPaste;
      evt.preventDefault();
      if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
        text = evt.originalEvent.clipboardData.getData("text/plain");
        this.$refs.editor_ref.runCmd("insertText", text);
      } else if (evt.clipboardData && evt.clipboardData.getData) {
        text = evt.clipboardData.getData("text/plain");
        this.$refs.editor_ref.runCmd("insertText", text);
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true;
          this.$refs.editor_ref.runCmd("ms-pasteTextOnly", text);
        }
        onPasteStripFormattingIEPaste = false;
      }
    },
    insertImg() {
      // insertImg method
      let post = this.boardInfo;
      // create an input file element to open file dialog
      const input = document.createElement("input");
      const editor = this.$refs.editor_ref;
      input.type = "file";
      input.accept = ".png, .jpg, .gif"; // file extensions allowed
      let file;
      input.onchange = function() {
        const files = Array.from(input.files);
        file = files[0];

        // lets load the file as dataUrl
        const reader = new FileReader();
        let dataUrl = "";
        reader.onloadend = () => {
          dataUrl = reader.result;
          editor.caret.restore();
          editor.runCmd(
            "insertHTML",
            '<div><img src="' + dataUrl + '" /></div>'
          );
          editor.focus();
        };
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }
};
</script>
