const a4base = "https://api.yichi.me"
const productionbase =  "https://api.stockstation.gay"


export default {
    base: productionbase,
    testbase: "https://localhost:4000",
    handlers: {
        users: "/v1/users",
        myuser: "/v1/users/me",
        myuserAvatar: "/v1/users/me/avatar",
        sessions: "/v1/sessions",
        sessionsMine: "/v1/sessions/mine",
        resetPasscode: "/v1/resetcodes",
        passwords: "/v1/passwords/",
        product: "/v1/product",
        subscription: "/v1/subscribe"
    }
}
