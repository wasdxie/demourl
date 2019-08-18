const vnodeType = {
    HTML:'HTML',
    TEXT:'TEXT',

    COMPONENT:'COMPONENT',
    CLASS_COMPONENT:'CLASS_COMPONENT'
}

const childType = {
    EMPTY:'EMPTY',
    SINGLE:'SINGLE',
    MULTIPLE:'MULTIPLE'
}

//新建
//名字 属性 子元素   创建虚拟dom 根据不同tag 创建不同类型  根据child来创建不同类型
function createElement(tag,data,children){
    let flag = "";

    if(typeof tag == 'string'){
        flag = vnodeType.HTML
    }else if(typeof tag == 'function'){
        flag = vnodeType.COMPONENT
    }else{
        flag = vnodeType.TEXT;
    }

    let childrenFlag;
    if(children == null){
        childrenFlag = childType.EMPTY;
    }else if(Array.isArray(children)){
        let length = children.length;
        if(length == 0){
            childrenFlag = childType.EMPTY
        }else{
            childrenFlag = childType.MULTIPLE
        }
    }else{
        //其他情况为文本
        childrenFlag = childType.SINGLE;
        children = createTextVnode(children + "")
    }

    //返回vnode
    return {
        flag,//vnode 类型 标记是什么类型
        tag,//标签 div 文本没有tag  标签,是函数组件还是类组件还是html标签
        data,//属性
        key:data && data.key,
        children,//子元素
        childrenFlag,//标记child的类型是为空 还是单个元素，还是多个元素
        el:null  //虚拟dom对应的dom元素
    }
}

function createTextVnode(text){
    return {
        flag:vnodeType.TEXT, //标记是什么类型
        tag:null,//标签,是函数组件还是类组件还是html标签
        data:null,//属性
        children:text,
        childrenFlag:childType.EMPTY
    }
}

//渲染  要渲染的虚拟dom 和 其容器
function render(vnode,container){
    //区分首次渲染
    console.log(vnode,container);
    if(container.vnode){
        //更新
        console.log(11111);
        patch(container.vnode,vnode,container);//开始对比
    }else{
        mount(vnode,container);//把虚拟dom变成真实dom挂载到容器中
    }
    container.vnode = vnode;
}

//对比
function patch(pre,next,container){
    let nextFlag = next.flag;
    let preFlag = pre.flag;
    if(nextFlag !== preFlag){
        repalceVnode(pre,next,container)
    }else if(nextFlag == vnodeType.HTML){
        patchElement(pre,next,container);
    }else if(nextFlag == vnodeType.TEXT){
        patchText(pre,next,container)
    }
}

//开始对比元素
function patchElement(pre,next,container){
    if(pre.tag !== next.tag){
        repalceVnode(pre,next,container);
        return;
    }
    let el = (next.el = pre.el);
    let preData = pre.data;
    let nextData = next.data;
    if(nextData){
        for(let key in nextData){
            let preValue = preData[key];
            if(preValue && !nextData.hasOwnProperty(key)){//删除属性
                patchData(el,key,preValue,null);
            }
        }
    }

    if(preData){
        for(let key in preData){
            let preValue = preData[key];
            let nextValue = nextData[key];
            patchData(el,key,preValue,nextValue);
        }
    }
    //data 更新完毕
    patchChild(
        pre.childrenFlag,
        next.childrenFlag,
        pre.children,
        next.children,
        el
    )
}

