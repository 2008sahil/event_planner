import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import EventModal from "./EventModal";

const App = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [recentEvent, setRecentEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:4000/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.warn("Notifications are disabled.");
        }
      });
    } else {
      console.error("This browser does not support notifications.");
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        const { type, event: updatedEvent } = event.data;

        if (type === "event-updated") {
          setEvents((prevEvents) =>
            prevEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
          );
        }
      });
    }
  }, []);


  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        const { type, event: updatedEvent } = event.data;

        if (type === "event-updated") {
          setEvents((prevEvents) =>
            prevEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
          );
        }
      });
    }
  }, []);

  const sendNotification = async (event) => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;

        if (Notification.permission === 'granted') {


          await registration.showNotification('Event Reminder', {
            body: `Don't forget: ${event.title}`,
            actions: [
              { action: 'mark-read', title: 'Mark as Read' },
              { action: 'snooze', title: 'Snooze' },
            ],
            data: { event },
            requireInteraction: true,
          });
        } else if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await sendNotification(event);
          }
        } else {
          console.log('Notification permission denied. Please enable it in settings.');
        }
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    } else {
      console.error('Service Worker is not supported by this browser.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const now = new Date();

    const todaysEvent = events.find(
      (event) =>
        new Date(event.date).toDateString() === now.toDateString() &&
        !event.isRead
    );

    setRecentEvent(todaysEvent || null);
  }, [events]);

  useEffect(() => {
    if (recentEvent) {
            const eventDate = new Date(recentEvent.date); // UTC time
      const localDate = new Date(eventDate.toLocaleDateString());
      const [hours, minutes] = recentEvent.time.split(":").map(Number);
      localDate.setHours(hours);
      localDate.setMinutes(minutes);
      const now = new Date();
      const timeDifference = localDate - now;
      if(timeDifference>=0){
        const timeoutId = setTimeout(() => {
          sendNotification(recentEvent);
        }, timeDifference);
        return () => clearTimeout(timeoutId);
      }
      else{
        sendNotification(recentEvent);
      }
    }
  }, [recentEvent]);

  const handleDateClick = (value) => {
    setDate(value);

    const eventForSelectedDate = events.find(
      (event) => new Date(event.date).toDateString() === value.toDateString()
    );

    setSelectedEvent(eventForSelectedDate || null);
    setShowModal(true);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Calendar App</h1>
      <Calendar
        onClickDay={handleDateClick}
        value={date}
        tileContent={({ date }) => {
          const eventForDate = events.find(
            (event) => new Date(event.date).toDateString() === date.toDateString()
          );

          if (eventForDate) {
            const eventDate = new Date(eventForDate.date);
            const now = new Date();
            let dotColor = "";

            if (eventDate < now && !eventForDate.isRead) {
              // Past and unread
              dotColor = "red";
            } else if (eventDate <= now && eventForDate.isRead) {
              // Past and read
              dotColor = "green";
            } else if (eventDate > now) {
              // Future event
              dotColor = "yellow";
            }

            return <div className={`event-dot ${dotColor}`} />;
          }

          return null;
        }}
      />
      {showModal && (
        <EventModal
          date={date}
          selectedEvent={selectedEvent}
          onClose={() => {
            setShowModal(false);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
};

export default App;
