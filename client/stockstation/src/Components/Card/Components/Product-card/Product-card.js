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
import api from '../../../../Constants/APIEndpoints/APIEndpoints';

const ProductCard = ({ data, getSubData }) => {

    const createSubscription = async (productID) => {
        const reqData = {productID: productID}
        console.log(reqData)
        const response = await fetch(api.base + api.handlers.subscription, {
            headers: new Headers({ "Authorization": localStorage.getItem("Authorization"), "Content-Type": "application/json" }),
            method: "POST",
            body: JSON.stringify(reqData)
        });
        if (response.status >= 300) {
            console.log(response)
            alert("Unable to create subscription Product data. Please try again");
            return;
        }
        
        alert("Subscription Successful!");
        getSubData()
    }

    return (
        <Grid item key={data.productName} xs={12} sm={6} md={4}>
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
                    {data.description}
                </Typography>

                <Typography>
                    <br/>
                    <a href={data.productLink} className='product-link'>Link to the product </a>
                </Typography>
                </CardContent>
                <CardActions>
                <Popup 
                trigger={<Button size="small" color="primary">Subscribe</Button>} 
                position="right center" modal nested>

                {close => (
                  <div className="modal">
                    <button className="close" onClick={close}>
                      &times;
                    </button>
                    <div className="header"> Subscription Confirmation</div>
                    <div className="content">
                      {' '}
                      Please click to confirm your subscription
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
                          createSubscription(data.productID);
                          close();
                        }}
                      >
                        Confirm
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



export default ProductCard