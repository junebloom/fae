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

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.fae=e()}(this,function(){"use strict";function t(){console.log("%cfae ♥ "+r+"%c https://github.com/sambrosia/fae ","\n    background: #aaf;\n    color: white;\n    line-height: 39px;\n    padding: 4px 10px;\n    border-radius: 30px;\n  ","color: #aaf;")}function e(t){function e(){t.event.emit("preupdate");var s=window.performance.now();n=(s-r)/1e3,r=s,t.event.emit("update",n),t.event.emit("draw"),window.requestAnimationFrame(e)}var n=0,r=window.performance.now();e()}var n=function(t,e){return e={exports:{}},t(e,e.exports),e.exports}(function(t){function e(){}function n(t,e,n){this.fn=t,this.context=e,this.once=n||!1}function r(){this._events=new e,this._eventsCount=0}var s=Object.prototype.hasOwnProperty,o="~";Object.create&&(e.prototype=Object.create(null),(new e).__proto__||(o=!1)),r.prototype.eventNames=function(){var t,e,n=this,r=[];if(0===this._eventsCount)return r;for(e in t=n._events)s.call(t,e)&&r.push(o?e.slice(1):e);return Object.getOwnPropertySymbols?r.concat(Object.getOwnPropertySymbols(t)):r},r.prototype.listeners=function(t,e){var n=o?o+t:t,r=this._events[n];if(e)return!!r;if(!r)return[];if(r.fn)return[r.fn];for(var s=0,i=r.length,a=new Array(i);s<i;s++)a[s]=r[s].fn;return a},r.prototype.emit=function(t,e,n,r,s,i){var a=arguments,p=this,h=o?o+t:t;if(!this._events[h])return!1;var u,f,c=this._events[h],v=arguments.length;if(c.fn){switch(c.once&&this.removeListener(t,c.fn,void 0,!0),v){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,e),!0;case 3:return c.fn.call(c.context,e,n),!0;case 4:return c.fn.call(c.context,e,n,r),!0;case 5:return c.fn.call(c.context,e,n,r,s),!0;case 6:return c.fn.call(c.context,e,n,r,s,i),!0}for(f=1,u=new Array(v-1);f<v;f++)u[f-1]=a[f];c.fn.apply(c.context,u)}else{var l,y=c.length;for(f=0;f<y;f++)switch(c[f].once&&p.removeListener(t,c[f].fn,void 0,!0),v){case 1:c[f].fn.call(c[f].context);break;case 2:c[f].fn.call(c[f].context,e);break;case 3:c[f].fn.call(c[f].context,e,n);break;case 4:c[f].fn.call(c[f].context,e,n,r);break;default:if(!u)for(l=1,u=new Array(v-1);l<v;l++)u[l-1]=a[l];c[f].fn.apply(c[f].context,u)}}return!0},r.prototype.on=function(t,e,r){var s=new n(e,r||this),i=o?o+t:t;return this._events[i]?this._events[i].fn?this._events[i]=[this._events[i],s]:this._events[i].push(s):(this._events[i]=s,this._eventsCount++),this},r.prototype.once=function(t,e,r){var s=new n(e,r||this,!0),i=o?o+t:t;return this._events[i]?this._events[i].fn?this._events[i]=[this._events[i],s]:this._events[i].push(s):(this._events[i]=s,this._eventsCount++),this},r.prototype.removeListener=function(t,n,r,s){var i=o?o+t:t;if(!this._events[i])return this;if(!n)return 0==--this._eventsCount?this._events=new e:delete this._events[i],this;var a=this._events[i];if(a.fn)a.fn!==n||s&&!a.once||r&&a.context!==r||(0==--this._eventsCount?this._events=new e:delete this._events[i]);else{for(var p=0,h=[],u=a.length;p<u;p++)(a[p].fn!==n||s&&!a[p].once||r&&a[p].context!==r)&&h.push(a[p]);h.length?this._events[i]=1===h.length?h[0]:h:0==--this._eventsCount?this._events=new e:delete this._events[i]}return this},r.prototype.removeAllListeners=function(t){var n;return t?(n=o?o+t:t,this._events[n]&&(0==--this._eventsCount?this._events=new e:delete this._events[n])):(this._events=new e,this._eventsCount=0),this},r.prototype.off=r.prototype.removeListener,r.prototype.addListener=r.prototype.on,r.prototype.setMaxListeners=function(){return this},r.prefixed=o,r.EventEmitter=r,t.exports=r}),r="1.2.0",s=function(r){void 0===r&&(r=e),this.event=new n,this.systems=new Set,this.groups={all:new Set},r(this),t()};s.prototype.entitiesWith=function(){for(var t=this,e=[],n=arguments.length;n--;)e[n]=arguments[n];e.sort(function(e,n){return t.groups[e].size-t.groups[n].size});for(var r=[],s=0,o=t.groups[e[0]];s<o.length;s+=1){var i=o[s];i.hasGroups.apply(i,e)&&r.push(i)}return r},s.prototype.startSystem=function(t){var e=this;this.systems.add(t);for(var n in t.listeners)e.event.on(n,t.listeners[n],t);return t},s.prototype.stopSystem=function(t){var e=this;this.systems.delete(t);for(var n in t.listeners)e.event.removeListener(n,t.listeners[n],t)},s.prototype.enterScene=function(t){var e=this;this.event.emit("exitScene");for(var n=0,r=e.systems;n<r.length;n+=1){var s=r[n];e.stopSystem(s)}for(var o=0,i=e.groups.all;o<i.length;o+=1){var a=i[o];a.persistent||a.destroy()}t()};var o=function(t){this.app=t,this.groups=new Set,this.group("all")};return o.prototype.attach=function(){for(var t=this,e=[],n=arguments.length;n--;)e[n]=arguments[n];for(var r=0,s=e;r<s.length;r+=1){var o=s[r],i=Object.getPrototypeOf(o).constructor.name;t[i]=o,t.group(i),o.entity=t}return this},o.prototype.attachProperties=function(t){var e=this;for(var n in t)e[n]=t[n],e.group(n),"object"==typeof t[n]&&(t[n].entity=e);return this},o.prototype.detach=function(){for(var t=this,e=[],n=arguments.length;n--;)e[n]=arguments[n];for(var r=0,s=e;r<s.length;r+=1){var o=s[r];t[o]=null,t.ungroup(o)}return this},o.prototype.group=function(){for(var t=this,e=[],n=arguments.length;n--;)e[n]=arguments[n];for(var r=0,s=e;r<s.length;r+=1){var o=s[r];t.app.groups[o]||(t.app.groups[o]=new Set),t.app.groups[o].add(t),t.groups.add(o)}return this},o.prototype.ungroup=function(){for(var t=this,e=[],n=arguments.length;n--;)e[n]=arguments[n];for(var r=0,s=e;r<s.length;r+=1){var o=s[r];t.app.groups[o].delete(t),t.groups.delete(o)}return this},o.prototype.hasGroups=function(){for(var t=this,e=[],n=arguments.length;n--;)e[n]=arguments[n];for(var r=0,s=e;r<s.length;r+=1){var o=s[r];if(!t.groups.has(o))return!1}return!0},o.prototype.destroy=function(){var t=this;this.destroyed=!0;for(var e=0,n=t.groups;e<n.length;e+=1){var r=n[e];t.ungroup(r)}},{Application:s,Entity:o,utils:{logBanner:t}}});
//# sourceMappingURL=fae.js.map
