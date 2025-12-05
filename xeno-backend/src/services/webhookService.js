// src/routes/webhooks.js
const express = require("express");
const router = express.Router();

// NOTE: simple approach: store a single latest event in memory.
// For small assignments this is fine. If you want persistence, use Redis/DB.
if (typeof global._webhookQueue === "undefined") global._webhookQueue = [];

function pushEvent(ev) {
  global._webhookQueue.push(ev);
  // keep queue small
  if (global._webhookQueue.length > 20) global._webhookQueue.shift();
}

// Accept raw body (simpleServer already applies express.raw for /api/webhooks)
router.post("/shopify", (req, res) => {
  try {
    // req.body is Buffer when express.raw is used; convert to string then parse
    const raw = req.body;
    const body = raw && raw.length ? JSON.parse(raw.toString("utf8")) : {};

    const shopDomain =
      req.headers["x-shopify-shop-domain"] ||
      req.headers["x-shopify-shop-domain".toLowerCase()];
    const topic =
      req.headers["x-shopify-topic"] ||
      req.headers["x-shopify-topic".toLowerCase()] ||
      req.headers["x-shopify-topic"];

    // minimal payload we need on client
    const ev = {
      topic: topic || "unknown",
      shopDomain: shopDomain || null,
      payload: {
        id: body.id ?? null,
        name: body.name ?? body.title ?? body.email ?? null,
      },
      receivedAt: Date.now(),
    };

    // accept only topics we care about
    const accepted = [
      "orders/create",
      "orders/updated",
      "products/create",
      "products/update",
      "customers/create",
      "customers/update",
    ];
    // some shops use singular topics e.g. products/update ; adjust as needed
    if (accepted.some((a) => (topic || "").includes(a.split("/")[0]))) {
      pushEvent(ev);
      console.log("✅ Webhook queued:", ev.topic, ev.shopDomain, ev.payload);
    } else {
      // still accept but mark
      pushEvent({ ...ev, note: "unrecognized-topic" });
      console.log("ℹ️ Webhook received (unrecognized topic):", ev.topic);
    }

    // respond quickly
    return res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Webhook parse error:", err);
    // Shopify expects 200/201 quickly; returning 400 ok for dev debugging
    return res.status(400).send("Bad Webhook");
  }
});

// Poll endpoint for frontend to check for events
// (frontend will call /api/webhooks/check)
router.get("/check", (req, res) => {
  try {
    const ev = global._webhookQueue.length
      ? global._webhookQueue.shift()
      : null;
    return res.json({ event: ev });
  } catch (err) {
    console.error("❌ Webhook check error", err);
    return res.status(500).json({ event: null });
  }
});

module.exports = router;
