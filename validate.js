const validate = (params,rule) => {
    return function (target, name, descriptor) {
        const oldValue = descriptor.value；//保存老的
        descriptor.value = function(){
           if(验证不通过){
                //做一些事情
           }else{
            oldValue.apply(target,arguments)
           }
            
        }
        return descriptor;
    }
}


