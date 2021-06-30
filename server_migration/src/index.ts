import express from "express"
const app = express();
const port = 3001; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req: HTTPRequest, res: HTTPResponse ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );