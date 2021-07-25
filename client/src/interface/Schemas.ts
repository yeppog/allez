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
  postCount: number;
}

export interface PostTags {
  media: string;
  caption: string;
  gym: string;
  route: string;
  people: [];
  errorMessage: string;
}

export interface Post {
  mediaPath: string;
  likes: number;
  likedUsers: string[];
  id: string;
  username: string;
  body: string;
  avatarPath: string;
  slug: string;
  tag: object;
  comments: Comment[];
  createdAt: Date;
  edited: boolean;
}

export interface Comment {
  _id: string;
  comments: Comment[];
  body: string;
  edited: boolean;
  username: string;
  avatarPath: string;
  createdAt: Date;
}
