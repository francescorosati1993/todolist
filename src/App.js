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

            $.getJSON("users/" + localStorage.getItem("email") + "/email/uncompletedtasks", (data) => 
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
                        needRegister: false,
                        tempRegister:{},
                        tempCredentials:{},
                        tempTask:{name:"", description:""},
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
        console.log("DRAG",e.target.parentElement.parentElement.dataset.column)
    }

    dragEnd = (e, id, completed) => 
    {
        if(!completed && this.state.dropColumn==="completed")
        {
            this.setCompleted(id);
            console.log("DRAG END",this.state.dropColumn)
            // let buongiorno = new Audio("/buongiorno.mp3");
            // buongiorno.play();
        }
        else
            this.state.dragItem.classList.remove("hidden");

        if(completed && this.state.dropColumn ==="unCompleted")  
        {
            this.setUncompleted(id)
            console.log("DRAG END",this.state.dropColumn)
            // let buongiorno = new Audio("/buongiorno.mp3");
            // buongiorno.play();
        }
        else
            this.state.dragItem.classList.remove("hidden");

        if(this.state.dropColumn === "delete")  
        {
            console.log("DRAG END DELETE",this.state.dropColumn)
            if(!completed)
                this.deleteUnCompletedTask(id);
            
            if(completed)
                this.deleteCompletedTask(id);

            // let buongiorno = new Audio("/buongiorno.mp3");
            // buongiorno.play();
        }
        else
            this.state.dragItem.classList.remove("hidden");

        this.setState({dragColumn: null, dropColumn:null});
    }

    ///

    ///DRAG & DROP (DIV)

    dragOver = (e) => 
    {
        e.preventDefault();
    }

    dragEnter = (e) => 
    {
        if(e.target.dataset.column === "delete")
        {
            e.target.classList.add("delete")
            e.target.querySelector("svg").setAttribute("stroke", "red");
        }

        if(e.target.parentElement.dataset.column === "delete")
        {
            console.log("Questo è quando entra", e.target)
            e.target.parentElement.classList.add("delete")
        }
    }
    
    dragLeave = (e) => 
    {
        if(e.target.dataset.column === "delete" && e.relatedTarget.tagName !== 'svg')
        {
            console.log("Questo è l'elemento in cui entro dopo che ho lasciato il div: ", e.relatedTarget.tagName)
            e.target.querySelector("svg").setAttribute("stroke", "currentColor");
            e.target.classList.remove("delete")
        }
    }
    
    dragDrop = (e) => 
    {
        // e.preventDefault();
        this.setState({dropColumn: e.target.parentElement.dataset.column});
        console.log("DROP",e.target.parentElement.dataset.column)

        if(e.target.dataset.column === "delete")
        {
            this.setState({dropColumn: e.target.dataset.column});
            e.target.querySelector("svg").setAttribute("stroke", "currentColor");
            e.target.classList.remove("delete")
        }

        if(e.target.parentElement.dataset.column === "delete")
        {
            this.setState({dropColumn: e.target.parentElement.dataset.column});
            e.target.parentElement.classList.remove("delete")
            e.target.setAttribute("stroke", "currentColor");
        }

        if(e.target.parentElement.parentElement.dataset.column === "delete")
        {
            this.setState({dropColumn: e.target.parentElement.parentElement.dataset.column});
            e.target.parentElement.parentElement.classList.remove("delete")
            e.target.parentElement.setAttribute("stroke", "currentColor");
        }
    }
    
    needLogin = () =>
    {
        this.setState({needLogin: true, needRegister: false})
    }

    needRegister = () =>
    {
        this.setState({needLogin: false, needRegister: true})
    }

    ///

    handleChangeLogin = (e) =>
    {
        let tempCredentials = this.state.tempCredentials;
        tempCredentials[e.target.name] = e.target.value;
        this.setState({tempCredentials: tempCredentials});
    }

    ///LOGIN
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

    handleChangeRegister = (e) =>
    {
        let tempRegister = this.state.tempRegister;
        tempRegister[e.target.name] = e.target.value;
        this.setState({tempRegister: tempRegister});

        console.log(this.state.tempRegister)
    }

    ///REGISTER
    userRegister = (e) =>
    {
        // let buongiorno = new Audio("/buongiorno.mp3");

        // buongiorno.play();

        e.preventDefault();

        console.log(this.state.tempRegister);

        var settings1 = {
            "url": "http://localhost:8080/register",
            "method": "POST",
            "timeout": 0,
            "data": JSON.stringify(this.state.tempRegister),
            "headers": {
            "Content-Type": "application/json"
            }
        };

        $.ajax(settings1).done(responseConToken => {

            localStorage.setItem("token",responseConToken.token);
            localStorage.setItem("email",this.state.tempRegister.email);

            var settings2 = {
                "url": "users/" + this.state.tempRegister.email + "/email",
                "method": "PUT",
                "timeout": 0,
                "data": JSON.stringify(this.state.tempRegister),
                "headers": {
                                "Authorization":"Bearer " + responseConToken.token,
                                "Content-Type": "application/json"
                            }
            };

            $.ajax(settings2).done(()=>{window.location.reload();})
            .fail(()=>alert("Qualcosa è andato storto"));

           
        })
    }


    ///

    userLogout = () =>
    {
        localStorage.removeItem('email');
        localStorage.removeItem('token');

        window.location.reload();
    }

    ///NEW TASK

    handleChangeTask = (e) =>
    {
        let tempTask = this.state.tempTask;
        tempTask[e.target.name] = e.target.value;
        this.setState({tempTask: tempTask});
        console.log("TITOLO TASK", this.state.tempTask.title)
        console.log("DESCRIZIONE TASK", this.state.tempTask.description)
    }

    insertTask = (e) =>
    {
        e.preventDefault();

        var settings = {
            "url": "users/" + this.state.user.id + "/tasks",
            "method": "POST",
            "timeout": 0,
            "data": JSON.stringify(this.state.tempTask),
            "headers": {
            "Content-Type": "application/json"
            }
        };

        $.ajax(settings).done(response => {
            let unCompleted = this.state.unCompletedTasks;
            unCompleted.push(response);
            this.setState({unCompletedTasks: unCompleted, tempTask:{title:"", description:""}});
        })
    }

    deleteUnCompletedTask = (id) =>
    {
        var settings = {
            "url": "users/" + this.state.user.id + "/tasks/" + id,
            "method": "DELETE",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            }
        };
        
        $.ajax(settings).done(() => 
        {
            let unCompleted = this.state.unCompletedTasks;
            unCompleted = unCompleted.filter(task => task.id !== id);
            this.setState({unCompletedTasks: unCompleted});
        })
    }

    deleteCompletedTask = (id) =>
    {
        var settings = {
            "url": "users/" + this.state.user.id + "/tasks/" + id,
            "method": "DELETE",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            }
        };
        
        $.ajax(settings).done(() => 
        {
            let completed = this.state.completedTasks;
            completed = completed.filter(task => task.id !== id);
            this.setState({completedTasks: completed});
        })
    }



    ///

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
            "url": "users/" + this.state.user.id + "/tasks/" + idTask + "/setuncompleted" ,
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

            const unCompletedTask = completed.splice(taskIndex, 1)[0];

            unCompletedTask.completed = false;
           
            unCompleted.push(unCompletedTask);

            this.setState({completedTasks:completed, unCompletedTasks: unCompleted});
        })
        .fail(() => {
            this.setState({error: true});
        });
    }

    handleFileChange = (event) => {
        console.log(event.target.files[0].name)
        // Aggiorna lo stato con il file selezionato dall'utente
        this.setState({
          selectedFile: event.target.files[0].name,
        });
      };

    render()
    {
        if(this.state.needLogin)
        return (
            <div className="flex justify-center">
                <div className="bg-sky-600 w-[25%] h-[300px] flex justify-center mt-48 rounded-lg">
                    <form onSubmit={this.userLogin} className="w-[85%] flex flex-column">
                        <input className="w-[100%] h-[15%] mt-10 p-2 rounded-sm" type="email" name="email" placeholder="Inserisci Email" onChange={this.handleChangeLogin}/>
                        <input className="w-[100%] h-[15%] mt-4 p-2 rounded-sm" type="password" name="password" placeholder="Inserisci Password" onChange={this.handleChangeLogin}/>
                        <div className="w-[100%] flex justify-center mt-6">
                            <input className="bg-green-500 w-[30%] h-[100%] flex justify-center p-2 items-center rounded-md text-white" type="submit" value="Accedi" />
                        </div>
                        <div className="w-[100%] flex justify-center ">
                            <button className="mt-3 w-[30%] h-[100%] text-white hover:text-blue-700 border rounded-md border-white" onClick={this.needRegister}>Registrati</button>
                        </div>
                    </form>
                </div>
            </div>
        );

        if(this.state.needRegister)
        return (
            <div className="flex justify-center">
                <div className="bg-sky-600 w-[25%] h-[450px] flex justify-center mt-48 rounded-lg">
                    <form onSubmit={this.userRegister} className="w-[85%] flex flex-column">
                        <input className="w-[100%] h-[10%] mt-10 p-2 rounded-sm" type="text" name="name" placeholder="Inserisci Nome" onChange={this.handleChangeRegister}/>
                        <input className="w-[100%] h-[10%] mt-4 p-2 rounded-sm" type="text" name="surname" placeholder="Inserisci Cognome" onChange={this.handleChangeRegister}/>
                        <input className="w-[100%] h-[10%] mt-4 p-2 rounded-sm" type="email" name="email" placeholder="Inserisci Email" onChange={this.handleChangeRegister}/>
                        <input className="w-[100%] h-[10%] mt-4 p-2 rounded-sm" type="password" name="password" placeholder="Inserisci Password" onChange={this.handleChangeRegister}/>
                        <div className="w-[100%] flex justify-center mt-6">
                            <input className="bg-green-500 w-[30%] h-[100%] flex justify-center p-2 items-center rounded-md text-white" type="submit" value="Registrati" />
                        </div>
                        <div className="w-[100%] flex justify-center ">
                            <button className="mt-3 w-[30%] h-[100%] text-white hover:text-blue-700 border rounded-md border-white" onClick={this.needLogin}>Accedi</button>
                        </div>
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
                        {/* <input type="file" onChange={this.handleFileChange} accept="image/*"/> */}
                        <div style={{backgroundImage: this.state.user.photo ? `url(${this.state.user.photo})` : 'url(/img/photodefault.jpg)', backgroundSize:"cover"}} className="w-24 h-24 border border-slate-800 rounded-[50%] m-2"></div>
                        <div className="w-[30%] flex m-4">
                            <h2 className="m-2">Ciao {this.state.user.name} {this.state.user.surname}</h2>
                            <button className="btn btn-danger m-2" onClick={this.userLogout}>Logout</button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-10">
                        <div className="flex justify-center items-center w-[300px] h-[100px]" data-column="delete" onDragEnter={this.dragEnter} onDragOver={this.dragOver} onDragLeave={this.dragLeave} onDrop={this.dragDrop}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex mt-4">
                        <Tasks unCompleted={true} unCompletedTasks={this.state.unCompletedTasks} setCompleted={this.setCompleted} handleChangeTask={this.handleChangeTask} insertTask={this.insertTask} dragStart={this.dragStart} dragEnd={this.dragEnd} dragOver={this.dragOver} dragEnter={this.dragEnter} dragLeave={this.dragLeave} dragDrop={this.dragDrop} taskName={this.state.tempTask.title} taskDescription={this.state.tempTask.description} />
                        <Tasks completed={true} completedTasks={this.state.completedTasks} setUncompleted={this.setUncompleted} dragStart={this.dragStart} dragEnd={this.dragEnd}  dragOver={this.dragOver} dragEnter={this.dragEnter} dragLeave={this.dragLeave} dragDrop={this.dragDrop}/>
                    </div>
                </div>
            );
        }

    }


}

export default App;
