import React from "react"
import 'bootstrap/dist/css/bootstrap.css';

class Task extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        if(this.props.unCompleted)
        {
        return (
            <div className="w-[100%] h-[100px] bg-amber-50 border rounded-lg mb-6 p-3 shadow-xl" onDragStart={this.props.dragStart} onDragEnd={(e)=>this.props.dragEnd(e,this.props.task.id, this.props.task.completed)} draggable="true">
                <h5>{this.props.task.title}</h5>
                <p className="text-slate-400">{this.props.task.description}</p>
                {/* <button className="btn btn-success" onClick={()=>this.props.setCompleted(this.props.task.id)}>Completa</button> */}
            </div>
        );
    }

        if(this.props.completed)
            {
            return (
                <div className="w-[100%] h-[100px] bg-green-50 border rounded-lg mb-6 p-3 shadow-xl"  onDragStart={this.props.dragStart} onDragEnd={(e)=>this.props.dragEnd(e, this.props.task.id, this.props.task.completed)} draggable="true">
                    <h5>{this.props.task.title}</h5>
                    <p className="text-slate-400">{this.props.task.description}</p>
                    {/* <button className="btn btn-danger" onClick={()=>this.props.setUncompleted(this.props.task.id)}>Rimetti nella lista</button> */}
                </div>   
            );
        }

        if(this.props.newTask)
        {
        return (
            <div className="w-[100%] h-[100px] bg-amber-50 border rounded-lg mb-6 p-3 shadow-xl">
                <div>
                    <h5>
                        <input type="text" name="title" placeholder="Inserisci Nome Task" className="bg-transparent w-[75%]" onChange={this.props.handleChangeTask}/>
                    </h5>
                    <div className="flex">
                        <p className="w-[80%]">
                            <textarea type="text" name="description" placeholder="Inserisci Descrizione Task" className="bg-transparent w-[100%]" onChange={this.props.handleChangeTask}/>
                        </p>
                        <button className="btn ml-20 h-10" onClick={this.props.insertTask}>➕</button>
                    </div>
                </div>
            </div>  
        );
    }

    }


}

export default Task;