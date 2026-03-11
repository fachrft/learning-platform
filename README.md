# Lumina Learning Platform

Lumina is a comprehensive Learning Management System (LMS) designed for aspiring influencers. It features robust course management, engaging curriculum delivery, and interactive learning tools to help users grow their skills effectively.

## 🚀 Getting Started Locally (Docker)

This project has been fully containerized using Docker, allowing you to run the application and the PostgreSQL database with a single command.

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Node.js & pnpm (optional, for running local commands).

### Step 1: Clone & Environment Variables
1. Clone this repository.
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Fill in the required variables in `.env`.

**Required Environment Variables (`.env`):**
- `DATABASE_URL`: Connection string. Use `postgresql://postgres:password@localhost:5433/lumina_db` for local development.
- `NEXTAUTH_SECRET`: Secret phrasing for NextAuth.
- `NEXTAUTH_URL`: `http://localhost:3000`
### 🔑 Third-Party API Keys Setup
To fully test the application's features (image uploads, payment gateways, and email notifications), you will need to set up sandbox/free accounts for the following services and add their keys to your `.env` file:

- **Midtrans (Payment Gateway)**: 
  1. Create a sandbox account at [Midtrans](https://midtrans.com/).
  2. Go to **Settings > Access Keys** to find your `MIDTRANS_SERVER_KEY` and `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`.
- **ImageKit (Image Hosting)**:
  1. Create a free account at [ImageKit.io](https://imagekit.io/).
  2. Navigate to **Developer Options** in the dashboard to get your `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`.
- **Resend (Email Notifications)**:
  1. Create an account at [Resend](https://resend.com/).
  2. Generate an API Key in the dashboard to use as `RESEND_API_KEY`.


### Step 2: Run the Docker Containers
Start the application and database in the background:
```bash
docker compose up -d --build
```
*The app will be available at `http://localhost:3000`.*

### Step 3: Database Migrations
To create the necessary tables in the database, run the Drizzle migration command:
```bash
docker compose exec app pnpm drizzle-kit push
```

### Step 4: Seed Initial Data
To populate the database with an Admin user required for the application:
```bash
docker compose exec app pnpm db:seed
```
**Default Admin Credentials:**
- **Email:** admin@gmail.com
- **Password:** password
### Step 5: Running Tests
To ensure everything is working correctly, you can run the unit tests:

**Using Docker (Recommended):**
```bash
docker compose exec app pnpm test
```

**Using Local pnpm:**
```bash
pnpm test
```

---

## 💻 Tech Stack
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Styling:** Tailwind CSS & Shadcn UI
