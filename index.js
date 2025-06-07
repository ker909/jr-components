// index.js
import Button from './packages/button'
import Scroll from './packages/scroll'

const components = [Button, Scroll]

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
  Button,
  Scroll,
}
