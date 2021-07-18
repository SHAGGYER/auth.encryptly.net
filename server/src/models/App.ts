import mongoose from "mongoose";

export interface IApp extends mongoose.Document {
  name: string;
  clientId: string;
  clientSecret: string;
  url: string;
  redirectUrl: string;
  fields: string;
}

const AppSchema = new mongoose.Schema<IApp>(
  {
    name: String,
    clientId: String,
    clientSecret: String,
    url: String,
    redirectUrl: String,
    fields: String,
  },
  {
    timestamps: true,
  }
);

const App = mongoose.model<IApp>("App", AppSchema, "apps");
export default App;
