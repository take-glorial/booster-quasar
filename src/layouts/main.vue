<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <router-link :to="{ name: 'main' }" tag="label">
            <q-btn dense flat
              ><img src="@/assets/take.png" /> {{ pTitle }}</q-btn
            >
          </router-link>
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="right = !right" />
        <q-btn
          push
          rounded
          color="purple"
          size="xs"
          label="logout"
          @click="logOut"
        />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" elevated>
      <frmLeft :shrink="shrinkMenu" />
    </q-drawer>

    <q-drawer v-model="right" side="right" elevated>
      <!-- drawer content -->
    </q-drawer>

    <div id="mainArea">
      <q-page-container>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
        <popup-anchor></popup-anchor>
        <!--공통팝업영역-->
      </q-page-container>
    </div>

    <q-footer elevated class="bg-grey-8 text-white footer">
      <q-toolbar>
        <q-toolbar-title class="text-body2">
          (07348) 서울시 영등포구 도산로54길 6 (주)테이크 copyright (c)2020 Take
          CSS Corp. All rights reserved
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import frmLeft from "@/pages/frm/frmLeft";

export default {
  components: {
    frmLeft
  },
  data() {
    return {
      left: false,
      right: false,
      pTitle: this.getTitle(),
      shrinkMenu: false
    };
  },
  computed: {},
  methods: {
    getTitle() {
      return process.env.title;
    },
    logOut() {
      this.$store
        .dispatch("Logout")
        .then(() => {
          this.$router.push({
            name: "login"
          });
        })
        .catch(ex => {});
    }
  }
};
</script>
<style>
.fade-enter-active,
.fade-enter {
  /* -webkit-animation: moveFromRight 0.5s both ease;
  animation: moveFromRight 0.5s both ease; */
}
.fade-leave-to,
.fade-leave-active {
  -webkit-animation: moveToLeft 0.5s both ease;
  animation: moveToLeft 0.5s both ease;
}
@-webkit-keyframes moveToLeft {
  from {
  }
  to {
    opacity: 0.5;
    -webkit-transform: translateX(-100%);
  }
}
@keyframes moveToLeft {
  from {
  }
  to {
    opacity: 0.5;
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
    overflow: hidden;
  }
}
@-webkit-keyframes moveFromRight {
  from {
    opacity: 0.7;
    -webkit-transform: translateX(10%);
  }
}
@keyframes moveFromRight {
  from {
    opacity: 0.7;
    -webkit-transform: translateX(10%);
    transform: translateX(10%);
  }
}
</style>
