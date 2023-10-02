### Commands:

- `npm start` &mdash; start the server in production mode
- `npm run start:dev` &mdash; start the server in development mode

# Authorization

### POST `http://localhost:3000/api/users/signup` - Create a new user
- Gets the body in the format (email, password fields are required with validation):
```json
{
  "email": "example@example.com",
  "password": "examplepassword"
}
```
- If validation fails, returns <Error from Joi or other validation library> and status `400 Bad Request`.
- If the email is already used by someone else, returns a json with the key `"message": "Such email ${user.email} is already registered"` and status `409 Conflict`.
- Based on the result of the work, it returns an object and status `201 Created`:
```json
 {
  "user": {
    "email": "example@example.com",
    "subscription": "starter"
  }
}
```

### POST `http://localhost:3000/api/users/signin` - Login user
- Gets the body in the format (email, password fields are required with validation):
```json
{
  "email": "example@example.com",
  "password": "examplepassword"
}
```
- If validation fails, returns <Error from Joi or other validation library> and status `400 Bad Request`.
- If the password or email is wrong, returns a json with the key `"message": "Email or password is wrong"` and status `401 Unauthorized`.
- If the email is not verified, returns a json with the key `"message": "Email not verified" and status `401 Unauthorized`.
- Otherwise, the password for the found user is compared; if the passwords match, a token is created, stored in the current user and the user object and the status `200 OK` are returned:
```json
{
  "token": "exampletoken",
  "user": {
    "email": "example@example.com",
    "subscription": "starter"
  }
}
```

### GET `http://localhost:3000/api/users/verify/:verificationToken` - Email verification
- The verificationCode parameter searches for a user in the User model.
- If a user with this token is not found, a json is returned with the key `"message": "Email not found"` and status `404 Not Found`.
- If the user is found, `{ verify: true, verificationCode: " " }` in the user's document and a json with the key `{"message": "Successfully verified"}` and status `200 OK`.

### POST `http://localhost:3000/api/users/verify` - Resend an email for verification
- Gets the body in the format (the `email` field is required with validation):
```json
{
  "email": "example@example.com"
}
```
- If validation fails, returns <Error from Joi or other validation library> and status `400 Bad Request`.
- If the body does not contain the required email field, a json is returned with the key `"message": "missing required field email"` and the status `400 Bad Request`.
- If the body is validated, the email with verificationCode is resent to the specified email, but only if the user is not verified.
- If the user has already been verified, a json is returned with the key `"message": "Email has been already verified"` with the status `400 Bad Request`.
- Otherwise, a json is returned with the key `"message": "Email was successfully resent"` with the status `200 OK`.

### POST `http://localhost:3000/api/users/signout` - SignOut user
- Does not receive a body.
- The Authorization header is required: "Bearer {{token}}".
- Searches the User model for a user by _id.
- If the user does not exist, returns a json with the key `"message": "Not authorized"` and status `401 Unauthorized`.
- Otherwise, removes the token from the current user and returns a json with the key `"message": "Successful signOut"` and status `204 No Content`.

### GET `http://localhost:3000/api/users/current` - Get user data by token
- Does not get the body.
- The Authorization header is required: "Bearer {{token}}".
- If the user does not exist, a json is returned with the key `"message": "Not authorized"` and status `401 Unauthorized`.
- Otherwise, the user object is returned and the status is `200 OK`:
```json
{
  "email": "example@example.com",
  "subscription": "starter"
}
```

### PATCH `http://localhost:3000/api/users` - Update subscription field
- Gets the body in the format:
```json
{
    "subscription": "business"
}
```
- Required Authorization header: "Bearer {{token}}".
- If the user does not exist, a json is returned with the key `"message": "Not authorized"` and status `401 Unauthorized`.
- Otherwise, the user object is returned and the status is `200 OK`:
```json
{
  "email": "example@example.com",
  "subscription": "business"
}
```

### PATCH `http://localhost:3000/api/users/avatars` - Update user's avatar
- Gets the uploaded file in the body.
- The Authorization header is required: "Bearer {{token}}".
- If the user does not exist, a json is returned with the key `"message": "Not authorized"` and status `401 Unauthorized`.
- Otherwise, the user object is returned and the status is `200 OK`:
```json
{
  "avatarURL": "avatarLink"
}
```


# Contacts

### GET `http://localhost:3000/api/contacts` - Get all contacts
- Does not receive a body.
- The Authorization header is required: "Bearer {{token}}".
- Returns an array of all contacts in json format with status `200 OK`.

### GET `http://localhost:3000/api/contacts/:contactId` - Get contact by id
- Does not get the body.
- The Authorization header is required: "Bearer {{token}}".
- Gets the contactId parameter.
- If there is such an id, returns a contact object in json format with the status `200 OK`.
- If there is no such id, returns a json with the key `"message": "Contact with id ${contactId} not found"` and status `404 Not Found`.

### POST `http://localhost:3000/api/contacts` - Add new contact
- Gets the body in the format:
```json
{
  "name": "username",
  "phone": "(XXX) XXX-XXXX"
}
```
- Required Authorization header: "Bearer {{token}}".
- If the body does not contain any required fields, returns a json with the key `"message": "Set name/phone for contact"` and status `400 Bad Request`.
- If the body is valid, adds a unique identifier to the contact object and returns an object with the added id and status `201 Created`:
```json
{
  "name": "username",
  "email": "username@mail.com",
  "phone": "(XXX) XXX-XXXX",
  "owner": "userId",
  "favorite": "false"
}
```

### DELETE `http://localhost:3000/api/contacts/:contactId` - Delete contact
- Does not receive a body.
- The Authorization header is required: "Bearer {{token}}".
- Gets the contactId parameter.
- If there is no such id, returns a json with the `"message" key: "Contact with id ${contactId} not found"` and status `404 Not Found`.
- If there is such an id, returns a json of the format `"message": "Contact with id ${contactId} was successfully deleted"` and status `200 OK`.

### PUT `http://localhost:3000/api/contacts/:contactId` - Update contact by id
- Gets the contactId parameter.
- The Authorization header is required: "Bearer {{token}}".
- Gets the body in json format with updating any fields `name`, `email`, `phone`.
- If there is no body, returns json with the key `"message": "missing fields"` and status `400 Bad Request`.
- As a result of the work, it returns an updated contact object with the status `200 OK`.
- Otherwise, returns a json with the `"message" key: "Contact with id ${contactId} not found"` and status `404 Not Found`.

### PATCH `http://localhost:3000/api/contacts/:contactId/favorite` - Update favorite field by id
- Gets the contactId parameter.
- The Authorization header is required: "Bearer {{token}}".
- Gets the body in json format with the update of the favorite field:
```json
{
  "favorite": true
}
```
- If there is no body, returns json with the key `"message": "missing field favorite"` and status `400 Bad Request`.
- Based on the result of the work, it returns an updated contact object and status `200 OK`.
- Otherwise, returns a json with the key `"message ": "Contact with id ${contactId} not found"` and status `404 Not Found`.