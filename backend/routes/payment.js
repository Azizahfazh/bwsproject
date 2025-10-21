// routes/payment.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const { core } = require("../config/midtrans");

// ================================
// POST /api/payment/notification — Webhook Midtrans
// ================================
router.post("/notification", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    // Parsing raw body dari Midtrans
    const notif = JSON.parse(req.body.toString());
    console.log("Webhook masuk:", notif);

    // Dapatkan status dari Core API (lebih aman)
    const statusResponse = await core.transaction.notification(notif);
    const {
      order_id: orderId,
      transaction_status,
      transaction_id,
      gross_amount,
      payment_type,
      transaction_time,
    } = statusResponse;

    // Cari booking terkait
    const booking = await Booking.findOne({ orderId });
    if (!booking) {
      console.log("Booking tidak ditemukan untuk orderId:", orderId);
      return res.status(404).send("Booking tidak ditemukan");
    }

    // Update status booking
    switch (transaction_status) {
      case "capture":
      case "settlement":
        booking.status = "paid";
        break;
      case "cancel":
      case "deny":
      case "expire":
        booking.status = "failed";
        break;
      case "pending":
      default:
        booking.status = "pending";
        break;
    }
    await booking.save();

    // Buat atau update Payment record
    let payment = await Payment.findOne({ transactionId: transaction_id });
    if (!payment) {
      payment = await Payment.create({
        bookingId: booking._id,
        transactionId: transaction_id,
        status: booking.status,
        grossAmount: gross_amount,
        paymentType: payment_type,
        transactionTime: transaction_time,
      });
    } else {
      payment.status = booking.status;
      await payment.save();
    }

    console.log(`Booking ${orderId} status updated to ${booking.status}`);
    console.log(`Payment ${transaction_id} status saved as ${payment.status}`);

    res.status(200).send("OK");
  } catch (err) {
    console.error("Error webhook Midtrans:", err);
    res.status(500).send("Error");
  }
});

module.exports = router;
