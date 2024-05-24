import express from 'express'
import  userRouter from './routers/user'
import workerRouter from './routers/worker'
export const JWT_SECRET = "gg12345"
const app = express()

//postgres+ prisma => ORM

app.use("/v1/user", userRouter)
app.use("/v1/workers",workerRouter)

app.listen(8080)

