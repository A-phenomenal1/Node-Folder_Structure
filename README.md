# Clean Architecture and 3 Layer Architecture

===

## Flow of Architecture

1. package.json script "start" run by
   `npm start`

2. app.js executed
3. line 10 execute ./db/index.js file, which connect backend with sql database.
4. line 18 of app.js is a testing backend route
   `http://localhost:9090/ `
   ##### Shows "This is the backend"
   else you haven't setup ./db/index.js file correctly
5. line 22 and 23 are non auth routes which haven't use middleware
6. line 25 is a middleware which only run on /authusers route address. if you are going to use only this middleware to many of the route address then you can just use `app.use(authorization)` at bottom most.
7. line 27 is auth routes.
8. line 29-31 runs the server at port **9090**

===

## Folder Structure

#### All important folders are inside _src_

1. **api** folder consists middleware and routes
   ...**middleware**
   ...It contains all Middlewares
   ...**routes**
   ...It currently stores two routes files one is for _auth routes_ and second one is for _non-auth routes_.
2. **config** folder consists all configuration files. at present it is empty.
3. **controllers** folder is use to control the routes to different routes files. at present one controller file is present name _user.controller.js_ which export two functions. one is to control _non-auth routes_ of user and second is for controlling _auth routes_ of user.
4. **db** folder consist one file _index.js_ which is used to set-up database.
5. **helpers** folder consists all helping files which reduce the redundancy of codes in backend structure.
   ...like _adapt-request.js_ is use for converting the route req in a formatted way.
   ..._errors.js_ is use for exporting three `server error` in a formatted way.
   ..._UniqueConstraintError_ occurs when user is going to add a duplicate data in server
   ..._InvalidPropertyError_ occurs due to apsence of used modules in our package or some dependencies absence.
   ..._RequiredParameterError_ occurs when user not sending required parameter to route/routes.
   ..._http-error_ is used to export customized and formatted error
   ...so on.
6. **models** folder consist all model file, currently it consists _user.model.js_ which validate user inputs. we are going to decreace the dependency of our backend on mpm modules.
7. **services** folder all functions which can be used many times in other folders.

===

## Route File Flow.

1. First _route_ should saperate by _method_ and then saperate by _path_. and on path it select a _function_ which returns their required data with the help of services.

===

## Controller File Flow

1. First it make a well formatted _request_ and store it in _httpRequest_.
2. Then it sends that httpRequest to particular _Route file_.

===
