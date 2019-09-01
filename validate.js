const validate = (params,rule) => {//params:要验证的参数,rule:验证的规则
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


