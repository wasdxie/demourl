/**
* 一些函数包函数写法  例如 [fn1,fn2,fn3,fn4]  fn4(fn3(fn2(fn1(...args))))
*/

//写法1：
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


function compose(middlers,ctx){
    return dispatch(0);
    function dispatch(i){
        let fn = middlers[i];
        if(!fn){
            return Promise.resolve()
        }else{
            return Promise.resolve(
                fn(ctx,function(){
                    dispatch(i+1)
                })
            );
        }
    }
}
