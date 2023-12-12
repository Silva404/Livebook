import express from "express";
import { google } from "googleapis";

const app = express();

const clientId =
  "927378287728-28f4effa0tau75a8ebm5e78hv8njm01m.apps.googleusercontent.com";
const clientSecret = "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";
const redirectURL = "http://127.0.0.1:3000";
const scope = "https://www.googleapis.com/auth/calendar";
const API_KEY = "";

const authClient = new google.auth.OAuth2(clientId, clientSecret, redirectURL);
const calendar = google.calendar({ version: "v3", auth: API_KEY });

app.get("/login", (_, res) => {
  const url = authClient.generateAuthUrl({ access_type: "offline", scope });
  console.log(url);
  res.redirect(url);
});

app.get("/", async (req, res) => {
  const code = req.query["code"] as string;
  const { tokens } = await authClient.getToken(code);
  console.log(tokens);
  authClient.setCredentials(tokens);
  res.send("yay");
});

app.get("/google/redirect", async (req) => {
  const code = req.query["code"];
  console.log(code);
  // const data = await authClient.getToken(code);
  // console.log(data);
  // authClient.setCredentials(tokens);
});

app.listen(3000, () => {
  console.log("started🤘");
});
