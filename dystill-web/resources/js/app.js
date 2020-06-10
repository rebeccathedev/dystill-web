import Vue from "vue";
import VueRouter from "vue-router";
import App from "~/Views/App";
import VModal from 'vue-js-modal';

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";

library.add(faPlus);
library.add(faMinus);
dom.watch();

Vue.use(VueRouter);
Vue.use(VModal);

const Rules = () => import("~/Views/Rules");
const Rule = () => import("~/Views/Rule");

const routes = [
  { path: "/", component: Rules, name: "rules" },
  { path: "/rules/:id?", component: Rule, name: "editRule" },
];

const router = new VueRouter({
  routes,
});

let vueApp = new Vue({
  router,
  render: (h) => h(App),
});

vueApp.$mount("#app");
