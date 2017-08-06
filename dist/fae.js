/**
 * MIT License
 *
 * Copyright (c) 2017 Sam Woodruff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("eventemitter3")):"function"==typeof define&&define.amd?define(["eventemitter3"],e):t.fae=e(t.EventEmitter3)}(this,function(t){"use strict";function e(t){return t.replace(o,function(t){return t.toLowerCase()})}function r(){console.log("%cfae ♥ "+s+"%c https://github.com/sambrosia/fae ","\n    background: #aaf;\n    color: white;\n    line-height: 39px;\n    padding: 4px 10px;\n    border-radius: 30px;\n  ","color: #aaf;")}function n(t){function e(){t.event.emit("preupdate");var o=window.performance.now();r=(o-n)/1e3,n=o,t.event.emit("update",r),t.event.emit("draw"),window.requestAnimationFrame(e)}var r=0,n=window.performance.now();e()}t=t&&"default"in t?t.default:t;var o=/^[A-Z](?:[A-Z](?![a-z]))*/,s="1.1.3",i=Object.freeze({pascalToCamel:e,logBanner:r}),a=function(e){void 0===e&&(e=n),this.event=new t,this.systems=new Set,this.groups={all:new Set},e(this),r()};a.prototype.entitiesWith=function(){for(var t=this,e=[],r=arguments.length;r--;)e[r]=arguments[r];e.sort(function(e,r){return t.groups[e].size-t.groups[r].size});for(var n=[],o=0,s=t.groups[e[0]];o<s.length;o+=1){var i=s[o];i.hasGroups.apply(i,e)&&n.push(i)}return n},a.prototype.startSystem=function(t){var e=this;this.systems.add(t);for(var r in t.listeners)e.event.on(r,t.listeners[r],t);return t},a.prototype.stopSystem=function(t){var e=this;this.systems.delete(t);for(var r in t.listeners)e.event.removeListener(r,t.listeners[r],t)},a.prototype.enterScene=function(t){var e=this;this.event.emit("exitScene");for(var r=0,n=e.systems;r<n.length;r+=1){var o=n[r];e.stopSystem(o)}for(var s=0,i=e.groups.all;s<i.length;s+=1){var a=i[s];a.persistent||a.destroy()}t()};var p=function(t){this.app=t,this.groups=new Set,this.group("all")};return p.prototype.attach=function(){for(var t=this,r=[],n=arguments.length;n--;)r[n]=arguments[n];for(var o=0,s=r;o<s.length;o+=1){var i=s[o],a=e(Object.getPrototypeOf(i).constructor.name);t[a]=i,t.group(a),i.entity=t}return this},p.prototype.detach=function(){for(var t=this,e=[],r=arguments.length;r--;)e[r]=arguments[r];for(var n=0,o=e;n<o.length;n+=1){var s=o[n];t[s]=null,t.ungroup(s)}return this},p.prototype.group=function(){for(var t=this,e=[],r=arguments.length;r--;)e[r]=arguments[r];for(var n=0,o=e;n<o.length;n+=1){var s=o[n];t.app.groups[s]||(t.app.groups[s]=new Set),t.app.groups[s].add(t),t.groups.add(s)}return this},p.prototype.ungroup=function(){for(var t=this,e=[],r=arguments.length;r--;)e[r]=arguments[r];for(var n=0,o=e;n<o.length;n+=1){var s=o[n];t.app.groups[s].delete(t),t.groups.delete(s)}return this},p.prototype.hasGroups=function(){for(var t=this,e=[],r=arguments.length;r--;)e[r]=arguments[r];for(var n=0,o=e;n<o.length;n+=1){var s=o[n];if(!t.groups.has(s))return!1}return!0},p.prototype.destroy=function(){var t=this;this.destroyed=!0;for(var e=0,r=t.groups;e<r.length;e+=1){var n=r[e];t.ungroup(n)}},{Application:a,Entity:p,utils:i}});
//# sourceMappingURL=fae.js.map
