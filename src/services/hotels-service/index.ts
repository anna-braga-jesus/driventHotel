import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import hotelRepository from "@/repositories/hotel-repository";

async function getHotel(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw unauthorizedError;
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw unauthorizedError;
  }
  if (ticket.TicketType.isRemote !== false) {
    throw unauthorizedError;
  }
  if (ticket.TicketType.includesHotel !== true) {
    throw unauthorizedError;
  }
  const ticketType = await ticketRepository.findTicketTypes;
  if (!ticketType) {
    throw unauthorizedError;
  }
  if (ticket.status !== "PAID") {
    throw unauthorizedError;
  }
  const hotels = await hotelRepository.findHotel();

  if (!hotels) {
    throw notFoundError();
  }
  return hotels;
}

async function getRoomByHotelId(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError;
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError;
  }
  if (ticket.TicketType.isRemote !== false) {
    throw unauthorizedError;
  }
  if (ticket.TicketType.includesHotel !== true) {
    throw unauthorizedError;
  }
  const ticketType = await ticketRepository.findTicketTypes;
  if (!ticketType) {
    throw unauthorizedError;
  }
  if (ticket.status !== "PAID") {
    throw unauthorizedError;
  }
  const room = await hotelRepository.findRoomByHotelId(hotelId);
  if (!room) {
    throw notFoundError;
  }

  return room;
}

const hotelService = {
  getHotel,
  getRoomByHotelId,
};

export default hotelService;
