# Chat Platform Backend

A real-time chat platform backend built with **Node.js**, **Express**, **MongoDB**, **Socket.IO**, and **TypeScript**. This project provides the backend infrastructure for a chat application, enabling real-time messaging, user management, and more.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) (package manager)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/gameshler/chat-platform-nodejs.git
cd chat-platform-nodejs
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a .env file in the root directory and add the following variables:

```
MONGO_URI=
PORT = 3000
JWT_SECRET =
JWT_REFRESH_SECRET =
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_SENDER =
RESEND_API_KEY =
CLIENT_URL = http://localhost:5173
NODE_ENV = development

```

- **`MONGO_URI`**: The connection string for your MongoDB database.
- **`PORT`**: The port number where your Node.js server will listen for incoming requests.
- **`JWT_SECRET`**: A secret key used to sign JWTs for user authentication.
- **`JWT_REFRESH_SECRET`**: A secret key used to sign refresh tokens, which are used to generate new JWTs after they expire.
- **`CLOUDINARY_CLOUD_NAME`**: Your Cloudinary account's cloud name, used for media storage and management.
- **`CLOUDINARY_API_KEY`**: Your Cloudinary API key for authenticating requests to their service.
- **`CLOUDINARY_API_SECRET`**: Your Cloudinary API secret for authenticating requests to their service.
- **`EMAIL_SENDER`**: The email address that will appear as the sender in transactional emails (e.g., password reset emails).
- **`RESEND_API_KEY`**: The API key for Resend (or your email service provider) to send emails programmatically.
- **`CLIENT_URL`**: The URL of your frontend application, used for CORS configuration and redirects.
- **`NODE_ENV`**: The environment mode (e.g., `development`, `production`). This helps configure the app behavior based on the environment.

### 4. Run the Application

```bash
npm run start:dev
# or
pnpm run start:dev
```

## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
