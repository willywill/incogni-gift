<p align="center">
  <img src="logo.png" alt="IncogniGift Logo" width="200" />
</p>

<h1 align="center">IncogniGift 🎁🕵️‍♂️</h1>

<p align="center">
  Anonymous gift pairing made simple. Secret matches, unforgettable surprises.
</p>

<p align="center">
  <!-- Badges go here -->
  <!-- e.g. version | license | build status -->
</p>

---

## ✨ About

IncogniGift anonymously matches two people to exchange gifts — while keeping identities secret until the gift is delivered. The app suggests gift ideas based on interests without revealing the other person.

A little mystery. A lot of joy. 🎁✨

---

## 🛠️ Setup

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd incogni-gift
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the values in `.env` file:
     - `DATABASE_URL`: Service account connection string for the application
     - `BETTER_AUTH_SECRET`: Generate a secure random string for production
     - `BETTER_AUTH_URL`: Your application URL (default: `http://localhost:3000`)
     - `NEXT_PUBLIC_BETTER_AUTH_URL`: Public auth URL (default: `http://localhost:3000/api/auth`)
     - `SMTP_HOST`: SMTP server hostname (e.g., `smtp.gmail.com`, `smtp.sendgrid.net`)
     - `SMTP_PORT`: SMTP server port (typically `587` for TLS or `465` for SSL)
     - `SMTP_USER`: SMTP username/email address
     - `SMTP_PASSWORD`: SMTP password or app-specific password
     - `SMTP_FROM`: Sender email address and name (e.g., `IncogniGift <[email protected]>`)

4. **Start the database**:
   ```bash
   docker-compose up -d
   ```
   This starts the PostgreSQL container and automatically creates the service account user.

---

## 🚀 Initializing

### First-Time Database Setup

1. **Start Docker containers**:
   ```bash
   docker-compose up -d
   ```
   The database will automatically:
   - Create the `incogni_gift` database
   - Create the `app_service` service account user
   - Grant appropriate permissions to the service account

2. **Generate database migrations**:
   ```bash
   npm run db:generate
   ```
   This generates migration files based on your schema in `app/db/schema.ts`.

3. **Apply migrations**:
   ```bash
   npm run db:migrate
   ```
   This applies all migrations to create the database tables.

4. **Verify database connection** (optional):
   ```bash
   npm run db:studio
   ```
   This opens Drizzle Studio, a database GUI where you can inspect tables and data.

### Running the Application

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Service Account

The application uses a separate database user (`app_service`) instead of the root user (`postgres`) for security:

- **Service Account** (`app_service`): Used by the application for all database operations
- **Root Account** (`postgres`): Only used for administrative tasks like migrations

This separation ensures that the application runs with the minimum required privileges.

### Troubleshooting

**Database connection issues**:
- Ensure Docker is running: `docker ps`
- Check if the container is up: `docker-compose ps`
- Verify environment variables in `.env` match Docker configuration

**Migration issues**:
- Check database logs: `docker-compose logs postgres`
- Reset database (⚠️ **destroys all data**): 
  ```bash
  docker-compose down -v
  docker-compose up -d
  npm run db:migrate
  ```

**Port already in use**:
- Change the port mapping in `docker-compose.yml` if port 5432 is already in use

---

## 🚀 Features (high-level)

- 🔒 Anonymous matching
- 🎁 Smart gift suggestions
- 🔍 Zero personal info exposed to match partners
- 📱 Clean and modern UI
- 💬 Optional reveal after gifting

---

## 📌 Roadmap

- Account system + interest profiles
- AI-powered gift recommendations
- Holiday / themed gift exchange modes
- Group / workplace secret gifting
- In-app reveal experience

> Have ideas or feedback? Open an issue or start a discussion!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [issues page](../../issues).

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ and a little mystery</p>
