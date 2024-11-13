import express,{Request , Response} from "express";
import cors from "cors";
import userRouter from "./routes/user.routes";
import clubRouter from "./routes/club/index";
import applicationRouter from "./routes/application/index";
import documentRouter from "./routes/uploads/index"
const port  = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req:Request ,res:Response)=>{
  res.send("Health is ok!");
})

app.use("/api/v1/users", userRouter);
app.use("/api/v1/clubs",clubRouter);
app.use('/api/v1/applications',applicationRouter);
app.use('/api/v1/document',documentRouter);


app.listen(port, () =>{
  console.log(`server is running on ${port}`);
})

