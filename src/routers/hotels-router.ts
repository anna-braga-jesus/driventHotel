import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAllHotels, getRoomsInHotel } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter.get("/", getAllHotels).get("/:hotelId", getRoomsInHotel);

export { hotelsRouter };
