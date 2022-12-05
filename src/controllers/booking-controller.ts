import { unauthorizedError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import roomService from "@/services/room-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    await bookingService.verifyTicket(userId);

    const booking = await bookingService.getABooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "Forbidden") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

export async function bookingProcess(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;
  const roomId = req.body.roomId as number;
  try {
    await bookingService.verifyTicket(userId);
    await bookingService.verifyRoom(Number(roomId));
    const roomIdExist = await roomService.findRoomById(roomId);

    const ifRoomHasCapacity = await roomService.verifyCapacity(roomId);
    const process = await bookingService.processBookingService(userId, roomId);

    return res.status(httpStatus.OK).send({ bookingId: process.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "Forbidden") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;

  const bookingId = req.params.bookingId as string;

  const newBookingId = parseInt(bookingId, 10);

  const roomId = req.body.roomId as number;

  try {
    await bookingService.verifyTicket(userId);
    await bookingService.verifyRoom(Number(roomId));
    const update = await bookingService.putBookingService(userId, roomId, newBookingId);
    return res.status(httpStatus.OK).send({ bookingId: update.bookingId });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "ConflictError") {
      return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
    }
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === "Forbidden") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}
