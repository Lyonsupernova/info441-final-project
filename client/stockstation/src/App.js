import React, { Component } from 'react';
import Auth from './Components/Auth/Auth';
import PageTypes from './Constants/PageTypes/PageTypes';
import './Styles/App.css';
import api from './Constants/APIEndpoints/APIEndpoints';
// marterial-ui template imports
import AppBar from '@material-ui/core/AppBar';
//import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import useStyles from './Styles/Style'
import theme from './Styles/theme'
import Footer from './Components/Footer/Footer'
import CardType from './Constants/CardTypes/Cardtypes'
import Card from './Components/Card/Card'
import './App.css'
import MOCK_SUBSCRIPTION_DATA from './Constants/StaticData/Mock-sub-data'
import MOCK_PRODUCT_DATA from './Constants/StaticData/Mock-product-data'
import GreetingAuth from './Components/Greeting-auth/Greeting-auth'
import GreetingMenu from './Components/Greeting-menu/Greeting-menu'
import { ThemeProvider } from '@material-ui/styles';

class App extends Component {
    constructor() {
        super();
        this.state = {
            page: localStorage.getItem("Authorization") ? PageTypes.signedInMain : PageTypes.signIn,
            authToken: localStorage.getItem("Authorization") || null,
            user: null,
            loading: false,
            userSubscriptionData: null,
            productData: null
        }
        console.log("user is: ", this.state.user)
        console.log("auth token is: ", this.state.authToken)
        console.log("page is: ", this.state.page)

        this.getCurrentUser()
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

        // get user-specific data after retrieved user data
        this.getSubscriptionData()
        this.getProductData()

        console.log("user is: ", this.state.user)
        console.log("auth token is: ", this.state.authToken)
        console.log("page is: ", this.state.page)
    }

    getSubscriptionData = async () => {
        if (!this.state.authToken) {
            return;
        }
        const response = await fetch(api.base + api.handlers.subscription, {
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

        const subscriptionData = await response.json()
        this.setUserSubscriptionData(subscriptionData)
    }

    getProductData = async () => {
        if (!this.state.authToken) {
            return;
        }
        const response = await fetch(api.base + api.handlers.product, {
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

        const productData = await response.json()
        this.setProductData(productData);
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
   
        console.log("user is: ", this.state.user)
        console.log("auth token is: ", this.state.authToken)
        console.log("page is: ", this.state.page)
    }

    /**
     * @description sets the user
     */
    setUser = (user) => {
        this.setState({ user });
    }

    /**
     * @description sets the user subscription data
     */
    setUserSubscriptionData = (data) => {
        this.setState({ userSubscriptionData: data });
    }

    /**
     * @description sets available product data
     */
    setProductData = (data) => {
        this.setState({productData: data})

        console.log("user is: ", this.state.user)
        console.log("auth token is: ", this.state.authToken)
        console.log("page is: ", this.state.page)
    }

    render() {
        const { page, user, userSubscriptionData, productData} = this.state;
        return (
            <div id="main-container">

            <ThemeProvider theme={theme}>
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
                    <div className={useStyles.heroContent} id="Greeting">
                        <Container maxWidth="sm">
                            {!user ? (<GreetingAuth/>) : (<GreetingMenu user={user} setUser={this.setUser} setAuthToken={this.setAuthToken}/>)}
                        </Container>
                    </div>

                    <div id="auth-page">
                        {(!user || this.state.page === PageTypes.signIn) &&
                            <Auth page={page}
                                setPage={this.setPage}
                                setAuthToken={this.setAuthToken}
                                setUser={this.setUser} />
                        }
                    </div>

                    {(user && this.state.page === PageTypes.signedInMain) && 
                        <div id="user-specific-info">
                        <Container className={useStyles.cardGrid} maxWidth="md">
                            {/* End hero unit */}
                            <h1>Currently Available product </h1>
                            <Grid container spacing={4}>
                            {productData && productData.map((card) => (
                                <Card data={card} cardType={CardType.productCard} getSubData={this.getSubscriptionData} />
                            ))}
                            </Grid>
                        </Container>
                        <Container className={useStyles.cardGrid} maxWidth="md">
                            {/* End hero unit */}
                            <h1>Your Current subscription</h1>
                            <Grid container spacing={4}>
                            {userSubscriptionData && userSubscriptionData.map((card) => (
                                <Card data={card} cardType={CardType.userSubCard} getSubData={this.getSubscriptionData}/>
                            ))}

                            {!userSubscriptionData && 
                                <Typography component="h4" variant="h2" align="center" color="textPrimary" gutterBottom>
                                    Stock Station
                                </Typography>
                            }
                            </Grid>
                        </Container>
                        </div>}
                </main>

                {/* Footer */}
                <footer className={useStyles.footer}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Stock Station
                    </Typography>
                    <Footer />
                </footer>
                {/* End footer */}
                </ThemeProvider> 
            </div>
        );
    }
}

export default App;