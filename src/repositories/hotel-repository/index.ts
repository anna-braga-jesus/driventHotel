import { prisma } from "@/config";

async function findHotel() {
  return prisma.hotel.findMany();
}

async function findRoomByHotelId(hotelId: number) {
  const hotels = await prisma.hotel.findMany({
    where: {
      id: hotelId,
    },
    include: { Rooms: true },
  });
  return hotels;
}

const hotelRepository = {
  findHotel,
  findRoomByHotelId,
};

export default hotelRepository;
