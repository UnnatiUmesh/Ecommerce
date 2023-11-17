const app = require("./app");


const dotenv = require("dotenv");

dotenv.config({})

//handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error : ${err.message}`)
    console.log("shutting down the server due to unhandled promise rejection");
    process.exit(1);
})


const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running in https://localhost/${process.env.PORT}`)
})







//unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error':${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
}
)
