import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useStyles from '../../Styles/Style'
import SignOutButton from '../Main/Components/SignOutButton/SignOutButton'
import UpdateName from '../Main/Components/UpdateName/UpdateName'

const GreetingMenu = ({user, setUser, setAuthToken }) => {
    return (
        <>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                {`Hi, ${user.userName}`}
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
                Ready to roll with Stock Station?
            </Typography>
            <div className={useStyles.heroButtons}>
                <br/>
                <Grid container spacing={2} justify="center" >
                <Grid item>
                    <UpdateName user={user} setUser={setUser} />
                </Grid>
                <Grid item>
                    <SignOutButton setUser={setUser} setAuthToken={setAuthToken} />
                </Grid>
                </Grid>
            </div>
        </>
    )
}

export default GreetingMenu;