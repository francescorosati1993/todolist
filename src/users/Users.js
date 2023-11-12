import React from "react"
import 'bootstrap/dist/css/bootstrap.css';
import User from './User'

class Users extends React.Component
{
    constructor(props)
    {
        super(props);
    }


    render()
    {
        
        return (

            <div>
              {this.props.users.map(user => <User user={user}/> )}
            </div>
        );

    }


}

export default Users;