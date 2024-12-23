# MyApp - Responsive React Web Application

## Overview
MyApp is a modern, responsive web application built with React, Redux, and React Router. 
It features a dynamic navigation experience with authentication and protected routes. Designed 
for both small and large screens, the app offers a collapsible hamburger menu on mobile devices for seamless usability.

## Key Features:
- User authentication (Login, Signup, and Logout).
- Responsive navigation bar with dynamic links based on authentication status.
- Protected routes for accessing user-specific pages.
- Personalized user experience.

##

## Technologies Used
- ### React: Frontend framework for interactive user interfaces.
- ### Redux: State management for authentication and user data.
-  ### React Router: Navigation and routing for SPA.
-  ### Tailwind CSS: Utility-first CSS framework for responsive design.
-  ### Axios: API request handling.
-  ### jwt-decode: Decoding and validating JSON Web Tokens (JWTs).

  ##
## Features
1. ### Authentication:
   - Login, Signup, and Logout functionality.
   - JWT-based token storage and validation.
   - Authentication status synchronized with Redux state.
2. Responsive Navbar:
 - Displays dynamic links (e.g., "Add Post", "Logout") based on user authentication.
 - Includes a collapsible hamburger menu for mobile screens.
3. Protected Routes:
 - Restricts access to certain pages (e.g., "Add Post") for authenticated users only.
4. Dynamic User Experience:
   - Personalized greetings and user-specific links like "My Posts".
##

# Installation and Setup

## Prerequisites
Ensure the following tools are installed:
- `Node.js` (v14 or higher)
- `npm or `yarn`
## Steps
1. ### Clone the repository:
```
bash

git clone https://github.com/your-username/myapp.git
cd myapp

```
2. ### Install dependencies:
 ```
bash

npm install

```
3. ###Configure environment variables:
 - Create a `.env` file in the root directory.
 - Add the following (update with your API URL):
  ```
bash

REACT_APP_API_BASE_URL=http://your-api-url.com

```
4.. ### Start the development server:
```
bash

npm start

```
5. ### Open your browser and navigate to:
```
bash

http://localhost:3000

```
