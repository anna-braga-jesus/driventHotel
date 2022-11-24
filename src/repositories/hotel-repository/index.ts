import { prisma } from "@/config";

async function findHotel() {
  return prisma.hotel.findMany();
}

async function findRoomByHotelId(hotelId: number) {
  return prisma.room.findFirst({
    where: {
      hotelId,
    },
    include: { Hotel: true },
  });
}

const hotelRepository = {
  findHotel,
  findRoomByHotelId,
};

export default hotelRepository;
