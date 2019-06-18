function Stack(){
    var items = [];
    this.push = function (item){
        items.push(item);
    }
    this.pop = function(){
        return items.pop();
    }
    this.top = function(){
      return  items[items.length - 1];
    }
    this.size = function(){
        return items.length
    }
    this.isEmpty = function(){
        return items.length == 0;
    }
    this.clear = function(){
        items = []
    }
    this.min = function(){//返回小的，不删除
        let min = '';

    }
}


//遇到左括号，就把左括号压入栈中
//遇到右括号 ，判断栈是否为空，为空说明没有左括号与之对应，缺少左括号说明
//不合法，如果栈不为空，则把栈顶元素移除，这对括号抵消掉

//当for循环结束之后，如果栈为空，就说明所有的左右括号都抵消掉了，如果不为空，
//则说明缺少右括号，字符串括号不合法


//判断字符串里的括号是否符合
function is_leagl_brackets(string){
    var stack = new Stack();
    for(var i;i<string.length;i++){
        var item = string[i];
        //遇见左括号
        if(item == '{'){
            stack.push(item)
        }else if(item == '}'){
            //遇见右括号，判断栈是否为空
            if(stack.isEmpty()){//多余右括号
                return false;
            }else{
                stack.pop();//弹出左括号
            }
        }
    }

    return stack.isEmpty();//栈为空，说明就左右括号都消除了。否则说明有左括号多余了
}

console.log(is_leagl_brackets("111()22(222)"))
console.log(is_leagl_brackets("(111()22(222)"))


//["4","13","5","/","+"] 

//[4,2,"/"]

//先入栈,遇到运算符，把运算符的前面2位拿出来计算 在 push进栈，在把

//

//遇到运算符，把运算符的前面2位拿出来计算

//如果元素不是 + - * / 中的一个，就压入栈中
//如果元素是 + - * / 中一个，就连续从栈中弹出2个  a  b，并计算 b xx  a ，把运算结果放入栈中
//最后计算完 结果应该只有一个

function calc_exp(exp){
    var stack = new Stack();
    
    for(var i =0;i<exp.length;i++){
        var item = exp[i];
        if(["+","-","*","/"].indexOf(item)> -1){
             var value_1 = stack.pop();
             var value_2 = stack.pop();
             //第一次弹出的数字在运算符左边，第二次弹出的运算符右边
             var exppress = value_2 + item + value_1;
             //计算并取值
             var result = parseInt(eval(exppress));
             //计算结果压入栈中
             stack.push(result.toString());   
        } else {
            stack.push(item);
        }
    }
    return stack.pop();
}

//怎么实现 min 栈方法

console.log(calc_exp(["4","13","5","/","+"]));


//minStack 编写 给栈添加个返回最小值方面
function MinStack(){
    var nomalStack = new Stack();
    var minStack = new Stack();
    this.push = function(item){
        if(minStack.size() == 0 || minStack.top()>=item){//放进来的时，当放进来的元素小于等于minStack栈顶元素时，minStack也要放入元素
            minStack.push(item)
        } 
        nomalStack.push(item) ;
    }
    this.min = function(){
       return minStack.top();
    }
    this.pop = function(){//弹出时，当弹出的元素等于minStack栈顶元素时，minStack 也要弹出
        var item1 = nomalStack.top();
        var item2 = minStack.top();
        if(item1 == item2){
            minStack.pop();
        }
        nomalStack.pop();
    }
}

var minStack = new MinStack();
minStack.push(2);
minStack.push(2);
minStack.push(4);
minStack.push(1);
minStack.push(0);
minStack.push(5);

console.log(minStack.min());

minStack.pop();

minStack.pop();

console.log(minStack.min());
minStack.pop();
console.log(minStack.min());
minStack.pop();
console.log(minStack.min());


var priority_map = {
    "+":1,
    "-":1,
    "*":2,
    "/":2
}

//如果是数字，放入list 中，遇到左括号放入栈，遇到右括号出栈，直到遇到左括号，
//遇到运算符，把栈顶的运算符弹出，直到栈顶的运算符小余单签运算符
//for 循环结束后，栈里面可能还有元素，都弹出放入到postfix_lst中
//怎么把中序表达式改为后序表达式    转为中序表达式 就是优先级先得运算符在前面，括号能改变运算符的优先级
//(8+9*7)/2
//
function changeMidtoBack(mid){
    var list = [];
    var stack = new Stack();
    for(var i = 0; i<mid.length;i++){
        var char = mid[i];
        if(!isNaN(char)){//数字直接放入数组中
            list.push(char)
        }else if(char == "("){//左括号直接入栈 这里存在改变运算符顺序的
            stack.push(char)
        }else if(char == ")"){
            while(stack.top != "("){//遇到右括号直接出栈，直到遇到左括号
                list.push(stack.pop());//把运算符放到数组中
            }
            stack.pop();//出栈左括号
        }else {//遇到运算符 先要把栈里面优先级高的元素给弹出去。
            //遇到运算符，把栈顶的运算符弹出，直到栈顶的运算符的优先级小于当前运算符， 就是把大的优先级放到数组中
            while(!stack.isEmpty()&&["+","-","*","/"].indexOf(stack.top())> 0
            && priority_map[stack.top()]> priority_map[char])
            {
                    list.push(stack.pop())
            }
                stack.push(char)
        }
    }
    while(!stack.isEmpty()){
        list.push(stack.pop())
    }
    return list;
}


console.log(changeMidtoBack('1+2/2+3'))
console.log(calc_exp(changeMidtoBack('1+2/2+3')));
