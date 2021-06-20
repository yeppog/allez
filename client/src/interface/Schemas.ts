export interface User extends PublicUser {
  email: string;
}

export interface PublicUser {
  name: string;
  username: string;
  avatarPath: string;
  bio: string;
  followCount: number;
  followers: object;
  following: string[];
  followingCount: number;
  taggedPost: object;
}

export interface PostTags {
  media: string;
  caption: string;
  gym: string;
  route: string;
  people: string;
}
