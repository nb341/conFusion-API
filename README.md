# conFusion-API

## Tools Used
* Express
* NodeJS
* Mongoose
* PassportJ
* OAuth2.0 (Facebook)
* MongoDB (Community Server)
* Postman for testing API

## Todo
Integrate with React and Angular client side


Task 1

In this task you will be implementing a new Mongoose schema named favoriteSchema, and a model named Favorites in the file named favorite.js in the models folder. This schema should take advantage of the mongoose population support to populate the information about the user and the list of dishes when the user does a GET operation.

Task 2

In this task, you will implement the Express router() for the '/favorites' URI such that you support GET, POST and DELETE operations

When the user does a GET operation on '/favorites', you will populate the user information and the dishes information before returning the favorites to the user.
When the user does a POST operation on '/favorites' by including [{"_id":"dish ObjectId"}, . . .,  {"_id":"dish ObjectId"}] in the body of the message, you will (a) create a favorite document if such a document corresponding to this user does not already exist in the system, (b) add the dishes specified in the body of the message to the list of favorite dishes for the user, if the dishes do not already exists in the list of favorites.
When the user performs a DELETE operation on '/favorites', you will delete the list of favorites corresponding to the user, by deleting the favorite document corresponding to this user from the collection.
When the user performs a POST operation on '/favorites/:dishId', then you will add the specified dish to the list of the user's list of favorite dishes, if the dish is not already in the list of favorite dishes.
When the user performs a DELETE operation on '/favorites/:dishId', then you will remove the specified dish from the list of the user's list of favorite dishes.
Task 3

You will update app.js to support the new '/favorites' route.

