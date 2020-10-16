import {
  Loading,
  QSpinnerGears,
  QSpinnerHourglass,
  QSpinnerCube
} from "quasar";

let loading = {};
let lastRequest = new Date("2020");

loading.show = function(config) {
  if (config && config.loading === "N") {
    return;
  } else {
    let now = new Date();
    let ms = now - lastRequest;
    lastRequest = now;
    if (ms > 2000) {
      //2초 간격의 요청으로 loading 재출력
      if (config.loading == "gears") {
        Loading.show({
          spinner: QSpinnerGears,
          message: "",
          messageColor: "white",
          spinnerSize: 100,
          spinnerColor: "white",
          customClass: ""
        });
      } else if (config.loading == "hourglass") {
        Loading.show({
          spinner: QSpinnerHourglass,
          message: "",
          messageColor: "white",
          spinnerSize: 100,
          spinnerColor: "white",
          customClass: ""
        });
      } else {
        Loading.show({
          spinner: QSpinnerCube,
          message: "",
          messageColor: "white",
          spinnerSize: 100,
          spinnerColor: "orange",
          customClass: ""
        });
      }
    }
  }
};

loading.hide = function(config) {
  if (config && config.loading === "N") {
    return;
  } else {
    setTimeout(() => {
      Loading.hide();
    }, 500);
  }
};

export default loading;
