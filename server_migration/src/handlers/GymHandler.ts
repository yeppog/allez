import { Gym } from "../models/UserSchema";

export class GymHandler {
  public static async updateGymTag(tag: string, slug: string, date: Date) {
    return new Promise((resolve, reject) => {
      Gym.findOne({ username: tag }).then((gym) => {
        if (!gym) {
          reject("Tagged gym not found");
        } else {
          if (gym.taggedPost[date.toISOString()]) {
            gym.taggedPost[date.toISOString()] = [
              ...gym.taggedPost[date.toISOString()],
              slug,
            ];
          } else {
            gym.taggedPost[date.toISOString()] = [slug];
          }
          gym
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        }
      });
    });
  }
}
