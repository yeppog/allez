import express, { Request, Response } from "express";

import { Route } from "../models/RouteSchema";

export const routeRouter = express.Router();

class RouteActions {
  static async fetchAllRoutes(req: Request, res: Response) {
    Route.find({})
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err.message));
  }
}

routeRouter.get("/routes", RouteActions.fetchAllRoutes);
