import Vue from "vue";
import VueRouter from "vue-router";
import App from "~/Views/App";

Vue.use(VueRouter);

const Rules = () => import("~/Views/Rules");

const routes = [
  { path: "/", component: Rules, name: "rules" },
  { path: "/rules/:id", component: Rules, name: "editRule" },
];

const router = new VueRouter({
    routes,
});

let vueApp = new Vue({
    router,
    render: (h) => h(App),
});

vueApp.$mount("#app");
