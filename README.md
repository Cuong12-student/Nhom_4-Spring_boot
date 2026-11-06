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

## Admin dashboard

Sign in with an account whose database role is `ADMIN`, then open `/admin`. The dashboard
shows revenue for completed orders over the latest 12 months. Admins can manage products,
variants and stock, categories, and staff accounts. Removing products, variants,
categories, or staff accounts disables them instead of deleting historical data. Order
history and customer contact information are view-only.
