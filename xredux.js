//createStore  applyMiddleware  compose
var tmp = "";

export function createStore(reducer,enhancer){
    if(enhancer){// 从这里可以看出 enhancer 就是给createStore包装下
        let newcreateStore = enhancer(createStore);//(createStore)=>{return }
        return newcreateStore(reducer);
    }

    let state = undefined;
    let cbs = [];

    function subscribe(cb){
        cbs.push(cb);
        return function(){
            cbs.splice(cbs.indexOf(cb),1);
        }
    }

    function dispatch(action){
        state = reducer(state,action);
        for(var cb of cbs){
            cb();//通知更新
        }
        return action;
    }

    function getState(){
        return state;
    }



    dispatch({ type: "@IMOOC/KKB-REDUX" });

    return {
        getState:getState,//获得状态
        dispatch:dispatch,//分发状态
        subscribe:subscribe,//分发状态
    }
}

export function combineReducers(params){
    return function(state = {},action){
        for(let key in params){
            let reducer = params[key];
            state[key] = reducer(state[key],action);   
        }
        return state;
    }   
}

function abcReducer(state={},action){
    let type = action.type;
    switch (type){
        case 'add':
        return {};
        case 'delete':
        return {};
        default:
        return {};
    }
}


function logger1({getState,dispatch}){
    return function log1(dispatch){
        return function wrapDispatch(action){
              console.log('执行了1');
              return dispatch(action);//执行下一个
        }
    }
}
function logger2({getState,dispatch}){
    return function log1(dispatch){ //包装dispatch 返回dispatch
        return function wrapDispatch(action){
              console.log('执行了2');
              return dispatch(action);//执行下一个
        }
    }
}

//inputstream(in) = inputstream


export function applyMiddleware(...middleware){
   return function enhancerTest(createStoretest){
        return function enCreatestore(reducer){
            let store = createStore(reducer);
            
            let midapi = {
                getState:store.getState,
                dispatch:(...args)=>dispatch(...args)
            }  
            const chain = middleware.map(function(mw){
                return mw(midapi);
            }) ;// [log1,log2,log3] log1(dispatch)
            
            let dispatch = compose2(...chain)(store.dispatch);
            //为了增强dispatch
            return {
                ...store,
                dispatch
            }
        }
    }
}


function compose(...funcs){
    let allwrapDispatch = funcs.reduce(function(pre,next){//next()
        return function tmppre(...args){
            return next(pre(...args));
        }
    })
    console.log(allwrapDispatch);

    return allwrapDispatch;
}

function compose2(...[first,...other]){
    return function(...args){
        let ret = first(...args);
        other.forEach(fn=>{
            ret = fn(ret)
        })
        return ret;
    }
}


export function connect(params){
    return function(state,action){

    }
}

