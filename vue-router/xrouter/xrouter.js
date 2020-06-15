// 手写路由
// 步骤
//  1.写静态的install
//  2.写init方法
//  3.保存options
//  4.定义监听hash 
//  5.写render方法


//  6.定义响应式
let Vue

class Xrouter{
    static install(_vue){
        Vue = _vue
        Vue.mixin({
            beforeCreate(){
                Vue.prototype.$xrouter = '来了老弟，我是路由'
                console.log(this.$options)
                if(this.$options.router){
                    this.$options.router.init()
                }
            }
        })
    }

    constructor(options){
        this.options = options
        this.initRouteMap(options)
        this.app = new Vue({
            data:{
                current:'/'
            }
        })
        this._current = this.app.current
        
        this.bindEvent()
       

    }

    initRouteMap(options){
        this._routeMap = {}
        options.routes.map(item=>{
            this._routeMap[item.path] = item;
        });
    }
    init(){
        Vue.component('router-view',{
            render:h=>{
                console.log('abc');
                let Component = this._routeMap[this.app.current].component;
                return h(Component)
            }
        })

        Vue.component('router-link',{
            props:{
                to:String
            },
            render(h){
                return h('a',{
                    attrs:{
                        href:'#'+this.to
                    }
                },[
                    this.$slots.default
                ])
            }
        })
    }

    bindEvent(){
        window.addEventListener('hashchange',this.hashchange.bind(this),false)
        window.addEventListener('load',this.hashchange.bind(this),false)
    }

    getFromTo(e){
        let {newURL,oldURL} = e 
        let from = oldURL.split('#')[1].slice(1)
        let to = newURL.split('#')[1].slice(1)
        return {from,to}
    }

    hashchange(e){
        console.log(e)
        console.log(111111111);
        const hash = window.location.hash.slice(1)
        let router = this._routeMap[hash]
        if(router.beforeEnter && e.newURL){
            let {from,to} = this.getFromTo(e)
            router.beforeEnter(from,to,()=>{
                this.app.current = hash
            })
        }else{
            this.app.current = hash
        }
        console.log(hash)
       
    }
}

export default Xrouter