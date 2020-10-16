<template>
  <div id="q-app" class="full-height justify-center">
    <div class="q-pa-md" style="max-width: 400px;margin: 160px auto;">
      <q-toolbar>
        <q-icon name="edit" />
        <q-toolbar-title>
          {{ $t("login") }}
        </q-toolbar-title>
      </q-toolbar>

      <div class="q-pa-md" style="max-width: 400px">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-select
            v-model="lang"
            :options="langOptions"
            label="Language"
            outlined
            emit-value
            map-options
            style="min-width: 150px"
          />

          <q-input
            filled
            v-model="loginForm.sUserId"
            label="Your name *"
            hint="Name and surname"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
            ref="sUserId"
          />

          <q-input
            filled
            type="password"
            v-model="loginForm.sUserPw"
            label="password"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
            ref="sUserPw"
          />

          <q-toggle
            v-model="loginForm.accept"
            label="I accept the license and terms"
          />

          <div>
            <q-btn :label="$q.lang.label.ok" type="submit" color="primary" />
            <q-btn
              :label="$q.lang.label.reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPwd: true,
      loginForm: {
        sUserId: "takeit",
        sUserPw: "take1234",
        accept: true
      },

      lang: this.getLang(),

      langOptions: [
        { value: "en-us", label: "English" },
        { value: "ko-kr", label: "한국어" }
      ]
    };
  },
  methods: {
    onSubmit() {
      if (this.loginForm.accept !== true) {
        this.$q.notify({
          icon: "warning",
          message: "You need to accept the license and terms first"
        });
      } else {
        this.$store
          .dispatch("LoginByUserName", this.loginForm)
          .then(() => {
            this.$router.push({
              name: "main"
            });
          })
          .catch(ex => {
            console.log(ex);
          });
      }
    },
    onReset() {
      this.loginForm.sUserId = "takeit";
      this.loginForm.sUserPw = "take1234";
      this.loginForm.accept = false;
    },
    getLang() {
      if (this.$i18n.locale === "ko" || this.$i18n.locale === "ko-kr") {
        return "ko-kr";
      } else {
        return this.$i18n.locale;
      }
    }
  },
  watch: {
    lang(lang) {
      // dynamic import, so loading on demand only
      this.$i18n.locale = lang;
      import("quasar/lang/" + lang).then(lang => {
        this.$q.lang.set(lang.default);
      });
    }
  },
  created: function() {}
};
</script>
