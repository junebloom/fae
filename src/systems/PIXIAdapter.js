import { pascalToCamel } from '../utils'
const classes = ['Container', 'Sprite', 'AnimatedSprite', 'Graphics', 'Text']

export const PIXIAdapter = {
  postupdate () {
    for (const className of classes) {
      if (this.app.groups[className]) {
        const camelName = pascalToCamel(className)
        for (const e of this.app.groups[className]) {
          e[camelName].position.x = e.transform.position.x
          e[camelName].position.y = e.transform.position.y
          e[camelName].rotation = e.transform.rotation
        }
      }
    }
  }
}
