import log from "./components/login.js";
import al from "./components/add_list.js";
import dash from "./components/users.js";
import ac from "./components/add_card.js";
import el from "./components/edit_list.js";
import ec from "./components/edit_card.js";
import base from "./components/base.js"; /////////// BASE COMPONENT
import move from "./components/move_all_cards.js";
import summary from "./components/summary.js";
import sign from "./components/signup.js";

const routes = [
  { path: "/", name: "login", component: log },
  { path: "/signup", name: "signup", component: sign },
  {
    path: "/user",
    component: base,
    children: [
      { path: "/addlist", name: "addlist", component: al },
      { path: "/dashboard", name: "dashboard", component: dash },
      { path: "/:l_id/add_card", name: "add_card", component: ac },
      { path: "/:l_id/edit_list", name: "edit_list", component: el },
      { path: "/:l_id/:c_id/edit_card", name: "edit_card", component: ec },
      { path: "/move_cards/:l_id", name: "move_cards", component: move },
      { path: "/summary", name: "summary", component: summary },
    ],
  },
];

const router = new VueRouter({
  routes,
  base: "/",
});

const app = new Vue({
  el: "#app",
  router,

  //     components:{
  //          profile,
  //     },
  data: {},
});
