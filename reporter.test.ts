// Google calendar
// From 10am end 11am   DAILY
// From 13pm end 15pm 1:1
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
// In-progress 9am end 10am TASK A
// From 10am end 11am   DAILY
// In-progress 11am end 12am TASK A
// In-progress 12am end 1pm TASK B
// From 1pm end 3pm 1:1
// In-progress 3pm end 4pm TASKC
//
import assert from "node:assert";
import { test } from "node:test";

type LinearIssue = {
  createdAt: string;
  id: string;
  title: string;
  type: "started" | "completed";
};

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};

type TimeEntry = {
  id: string;
  title: string;
  start: string;
  end: string;
};

type TimeEntries = Array<TimeEntry>;

function mergeTimeEntries(
  priorityEntries: TimeEntries,
  regularEntries: TimeEntries,
): TimeEntries {
  let result: TimeEntries = [];
  const prioritiesToIgnore: Array<string> = [];

  for (const regular of regularEntries) {
    priorityEntries.find((priority) => {
      if (
        new Date(regular.start).getTime() > new Date(priority.start).getTime()
      ) {
        return false;
      }

      const before =
        new Date(regular.start).getTime() < new Date(priority.start).getTime();
      if (before) {
        result.push({ ...regular, end: priority.start });
      }
      return before;
    });

    priorityEntries.find((priority) => {
      if (
        new Date(regular.start).getTime() > new Date(priority.start).getTime()
      ) {
        return false;
      }
      const timeEntryContinuesAfterPriority =
        new Date(regular.end).getTime() > new Date(priority.end).getTime();

      if (timeEntryContinuesAfterPriority) {
        prioritiesToIgnore.push(priority.id);
        result.push(priority);
        result.push({ ...regular, start: priority.end });
      }

      return timeEntryContinuesAfterPriority;
    });
  }

  return result;
}

function convertTimeEntriesToDateString(entries: TimeEntries) {
  return entries.map((entry) => ({
    ...entry,
    start: new Date(entry.start).toDateString(),
    end: new Date(entry.end).toDateString(),
  }));
}

function newDateFromHour(hour: number): string {
  const date = new Date();
  date.setHours(hour);
  return date.toISOString();
}

function convertLinearIssueToTimeEntry(entries: Array<LinearIssue>) {
  let timeEntries: Array<TimeEntry> = [];

  for (const entry of entries) {
    const currentEntry = timeEntries.find(
      (item) => item.id === entry.id && entry.type === "completed",
    );

    if (!currentEntry) {
      timeEntries.push({
        id: entry.id,
        title: entry.title,
        start: entry.createdAt,
        end: entry.createdAt,
      });
      continue;
    }

    const rest = timeEntries.filter((item) => item.id !== entry.id);
    timeEntries = [...rest, { ...currentEntry, end: entry.createdAt }];
  }

  return timeEntries;
}

test("should create a report start the time entries", () => {
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
  const calendarEvents: Array<CalendarEvent> = [
    {
      start: newDateFromHour(10),
      end: newDateFromHour(11),
      id: "5d25f17c-bef3-492c-8d38-156e58366261",
      title: "Daily",
    },
    {
      start: newDateFromHour(13),
      end: newDateFromHour(15),
      id: "5d25f17c-bef3-492c-8d38-156e58366261",
      title: "Presentation",
    },
  ];

  const result: TimeEntries = mergeTimeEntries(
    calendarEvents,
    convertLinearIssueToTimeEntry(linearIssues),
  );
  const expected: TimeEntries = [
    {
      id: "5d25f17c-bef3-492c-8d38-156e58366261",
      title: "TASK A",
      start: newDateFromHour(9),
      end: newDateFromHour(10),
    },
    {
      start: newDateFromHour(10),
      end: newDateFromHour(11),
      id: "5d25f17c-bef3-492c-8d38-156e58366261",
      title: "Daily",
    },
    {
      id: "5d25f17c-bef3-492c-8d38-156e58366261",
      title: "TASK A",
      start: newDateFromHour(11),
      end: newDateFromHour(12),
    },
    {
      id: "5d25f17c-bef3-492c-8d38-156e58366268",
      title: "TASK B",
      start: newDateFromHour(12),
      end: newDateFromHour(13),
    },
    {
      start: newDateFromHour(13),
      end: newDateFromHour(15),
      id: "5d25f17c-bef3-492c-8d38-156e58366261",
      title: "Presentation",
    },
    {
      id: "5d25f17c-bef3-492c-8d38-156e58366266",
      title: "TASK C",
      start: newDateFromHour(15),
      end: newDateFromHour(16),
    },
  ];

  assert.deepEqual(
    convertTimeEntriesToDateString(result),
    convertTimeEntriesToDateString(expected),
  );
});
