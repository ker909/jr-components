// index.js
import Button from './packages/button'
import Board from './packages/Board';

const components = [Button, Board]

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
