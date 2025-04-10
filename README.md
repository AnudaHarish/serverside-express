Backend

node version: v14.21.3
framework: express.js
run: npm run dev -for local running


Frontend

node version: v18.19.0
frameworks: Anugular, Bootstrap
run: ng serve - for local running

JWT authentication used for generating access token and the refresh token.
verifyJWT middleware will be used to check for the validity of the token.
Password will be hashed using bcrypt and saved in the database.
Access token will be saved in the application memory and the refresh token will be sent as http only cookie.
When user logout the refesh token will be removed from the refrsh_tokens table.
Access token also will be set as empty string from the frontend.


testing criterias
1. User Registration  
   - Endpoint: `POST /api/signup`  
   - Test:  
     - Valid credentials → 201 Created  
     - Duplicate username → 409 Conflict  
     - Missing fields → 400 Bad Request  

2. User Login & JWT  
   - Endpoint: `POST /api/login`  
   - Test:  
     - Valid credentials → 200 OK + accessToken  
     - Invalid password → 401 Unauthorized  

3. Country Data Fetching  
   - Endpoint: `GET /api/countries/:name`  
   - Test:  
     - Valid country (Germany) → 200 OK + JSON data  
     - Invalid country (XYZ) → 404 Not Found  

4. Refresh Token  
   - Endpoint: `GET /api/refresh`  
   - Test:  
     - Valid refreshToken cookie → 200 OK + new accessToken  
     - Missing cookie → 400 Bad Request  

5. Security Checks  
   - Access `/api/countries` without JWT → 403 Forbidden  
   - SQL injection attempt → 500 Internal Server Error (sanitized)  
