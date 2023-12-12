// Google calendar
// From 10am to 11am   DAILY
// From 13pm to 15pm 1:1
//
// Linear
// In-progress 9am TASK A
// Done 12am TASK A
// In-progress 12am TASK B
// Done 2pm TASK B
// In-progress 1pm TASKC
// Done 4pm TASKC
//
// Time entries
// In-progress 9am to 10am TASK A
// From 10am to 11am   DAILY
// In-progress 11am to 12am TASK A
// In-progress 12am to 1pm TASK B
// From 1pm to 3pm 1:1
// In-progress 3pm to 4pm TASKC
//
import { test } from "node:test";

type LinearIssue = {
  createdAt: string;
  id: string;
  title: string;
  type: "started" | "completed";
};

type TimeEntry = {
  title: string;
  from: string;
  to: string;
  id: string;
};

function newDateFromHour(hour: number): string {
  const date = new Date();
  date.setHours(hour);
  // return date.toString();
  return date.toISOString();
}

function createTimeEntries(entries: Array<LinearIssue>) {
  let timeEntries: Array<TimeEntry> = [];

  for (const entry of entries) {
    const currentEntry = timeEntries.find(
      (item) => item.id === entry.id && entry.type === "completed",
    );

    if (!currentEntry) {
      timeEntries.push({
        id: entry.id,
        title: entry.title,
        from: entry.createdAt,
        to: entry.createdAt,
      });
      continue;
    }

    const rest = timeEntries.filter((item) => item.id !== entry.id);
    timeEntries = [...rest, { ...currentEntry, to: entry.createdAt }];
  }

  return timeEntries;
}

test("should merge the same time entries with start and finish date", () => {
  const linearIssues: Array<LinearIssue> = [
    {
      createdAt: newDateFromHour(9),
      id: "5d25f17c-bef3-492c-8d38-156e58366261",
      title: "TASK A",
      type: "started",
    },
    {
      createdAt: newDateFromHour(12),
      id: "5d25f17c-bef3-492c-8d38-156e58366261",
      title: "TASK A",
      type: "completed",
    },
    {
      createdAt: newDateFromHour(12),
      id: "5d25f17c-bef3-492c-8d38-156e58366268",
      title: "TASK B",
      type: "completed",
    },
    {
      createdAt: newDateFromHour(14),
      id: "5d25f17c-bef3-492c-8d38-156e58366268",
      title: "TASK B",
      type: "completed",
    },
    {
      createdAt: newDateFromHour(13),
      id: "5d25f17c-bef3-492c-8d38-156e58366266",
      title: "TASK C",
      type: "completed",
    },
    {
      createdAt: newDateFromHour(16),
      id: "5d25f17c-bef3-492c-8d38-156e58366266",
      title: "TASK C",
      type: "completed",
    },
  ];
  // Linear
  // In-progress 9am TASK A
  // Done 12am TASK A
  // In-progress 12am TASK B
  // Done 2pm TASK B
  // In-progress 1pm TASKC
  // Done 4pm TASKC
  const entries = createTimeEntries(linearIssues);
  console.log(entries);
  // console.log(linearIssues);
});

test("should create a report from the time entries", () => {
  const linearIssues: Array<LinearIssue> = [
    {
      createdAt: newDateFromHour(9),
      id: "5d25f17c-bef3-492c-8d38-156e58366261",
      title: "TASK A",
      type: "started",
    },
    {
      createdAt: newDateFromHour(12),
      id: "5d25f17c-bef3-492c-8d38-156e58366261",
      title: "TASK A",
      type: "completed",
    },
    {
      createdAt: newDateFromHour(12),
      id: "5d25f17c-bef3-492c-8d38-156e58366268",
      title: "TASK B",
      type: "completed",
    },
    {
      createdAt: newDateFromHour(14),
      id: "5d25f17c-bef3-492c-8d38-156e58366268",
      title: "TASK B",
      type: "completed",
    },
    {
      createdAt: newDateFromHour(13),
      id: "5d25f17c-bef3-492c-8d38-156e58366266",
      title: "TASK C",
      type: "completed",
    },
    {
      createdAt: newDateFromHour(16),
      id: "5d25f17c-bef3-492c-8d38-156e58366266",
      title: "TASK C",
      type: "completed",
    },
  ];
});
