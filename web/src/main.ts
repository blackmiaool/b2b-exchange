import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./style/base.css";
import store from "./store";

Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.filter("percentage", function (value) {
    if (!value) {
        value = 0;
    }
    return Math.floor(value * 100) + "%";
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
