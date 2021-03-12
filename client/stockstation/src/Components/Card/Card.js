import CardType from '../../Constants/CardTypes/Cardtypes'
import UserSubCard from './Components/UserSub-Card/UserSub-Card'
import ProductCard from './Components/Product-card/Product-card'

const Card = (props) => {
    switch (props.cardType) {
        case CardType.productCard:
            return <ProductCard data={props.data} getSubData={props.getSubData}/>;
        case CardType.userSubCard:
            return <UserSubCard data={props.data} getSubData={props.getSubData}/>; 
        default: 
            return null
    }
}

export default Card