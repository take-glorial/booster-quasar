<template>
  <q-input
    v-model="computedValue"
    :readonly="readonly"
    :label="label"
    mask="####-##-##"
    :rules="[checkDate]"
    :dense="dense"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer" v-if="readonly === false">
        <q-popup-proxy
          ref="qDateProxy"
          @show="readonly === true"
          @hide="readonly === false"
        >
          <q-date
            v-model="displayValue"
            :mask="calendarFormat"
            @input="onQdateChanged"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { date } from "quasar";

export default {
  //props: ["label", "value"],  default를 사용하면 computed,mounted,data 등을 사용할 수 없음
  props: {
    label: { type: String, required: false },
    value: {
      type: String,
      required: true,
      default: ""
    },
    dataFormat: {
      type: String,
      required: false,
      default: "YYYYMMDD"
    },
    calendarFormat: {
      type: String,
      required: false,
      default: "YYYY-MM-DD"
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    computedValue: {
      get: function() {
        return this.displayValue;
      },
      set: function(objVal) {
        this.displayValue = objVal;
      }
    },
    displayValue: {
      get: function() {
        return this.value === null
          ? ""
          : date.formatDate(
              date.extractDate(this.value, this.dataFormat),
              this.calendarFormat
            );
      },
      set: function(objVal) {
        console.log("displayValue set", objVal);
        this.$emit("input", date.formatDate(objVal, this.dataFormat));
      }
    }
  },
  methods: {
    fnFocus() {
      document.activeElement.blur();
    },
    checkDate(val) {
      val === "" ? true : date.isValid(val) || "Invalid date.";
    },

    onQdateChanged(objVal) {
      if (objVal === null) this.displayValue = this.computedValue;
      this.$refs.qDateProxy.hide();
    }
  }
};
</script>
