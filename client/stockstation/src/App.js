import React, { Component } from 'react';
import Auth from './Components/Auth/Auth';
import PageTypes from './Constants/PageTypes/PageTypes';
import Main from './Components/Main/Main';
import './Styles/App.css';
import api from './Constants/APIEndpoints/APIEndpoints';
// marterial-ui template imports
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
//import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import useStyles from './Styles/Style'
import Footer from './Components/Footer/Footer'
import CardType from './Constants/CardTypes/Cardtypes'
import Card from './Components/Card/Card'
import './App.css'
import SignOutButton from './Components/Main/Components/SignOutButton/SignOutButton'
import UpdateName from './Components/Main/Components/UpdateName/UpdateName'

class App extends Component {
    constructor() {
        super();
        this.state = {
            page: localStorage.getItem("Authorization") ? PageTypes.signedInMain : PageTypes.signIn,
            authToken: localStorage.getItem("Authorization") || null,
            user: 2,
            loading: false,
            userSubscriptionData: [1, 2],
            productData: [1, 2]
        }

        this.getCurrentUser()
        this.getSubscriptionData()
    }

    /**
     * @description Gets the users
     */
    getCurrentUser = async () => {
        if (!this.state.authToken) {
            return;
        }
        const response = await fetch(api.base + api.handlers.myuser, {
            headers: new Headers({
                "Authorization": this.state.authToken
            })
        });
        if (response.status >= 300) {
            alert("Unable to verify login. Logging out...");
            localStorage.setItem("Authorization", "");
            this.setAuthToken("");
            this.setUser(null)
            return;
        }
        const user = await response.json()
        this.setUser(user);
    }

    getSubscriptionData = async () => {
        if (!this.state.authToken) {
            return;
        }
        const response = await fetch(api.base + api.handlers.myuser, {
            headers: new Headers({
                "Authorization": this.state.authToken
            }),
            method: "GET"
        });
        if (response.status >= 300) {
            alert("Unable to fetch subscription data. Please try again");
            localStorage.setItem("Authorization", "");
            this.setAuthToken("");
            return;
        }
        // need to convert response to json
        this.setUserSubscriptionData(response.body);
    }

    getProductData = async () => {
        if (!this.state.authToken) {
            return;
        }
        const response = await fetch(api.base + api.handlers.myuser, {
            headers: new Headers({
                "Authorization": this.state.authToken
            }),
            method: "GET"
        });
        if (response.status >= 300) {
            alert("Unable to fetch Product data. Please try again");
            localStorage.setItem("Authorization", "");
            this.setAuthToken("");
            return;
        }
        // need to convert response to json
        this.setProductData(response.body);
    }

    createSubscription = async (product_id, product_name) => {
        if (!this.state.authToken) {
            return;
        }
        const reqData = {product_id, product_name}
        const response = await fetch(api.base + api.handlers.myuser, {
            headers: new Headers({
                "Authorization": this.state.authToken
            }),
            method: "POST",
            body: JSON.stringify(reqData)
        });
        if (response.status >= 300) {
            alert("Unable to fetch Product data. Please try again");
            localStorage.setItem("Authorization", "");
            this.setAuthToken("");
            return;
        }

        this.getSubscriptionData()
    }

    // need to fix this
    deleteSub = async (id) => {
        if (!this.state.authToken) {
            return;
        }

        const reqData = {id}
        
        const response = await fetch(api.base + api.handlers.myuser, {
            headers: new Headers({
                "Authorization": this.state.authToken
            }),
            method: 'DELETE',
            body: JSON.stringify(reqData)
        });
        if (response.status >= 300) {
            alert("Unable to delete subscription. Please try again");
            localStorage.setItem("Authorization", "");
            return;
        }

        // refresh sub data and re-render
        this.getSubscriptionData()
    }
    /**
     * @description sets the page type to sign in
     */
    setPageToSignIn = (e) => {
        e.preventDefault();
        this.setState({ page: PageTypes.signIn });
    }

    /**
     * @description sets the page type to sign up
     */
    setPageToSignUp = (e) => {
        e.preventDefault();
        this.setState({ page: PageTypes.signUp });
    }

    setPage = (e, page) => {
        e.preventDefault();
        this.setState({ page });
    }

    /**
     * @description sets auth token
     */
    setAuthToken = (authToken) => {
        this.setState({ authToken, page: authToken === "" ? PageTypes.signIn : PageTypes.signedInMain });
    }

    /**
     * @description sets the user
     */
    setUser = (user) => {
        this.setState({ user });
    }

    render() {
        const { page, user } = this.state;
        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                    Stock Station
                    </Typography>
                </Toolbar>
                </AppBar>
                <main>
                {/* Hero unit */}
                <div className={useStyles.heroContent}>
                    <Container maxWidth="sm">
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Stock Station
                    </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        Get notificaiton about popular products, instantly
                    </Typography>
                    {user && <div className={useStyles.heroButtons}>
                        <Grid container spacing={2} justify="center" >
                        <Grid item>
                            <UpdateName user={this.user} setUser={this.setUser} />
                        </Grid>
                        <Grid item>
                            <SignOutButton setUser={this.setUser} setAuthToken={this.setAuthToken} />
                        </Grid>
                        </Grid>
                    </div>}
                    </Container>
                </div>

                <div id="auth-page">
                    {!user &&
                        <Auth page={page}
                            setPage={this.setPage}
                            setAuthToken={this.setAuthToken}
                            setUser={this.setUser} />
                    }
                </div>
                {(this.state.userSubscriptionData && user) && 
                    <div id="user-specific-sub-info">
                    <Container className={useStyles.cardGrid} maxWidth="md">
                        {/* End hero unit */}
                        <h1>Currently Available product </h1>
                        <Grid container spacing={4}>
                        {this.state.userSubscriptionData.map((card) => (
                            <Card data={card} cardType={CardType.productCard}/>
                        ))}
                        </Grid>
                    </Container>
                    <Container className={useStyles.cardGrid} maxWidth="md">
                        {/* End hero unit */}
                        <h1>Your Current subscription</h1>
                        <Grid container spacing={4}>
                        {this.state.userSubscriptionData.map((card) => (
                            <Card data={card} cardType={CardType.userSubCard} deleteSub={this.deleteSub}/>
                        ))}
                        </Grid>
                    </Container>
                    </div>}
                </main>

                {/* Footer */}
                <footer className={useStyles.footer}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Stock Station
                    </Typography>
                    <Footer/>
                </footer>
                {/* End footer */}
            </React.Fragment>
        );
    }
}

export default App;