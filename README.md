# Music Resource Library
A storage system for chords and wind notes by song, organized with tags and designed to make searching by name, content, and filters easy.

## How its made
**Frontend:** TypeScript, React, Shad.cn, React Query  
**Backend:** TypeScript, MongoDB, Express.js, Node.js, JWT, Resend (for sending emails)

## API Architecture
The API consists of 4 different layers. 
* Routes — Handle incoming requests and forward them to the correct controller.
* Controllers — Validate the request, call the appropriate service, and send back the response.
* Services — Handle the business logic, interact with the database, and optionally connect to external services.
* Models — Define the database schema and provide utility methods for interacting with the data.

The controller directly interacts with the model for simple GET and DELETE requests that don't require business logic.

## Authentication
When a user logs in, the system issues two JWTs: an `AccessToken` and a `RefreshToken`, both stored in secure HTTP-only cookies. The `AccessToken` is short-lived (15 minutes) and is included with every request to authenticate the user. The `RefreshToken` is long-lived (30 days) and is only sent to the `/refresh` endpoint to obtain a new `Access oken`. For added security, if a session is set to expire within the next 24 hours, the system automatically refreshes the session and issues a new `RefreshToken` along with the new `AccessToken`.
