//冒泡排序算法1
function maopai(arr){
    let len = arr.length;
    for(let i=0;i<len-1;i++){
        let flag = true;
        for(let j=0;j<len-1;j++){
            if(arr[j]>arr[j+1]){
                [arr[j],arr[j+1]] = [arr[j+1],arr[j]];
                flag = false;
            }
        }
        if(flag){
            console.log(111);
            break;
        }
    }
    console.log(arr);
}

maopai([9,8,7,6,5,4,3,2,1])


function maopai2(arr){
    let len = arr.length;
    for(let i=len;i>=2;i--){//排序次数
        let flag = true;
        for(let j=0;j<i-1;j++){//每次排序,每次排序高位都是有序的
            if(arr[j]>arr[j+1]){
                [arr[j],arr[j+1]] = [arr[j+1],arr[j]];
                flag = false;
            }
        }
        if(flag){
            console.log(111);
            break;
        }
    }
    console.log(arr);
}

maopai2([9,8,7,6,5,4,3,2,1])
