<template>
  <q-input
    v-model="computedValue"
    :readonly="readOnly"
    :label="label"
    mask="####-##-##"
    :rules="[checkDate]"
    :dense="dense"
  >
    {{ dense }}
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" @show="readOnly" @hide="!readOnly">
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
  //props: ["label", "value"],
  props: {
    label: { type: String, required: false },
    value: {
      type: String,
      required: true
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
    readOnly: {
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
        console.log("computedValue", objVal);
        this.displayValue = objVal;
      }
    },
    displayValue: {
      get: function() {
        return date.formatDate(
          date.extractDate(this.value, this.dataFormat),
          this.calendarFormat
        );
      },
      set: function(objVal) {
        this.$emit("input", date.formatDate(objVal, this.dataFormat));
      }
    }
  },
  methods: {
    fnFocus() {
      document.activeElement.blur();
    },
    checkDate(val) {
      return date.isValid(val) || "Invalid date.";
    },

    onQdateChanged(objVal) {
      if (objVal === null) {
        this.displayValue = this.computedValue;
      }
      this.$refs.qDateProxy.hide();
    }
  }
};
</script>
