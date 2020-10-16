<template>
  <q-uploader style="max-width: 300px" />
</template>

<script>
import { date } from "quasar";

export default {
  props: {
    isReadonly: { type: Boolean, required: false, default: false },
    fileList: {
      type: Object,
      required: false
    },
    atchFileId: {
      type: String,
      required: false
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
