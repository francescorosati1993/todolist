import React from "react"
import 'bootstrap/dist/css/bootstrap.css';

class User extends React.Component
{
    constructor(props)
    {
        super(props);
    }


    render()
    {
        
        return (

            <div>
              <div>{this.props.user.name}</div>
            </div>
        );

    }


}

export default User;