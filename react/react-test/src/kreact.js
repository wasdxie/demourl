import { createVNode } from "./kvdom"

function createElement(type,props,...children){
    //console.log(arguments)
    props.children = children
    delete props.__source
    delete props.__self
    //type 说明标签的类型 如div
    //vtype component type
    let vtype 
    if(typeof type === 'string'){
        //原生标签
        vtype = 1 
    }else if(typeof type === 'function'){
        if(type.isClassComponent){
            //类组件
            vtype = 2
        }else{
            //函数组件
            vtype = 3
        }
    }


    return createVNode(vtype,type,props)
}

export class Component {

    //isclass or function
    static isClassComponent = true

    constructor(props){
        this.props = props
        this.state = {

        }
    }

    setState(){

    }
}

export default {createElement}