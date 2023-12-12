export type GoogleCalendarPayload = Array<{
  id: string;
  status: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}>;

export type LinearIssue = {
  createdAt: string;
  id: string;
  title: string;
  type: "started" | "completed";
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};

export type TimeEntry = {
  id: string;
  title: string;
  start: string;
  end: string;
};

export type TimeEntries = Array<TimeEntry>;

export function mergeTimeEntries(
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

export function convertTimeEntriesToDateString(entries: TimeEntries) {
  return entries.map((entry) => ({
    ...entry,
    start: new Date(entry.start).toDateString(),
    end: new Date(entry.end).toDateString(),
  }));
}

export function newDateFromHour(hour: number): string {
  const date = new Date();
  date.setHours(hour);
  return date.toISOString();
}

export function formatCalendarEventIntoTimeEntry(
  payload: GoogleCalendarPayload,
): TimeEntries {
  return payload.map((event) => ({
    title: event.summary,
    id: event.id,
    start: event.start.dateTime,
    end: event.end.dateTime,
  }));
}

export function formatLinearIssueToTimeEntry(entries: Array<LinearIssue>) {
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
