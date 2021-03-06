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

const ProductCard = ({card}) => {

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
                <Button size="small" color="primary">
                    Subscribe
                </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default ProductCard