# Contacts Grid (500k)

A simple, fully functional web application capable of displaying 500,000 contacts with search, sorting, and pagination.

## Tech Stack

- **Frontend:** React (Vite + TypeScript), TanStack Table, TanStack Query, Tailwind CSS
- **Backend:** .NET 8/9 Minimal API, EF Core + SQLite
- **Database:** SQLite (auto-created + CSV import on first run)

## Prerequisites

- Node.js 18+
- .NET SDK 8 or 9
- `contacts_500k.csv` file in `data/` folder.

## Setup & Run

### 1. Backend

The backend will automatically create the SQLite database and import the CSV file on the first run.

```bash
cd backend/Contacts.Api
dotnet run
```

The API will be available at `http://localhost:5174`.
Swagger documentation: [http://localhost:5174/swagger](http://localhost:5174/swagger)

**Note:** The import process for 500,000 rows might take a minute or two on the first run. Check the console logs for progress.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Features

- **Search:** Server-side filtering by First Name, Last Name, Email, Phone, City, State.
- **Sorting:** Server-side sorting by all columns.
- **Pagination:** Server-side pagination with configurable page size.
- **Virtualization:** Smooth scrolling for large datasets using TanStack Virtual.
