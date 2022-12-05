import { conflictError, notFoundError, unauthorizedError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import bookingRepository from "@/repositories/booking-repository";
import hotelService from "../hotels-service";
import hotelRepository from "@/repositories/hotel-repository";
import { forbiddenError } from "@/errors/forbidden-error";
import roomService from "../room-service";
import roomRepository from "@/repositories/room-repository";

async function getABooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) {
    throw notFoundError();
  }
  const newBooking = {
    id: booking.id,
    Rooms: booking.Room,
  };
  return newBooking;
}
async function verifyTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
}
async function verifyRoom(roomId: number) {
  // if (roomId === 0) {
  //   throw notFoundError();
  // }
  if (!roomId) {
    throw notFoundError();
  }
  const room = await roomRepository.findRoom(roomId);
  if (!room) {
    throw notFoundError();
  }

  const countBooking = await bookingRepository.findBookingByRoomId(roomId);
  if (countBooking.length >= room.capacity) {
    throw forbiddenError();
  }
}
async function processBookingService(userId: number, roomId: number) {
  const booking = await bookingRepository.findBooking(userId);

  if (booking) {
    throw conflictError("ConflictError");
  }
  const result = await bookingRepository.insertBooking(roomId, userId);

  return result;
}
async function putBookingService(userId: number, roomId: number, bookingId: number) {
  if (!bookingId || isNaN(bookingId)) {
    throw forbiddenError();
  }
  if (bookingId === 0) {
    throw notFoundError();
  }
  const booking = await bookingRepository.findBooking(userId);
  const verifyBooking = await bookingRepository.findBookingByBookingId(bookingId);
  if (!verifyBooking) {
    throw notFoundError();
  }
  const updatedBooking = await bookingRepository.updateBooking(roomId, booking.id);
  return { bookingId: updatedBooking.id };
}

const bookingService = { getABooking, processBookingService, putBookingService, verifyRoom, verifyTicket };

export default bookingService;
