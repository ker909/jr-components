// index.js
import { directive as vClickOutside } from "vue-clickaway";
import 'element-ui/lib/theme-chalk/index.css';

import Board from './packages/Board';
import Field from './packages/Field';
import Scroll from './packages/Scroll';
import Search from './packages/Search';

const components = [Board, Field, Scroll, Search];

const install = function (Vue) {
  components.forEach(component => {
    if (component.install) {
      Vue.use(component)
    } else if (component.name) {
      Vue.component(component.name, component)
    }
  })
  Vue.directive('click-outside', vClickOutside);
}

export default {
  install,
  ...components
}
