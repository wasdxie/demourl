//import ReactDOM from 'react-dom'
import ReactDOM from './kreact-dom'
import React,{Component} from './kreact'

function Comp(props){
    return <h2>hi {props.name}</h2>
}

class Comp2 extends Component{
    render(){
        return (
            <div>
                <h2>hi {this.props.name}</h2>
            </div>
        )
    }
}

const data = [{
    name:'tom',age:13
},{
    name:'jerry',age:14
}]

const jsx = (
    <div id="demo" style={{color:'red'}} onClick={()=>{console.log(1111111)}}>
        <span>hi</span>
        <Comp name="function component"></Comp>
        <Comp2 name="class component"></Comp2>
        <ul>
            {data.map(user=>{
                return (
                <li key={user.age}>{user.name}</li>
                )
            })}
        </ul>
    </div>
)

console.log(jsx)

ReactDOM.render(jsx,document.querySelector('#root'))