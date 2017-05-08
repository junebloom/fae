import { pascalToCamel } from '../utils'
const classes = ['Container', 'Sprite', 'AnimatedSprite', 'Graphics', 'Text']

export const PIXIAdapter = {
  update () {
    for (const className of classes) {
      const name = pascalToCamel(className)
      if (this.groups[name]) {
        for (const e of this.groups[name]) {
          e[name].position.x = e.transform.position.x
          e[name].position.y = e.transform.position.y
          e[name].rotation = e.transform.rotation
        }
      }
    }
  }
}
