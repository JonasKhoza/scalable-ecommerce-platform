import app from "./app";
import { onShutDowngracefullyClosePool } from "./utils/databaseConfig";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

onShutDowngracefullyClosePool();
