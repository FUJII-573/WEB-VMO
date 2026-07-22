# VMO Lucky Speed Custom Project

This project is a web application that was originally developed in a Manus environment and has been adapted to run on a standard development setup with VS Code and GitHub.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (LTS version recommended)
*   pnpm (or npm/yarn, but pnpm is used in `package.json`)
*   Docker (for database, if using)
*   VS Code (or your preferred code editor)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-github-repo-url>
    cd vmo_lucky_speed_custom
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
    If you don't have pnpm, you can install it globally:
    ```bash
    npm install -g pnpm
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root of the project based on `.env.example`.
    ```
    VITE_APP_ID=
    JWT_SECRET=
    DATABASE_URL=
    OAUTH_SERVER_URL=
    OWNER_OPEN_ID=
    BUILT_IN_FORGE_API_URL=
    BUILT_IN_FORGE_API_KEY=
    ```
    You will need to fill in these values according to your project's requirements. For local development, some values might be optional or can be set to dummy values.

4.  **Database Setup (if applicable):**
    This project uses Drizzle ORM. You might need to set up a database (e.g., MySQL) and run migrations.
    
    *   **Option 1: Using Docker for MySQL (Recommended for local development)**
        You can use a `docker-compose.yml` file to quickly spin up a MySQL database. (A sample `docker-compose.yml` is not included, but you can create one like this):
        ```yaml
        version: '3.8'
        services:
          db:
            image: mysql:8.0
            environment:
              MYSQL_ROOT_PASSWORD: your_root_password
              MYSQL_DATABASE: your_database_name
              MYSQL_USER: your_user
              MYSQL_PASSWORD: your_password
            ports:
              - "3306:3306"
            volumes:
              - db_data:/var/lib/mysql
        volumes:
          db_data:
        ```
        Then run:
        ```bash
        docker-compose up -d
        ```
        Update `DATABASE_URL` in your `.env` file accordingly (e.g., `mysql://your_user:your_password@localhost:3306/your_database_name`).

    *   **Run Drizzle migrations:**
        ```bash
        pnpm run db:push
        ```

### Running the Project

To start the development server:

```bash
pnpm run dev
```

This will start both the client (Vite) and the server (tsx watch). The application should be accessible at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To build the project for production:

```bash
pnpm run build
```

To start the built application:

```bash
pnpm run start
```

## GitHub Actions

A basic GitHub Actions workflow will be provided to automate building and deployment (or other CI/CD tasks). You can find it in `.github/workflows/main.yml`.

## VS Code Setup

This project is configured to work well with VS Code. Recommended extensions include:

*   ESLint
*   Prettier
*   TypeScript Vue Plugin (Volar) (if using Vue, otherwise ignore)

Happy coding!
