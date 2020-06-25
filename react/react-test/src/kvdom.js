//vdom -> dom
//diff
//vtype element type  1=>html  2->class 3=>function
export function createVNode(vtype,type,props){
    const vnode = {
        vtype,type,props
    }
    return vnode
}

//vdom =>dom
export function initVNode(vnode){
    const {vtype} = vnode;
    if(!vtype){
        //文本节点
        return document.createTextNode(vnode)
    }

    if(vtype === 1){
        //原生元素
        return createElement(vnode)
    }else if(vtype === 2){
        return createClassComp(vnode)
    }else if(vtype === 3){
        return createFuncComp(vnode)
    }
}


function createElement(vnode){
    const {type,props} = vnode;
    const node = document.createElement(type);
    //处理属性
    const {key,children,...rest} = props
    Object.keys(rest).forEach(k =>{
        //处理特别属性名  className htmlFor
        if(k === 'className'){
            node.setAttribute('class',rest[k])
        }else if(k === 'htmlFor'){
            node.setAttribute('for',rest[k])
        }else if(k === 'style' && typeof rest[k] === 'object'){
           let styles =  Object.keys(rest[k]).map(s =>{
                return s+':'+rest[k][s]
            }).join(';')
            node.setAttribute('style',styles)
        }else if(k.startsWith('on')){
            const event = k.toLowerCase()
            node[event] = rest[k]
        }else{
            node.setAttribute(k,rest[k])
        }
    })

    //递归子元素
    children.forEach(c=>{
        if(Array.isArray(c)){
            c.forEach(n =>{
                node.appendChild(initVNode(n))
            })
        }else{
            node.appendChild(initVNode(c))
        }
        
    })
    return node;
}

//
function createClassComp(vnode){
    const {type,props} = vnode  //type 为class组件的声明
    const component = new type(props)
    const vdom = component.render()
    return initVNode(vdom)
}
function createFuncComp(vnode){
    const {type,props} = vnode 
    const vdom = type(props)
    return initVNode(vdom)
}