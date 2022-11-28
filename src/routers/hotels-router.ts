import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAllHotels, getRoomsInHotel } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter.all("/*", authenticateToken).get("/", getAllHotels).get("/:hotelId", getRoomsInHotel);

export { hotelsRouter };
// NAO ESQUECER!
