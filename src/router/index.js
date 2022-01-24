import { createWebHistory, createRouter } from "vue-router";
import CoingeckoPriceTicker from "../views/CoingeckoPriceTicker.vue";
import BasicTextTicker from "../views/BasicTextTicker.vue";
const routes = [
  {
    path: "/coingeckopriceticker",
    name: "coingeckopriceticker",
    component: CoingeckoPriceTicker,
  },
  {
    path: "/basictextticker",
    name: "basictextticker",
    component: BasicTextTicker,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;