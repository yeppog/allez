import { Route } from "../models/RouteSchema";

export class RouteHandler {
  public static async updateRouteTag(tag: string, slug: string, date: Date) {
    return new Promise((resolve, reject) => {
      Route.findOne({ name: tag }).then((route) => {
        if (!route) {
          reject("Tagged route not found");
        } else {
          route.taggedPost[date.toISOString()] = slug;
          route
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        }
      });
    });
  }
}
