<template>
  <div id="q-app" class="row justify-between items-center">
    <div class="navigation_container q-pl-md">
      <q-breadcrumbs color="grey-4" gutter="none">
        <template v-slot:separator>
          <q-icon size="1.4em" name="chevron_right" color="primary" />
        </template>
        <template v-for="route in this.$route.matched">
          <q-breadcrumbs-el :key="route.name" :label="route.meta.title" />
        </template>
      </q-breadcrumbs>
    </div>
    <div class="q-gutter-xs">
      <q-btn label="조회" color="primary" icon="search" @click="fnSearch" />
      <q-btn label="신규" color="primary" icon="add" @click="fnAdd" />
      <q-btn label="삭제" color="primary" icon="delete" @click="fnDelete" />
      <q-btn label="저장" color="primary" icon="save" @click="fnSave" />
      <q-btn label="인쇄" color="primary" icon="print" @click="fnPrint" />
    </div>
  </div>
</template>

<script>
export default {
  name: "frmHead",
  props: {},
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    menuList() {
      return this.$store.state.user.menuInfo;
    }
  },
  methods: {
    fnSearch() {
      //this.$root.$emit(`search_data_m0009`);
      this.$parent.fnSearch();
    },
    fnAdd() {
      this.$parent.fnAdd();
    },
    fnDelete() {
      this.$parent.fnDelete();
    },
    fnSave() {
      this.$parent.fnSave();
    },
    fnPrint() {
      this.$parent.fnPrint();
    }
  },
  mounted() {
    //console.log("this.route", this.$route);
  }
};
</script>
<style scoped>
.navigation_container {
  border-left: 3px solid #027be3;
}
</style>
