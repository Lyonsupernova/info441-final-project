import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import Button from '@material-ui/core/Button';
import Popup from 'reactjs-popup';

class UpdateName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            error: ''
        }
    }

    sendRequest = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email } = this.state;
        const sendData = { firstName, lastName, email };
        const response = await fetch(api.base + api.handlers.myuser, {
            method: "PATCH",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Authorization": localStorage.getItem("Authorization"),
                "Content-Type": "application/json"
            })
        });
        if (response.status >= 300) {
            const error = await response.text();
            console.log(error);
            this.setError(error);
            return;
        }
        alert("Name changed") // TODO make this better by refactoring errors
        const user = await response.json();
        this.props.setUser(user);
    }

    setValue = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setError = (error) => {
        this.setState({ error })
    }

    render() {
        const { firstName, lastName, email, error } = this.state;
        return <>
            <Errors error={error} setError={this.setError} />

            <Popup 
                trigger={<Button variant="outlined" color="primary">Update User Info</Button>} 
                position="right center" modal nested>

                {close => (
                  <div className="modal">
                    <div>Enter a new name</div>
                    <form onSubmit={this.sendRequest}>
                        <div>
                            <span>First name: </span>
                            <input name={"firstName"} value={firstName} onChange={this.setValue} />
                        </div>
                        <div>
                            <span>Last name: </span>
                            <input name={"lastName"} value={lastName} onChange={this.setValue} />
                        </div>
                        <div>
                            <span>Email: </span>
                            <input name={"email"} value={email} onChange={this.setValue} />
                        </div>
                        <Button size="small" type="submit"> Submit</Button>
                
                        <Button size="small" type="submit" onClick={() => {close()}}>Cancel</Button>
                    </form>
                  </div>
                )}
             </Popup>
        </>
    }

}

export default UpdateName;