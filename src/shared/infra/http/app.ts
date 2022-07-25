import "reflect-metadata"
import "dotenv/config"
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors"
import swaggerUI from "swagger-ui-express"

import "@shared/container"
import upload from "@config/upload";
import { AppError } from "@shared/errors/AppError";
import createConnection from "@shared/infra/typeorm"

import swaggerFile from "../../../swagger.json"
import { router } from "./routes";

createConnection()
const app = express();

app.use(express.json())

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile))

app.use("/avatar", express.static(`${upload.tmpfolder}/avatar`))
app.use("/cars", express.static(`${upload.tmpfolder}/cars`))

app.use(router)

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if(err instanceof AppError){
        return response.status(err.statusCode).json({message: err.message})
    }

    return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    })
})

export { app }