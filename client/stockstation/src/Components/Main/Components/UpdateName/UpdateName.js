import React, { Component } from 'react';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import Button from '@material-ui/core/Button';
import Popup from 'reactjs-popup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#11cb5f',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#11cb5f',
      },
    },
  });

class UpdateName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
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
        const { firstName, lastName, error } = this.state;
        return <>
            <Errors error={error} setError={this.setError} />

            <Popup 
                trigger={<Button variant="outlined" color="primary">Update User Info</Button>} 
                position="right center" modal nested>

                {close => (
                  <div className="modal">
                    <Typography>Enter a new name</Typography>
                    <form onSubmit={this.sendRequest}>
                        <div >
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="firstName"
                                name="firstName"
                                autoComplete="firstName"
                                autoFocus
                                type=''
                                onChange={this.setValue}
                                value={firstName}
                                size="small"
                            />
                        </div>
                        <div >
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="lastName"
                                label="lastName"
                                name="lastName"
                                autoComplete="lastName"
                                autoFocus
                                type=''
                                onChange={this.setValue}
                                value={lastName}
                                size="small"
                            />
                        </div>
                        <Button size="small" type="submit" color="primary"> Submit</Button>
                
                        <Button size="small" color="primary" onClick={() => {close()}}>Cancel</Button>
                    </form>
                  </div>
                )}
             </Popup>
        </>
    }

}

export default UpdateName;