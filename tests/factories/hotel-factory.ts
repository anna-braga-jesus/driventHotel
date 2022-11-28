import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      id: faker.datatype.number(),
      name: faker.name.findName(),
      image: faker.image.image(),
    },
  });
}
