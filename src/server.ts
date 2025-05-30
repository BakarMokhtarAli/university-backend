import app from "./app";
import { connectDB } from "./config/connect";
import { PORT } from "./config/config";
connectDB();

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
