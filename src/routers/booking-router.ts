import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking, bookingProcess, updateBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", bookingProcess)
  .put("/:bookingId", updateBooking);

export { bookingRouter };
