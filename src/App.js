import React from "react"
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import $ from "jquery";
import Tasks from './tasks/Tasks'

class App extends React.Component
{
    componentDidMount()
    {
        if(localStorage.getItem('token'))
        $.ajaxSetup({headers:{"Authorization":"Bearer " + localStorage.getItem('token')}}); 

        $.getJSON("users/" + localStorage.getItem("email") + "/email", (data) => 
        {
            this.setState({user:data}); 
        })
        .done(
            $.getJSON("users/" + localStorage.getItem("email") + "/email/completedtasks", (data) => 
            {
                this.setState({loadedc:true, completedTasks:data});
            }),

            $.getJSON("users/" + localStorage.getItem("email") + "/email/notcompletedtasks", (data) => 
            {
                this.setState({loadedu:true, unCompletedTasks:data});
            }),

        ).fail(() =>  
        {
            this.setState({needLogin:true});  
            $.ajaxSetup({
                headers:{"Authorization":""}
            }); 
        });

    }

    constructor(props)
    {
        super(props);
        this.state = {
                        loadedu:false, 
                        loadedc:false, 
                        tempCredentials:{},
                        dragItem: null,
                        dragColumn: null,
                        dropColumn: null
                    };
    }

    ///DRAG & DROP (TASKS)

    dragStart = (e) => 
    {
        setTimeout(() => {
            e.target.classList.add("hidden");
          }, 0);

        this.setState({dragItem: e.target});
        this.setState({dragColumn: e.target.parentElement.parentElement.dataset.column});
    }

    dragEnd = (e, id, completed) => 
    {
        if(!completed && this.state.dragColumn !== this.state.dropColumn && this.state.dropColumn!==undefined)
            this.setCompleted(id)
        else
            this.state.dragItem.classList.remove("hidden");

        if(completed && this.state.dragColumn !== this.state.dropColumn && this.state.dropColumn!==undefined)
            this.setUncompleted(id)
        else
            this.state.dragItem.classList.remove("hidden");
    }

    ///

    ///DRAG & DROP (DIV)

    dragOver = (e) => 
    {
        e.preventDefault();
    }

    dragEnter = (e) => 
    {
    }
    
    dragLeave = (e) => 
    {
    }
    
    dragDrop = (e) => 
    {
        e.preventDefault();
        this.setState({dropColumn: e.target.parentElement.dataset.column});
    }
    
    ///

    handleChange = (e) =>
    {
        let tempCredentials = this.state.tempCredentials;
        tempCredentials[e.target.name] = e.target.value;
        this.setState({tempCredentials: tempCredentials});
    }

    userLogin = (e) =>
    {
        // let buongiorno = new Audio("/buongiorno.mp3");

        // buongiorno.play();

        e.preventDefault();

        var settings = {
            "url": "http://localhost:8080/authenticate",
            "method": "POST",
            "timeout": 0,
            "data": JSON.stringify(this.state.tempCredentials),
            "headers": {
            "Content-Type": "application/json"
            }
        };
        
        $.ajax(settings).done(responseConToken => {

            localStorage.setItem("token",responseConToken.token);
            localStorage.setItem("email",this.state.tempCredentials.email);

            window.location.reload();
        })
    }

    userLogout = () =>
    {
        localStorage.removeItem('email');
        localStorage.removeItem('token');

        window.location.reload();
    }

    setCompleted = (idTask) =>
    {
        var settings = {
            "url": "users/" + this.state.user.id + "/tasks/" + idTask + "/setcompleted" ,
            "method": "PUT",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            }
          };

          $.ajax(settings).done(() => 
          {
             let completed = this.state.completedTasks;
             let unCompleted = this.state.unCompletedTasks;

             const taskIndex = unCompleted.findIndex(task => task.id === idTask);

             const completedTask = unCompleted.splice(taskIndex, 1)[0];

             completedTask.completed=true

             completed.push(completedTask);

             this.setState({completedTasks:completed, unCompletedTasks: unCompleted});

          })
          .fail(() => {
              this.setState({error: true});
          });
        
    }

    setUncompleted = (idTask) =>
    {
        var settings = {
            "url": "users/2/tasks/" + idTask + "/setuncompleted" ,
            "method": "PUT",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            }
        };
          
        $.ajax(settings).done(() => 
        {
            let completed = this.state.completedTasks;
            let unCompleted = this.state.unCompletedTasks;

            const taskIndex = completed.findIndex(task => task.id === idTask);

            const uncompletedTask = completed.splice(taskIndex, 1)[0];

            uncompletedTask.completed = false;
           
            unCompleted.push(uncompletedTask);

            this.setState({completedTasks:completed, unCompletedTasks: unCompleted});
        })
        .fail(() => {
            this.setState({error: true});
        });
    }


    render()
    {
        if(this.state.needLogin)
        return (
            <div>
                <div>
                    <form onSubmit={this.userLogin}>
                        <input className="" type="email" name="email" placeholder="Inserisci Email" onChange={this.handleChange}/>
                        <input className="" type="password" name="password" placeholder="Inserisci Password" onChange={this.handleChange}/>
                        <input className="" type="submit" value="Accedi" />
                    </form>
                </div>
            </div>
        );


        if(!this.state.loadedc && !this.state.loadedu)
        return (<div>CARICAMENTO DATI...</div>);

        if(this.state.loadedc && this.state.loadedu)
        {
            return (
                <div>
                    <div className="flex justify-center">
                        <h2 className="m-2">Ciao {this.state.user.name} {this.state.user.surname}</h2>
                        <button className="btn btn-danger m-2" onClick={this.userLogout}>Logout</button>
                    </div>
                    <div className="d-flex">
                        <Tasks unCompleted={true} unCompletedTasks={this.state.unCompletedTasks} setCompleted={this.setCompleted} dragStart={this.dragStart} dragEnd={this.dragEnd} dragOver={this.dragOver} dragEnter={this.dragEnter} dragLeave={this.dragLeave} dragDrop={this.dragDrop}/>
                        <Tasks completed={true} completedTasks={this.state.completedTasks} setUncompleted={this.setUncompleted} dragStart={this.dragStart} dragEnd={this.dragEnd}  dragOver={this.dragOver} dragEnter={this.dragEnter} dragLeave={this.dragLeave} dragDrop={this.dragDrop}/>
                    </div>
                </div>
            );
        }

    }


}

export default App;
