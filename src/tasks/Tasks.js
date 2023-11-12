import React from "react"
import 'bootstrap/dist/css/bootstrap.css';
import Task from './Task'

class Tasks extends React.Component
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
                <div className="border w-[45%] h-[1000px] mt-16 ml-10 rounded-lg p-2 bg-blue-500" >
                    <h2 className="text-center text-blue-50">Task da completare</h2>
                    <div className="w-[100%] flex justify-center h-[90%] bg-white border rounded-lg pt-1" data-column={11} onDragOver={this.props.dragOver} onDragEnter={this.props.dragEnter} onDragLeave={this.props.dragLeave} onDrop={this.props.dragDrop}>
                        <div className="w-[100%] pl-20 pr-20 pt-10"> 
                            <Task newTask={true}></Task>
                            {this.props.unCompletedTasks.map(task => <Task key={task.id} unCompleted={this.props.unCompleted} task={task} setCompleted={this.props.setCompleted} dragStart={this.props.dragStart}  dragEnd={this.props.dragEnd} /> )}
                        </div>
                    </div>
                </div>
            );
        }

        if(this.props.completed)
        {
            return (
                <div className="border w-[45%] h-[1000px] mt-16 ml-10 rounded-lg p-2 bg-blue-500">
                    <h2 className="text-center text-blue-50">Task completate</h2>
                    <div className="w-[100%] flex justify-center h-[90%] bg-white border rounded-lg pt-1" data-column={12} onDragOver={this.props.dragOver} onDragEnter={this.props.dragEnter} onDragLeave={this.props.dragLeave} onDrop={this.props.dragDrop}>
                        <div className="w-[100%] pl-20 pr-20 pt-10">
                            {this.props.completedTasks.map(task => <Task key={task.id} completed={this.props.completed} setUncompleted={this.props.setUncompleted} task={task} dragStart={this.props.dragStart}  dragEnd={this.props.dragEnd}/> )}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Tasks;