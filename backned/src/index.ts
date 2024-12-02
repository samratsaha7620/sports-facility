import express,{Request , Response} from "express";
import cors from "cors";
import adminRouter from "./routes/admin/index"
import userRouter from "./routes/user.routes";
import clubRouter from "./routes/club/index";
import applicationRouter from "./routes/application/index";
import documentRouter from "./routes/uploads/index";
import getAuthenticatedUserRouter from "./routes/auth/index";
import paymentsRouter from "./routes/payments/index";

const port  = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req:Request ,res:Response)=>{
  res.send("Health is ok!");
})

app.use("/api/v1/auth/me",getAuthenticatedUserRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/clubs",clubRouter);
app.use('/api/v1/applications',applicationRouter);
app.use('/api/v1/document',documentRouter);
app.use('/api/v1/payments',paymentsRouter);



app.listen(port, () =>{
  console.log(`server is running on ${port}`);
})

