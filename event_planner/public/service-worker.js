self.addEventListener("notificationclick", (event) => {
    // console.log("Notification click event triggered");

    const action = event.action;
    const eventData = event.notification.data;

    // console.log("Notification action:", action);
    // console.log("Event data:", eventData);

    switch (action) {
      case "mark-read":
        const EventRead = {
            ...eventData.event,
            isRead: true
          };

        fetch(`http://localhost:4000/events/${eventData.event.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...eventData.event, isRead: true }),
        })
        .then((response) => response.json())
          .then((updatedEvent) => {

            return self.clients.matchAll();
          })
          .then((clients) => {
            if (clients && clients.length > 0) {
              clients.forEach((client) => {
                client.postMessage({
                  type: "event-updated",
                  event: EventRead,
                });
              });
            } else {
              console.log("No clients found to send the updated event.");
            }
          })
        .catch((error) => console.error("Error marking event as read:", error));
        break;

      case "snooze":

        const snoozeDate = new Date();
        snoozeDate.setMinutes(snoozeDate.getMinutes() + 5);

        const newTime = snoozeDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

        const updatedEvent = {
            ...eventData.event,
            date: snoozeDate.toISOString(),
            time: newTime,
          };

        fetch(`http://localhost:4000/events/${eventData.event.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...eventData.event, date: snoozeDate.toISOString(), time: newTime }),
        })
          .then((response) => response.json())
          .then((updatedEvent) => {
            return self.clients.matchAll();
          })
          .then((clients) => {
            if (clients && clients.length > 0) {
              clients.forEach((client) => {
                client.postMessage({
                  type: "event-updated",
                  event: updatedEvent,
                });
              });
            } else {
              console.log("No clients found to send the updated event.");
            }
          })
          .catch((error) => console.error("Error snoozing event:", error));
        break;

      default:
        console.log("Notification clicked but no action.");
    }

    event.notification.close();
  });
