import assert from "node:assert";
import { test } from "node:test";
import {
  LinearIssue,
  TimeEntries,
  convertLinearIssueToTimeEntry,
  formatCalendarEventIntoTimeEntry,
} from "./formater";

test("should format the google calendar payload to a time entry", () => {
  const payload = [
    {
      id: "29o4r124bc9imuj2d0cds1trrd",
      status: "confirmed",
      summary: "Finalizar base design system",
      start: {
        dateTime: "2023-12-12T16:30:00+01:00",
        timeZone: "Europe/Berlin",
      },
      end: {
        dateTime: "2023-12-12T17:30:00+01:00",
        timeZone: "Europe/Berlin",
      },
    },
    {
      id: "0m5pi1dg730hhjf52bmb26pfr1",
      status: "confirmed",
      summary: "Finalizar Livebook",
      start: {
        dateTime: "2023-12-12T10:00:00+01:00",
        timeZone: "Europe/Berlin",
      },
      end: {
        dateTime: "2023-12-12T10:30:00+01:00",
        timeZone: "Europe/Berlin",
      },
    },
  ];

  const expected: TimeEntries = [
    {
      id: "29o4r124bc9imuj2d0cds1trrd",
      title: "Finalizar base design system",
      start: "2023-12-12T16:30:00+01:00",
      end: "2023-12-12T17:30:00+01:00",
    },
    {
      id: "0m5pi1dg730hhjf52bmb26pfr1",
      title: "Finalizar Livebook",
      start: "2023-12-12T10:00:00+01:00",
      end: "2023-12-12T10:30:00+01:00",
    },
  ];
  assert.deepEqual(formatCalendarEventIntoTimeEntry(payload), expected);
});

test("should format linear issues to time entries", () => {
  const issues: Array<LinearIssue> = [
    {
      createdAt: "2023-12-12T15:39:06.470Z",
      id: "ebc6df11-f8ed-485b-9cab-ad2413c15580",
      title: "Use Cycles to focus work over n–weeks",
      type: "started",
    },
    {
      createdAt: "2023-12-12T15:39:41.748Z",
      id: "ebc6df11-f8ed-485b-9cab-ad2413c15580",
      title: "Use Cycles to focus work over n–weeks",
      type: "completed",
    },
    {
      createdAt: "2023-12-12T15:40:30.739Z",
      id: "f646bb2b-3a70-4644-acf5-a104370afe80",
      title: "Use Projects to organize work for features or releases",
      type: "started",
    },
    {
      createdAt: "2023-12-12T15:40:40.609Z",
      id: "a94a6a43-233f-48c8-83fe-d49be65f46ea",
      title: "Next steps",
      type: "started",
    },
  ];
  console.log(convertLinearIssueToTimeEntry(issues));
});
