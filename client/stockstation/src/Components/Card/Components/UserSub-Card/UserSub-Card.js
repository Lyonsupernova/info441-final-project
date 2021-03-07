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

const UserSubCard = ({card, deleteSub}) => {

    // need a function to make a delete request 

    return (
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
            <Popup 
                trigger={<Button size="small" color="primary">Delete</Button>} 
                position="right center" modal nested>

                {close => (
                  <div className="modal">
                    <button className="close" onClick={close}>
                      &times;
                    </button>
                    <div className="header"> Modal Title </div>
                    <div className="content">
                      {' '}
                      Are yous sure to delete this product subscription?
                    </div>
                    <div className="actions">

                      <button
                          className="button"
                          onClick={() => {
                            console.log('modal closed ');
                            close();
                          }}
                        >
                          Cancel
                      </button>
                      <button
                        className="button"
                        onClick={() => {
                          deleteSub(card._id) // might need to change the "_id" field name
                          close();
                        }}
                      >
                        Delete
                      </button>
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