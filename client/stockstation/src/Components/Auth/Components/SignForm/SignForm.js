import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const SignForm = ({ setField, submitForm, values, fields }) => {
    return <>
        <form onSubmit={submitForm}>
            {fields.map(d => {
                const { key } = d;
                return <div key={key}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={key}
                        name={key}
                        autoComplete="email"
                        autoFocus
                        type={key === "password" || key === "passwordConf" ? "password" : ''}
                        onChange={setField}
                        value={values[key]}
                        size="small"
                    />
                </div>
            })}
            <div id="auth-submit-container">
                <Button size="small" color="primary" variant="outlined" type="submit"> Submit</Button>
            </div>
        </form>
    </>
}

SignForm.propTypes = {
    setField: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    values: PropTypes.shape({
        email: PropTypes.string.isRequired,
        userName: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        password: PropTypes.string.isRequired,
        passwordConf: PropTypes.string
    }),
    fields: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        name: PropTypes.string
    }))
}

export default SignForm;