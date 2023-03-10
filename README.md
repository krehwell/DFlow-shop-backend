# DFlow Shop API

For DFlow technical challenge

- Walkthorugh link: https://youtu.be/CmBpSTa2UpE

_np: in this repo, I pushed `.env` (includes db URI, etc) which normally should not, but for the sake of simplicity I shared it anyway_

## Installation
```bash
# install packages
yarn

# run the server
yarn dev
```

Test API using Postman API script the you can import inside `./misc/DFlow-shop.postman_collection.json`

## Project Structure
```bash
├── misc
│   └── DFlow-shop.postman_collection.json                       # postman API testing template
├── package.json
├── README.md
├── src
│   ├── app.ts                                                   # server, db, etc initializer
│   ├── authentication                                           # auth routes handler
│   │   ├── authentication.controller.ts
│   │   ├── authentication.service.ts
│   │   └── logIn.dto.ts
│   ├── cart                                                     # cart routes handler
│   │   ├── cart.controller.ts
│   │   ├── cart.dto.ts
│   │   ├── cart.interface.ts
│   │   └── cart.model.ts
│   ├── exceptions                                               # error wrappers
│   │   ├── AuthenticationTokenMissingException.ts
│   │   ├── HttpException.ts
│   │   ├── NotAuthorizedException.ts
│   │   ├── NotFoundException.ts
│   │   ├── UserNotFoundException.ts
│   │   ├── UserWithThatUsernameAlreadyExistsException.ts
│   │   ├── WrongAuthenticationTokenException.ts
│   │   └── WrongCredentialsException.ts
│   ├── interfaces                                                # typescript types
│   │   ├── controller.interface.ts
│   │   ├── dataStoredInToken.ts
│   │   ├── requestWithUser.interface.ts
│   │   └── tokenData.interface.ts
│   ├── item                                                      # shop product (item) routes handler
│   │   ├── item.controller.ts
│   │   ├── item.dto.ts
│   │   ├── item.interface.ts
│   │   └── item.model.ts
│   ├── middleware                                                # middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── validation.middleware.ts
│   ├── server.ts                                                 # main
│   ├── user                                                      # user routes handler
│   │   ├── user.controller.ts
│   │   ├── user.dto.ts
│   │   ├── user.interface.ts
│   │   └── user.model.ts
│   └── utils
│       └── validateEnv.ts
├── tsconfig.json
├── tslint.json
└── yarn.lock
```
