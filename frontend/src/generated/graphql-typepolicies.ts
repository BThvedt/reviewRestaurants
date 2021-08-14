import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type CommentKeySpecifier = ('id' | 'title' | 'text' | 'restaurant_id' | 'reply_id' | 'review' | 'reply' | CommentKeySpecifier)[];
export type CommentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	restaurant_id?: FieldPolicy<any> | FieldReadFunction<any>,
	reply_id?: FieldPolicy<any> | FieldReadFunction<any>,
	review?: FieldPolicy<any> | FieldReadFunction<any>,
	reply?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('root' | 'createUser' | 'updateUser' | 'deleteUser' | 'login' | 'logout' | 'createRestaurant' | 'updateRestaurant' | 'deleteRestaurant' | 'createReview' | 'updateReview' | 'deleteReview' | 'createReply' | 'updateReply' | 'deleteReply' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	root?: FieldPolicy<any> | FieldReadFunction<any>,
	createUser?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUser?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUser?: FieldPolicy<any> | FieldReadFunction<any>,
	login?: FieldPolicy<any> | FieldReadFunction<any>,
	logout?: FieldPolicy<any> | FieldReadFunction<any>,
	createRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	updateRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	createReview?: FieldPolicy<any> | FieldReadFunction<any>,
	updateReview?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteReview?: FieldPolicy<any> | FieldReadFunction<any>,
	createReply?: FieldPolicy<any> | FieldReadFunction<any>,
	updateReply?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteReply?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NameAndRoleDataKeySpecifier = ('name' | 'role' | NameAndRoleDataKeySpecifier)[];
export type NameAndRoleDataFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	role?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('root' | 'currentUser' | 'getUser' | 'getUserNameAndRole' | 'getUsers' | 'test' | 'getRestaurant' | 'getRestaurants' | 'getRestaurantsByOwner' | 'getRestaurantCount' | 'getReview' | 'getReviews' | 'getReviewsByUser' | 'getReviewsByRestaurant' | 'getReviewCount' | 'getReply' | 'getRepliesByUser' | 'getRepliesByResturant' | 'getReplies' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	root?: FieldPolicy<any> | FieldReadFunction<any>,
	currentUser?: FieldPolicy<any> | FieldReadFunction<any>,
	getUser?: FieldPolicy<any> | FieldReadFunction<any>,
	getUserNameAndRole?: FieldPolicy<any> | FieldReadFunction<any>,
	getUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	test?: FieldPolicy<any> | FieldReadFunction<any>,
	getRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	getRestaurants?: FieldPolicy<any> | FieldReadFunction<any>,
	getRestaurantsByOwner?: FieldPolicy<any> | FieldReadFunction<any>,
	getRestaurantCount?: FieldPolicy<any> | FieldReadFunction<any>,
	getReview?: FieldPolicy<any> | FieldReadFunction<any>,
	getReviews?: FieldPolicy<any> | FieldReadFunction<any>,
	getReviewsByUser?: FieldPolicy<any> | FieldReadFunction<any>,
	getReviewsByRestaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	getReviewCount?: FieldPolicy<any> | FieldReadFunction<any>,
	getReply?: FieldPolicy<any> | FieldReadFunction<any>,
	getRepliesByUser?: FieldPolicy<any> | FieldReadFunction<any>,
	getRepliesByResturant?: FieldPolicy<any> | FieldReadFunction<any>,
	getReplies?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RatingKeySpecifier = ('id' | 'restaurant_id' | 'restaurant' | 'stars' | RatingKeySpecifier)[];
export type RatingFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	restaurant_id?: FieldPolicy<any> | FieldReadFunction<any>,
	restaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	stars?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReplyKeySpecifier = ('id' | 'title' | 'text' | 'user_id' | 'comment_id' | 'user' | 'comment' | 'review' | 'restaurant' | ReplyKeySpecifier)[];
export type ReplyFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	comment_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	comment?: FieldPolicy<any> | FieldReadFunction<any>,
	review?: FieldPolicy<any> | FieldReadFunction<any>,
	restaurant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RestaurantKeySpecifier = ('id' | 'name' | 'owner_id' | 'owner' | 'average_rating' | 'num_of_ratings' | 'num_of_reviews' | 'reviews' | RestaurantKeySpecifier)[];
export type RestaurantFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	average_rating?: FieldPolicy<any> | FieldReadFunction<any>,
	num_of_ratings?: FieldPolicy<any> | FieldReadFunction<any>,
	num_of_reviews?: FieldPolicy<any> | FieldReadFunction<any>,
	reviews?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RestaurantDataKeySpecifier = ('restaurant' | 'featured_review' | RestaurantDataKeySpecifier)[];
export type RestaurantDataFieldPolicy = {
	restaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	featured_review?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RestaurantOwnerReturnDataKeySpecifier = ('restaurant' | 'featured_review' | 'reviews_pending_reply' | RestaurantOwnerReturnDataKeySpecifier)[];
export type RestaurantOwnerReturnDataFieldPolicy = {
	restaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	featured_review?: FieldPolicy<any> | FieldReadFunction<any>,
	reviews_pending_reply?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RestaurantReturnDataKeySpecifier = ('restaurant' | 'featured_review' | RestaurantReturnDataKeySpecifier)[];
export type RestaurantReturnDataFieldPolicy = {
	restaurant?: FieldPolicy<any> | FieldReadFunction<any>,
	featured_review?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RestaurantsReturnDataKeySpecifier = ('count' | 'restaurants' | RestaurantsReturnDataKeySpecifier)[];
export type RestaurantsReturnDataFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	restaurants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReviewKeySpecifier = ('id' | 'visited' | 'rating' | 'comment' | 'user_id' | 'restaurant_id' | 'user' | 'restaurant' | ReviewKeySpecifier)[];
export type ReviewFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	visited?: FieldPolicy<any> | FieldReadFunction<any>,
	rating?: FieldPolicy<any> | FieldReadFunction<any>,
	comment?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	restaurant_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	restaurant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReviewsReturnDataKeySpecifier = ('reviews' | 'count' | ReviewsReturnDataKeySpecifier)[];
export type ReviewsReturnDataFieldPolicy = {
	reviews?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TokenPayloadKeySpecifier = ('token' | 'user' | TokenPayloadKeySpecifier)[];
export type TokenPayloadFieldPolicy = {
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('id' | 'email' | 'password' | 'name' | 'role' | 'restaurants' | 'reviews' | 'ratings' | 'comments' | 'replies' | 'num_of_reviews' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	password?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	role?: FieldPolicy<any> | FieldReadFunction<any>,
	restaurants?: FieldPolicy<any> | FieldReadFunction<any>,
	reviews?: FieldPolicy<any> | FieldReadFunction<any>,
	ratings?: FieldPolicy<any> | FieldReadFunction<any>,
	comments?: FieldPolicy<any> | FieldReadFunction<any>,
	replies?: FieldPolicy<any> | FieldReadFunction<any>,
	num_of_reviews?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserReturnDataKeySpecifier = ('count' | 'users' | UserReturnDataKeySpecifier)[];
export type UserReturnDataFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
	Comment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CommentKeySpecifier | (() => undefined | CommentKeySpecifier),
		fields?: CommentFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	NameAndRoleData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NameAndRoleDataKeySpecifier | (() => undefined | NameAndRoleDataKeySpecifier),
		fields?: NameAndRoleDataFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Rating?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RatingKeySpecifier | (() => undefined | RatingKeySpecifier),
		fields?: RatingFieldPolicy,
	},
	Reply?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReplyKeySpecifier | (() => undefined | ReplyKeySpecifier),
		fields?: ReplyFieldPolicy,
	},
	Restaurant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RestaurantKeySpecifier | (() => undefined | RestaurantKeySpecifier),
		fields?: RestaurantFieldPolicy,
	},
	RestaurantData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RestaurantDataKeySpecifier | (() => undefined | RestaurantDataKeySpecifier),
		fields?: RestaurantDataFieldPolicy,
	},
	RestaurantOwnerReturnData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RestaurantOwnerReturnDataKeySpecifier | (() => undefined | RestaurantOwnerReturnDataKeySpecifier),
		fields?: RestaurantOwnerReturnDataFieldPolicy,
	},
	RestaurantReturnData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RestaurantReturnDataKeySpecifier | (() => undefined | RestaurantReturnDataKeySpecifier),
		fields?: RestaurantReturnDataFieldPolicy,
	},
	RestaurantsReturnData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RestaurantsReturnDataKeySpecifier | (() => undefined | RestaurantsReturnDataKeySpecifier),
		fields?: RestaurantsReturnDataFieldPolicy,
	},
	Review?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReviewKeySpecifier | (() => undefined | ReviewKeySpecifier),
		fields?: ReviewFieldPolicy,
	},
	ReviewsReturnData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReviewsReturnDataKeySpecifier | (() => undefined | ReviewsReturnDataKeySpecifier),
		fields?: ReviewsReturnDataFieldPolicy,
	},
	TokenPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TokenPayloadKeySpecifier | (() => undefined | TokenPayloadKeySpecifier),
		fields?: TokenPayloadFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserReturnData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserReturnDataKeySpecifier | (() => undefined | UserReturnDataKeySpecifier),
		fields?: UserReturnDataFieldPolicy,
	}
};