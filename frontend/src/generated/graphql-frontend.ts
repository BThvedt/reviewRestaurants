import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export enum AscendingOrDescending {
  Desc = 'desc',
  Asc = 'asc'
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['ID'];
  title: Scalars['String'];
  text: Scalars['String'];
  restaurant_id?: Maybe<Scalars['String']>;
  reply_id?: Maybe<Scalars['String']>;
  review?: Maybe<Review>;
  reply?: Maybe<Reply>;
};

export type CommentInput = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type CreateUserInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  role: UserRole;
};


export type LoginUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  root?: Maybe<Scalars['String']>;
  createUser: User;
  updateUser: User;
  deleteUser: User;
  login: UserOrTokenPayload;
  logout?: Maybe<Scalars['Boolean']>;
  createRestaurant?: Maybe<Restaurant>;
  updateRestaurant?: Maybe<Restaurant>;
  deleteRestaurant?: Maybe<Restaurant>;
  createReview?: Maybe<Review>;
  updateReview?: Maybe<Review>;
  deleteReview?: Maybe<Review>;
  createReply?: Maybe<Reply>;
  updateReply?: Maybe<Reply>;
  deleteReply?: Maybe<Reply>;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  data: UpdateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  data: LoginUserInput;
};


export type MutationCreateRestaurantArgs = {
  data: RestaurantInput;
};


export type MutationUpdateRestaurantArgs = {
  id: Scalars['ID'];
  data: RestaurantInput;
};


export type MutationDeleteRestaurantArgs = {
  id: Scalars['ID'];
};


export type MutationCreateReviewArgs = {
  data: ReviewInput;
};


export type MutationUpdateReviewArgs = {
  id: Scalars['ID'];
  data: ReviewInput;
};


export type MutationDeleteReviewArgs = {
  id: Scalars['ID'];
};


export type MutationCreateReplyArgs = {
  data: ReplyInput;
};


export type MutationUpdateReplyArgs = {
  id: Scalars['ID'];
  data: ReplyInput;
};


export type MutationDeleteReplyArgs = {
  id: Scalars['ID'];
};

export type NameAndRoleData = {
  __typename?: 'NameAndRoleData';
  name: Scalars['String'];
  role: Scalars['String'];
};

export enum OrderByField {
  AverageRating = 'average_rating',
  NumOfRatings = 'num_of_ratings'
}

