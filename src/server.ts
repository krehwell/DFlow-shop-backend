import "dotenv/config";
import validateEnv from "./utils/validateEnv";
import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import ItemController from "./item/item.controller";
import UserController from "./user/user.controller";
import CartController from "./cart/cart.controller";

validateEnv();

const app = new App([new ItemController(), new AuthenticationController(), new UserController(), new CartController()]);

app.listen();
