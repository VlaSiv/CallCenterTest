# Full Implementation Plan

React Frontend + .NET Backend + SQLite
500,000 Contacts Data Grid (Search, Sort, Pagination)

## 1. Overview

This document describes the implemented web application capable of displaying 500,000 contacts with:

- Search
- Sorting
- Pagination

### Tech Stack

- **Frontend:** React (Vite + TypeScript), TanStack Table, TanStack Query, Tailwind CSS
- **Backend:** .NET 8/9 Minimal API, EF Core + SQLite
- **Database:** SQLite (auto-created + CSV import on first run)

The solution prioritizes simplicity over heavy optimizations, but remains performant enough for 500k rows using proper indexing + server-side queries.

## 2. CSV Structure

Expected CSV columns (comma-separated):
`id,first_name,last_name,phone,email,address,city,state,zip,age,status`

The CSV file should be located at:
`/data/contacts_500k.csv`

## 3. Repository Structure

```
CallCenterTest/
  contacts-grid/
    backend/
      Contacts.Api/
        Program.cs
        Contacts.Api.csproj
        appsettings.json
        Data/
          ContactsDbContext.cs
          DbInitializer.cs
        Models/
          Contact.cs

    frontend/
      package.json
      vite.config.ts
      src/
        api/contactsApi.ts
        hooks/useContacts.ts
        components/ContactsGrid.tsx
        App.tsx
        main.tsx
        index.css

    data/
      contacts_500k.csv

    docs/
      plan.md
    
  README.md
  .gitignore
```

## 4. Backend Implementation (.NET + SQLite)

### 4.1 NuGet packages
- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.Sqlite
- Microsoft.EntityFrameworkCore.Design
- CsvHelper

## 5. Database Design (SQLite)

### Table: Contacts

**Columns:**
- Id (primary key)
- FirstName
- LastName
- Phone
- Email
- Address
- City
- State
- Zip
- Age
- Status

**Indexes**
- LastName
- FirstName
- Email
- Phone
- City
- State

## 6. Backend Behavior

### 6.1 On First Run
1. Create SQLite DB file (contacts.db)
2. Create schema
3. Check if table is empty
4. If empty → import entire CSV using streaming batches (5000 rows)
5. Create indexes
6. Serve API immediately after

### 6.2 API Endpoints

**GET /api/contacts**

Query params:
- `q` → optional search string
- `sortBy` → firstName, lastName, email, phone, city, state, age, status
- `sortDir` → asc | desc
- `page` → default 1
- `pageSize` → default 50, max 200

Example:
`/api/contacts?q=john&sortBy=lastName&sortDir=asc&page=3&pageSize=50`

Response shape:
```json
{
  "items": [],
  "totalCount": 0,
  "page": 1,
  "pageSize": 50
}
```

Sorting and paging are fully server-side.

## 7. Frontend Implementation (React + Vite)

### 7.1 npm packages
`@tanstack/react-table`, `@tanstack/react-query`, `@tanstack/react-virtual`, `axios`, `lodash.debounce`, `tailwindcss`

### 7.2 Core Elements

**useContacts hook**
- Wraps API requests using TanStack Query
- Keys include q, sortBy, sortDir, page, pageSize

**ContactsGrid component**
- Manual mode:
  - server-side search
  - server-side sorting
  - server-side pagination
- Debounced search box (300 ms debounce)
- Virtualized rows (Smooth scrolling for large pages)
- Tailwind CSS for styling

## 8. Running the Solution

### 8.1 Requirements
- Node 18+
- .NET SDK 8 or 9
- CSV placed at `/contacts-grid/data/contacts_500k.csv`

### 8.2 Run Backend
```bash
cd contacts-grid/backend/Contacts.Api
dotnet run
```

Backend will:
1. Create the DB
2. Import 500k rows on first run
3. Start serving API

Backend URL: `http://localhost:5000/api/contacts`

### 8.3 Run Frontend
```bash
cd contacts-grid/frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:3000`

Vite proxy is configured to forward `/api` requests to `http://localhost:5174` (or whatever port the backend is running on).

## 9. Simplifications
- SQLite instead of SQL Server
- No full-text search (basic LIKE works adequately with indexes)
- Offset pagination (easier)
- Minimal React stack
- Automatic CSV ingestion
