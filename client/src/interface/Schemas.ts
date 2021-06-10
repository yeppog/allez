export interface User extends PublicUser {
  email: string;
}

export interface PublicUser {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followCount: number;
  followers: object;
}
