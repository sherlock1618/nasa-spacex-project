NASA-SpaceX Mission Control

Project Overview
The NASA-SpaceX Mission Control is a full-stack application designed to simulate the control and management of interstellar space missions. Built using Node.js, Express, MongoDB, and ReactJS, this project provides a robust platform to schedule, track, and control space launches. The application features a RESTful API and integrates modern development practices such as containerization, automated testing, and continuous deployment.

Features
- Mission Scheduling: Users can schedule space launches by sending mission data to the server.
- Real-Time Tracking: Track the status of ongoing missions with real-time updates using Socket.io.
- Data Management: Persistent storage and retrieval of mission data using MongoDB.
- Authentication & Security: JWT-based authentication, HelmetJS, and HTTPS for secure communication.
- GraphQL API: Advanced querying of mission data using GraphQL for flexible data retrieval.
- Scalable Deployment: Containerized using Docker for easy deployment, and managed with PM2 for clustering and process management.
- CI/CD Integration: Automated testing with Jest and Supertest, deployed using GitHub Actions to AWS EC2.

Tech Stack
- Frontend: ReactJS
- Backend: Node.js, Express.js
- Database: MongoDB, MongoDB Atlas
- Containerization: Docker
- Real-time Communication: Socket.io
- API: RESTful API and GraphQL
- Authentication: JSON Web Tokens (JWT), HelmetJS
- Testing: Jest, Supertest
- Deployment: PM2, AWS EC2
- Version Control: Git, GitHub
- CI/CD Pipeline: GitHub Actions

Installation

Prerequisites
- Node.js (>= 14.x)
- MongoDB (local or MongoDB Atlas)
- Docker (optional, for containerization)
- AWS EC2 (optional, for cloud deployment)

Steps
1. Clone the Repository:
   git clone https://github.com/sherlock1618/nasa-spacex-project.git
   cd nasa-spacex-project

2. Install Dependencies:
   npm install

3. Set Up Environment Variables:
   Create a .env file in the root directory with the following:
   PORT=8000
   MONGO_URL=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>

4. Run the Application:
   npm run dev

5. Access the Application:
   - Open your browser and navigate to http://localhost:8000.
   - Use Postman or Insomnia to test the API routes.

API Endpoints

RESTful API
- GET /launches - Retrieve all scheduled launches.
- POST /launches - Schedule a new launch.
- DELETE /launches/:id - Cancel an existing launch.

GraphQL API
- /graphql - Perform advanced queries to retrieve mission and launch data.

Testing
- Unit Tests: The project includes unit tests for key functionalities using Jest.
- API Tests: End-to-end API testing is handled with Supertest.

Run tests using:
npm test

Deployment
1. Docker Deployment:
   - Build and run the Docker container:
     docker-compose up --build

2. PM2 for Clustering:
   - Start the application using PM2 for multiple instances:
     pm2 start src/server.js -i max

3. AWS EC2 Deployment:
   - Deploy the app to AWS EC2 with PM2 and MongoDB Atlas for database scaling.

Future Improvements
- Implement caching with Redis to improve response times for high-traffic endpoints.
- Add pagination for large mission datasets.
- Implement a webhook system for real-time mission status updates.

