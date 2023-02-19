import "dotenv/config";
import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import ItemController from "./item/item.controller";
import UserController from "./user/user.controller";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new ItemController(), new AuthenticationController(), new UserController()]);

app.listen();
