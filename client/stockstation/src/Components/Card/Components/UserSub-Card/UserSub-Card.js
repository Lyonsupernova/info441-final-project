import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useStyles from '../../../../Styles/Style'
import Popup from 'reactjs-popup';
import './UserSub-Card.css'
import api from '../../../../Constants/APIEndpoints/APIEndpoints';

const UserSubCard = ({data, getSubData}) => {

  const deleteSub = async (subscribeID) => {
    console.log(api.base + api.handlers.subscription + `/${subscribeID}`)
    const response = await fetch(api.base + api.handlers.subscription + `/${subscribeID}`, {
        headers: new Headers({ "Authorization": localStorage.getItem("Authorization") }),
        method: 'DELETE',
    });
    if (response.status >= 300) {
        alert("Unable to delete subscription. Please try again");
        return;
    }

    alert("Delete Success!")
    // refresh sub data and re-render
    getSubData()
}

    return (
        <Grid item key={data.subscribeID} xs={12} sm={6} md={4}>
        <Card className={useStyles.card}>
            <CardMedia
            className={useStyles.cardMedia}
            image={data.imageLink}
            title="Image title"
            style={{height: 15 + "em"}}
            />
            <CardContent className={useStyles.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
                {data.productName}
            </Typography>
            <Typography>
                <br/>
                {`Subscribe date: ${data.createdAt}`}
            </Typography>
            </CardContent>
            <CardActions>
            <Popup 
                trigger={<Button size="small" color="primary">Delete</Button>} 
                position="right center" modal nested>

                {close => (
                  <div className="modal">
                    <button className="close" onClick={close}>
                      &times;
                    </button>
                    <div className="header"> Confirm Deletion </div>
                    <div className="content">
                      {' '}
                      Are yous sure to delete this product subscription?
                    </div>
                    <div className="actions">

                    <Button
                          variant='outlined'
                          color='primary'
                          className="button"
                          onClick={() => {
                            console.log('modal closed ');
                            close();
                          }}
                        >
                          Cancel
                      </Button>
                      <Button
                          variant='outlined'
                          color='primary'
                        className="button"
                        onClick={() => {
                          deleteSub(data.subscribeID) // might need to change the "_id" field name
                          close();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
             </Popup>
            </CardActions>
        </Card>
        </Grid>
    )
}

export default UserSubCard