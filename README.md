# School Supplies Store

## Run locally

Start the Spring Boot backend and Vite frontend in separate terminals:

```powershell
.\mvnw.cmd spring-boot:run
```

```powershell
cd frontend
npm run dev
```

Open `http://localhost:8080` to be redirected to the store at `http://localhost:5173`.
The Vite development server proxies `/api` requests to the backend on port `8080`.
