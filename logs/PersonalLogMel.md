Personal Log 01 - 1st Prototype Delivery
During this phase, I focused on building and refining the project's user interface, ensuring full responsiveness and visual consistency across all key pages. I updated the styling for our main sections including the Resource Center, Home, Login, and Sign-Up pages to establish high text contrast, resolve theme layout bugs, and maintain a polished color palette aligned with our design goals.
My teammates, Marianna and Ana Paola, performed exceptionally well throughout this project. They successfully resolved complex Git merge conflicts during our workflow, completed their designated tasks efficiently, and consistently contributed valuable ideas to refine our product strategy.

Personal Log 02 - 2nd Beta Delivery

During this second phase, I focused on building and integrating the core backend functionality using Node.js and Express to transition our project from a static prototype to a fully functional Beta version.
- Configured an Express backend architecture with environment variable management (`dotenv`), route handling, and cross-origin resource sharing (`CORS`).
- Implemented a secure backend proxy endpoint (`/api/youtube/search`) to consume YouTube's Data API v3 safely without exposing private credentials on the frontend client.
- Developed asynchronous JavaScript logic (`resources.js`) using `fetch` to handle user queries, render dynamic video card components, and display loading states or empty result messages.
- Set up custom authentication endpoints (`/api/login` and `/api/signup`) with proper HTTP status codes (`400 Bad Request`, `401 Unauthorized`) to handle input validation, missing credentials, and duplicate account errors.
