// src/hooks/useWebhookPoll.js
import { useEffect, useRef } from "react";

/**
 * Poll backend for webhook events using the frontend proxy at /api/proxy
 * -> This matches your dashboard pattern of calling backend through /api/proxy
 *
 * onEvent(event) should be an async handler provided by the Dashboard component.
 */
export default function useWebhookPoll({ onEvent, interval = 5000 }) {
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    let timerId;

    const poll = async () => {
      try {
        // Call the frontend proxy which will forward to backend /api/webhooks/check
        const proxyEndpoint = `/api/proxy?endpoint=${encodeURIComponent(
          "/api/webhooks/check"
        )}`;

        const res = await fetch(proxyEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // token header if your proxy requires authentication
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          // If 404/500, just continue polling (do not throw)
          // console.debug("Webhook poll non-ok", res.status);
          return;
        }

        const data = await res.json();
        if (data?.event) {
          // call the handler provided by Dashboard
          try {
            await onEvent(data.event);
          } catch (e) {
            console.error("onEvent handler error", e);
          }
        }
      } catch (err) {
        // swallow and continue polling
        // console.debug("poll error", err);
      } finally {
        if (alive.current) timerId = setTimeout(poll, interval);
      }
    };

    poll();
    return () => {
      alive.current = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [onEvent, interval]);
}
