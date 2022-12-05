import { notFoundError, unauthorizedError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import bookingRepository from "@/repositories/booking-repository";
import hotelService from "../hotels-service";
import hotelRepository from "@/repositories/hotel-repository";
import { forbiddenError } from "@/errors/forbidden-error";
import roomRepository from "@/repositories/room-repository";

async function findRoomById(roomId: number) {
  const room = await roomRepository.findRoom(roomId);
  if (!room) {
    throw notFoundError();
  }
  return room;
}

async function verifyCapacity(roomId: number) {
  const stepOne = await bookingRepository.oneVerify(roomId);
  const stepTwo = await bookingRepository.twoVerify(roomId);

  if (stepOne >= stepTwo.capacity) {
    throw forbiddenError();
  }
}

const roomService = { findRoomById, verifyCapacity };

export default roomService;
