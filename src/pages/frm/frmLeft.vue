<template>
  <div style="max-width:350px;height:calc(100% - 150px);">
    <q-img
      class="absolute-top"
      src="https://cdn.quasar.dev/img/material.png"
      style="height: 150px"
    >
      <div class="absolute-bottom bg-transparent">
        <q-avatar size="56px" class="q-mb-sm">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <div class="text-weight-bold">{{ userInfo.user_nm }}</div>
        <div>{{ userInfo.user_id }}</div>
      </div>
    </q-img>

    <q-scroll-area
      style="height: 100%; margin-top: 150px; border-right: 1px solid #ddd"
    >
      <q-list v-show="!shrink">
        <template v-for="(menu, pindex) in menuList">
          <q-expansion-item
            :expand-separator="true"
            :label="menu.menu_nm"
            :key="menu.menu_cd"
          >
            <template v-if="menu.children">
              <div
                v-for="(subitem, index) in menu.children"
                :key="subitem.menu_cd"
              >
                <q-item
                  clickable
                  v-ripple
                  :active="$route.name === subitem.menu_cd"
                  active-class="menu-active"
                >
                  <q-item-section avatar @click="move(subitem.menu_cd)">
                    <q-icon name="person_outline" />
                  </q-item-section>
                  <q-item-section @click="move(subitem.menu_cd)">
                    <q-item-label
                      >{{ subitem.menu_nm }} -
                      {{ subitem.mymenu_yn === "N" ? "" : "orange" }} ///
                      {{ pindex + "/" + index }}</q-item-label
                    >
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      icon="star"
                      :color="`${subitem.mymenu_yn === 'N' ? '' : 'orange'}`"
                      @click="favorite(pindex, index)"
                    />
                  </q-item-section>
                </q-item>
              </div>
            </template>
          </q-expansion-item>
        </template>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script>
import { myMenuInsert, myMenuDelete } from "@/service/main";

export default {
  name: "frmLeft",
  props: {
    shrink: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    menuList() {
      return this.$store.state.user.menuInfo;
    }
  },
  methods: {
    move(name) {
      if (this.$route.name !== name) {
        this.$router.push({
          name
        });
      }
    },
    favorite(pindex, index) {
      const mymenuYn = this.menuList[pindex].children[index].mymenu_yn;
      if (mymenuYn === "Y") {
        this.menuList[pindex].children[index].mymenu_yn = "N";
        myMenuDelete(this.menuList[pindex].children[index]).then(res => {});
      } else {
        this.menuList[pindex].children[index].mymenu_yn = "Y";
        myMenuInsert(this.menuList[pindex].children[index]).then(res => {});
      }
    }
  }
};
</script>
<style scoped>
.menu-active {
  color: #027be3;
  background-color: #dadada !important;
  border-left: 5px solid #027be3;
}

.menu-enter-active,
.scale-enter {
  -webkit-animation: moveFromLeftFade 0.9s ease both;
  animation: moveFromLeftFade 0.9s ease both;
}
.menu-leave-to,
.scale-leave-active {
  -webkit-animation: moveToLeft 0.9s ease both;
  animation: moveToLeft 0.9s ease both;
}
</style>
