import { prisma } from "@/config";

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: { userId: userId },
    include: {
      Room: true,
    },
  });
}
async function findBookingByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId },
  });
}

async function findBookingByBookingId(bookingId: number) {
  return await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
}

async function insertBooking(roomId: number, userId: number) {
  return prisma.booking.create({
    data: {
      roomId: roomId,
      userId: userId,
    },
  });
}

async function updateBooking(roomId: number, newBookingId: number) {
  return prisma.booking.update({
    where: {
      id: newBookingId,
    },
    data: { roomId: roomId },
  });
}
async function oneVerify(roomId: number) {
  return prisma.booking.count({
    where: { roomId: roomId },
  });
}

async function twoVerify(roomId: number) {
  return prisma.room.findUnique({
    where: { id: roomId },
  });
}

async function threeVerify(userId: number) {
  return prisma.booking.findFirst({
    where: { userId: userId },
  });
}

const bookingRepository = {
  findBooking,
  findBookingByRoomId,
  insertBooking,
  updateBooking,
  oneVerify,
  twoVerify,
  threeVerify,
  findBookingByBookingId,
};

export default bookingRepository;
