
//虚拟dom ->转成dom
//把dom追加到容器上去
import {initVNode} from './kvdom'
function render(vnode,container){
   // initVNode(vnode)
   const node = initVNode(vnode)
    container.appendChild(node)
    //container.innerHTML = `<pre>${JSON.stringify(vnode,null,2)}</pre>`
}

export default {render}