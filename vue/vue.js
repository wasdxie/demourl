
//要能展示data中的数据 nodeType == 3  其他的node

//要能监听数据变化
class vue extends EventTarget{
    constructor(options){//保存数据
        super()
        this._data = options.data;
        this.el = document.querySelector(options.el)
        //编译模板
        this.observe(this._data)
        this.compile(this.el)
    }

    observe(data){
       this._data = new Proxy(data,{
            set:(target,property,newValue)=>{
                let event = new CustomEvent(property,{ //test
                    detail:newValue
                })
                console.log(2)
                this.dispatchEvent(event)
                return Reflect.set(...arguments)
            }
        })
    }

    //编译模板 先编译text节点,在编译input节点,代理Proxy 
    compile(el){
        let childs= el.childNodes;
        Array.prototype.forEach.call(childs,(node)=>{
            if(node.nodeType === 3){
                let reg = /\{\{\s*([^\s\}]+)\s*\}\}/g
                if(reg.test(node.textContent)){
                    let $1 = RegExp.$1 // test
                    let text = node.textContent
                    node.textContent = text.replace(reg,this._data[$1])
                    this.addEventListener($1,e=>{
                        console.log(3)
                        node.textContent =  text.replace(reg,e.detail)
                    })
                }
            }else{
                let nodeName = node.nodeName
                let _this = this;
                if(nodeName == 'INPUT'){
                    let model = node.getAttribute('v-model');
                    model && (node.value = this._data[model])
                    model && node.addEventListener('input',function(e){
                        console.log(1)
                        _this._data[model] = e.target.value
                    })
                }else{
                    this.compile(node)
                }
            }
        })
    }
}