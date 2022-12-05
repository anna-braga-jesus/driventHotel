import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

export async function oneVerify(roomId: number) {
  return prisma.booking.count({
    where: { roomId: roomId },
  });
}

export async function twoVerify(roomId: number) {
  return prisma.room.findUnique({
    where: { id: roomId },
  });
}
export async function fakeRoomCapacity(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: 0,
      hotelId: hotelId,
    },
  });
}
export async function fakeTwoRoomCapacity(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: 1,
      hotelId: hotelId,
    },
  });
}
