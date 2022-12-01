import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
// import dotenv from 'dotenv'
//set directory dirname 
// const __dirname = path.dirname(fileURLToPath(import.meta.url))
// dotenv.config({ path: path.join(__dirname, './config/.env') })
import express from 'express'
import * as indexRouter from './src/modules/index.router.js'
import connectDB from './DB/connection.js'
import { globalErrorHandling } from './src/services/errorHandling.js'
import morgan from 'morgan'
import { addFirstAdmin } from './src/services/admin.js'
const app = express()
// setup port and the baseUrl
const port = process.env.PORT || 5000
const baseUrl = process.env.BASEURL
//convert Buffer Data
app.use(express.json())
app.use(express.urlencoded({extended:true}));

if(process.env.MODE == "dev"){
    app.use(morgan('dev'))
}else{
    app.use(morgan('combined'))
}
addFirstAdmin()
//Setup API Routing 
app.use(`${baseUrl}/auth`, indexRouter.authRouter)
app.use(`${baseUrl}/user`, indexRouter.userRouter)
app.use(`${baseUrl}/product`, indexRouter.productRouter)
app.use(`${baseUrl}/category`, indexRouter.categoryRouter)
app.use(`${baseUrl}/subCategory`, indexRouter.subcategoryRouter)
app.use(`${baseUrl}/reviews`, indexRouter.reviewsRouter)
app.use(`${baseUrl}/coupon`, indexRouter.couponRouter)
app.use(`${baseUrl}/cart`, indexRouter.cartRouter)
app.use(`${baseUrl}/order`, indexRouter.orderRouter)
app.use(`${baseUrl}/brand`, indexRouter.branRouter)

app.use('*', (req, res, next) => {
    // res.send("In-valid Routing Plz check url  or  method")
    res.status(404).json({message:"In-valid Routing Plz check url  or  method"})
})

app.use( globalErrorHandling )
connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))