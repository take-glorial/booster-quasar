import Vue from "vue";

var nextKey = 0; //키 생성을 위한 일련번호
var popupList = []; //팝업될 컴포넌트들을 저장하는 리스트
var anchorVm = null; //popup-anchor 컴포넌트의 인스턴스

const popupInstance = {
  open: function(component, params) {
    return new Promise((resolve, reject) => {
      //요청시에 컴포넌트와 파라미터를 인자로 넘길 수 있다.
      var key = "_popup_key_" + nextKey++; //키 생성
      popupList.push({
        component,
        params,
        key,
        componentInstance: null
      }); //popupList에 open 요청을 저장한다.

      if (anchorVm) anchorVm.$forceUpdate(); //popup-anchor가 새롭게 render를 하도록 한다.

      resolve({ popup_key: key }); //리턴값으로 key를 담고 있는 객체를 넘긴다.
    });
  },
  close: function(inst) {
    return new Promise((resolve, reject) => {
      if (!inst) resolve();

      for (var i = 0; i < popupList.length; i++) {
        if (
          (inst instanceof Vue && popupList[i].componentInstance === inst) || //컴포넌트 자체가 this로 close를 한 경우
          inst.popup_key === popupList[i].key
        ) {
          //open시 리턴객체를 가지고 close를 한 경우
          //해당 컴포넌트를 리스트에서 제거
          popupList.splice(i, 1);

          if (anchorVm) anchorVm.$forceUpdate(); //popup-anchor가 새롭게 render를 하도록 한다.

          resolve();
        }
      }
    });
  }
};

const popupAnchor = {
  name: "popup-anchor",
  created() {
    //popup-anchor 컴포넌트가 생성되었을때
    anchorVm = this; //popup-anchor의 인스턴스를 저장해 둔다. 이후 open이나 close 시에 $forceUpdate를 위해 사용된다.
  },

  render: function(createElement) {
    var children = popupList.map(popup =>
      createElement(
        //createElement의 첫번째 인자로 컴포넌트, 두번째 인자로 옵션 데이터 객체
        popup.component,
        {
          key: popup.key, //컴포넌트 key
          props: popup.params ? popup.params : {}, //open시 전달한 파라미터
          hook: {
            create: function(_, vnode) {
              //VNode의 create 훅을 통해서
              popup.componentInstance = vnode.componentInstance; //생성한 컴포넌트의 인스턴스를 저장해 둔다.
            }
          }
        }
      )
    );

    return createElement("div", children);
  }
};

// for use inside Vue files through this.$popup
Vue.prototype.$popup = popupInstance;

export default async ({ Vue }) => {
  Vue.component("popup-anchor", popupAnchor);
};
