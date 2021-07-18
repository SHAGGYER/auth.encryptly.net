const app = require("./app");

const PORT = process.env.NODE_PORT;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
