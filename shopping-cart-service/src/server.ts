import app from "./app";
import { onShutDowngracefullyClosePool } from "./utils/databaseConfig";

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

onShutDowngracefullyClosePool();
