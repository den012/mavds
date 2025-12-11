import express from "express";

import { cancelReservation, getPadelCourts, getUserReservations, createReservation } from "../controllers/padelCourts";

const router = express.Router();

router.get("/getCourts", getPadelCourts);
router.post('/reservations/create', createReservation);
router.patch('/reservations/:reservationId/cancel', cancelReservation);
router.get('/reservations/user/:userId', getUserReservations);

export default router;