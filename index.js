// index.js
import Board from './packages/Board';
import Field from './packages/Field';
import Scroll from './packages/Scroll';

const components = [Board, Field, Scroll]

const install = function (Vue) {
  components.forEach(component => {
    if (component.install) {
      Vue.use(component)
    } else if (component.name) {
      Vue.component(component.name, component)
    }
  })
}

export default {
  install,
  ...components
}
