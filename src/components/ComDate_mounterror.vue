<template>
  <q-input
    v-model="vDate"
    mask="####-##-##"
    :rules="[checkDate]"
    @input="vDateChanged"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          @before-show="updateProxy"
          ref="qDateProxy"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date v-model="proxyDate" mask="YYYY-MM-DD" @input="updateDate">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="Cancel" color="primary" flat v-close-popup />
              <q-btn
                label="OK"
                color="primary"
                flat
                @click="save"
                v-close-popup
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { date } from "quasar";

export default {
  name: "ComDate",
  props: ["value"],
  data() {
    return {
      proxyDate: "",
      vDate: date.formatDate(
        date.extractDate(this.value, "YYYYMMDD"),
        "YYYY-MM-DD"
      )
    };
  },
  mounted() {
    //console.log("mounted", this.value);
    //console.log(date.extractDate(this.value, "YYYYMMDD"));
    // console.log(date.formatDate(this.value, "YYYY-MM-DD"));
    // console.log(date.isValid(this.value));
    // console.log(date.isValid(date.extractDate(this.value, "YYYYMMDD")));
  },
  computed: {
    // vDate() {
    //   return date.formatDate(
    //     date.extractDate(this.value, "YYYYMMDD"),
    //     "YYYY-MM-DD"
    //   );
    // },
    // vDate: {
    //   get() {
    //     return date.formatDate(
    //       date.extractDate(this.tempDate || this.value, "YYYYMMDD"),
    //       "YYYY-MM-DD"
    //     );
    //   },
    //   set(objVal) {
    //     console.log(this.proxyDate + "/" + objVal);
    //     this.tempDate = objVal;
    //   }
    // }
  },
  methods: {
    fnFocus() {
      document.activeElement.blur();
      //this.$refs.qDateProxy.show();
    },
    fnFormatDate(objValue, sFormat) {
      return objValue === null ? null : date.formatDate(objValue, sFormat);
    },
    checkDate(val) {
      console.log("date.isValid(val)", date.isValid(val));
      return date.isValid(val) || "Invalid date.";
    },
    updateProxy() {
      this.proxyDate = this.vDate;
    },
    updateDate(oVal) {
      console.log("updateDate", oVal);
      this.$refs.qDateProxy.hide();
      this.proxyDate = oVal;
      this.save();
    },
    save() {
      console.log("save");
      this.vDate = this.proxyDate;
      this.$emit("input", date.formatDate(this.vDate, "YYYYMMDD"));
    },
    vDateChanged() {
      this.updateProxy();
      this.save();
      console.log("vDateChanged", this.vDate);
    }
  }
};
</script>
