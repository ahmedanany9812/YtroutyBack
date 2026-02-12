# YtroutyBack

This is the backend server for the Ytrouty application, a social media platform. It is built with Node.js, Express, and MongoDB.

## Features

- **User Management**: Authentication and user profiles.
- **Post Management**: Create, read, and manage posts.
- **Security**: JWT authentication, cookie parsing, and CORS configuration.
- **File Uploads**: Uses Multer and Cloudinary.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Other Utilities**: dotenv, cors, cookie-parser, multer, cloudinary

## Prerequisites

- Node.js installed
- MongoDB instance

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/ahmedanany9812/YtroutyBack.git
    cd YtroutyBack
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Environment Configuration:
    Create a `config.env` file in the root directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_attachment_string
    # Add other necessary keys like CLOUDINARY_*, JWT_SECRET, etc.
    ```

## Running the Server

- **Development Mode** (with nodemon):

  ```bash
  npx nodemon App.js
  ```

  _Note: The `package.json` "start" script runs `node App.js`._

- **Production Mode**:
  ```bash
  npm start
  ```

## API Endpoints

- `/users`: User authentication and profile routes.
- `/posts`: Post creation and management routes.
