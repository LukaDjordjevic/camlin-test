# camlin-test

This is a homewrk app for a senior fronend developer position application by Luka Djordjevic (lulo.djordjevic@gmail.com).

<img src="https://drive.usercontent.google.com/download?id=1uwsmOjfnjGGA1UTe0bXoSuLLYoGfK_Dx&export=view&authuser=0" width="350" alt="Description">

## Installation instructions

### Option 1: Using Docker (Preferred)

1. Ensure [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) are installed.
2. Clone the repository:
   ```bash
   git clone https://github.com/LukaDjordjevic/camlin-test.git
   cd camlin-test

3. Run the application:

   ```bash
   docker compose up
   ```
   or for older docker versions
    ```bash
    docker-compose up
    ```
Access the app at http://localhost:3000 and the server API at http://localhost:3001.



### Option 2: Local Development

1. Ensure Node.js (v16 or higher) and npm are installed.

   Clone the repository:
   ```bash
   git clone https://github.com/LukaDjordjevic/camlin-test.git
   cd camlin-test
   ```
2. Install and run the Vue3 app:

   ```bash
   npm install
   npm run dev
   ```
3. In a separate terminal, install and run the Express server:

   ```bash
   cd server
   npm install
   npm start
   ```
Access the app at http://localhost:5173 and the server API at http://localhost:3000.

