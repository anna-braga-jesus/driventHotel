import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import hotelRepository from "@/repositories/hotel-repository";

async function getHotel(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }
  const ticketType = await ticketRepository.findTicketTypes();
  if (!ticketType) {
    throw notFoundError();
  }
  //Se o ticketType for verdadeiro em hotel e falso em online
  //const ticketPaid = await ticketRepository.verifyIfTicketTypeIsTrue(includesHotel);
  // if (ticketPaid === true )  {
  const hotels = await hotelRepository.findHotel();

  if (!hotels) {
    throw notFoundError();
  }
  return hotels;
  //}
}

async function getRoomByHotelId(userId: number, hotelId: number) {
  // const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  // if (!enrollment) {
  //   throw notFoundError();
  // }
  // const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  // if (!ticket) {
  //   throw notFoundError();
  // }
  const room = await hotelRepository.findRoomByHotelId(hotelId);
  if (!room) {
    throw notFoundError();
  }
  return room;
}

const hotelService = {
  getHotel,
  getRoomByHotelId,
};

export default hotelService;
