import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

//Global component over here

Vue.component("ComponentA", {
  template: "<h1>Hello, im a global component"
});

new Vue({
  render: h => h(App)
}).$mount("#app");