//对比子元素
function patchChild(preChildFlag,nextChildFlag,preChild,nextChild,container){
    //更新子元素
    // 老的是单独的
    // 老的是空格
    // 老的是多个

    // 新的是单独的
    // 新的是空的
    // 新的是多个
    switch(preChildFlag){
        case childType.SINGLE:
            switch(nextChildFlag){
                case childType.SINGLE:
                    patch(preChild,nextChild,container);
                break;
                case childType.EMPTY:
                    container.removeChild(preChild.el);
                break;
                case childType.MULTIPLE:
                    container.removeChild(preChild.el);
                    for(let i=0;i<nextChild.length;i++){
                        mount(nextChild[i],container);
                    }
                break;
            }
        break;
        case childType.EMPTY:
            switch(nextChildFlag){
                case childType.SINGLE:
                    mount(nextChild,container);
                break;
                case childType.EMPTY:
                break;
                case childType.MULTIPLE:
                    for(let i=0;i<nextChild.length;i++){
                        mount(nextChild[i],container);
                    }
                break;
            }
        break;
        case childType.MULTIPLE:
            switch(nextChildFlag){
                case childType.SINGLE:
                    for(let i=0;i<preChild.length;i++){
                       container.removeChild(preChild[i].el)
                    }
                    mount(nextChild,container)
                break;
                case childType.EMPTY:
                    for(let i=0;i<preChild.length;i++){
                        container.removeChild(preChild[i].el)
                    }
                break;
                case childType.MULTIPLE:
                    //众多虚拟dom的实现不同,每家优化策略不同
                    console.log("新老都是数组");
                    // [abc] 老
                    // [cba] 新  lastIndex   要把老的dom给移动，新的虚拟dom上还没有真实dom
                    // //012
                    let lastIndex = 0;
                    
                    for(let i=0;i<nextChild.length;i++){
                        let nextVnode = nextChild[i];
                        let j= 0;
                        let find = false;
                        for(j;j<preChild.length;j++){
                            let preVnode = preChild[j];
                            if(preVnode.key == nextVnode.key){
                                find = true;
                                //key 为相同
                                patch(preVnode,nextVnode,container);
                                if(j<lastIndex){
                                    //需要移动
                                    //insertBefore();
                                    //abc 变成 bxxxac  abc 的父元素 before  abc(old)  bac(new)
                                    let flagNode = nextChild[i-1].el.nextSibing; //指向老的节点
                                    console.log(flagNode);
                                    container.insertBefore(preVnode.el,flagNode);
                                    break;
                                }else{
                                    lastIndex = j;
                                }
                            }
                        }

                        if(!find){ //a b  c   a d b c
                            //需要新增
                            let flagNode = i==0?preChild[0].el:nextChild[i-1].el.nextSibing
                            mount(nextVnode,container,flagNode);
                        }
                    }
                    //移除不需要的元素
                    for(let i = 0;i<preChild.length;i++){
                        const preVnode =preChild[i];
                        const has = nextChild.find(next => next.key === preVnode.key)
                        if(!has){
                            container.removeChild(preVnode.el)
                        }
                    }
                break;
            }
        break;
    }
}

//对比text 元素,并做更新
function patchText(pre,next,container){
    let el = (next.el = pre.el);
    if(next.children !== pre.children){
        el.nodeValue = next.children;
    }
}

//删除老的节点，并挂载新节点
function repalceVnode(pre,next,container){
    container.removeChild(pre.el);
    mount(next,container);
}

function mount(vnode,container,flagNode){
//挂载几点,根据flag不同调用不同方法
    let {flag} = vnode;
    console.log(flag)
    if(flag == vnodeType.HTML){
        mountElement(vnode,container,flagNode)
    }else if(flag == vnodeType.TEXT){
        mountText(vnode,container)
    }
}

//挂载元素 先挂载属性,在把子元素挂载到自己的dom上,最后在把自己挂载到父元素之上
function mountElement(vnode,container,flagNode){
    let dom = document.createElement(vnode.tag);
    vnode.el = dom;
    let {data,children,childrenFlag} = vnode; //属性
    //挂载data属性
    for(var key in data){//先挂载属性 {value:'xxx',style:{width:'',height:''},class:''}
        patchData(dom,key,null,data[key])
    }
    if(childrenFlag !== childType.EMPTY){
        if(childrenFlag == childType.SINGLE){
            mount(children,dom)
        }else if(childrenFlag == childType.MULTIPLE){
            console.log(1111);
            for(let i=0;i<children.length;i++){
                mount(children[i],dom);
            }
        }
    }
    flagNode?container.insertBefore(dom,flagNode): container.appendChild(dom)
}

//挂载text
function mountText(vnode,container){
    let dom = document.createTextNode(vnode.children)
    vnode.el = dom;
    container.appendChild(dom);
}


/*
    挂载属性 要对属性进行不同的处理
    style 单独处理，要进行循环

*/
function patchData(el,key,pre,next){
    switch(key){
        case "style":
            for(let k in next){//对style进行循环遍历
                el.style[k] = next[k];
            }
            for(let k in pre){//对style进行循环遍历删除
                if(next && !next.hasOwnProperty(key)){
                    el.style[key]='';
                }
            }
            
         break;
        case 'class'://设置样式
            el.className = next;
            break;
        default:
            if(key[0] == "@"){//设置监听
                if(pre){
                    el.removeEventListener(key.slice(1),pre);
                }
                if(next){
                    el.addEventListener(key.slice(1),next)
                }
            }else{ //设置属性,这里要对select 和 checkbox 进行特殊处理,具体看下vue源码
                el.setAttribute(key,next);
            }
         break;           
    }
}
