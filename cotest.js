/**
*  gen函数的同步执行实现
*/

function co(fun){
    let gen = fun();
    let tmp = gen.next();
    console.log(tmp.value);
    next(tmp,gen)
}


function next(tmp,gen){
    if(!tmp.done){
        if(tmp.value instanceof Promise){
            tmp.value.then((res)=>{
                tmp = gen.next(res);
                next(tmp,gen)
            },(error)=>{
                
            })
        }else{
            console.log(tmp.value)
            tmp = gen.next(tmp.value)
            next(tmp,gen)
        }
    }
}


function* helloWorldGenerator() {
  let a =  yield test1();
  
  let b = yield test2();
  let c = yield test3();
  console.log(a+b+c)
    return a+b+c
  }

  function test1(){
        return new Promise((resolve,reject)=>{
            resolve(1);
        })
    }


function test2(){
    return new Promise((resolve,reject)=>{
            resolve(2);
    })
}


function test3(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(3);
        },5000)
            
    })
}
  co(helloWorldGenerator)
