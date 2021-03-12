import Typography from '@material-ui/core/Typography';

const GreetingAuth = () => {
    return (
        <>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Stock Station
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
                Get notificaiton about popular products, instantly
            </Typography>
        </>
    )
}

export default GreetingAuth;