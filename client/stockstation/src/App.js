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
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import useStyles from './Styles/Style'
import Footer from './Components/Footer/Footer'
import './App.css'

class App extends Component {
    constructor() {
        super();
        this.state = {
            page: localStorage.getItem("Authorization") ? PageTypes.signedInMain : PageTypes.signIn,
            authToken: localStorage.getItem("Authorization") || null,
            user: null,
            userSubscriptionData: null
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
            })
        });
        if (response.status >= 300) {
            alert("Unable to fetch subscription data. Please try again");
            localStorage.setItem("Authorization", "");
            this.setAuthToken("");
            this.setUser(null)
            return;
        }
        // need to convert response to json
        this.setUserSubscriptionData(response);
    }

    // need to fix this
    deleteSubscription = async () => {
        if (!this.state.authToken) {
            return;
        }
        const response = await fetch(api.base + api.handlers.myuser, {
            headers: new Headers({
                "Authorization": this.state.authToken
            })
        });
        if (response.status >= 300) {
            alert("Unable to fetch subscription data. Please try again");
            localStorage.setItem("Authorization", "");
            this.setAuthToken("");
            this.setUser(null)
            return;
        }
        // need to convert response to json
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

    Copyright = () => {
        return (
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
              Yichi Zhang, Lyon Lu, Wendell Li, Lance Zhong
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        );
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
                    <div className={useStyles.heroButtons}>
                        <Grid container spacing={2} justify="center">
                        <Grid item>
                            <Button variant="contained" color="primary">
                            Main call to action
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary">
                            Secondary action
                            </Button>
                        </Grid>
                        </Grid>
                    </div>
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
                            <Grid item key={card} xs={12} sm={6} md={4}>
                            <Card className={useStyles.card}>
                                <CardMedia
                                className={useStyles.cardMedia}
                                image="https://source.unsplash.com/random"
                                title="Image title"
                                />
                                <CardContent className={useStyles.cardContent}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Heading
                                </Typography>
                                <Typography>
                                    This is a media card. You can use this section to describe the content.
                                </Typography>
                                </CardContent>
                                <CardActions>
                                <Button size="small" color="primary">
                                    Subscribe
                                </Button>
                                </CardActions>
                            </Card>
                            </Grid>
                        ))}
                        </Grid>
                    </Container>
                    <Container className={useStyles.cardGrid} maxWidth="md">
                        {/* End hero unit */}
                        <h1>Your Current subscription</h1>
                        <Grid container spacing={4}>
                        {this.state.userSubscriptionData.map((card) => (
                            <Grid item key={card} xs={12} sm={6} md={4}>
                            <Card className={useStyles.card}>
                                <CardMedia
                                className={useStyles.cardMedia}
                                image="https://source.unsplash.com/random"
                                title="Image title"
                                />
                                <CardContent className={useStyles.cardContent}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Heading
                                </Typography>
                                <Typography>
                                    This is a media card. You can use this section to describe the content.
                                </Typography>
                                </CardContent>
                                <CardActions>
                                <Button size="small" color="primary">
                                    Edit
                                </Button>
                                <Button size="small" color="primary">
                                    Delete
                                </Button>
                                </CardActions>
                            </Card>
                            </Grid>
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