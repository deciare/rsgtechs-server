import * as Express from "express";
import RegionRouter from "./routes/region";

// Port number application should listen on
var port: number = 3000;

// Instantiate Express application.
var app: Express.Application = Express();

// Basic route to confirm the application is listening for connections.
app.get("/", function (req, res) {
	res.send("Application is running");
})

// Delegate route handling to specialised router modules.
app.use("/region", RegionRouter);

// Begin listening for connections.
app.listen(port, function () {
	console.log("Listening on port", port);
})
