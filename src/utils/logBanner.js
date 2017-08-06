/* eslint no-console: off */
import { version } from '../../package.json'

// Display a nice banner in the browser console
export default function logBanner () {
  console.log(`%cfae ♥ ${version}%c https://github.com/sambrosia/fae `, `
    background: #aaf;
    color: white;
    line-height: 39px;
    padding: 4px 10px;
    border-radius: 30px;
  `, 'color: #aaf;')
}
