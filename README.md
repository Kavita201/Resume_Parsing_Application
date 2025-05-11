# Resume Parsing Application

A full-stack resume parsing application with a React frontend and Node.js backend using Prisma ORM and PostgreSQL database. This system extracts structured data from uploaded resumes and presents it in an interactive UI.

## Tech Stack

### Backend
- Node.js + Express.js
- Flask
- NLP
- LLM
- Prisma ORM
- PostgreSQL
- Multer (resume file upload)
- dotenv, cors, uuid


### Frontend
- React
- Redux Toolkit
- React Router
- MUI (Material UI)
- React Hook Form + Yup

---

## Features

- Upload resumes in `.pdf` or `.docx`
- Parse resumes using Python spaCy or Groq LLM (via LangChain)
- Store structured data in PostgreSQL
- View parsed resume data (Basic Info, Education, Work Exp, Skills, Specialties)
- Clean, component-based frontend



##  Setup Instructions

### 1. Clone the Repository
Clone the repository from GitHub and navigate into the project directory:

git clone https://github.com/yourusername/Resume_Parsing_Application.git
cd Resume_Parsing_Application

### 2. Backend Setup (Flask + NLP)
## 2.1 Install Backend Dependencies
Navigate to the Backend folder and install the necessary dependencies:

cd Backend
npm install



createdb resume_parsing_db
Create a .env file inside the Backend directory and add your environment variables, such as the database connection URL, JWT secrets, etc. Example:


DATABASE_URL=postgresql://user:password@localhost:5432/resume_parsing_db
PORT=5000
Replace user and password with your actual database credentials.

2.3 Run Database Migrations
Use Prisma to apply the database migrations:


npx prisma migrate dev
2.4 Run the Backend Server
To handle resume parsing, run the Flask Python server for NLP tasks:


python Flask_python.py
Start the Node.js backend server to handle API requests:


node server.js
3. Frontend Setup (React)
3.1 Install Frontend Dependencies
Navigate to the Frontend folder and install the necessary dependencies:


cd Frontend
npm install

3.2 Setup .env File
Create a .env file in the Frontend directory and add the backend API URL:

REACT_APP_API_URL=http://localhost:5000
This will connect the frontend with the backend API.

3.3 Run the Frontend Server
Start the frontend development server:
npm start
This will open the app in your browser at http://localhost:3000.
