import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AscendingOrDescending =
  | 'desc'
  | 'asc';

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


export type Mutation = {
  __typename?: 'Mutation';
  createReply?: Maybe<Reply>;
  deleteReply?: Maybe<Reply>;
  root?: Maybe<Scalars['String']>;
  updateReply?: Maybe<Reply>;
};


export type MutationCreateReplyArgs = {
  data: ReplyInput;
};


export type MutationDeleteReplyArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateReplyArgs = {
  id: Scalars['ID'];
  data: ReplyInput;
};

export type Query = {
  __typename?: 'Query';
  getReplies?: Maybe<Array<Maybe<Reply>>>;
  getRepliesByResturant?: Maybe<Array<Maybe<Reply>>>;
  getRepliesByUser?: Maybe<Array<Maybe<Reply>>>;
  getReply?: Maybe<Reply>;
  root?: Maybe<Scalars['String']>;
};


export type QueryGetRepliesByResturantArgs = {
  restaurantId: Scalars['ID'];
};


export type QueryGetRepliesByUserArgs = {
  userId: Scalars['ID'];
};


export type QueryGetReplyArgs = {
  id: Scalars['ID'];
};

export type Rating = {
  __typename?: 'Rating';
  id: Scalars['ID'];
  restaurant_id?: Maybe<Scalars['String']>;
  restaurant?: Maybe<Restaurant>;
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

export type UserRole =
  | 'REGULAR'
  | 'RESTAURANT_OWNER'
  | 'ADMIN';



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AscendingOrDescending: AscendingOrDescending;
  Comment: ResolverTypeWrapper<Comment>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Rating: ResolverTypeWrapper<Rating>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Reply: ResolverTypeWrapper<Reply>;
  ReplyInput: ReplyInput;
  Restaurant: ResolverTypeWrapper<Restaurant>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Review: ResolverTypeWrapper<Review>;
  User: ResolverTypeWrapper<User>;
  UserRole: UserRole;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Comment: Comment;
  ID: Scalars['ID'];
  String: Scalars['String'];
  DateTime: Scalars['DateTime'];
  Mutation: {};
  Query: {};
  Rating: Rating;
  Float: Scalars['Float'];
  Reply: Reply;
  ReplyInput: ReplyInput;
  Restaurant: Restaurant;
  Int: Scalars['Int'];
  Review: Review;
  User: User;
  Boolean: Scalars['Boolean'];
};

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurant_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reply_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  review?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType>;
  reply?: Resolver<Maybe<ResolversTypes['Reply']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createReply?: Resolver<Maybe<ResolversTypes['Reply']>, ParentType, ContextType, RequireFields<MutationCreateReplyArgs, 'data'>>;
  deleteReply?: Resolver<Maybe<ResolversTypes['Reply']>, ParentType, ContextType, RequireFields<MutationDeleteReplyArgs, 'id'>>;
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updateReply?: Resolver<Maybe<ResolversTypes['Reply']>, ParentType, ContextType, RequireFields<MutationUpdateReplyArgs, 'id' | 'data'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getReplies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Reply']>>>, ParentType, ContextType>;
  getRepliesByResturant?: Resolver<Maybe<Array<Maybe<ResolversTypes['Reply']>>>, ParentType, ContextType, RequireFields<QueryGetRepliesByResturantArgs, 'restaurantId'>>;
  getRepliesByUser?: Resolver<Maybe<Array<Maybe<ResolversTypes['Reply']>>>, ParentType, ContextType, RequireFields<QueryGetRepliesByUserArgs, 'userId'>>;
  getReply?: Resolver<Maybe<ResolversTypes['Reply']>, ParentType, ContextType, RequireFields<QueryGetReplyArgs, 'id'>>;
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type RatingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Rating'] = ResolversParentTypes['Rating']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  restaurant_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  stars?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReplyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reply'] = ResolversParentTypes['Reply']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comment_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  review?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RestaurantResolvers<ContextType = any, ParentType extends ResolversParentTypes['Restaurant'] = ResolversParentTypes['Restaurant']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  average_rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  num_of_ratings?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  num_of_reviews?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  reviews?: Resolver<Maybe<Array<ResolversTypes['Review']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  visited?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Rating']>, ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurant_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  restaurants?: Resolver<Maybe<Array<Maybe<ResolversTypes['Restaurant']>>>, ParentType, ContextType>;
  reviews?: Resolver<Maybe<Array<Maybe<ResolversTypes['Review']>>>, ParentType, ContextType>;
  ratings?: Resolver<Maybe<Array<Maybe<ResolversTypes['Rating']>>>, ParentType, ContextType>;
  comments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType>;
  replies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Reply']>>>, ParentType, ContextType>;
  num_of_reviews?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Comment?: CommentResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Rating?: RatingResolvers<ContextType>;
  Reply?: ReplyResolvers<ContextType>;
  Restaurant?: RestaurantResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