export type Query = {
  __typename?: 'Query';
  root?: Maybe<Scalars['String']>;
  currentUser?: Maybe<User>;
  getUser?: Maybe<User>;
  getUserNameAndRole?: Maybe<NameAndRoleData>;
  getUsers?: Maybe<Array<Maybe<User>>>;
  test?: Maybe<Scalars['String']>;
  getRestaurant: RestaurantData;
  getRestaurants: RestaurantsReturnData;
  getRestaurantsByOwner: Array<Maybe<RestaurantOwnerReturnData>>;
  getRestaurantCount: Scalars['Int'];
  getReview?: Maybe<Review>;
  getReviews: ReviewsReturnData;
  getReviewsByUser?: Maybe<Array<Maybe<Review>>>;
  getReviewsByRestaurant?: Maybe<Array<Maybe<Review>>>;
  getReviewCount: Scalars['Int'];
  getReply?: Maybe<Reply>;
  getRepliesByUser?: Maybe<Array<Maybe<Reply>>>;
  getRepliesByResturant?: Maybe<Array<Maybe<Reply>>>;
  getReplies?: Maybe<Array<Maybe<Reply>>>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetUserNameAndRoleArgs = {
  id: Scalars['ID'];
};


export type QueryGetRestaurantArgs = {
  id: Scalars['ID'];
};


export type QueryGetRestaurantsArgs = {
  data: GetRestaurantsInput;
};


export type QueryGetRestaurantsByOwnerArgs = {
  ownerId: Scalars['ID'];
};


export type QueryGetReviewArgs = {
  id: Scalars['ID'];
};


export type QueryGetReviewsArgs = {
  data: GetReviewsInput;
};


export type QueryGetReviewsByUserArgs = {
  userId: Scalars['ID'];
};


export type QueryGetReviewsByRestaurantArgs = {
  restaurantId: Scalars['ID'];
};


export type QueryGetReplyArgs = {
  id: Scalars['ID'];
};


export type QueryGetRepliesByUserArgs = {
  userId: Scalars['ID'];
};


export type QueryGetRepliesByResturantArgs = {
  restaurantId: Scalars['ID'];
};

export type Rating = {
  __typename?: 'Rating';
  id: Scalars['ID'];
  restaurant_id?: Maybe<Scalars['String']>;
  restaurant?: Maybe<Restaurant>;
  stars: Scalars['Float'];
};

export type RatingInput = {
  stars: Scalars['Float'];
};

export type Reply = {
  __typename?: 'Reply';
  id: Scalars['ID'];
  title: Scalars['String'];
  text: Scalars['String'];
  user_id: Scalars['String'];
  comment_id: Scalars['String'];
  user?: Maybe<User>;
  comment?: Maybe<Comment>;
  review?: Maybe<Review>;
  restaurant?: Maybe<Restaurant>;
};

export type ReplyInput = {
  title: Scalars['String'];
  text: Scalars['String'];
  comment_id: Scalars['String'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  id: Scalars['ID'];
  name: Scalars['String'];
  owner_id: Scalars['String'];
  owner?: Maybe<User>;
  average_rating?: Maybe<Scalars['Float']>;
  num_of_ratings?: Maybe<Scalars['Int']>;
  num_of_reviews?: Maybe<Scalars['Int']>;
  reviews?: Maybe<Array<Review>>;
};

export type RestaurantData = {
  __typename?: 'RestaurantData';
  restaurant?: Maybe<Restaurant>;
  featured_review?: Maybe<Review>;
};

export type RestaurantInput = {
  name: Scalars['String'];
  owner_id: Scalars['ID'];
};

export type RestaurantOwnerReturnData = {
  __typename?: 'RestaurantOwnerReturnData';
  restaurant?: Maybe<Restaurant>;
  featured_review?: Maybe<Review>;
  reviews_pending_reply: Scalars['Int'];
};

export type RestaurantReturnData = {
  __typename?: 'RestaurantReturnData';
  restaurant?: Maybe<Restaurant>;
  featured_review?: Maybe<Review>;
};

export type RestaurantsReturnData = {
  __typename?: 'RestaurantsReturnData';
  count: Scalars['Int'];
  restaurants: Array<RestaurantReturnData>;
};

export type Review = {
  __typename?: 'Review';
  id: Scalars['ID'];
  visited: Scalars['DateTime'];
  rating?: Maybe<Rating>;
  comment?: Maybe<Comment>;
  user_id: Scalars['String'];
  restaurant_id: Scalars['String'];
  user?: Maybe<User>;
  restaurant?: Maybe<Restaurant>;
};

export type ReviewInput = {
  visited: Scalars['DateTime'];
  restaurant_id: Scalars['String'];
  comment?: Maybe<CommentInput>;
  rating?: Maybe<RatingInput>;
};

export type ReviewsReturnData = {
  __typename?: 'ReviewsReturnData';
  reviews: Array<Review>;
  count: Scalars['Int'];
};

export type TokenPayload = {
  __typename?: 'TokenPayload';
  token: Scalars['String'];
  user: User;
};

export type UpdateUserInput = {
  idToUpdate: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  role: UserRole;
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
  role: UserRole;
  restaurants?: Maybe<Array<Maybe<Restaurant>>>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  ratings?: Maybe<Array<Maybe<Rating>>>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  replies?: Maybe<Array<Maybe<Reply>>>;
  num_of_reviews?: Maybe<Scalars['Int']>;
};

export type UserOrTokenPayload = User | TokenPayload;

export enum UserRole {
  Regular = 'REGULAR',
  RestaurantOwner = 'RESTAURANT_OWNER',
  Admin = 'ADMIN'
}

export type GetRestaurantsInput = {
  orderBy: OrderByField;
  direction: AscendingOrDescending;
  page: Scalars['Int'];
  recordsPerPage: Scalars['Int'];
};

export type GetReviewsInput = {
  page: Scalars['Int'];
  recordsPerPage: Scalars['Int'];
};
