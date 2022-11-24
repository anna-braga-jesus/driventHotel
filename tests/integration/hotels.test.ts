import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe("when token is valid", () => {
  it("should respond with empty array when there are no ticket types created", async () => {
    const token = await generateValidToken();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual([]);
  });

  it("should respond with status 404 when user doesnt have a ticket yet", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await server.get("/tickets").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  /*it("should respond with status 200 and with Hotels data", async () => {
         const user = await createUser();
         const token = await generateValidToken(user);
         const enrollment = await createEnrollmentWithAddress(user);
         const ticketType = await createTicketType();
         const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
         //const hotel = await createHotelType(); Ver no minicurso
         //const room = await createRoom();
         const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

         expect(response.status).toEqual(httpStatus.OK);
         expect(response.body).toEqual({
           id: hotel.id,
           name: hotel.status,
           image: hotel.image,
           Rooms: {
             id: room.id,
             name: room.name,
             price: room.price,
             isRemote: room.isRemote,
             includesHotel: room.includesHotel,
             createdAt: room.createdAt.toISOString(),
             updatedAt: room.updatedAt.toISOString(),
           },
           createdAt: ticket.createdAt.toISOString(),
           updatedAt: ticket.updatedAt.toISOString(),
         });
       });
     });*/
});
