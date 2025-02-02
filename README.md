What each thing does:

/countriesPage
│── /frontend        # The client-side application (React or Vanilla JS)
│   ├── /public      # Static files (like index.html and JSON data)
│   ├── /src         # Main JavaScript/React/Vue code for the frontend
│── /backend         # The server-side application (Node.js, Express)
│   ├── /routes      # API route handlers (e.g., `/api/countries`)
│   ├── /models      # Database schemas (if using MongoDB)
│   ├── /controllers # Business logic (optional)
│   ├── /data        # JSON file with country data (if not using a database)
│── README.md        # Documentation
│── .gitignore       # List of files to ignore in Git
