import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../../../Constants/APIEndpoints/APIEndpoints';
import Errors from '../../../Errors/Errors';
import Button from '@material-ui/core/Button';

const SignOutButton = ({ setAuthToken, setUser }) => {
    const [error, setError] = useState("");

    return <><Button variant="outlined" color="primary" onClick={async (e) => {
        e.preventDefault();
        const response = await fetch(api.base + api.handlers.sessionsMine, {
            method: "DELETE",
            headers: new Headers({ "Authorization": localStorage.getItem("Authorization") })
        });
        if (response.status >= 300) {
            const error = await response.text();
            setError(error);
            return;
        }
        localStorage.removeItem("Authorization");
        setError("");
        setAuthToken("");
        setUser(null);
    }}>Sign out</Button>
        {error &&
            <div>
                <Errors error={error} setError={setError} />
            </div>
        }
    </>
}

SignOutButton.propTypes = {
    setAuthToken: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired
}

export default SignOutButton;