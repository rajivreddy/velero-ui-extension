// Rancher Dashboard built-in resource pages
import ListResource from '@shell/pages/c/_cluster/_product/_resource/index.vue';
import CreateResource from '@shell/pages/c/_cluster/_product/_resource/create.vue';
import ViewResource from '@shell/pages/c/_cluster/_product/_resource/_id.vue';
import ViewNamespacedResource from '@shell/pages/c/_cluster/_product/_resource/_namespace/_id.vue';
import Dashboard from '../pages/index.vue';

// Product name - should match what's defined in product.ts
const PRODUCT_NAME = 'velero-ui-extension';
const DASHBOARD_PAGE = 'dashboard';

// Cluster-level routes (available in each cluster tab)
const routes = [
  // Custom dashboard page
  {
    name:      `c-cluster-${ PRODUCT_NAME }-${ DASHBOARD_PAGE }`,
    path:      `/c/:cluster/${ PRODUCT_NAME }/${ DASHBOARD_PAGE }`,
    component: Dashboard,
    meta:      {
      product: PRODUCT_NAME,
      pkg:     PRODUCT_NAME,
    },
  },
  // Resource list page
  {
    name:      `c-cluster-${ PRODUCT_NAME }-resource`,
    path:      `/c/:cluster/${ PRODUCT_NAME }/:resource`,
    component: ListResource,
    meta:      {
      product: PRODUCT_NAME,
      pkg:     PRODUCT_NAME,
    },
  },
  // Resource create page
  {
    name:      `c-cluster-${ PRODUCT_NAME }-resource-create`,
    path:      `/c/:cluster/${ PRODUCT_NAME }/:resource/create`,
    component: CreateResource,
    meta:      {
      product: PRODUCT_NAME,
      pkg:     PRODUCT_NAME,
    },
  },
  // Resource view page (non-namespaced)
  {
    name:      `c-cluster-${ PRODUCT_NAME }-resource-id`,
    path:      `/c/:cluster/${ PRODUCT_NAME }/:resource/:id`,
    component: ViewResource,
    meta:      {
      product: PRODUCT_NAME,
      pkg:     PRODUCT_NAME,
    },
  },
  // Resource view page (namespaced)
  {
    name:      `c-cluster-${ PRODUCT_NAME }-resource-namespace-id`,
    path:      `/c/:cluster/${ PRODUCT_NAME }/:resource/:namespace/:id`,
    component: ViewNamespacedResource,
    meta:      {
      product: PRODUCT_NAME,
      pkg:     PRODUCT_NAME,
    },
  },
];

export default routes;
