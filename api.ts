import express, { Request, Response } from "express";
import { google } from "googleapis";
import bodyParser from "body-parser";
import {
  GoogleCalendarPayload,
  formatCalendarEventIntoTimeEntry,
} from "./formater";

const app = express();

const clientId =
  "927378287728-28f4effa0tau75a8ebm5e78hv8njm01m.apps.googleusercontent.com";
const clientSecret = "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";
const redirectURL = "http://127.0.0.1:3000";
const scope = "https://www.googleapis.com/auth/calendar";
const API_KEY = "AIzaSyAHghvkkzPg0YS6evYgNbKoLBDH0GNt4T8";
// const LINEAR_KEY = "lin_api_W3ampBslbM5YlZe8ZCP7yki888CkubwMRxHo5J1M";

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectURL,
);
const calendar = google.calendar({ version: "v3", auth: API_KEY });

app.use(bodyParser.json());

app.get("/login", (_, res) => {
  const url = oauth2Client.generateAuthUrl({ access_type: "offline", scope });
  console.log(url);
  res.redirect(url);
});

app.get("/", async (req, res) => {
  const code = req.query["code"] as string;
  const { tokens } = await oauth2Client.getToken(code);
  console.log(tokens);
  oauth2Client.setCredentials(tokens);

  const date = new Date().toISOString().split("T")[0];

  const {
    data: { items },
  } = await calendar.events.list({
    calendarId: "primary",
    auth: oauth2Client,
    timeMin: `${date}T00:00:00Z`,
    timeMax: `${date}T23:59:59Z`,
    maxResults: 10,
  });
  const data = formatCalendarEventIntoTimeEntry(items as GoogleCalendarPayload);
  console.log(data);

  res.send("yay");
});

app.post("/linear", (req: Request, res: Response) => {
  const payload = req.body;
  const data = {
    created_at: payload.createdAt,
    id: payload.data.id,
    title: payload.data.title,
    state: payload.data.state.type,
  };
  // insert it
  console.log(data);
  res.send(200);
});

app.listen(3000, () => {
  console.log("started🤘");
});
