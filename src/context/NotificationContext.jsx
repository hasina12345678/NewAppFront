import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const notify = (message, type = "success") => {
    const id = Date.now();

    setNotifications((prev) => [
      ...prev,
      { id, message, type }
    ]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );
    }, 1700);
  };

  const remove = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {/* UI GLOBAL */}
      <div className="notification-container">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.1 }}
              className={`notification notification-${n.type}`}
              onClick={() => remove(n.id)}
            >
              {n.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotify = () => useContext(NotificationContext);