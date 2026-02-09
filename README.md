# Mascota Segura MVP

This is a Minimum Viable Product (MVP) for **Mascota Segura**, a pet safety and medical history tracking application.

## Tech Stack

- **Core**: React (Vite)
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/postcss`)
- **Routing**: React Router DOM v6+
- **Icons**: Lucide-React
- **State Management**: React Context API (simulated backend)

## Features

1.  **Dev Login**: A landing page to easily switch between user roles (Owner, Partner, Admin).
2.  **Public Emergency Profile**: Accessible via `/p/:slug` (e.g., `/p/bobby-lima-123`). Shows pet details and "Report Found" button.
3.  **Owner Dashboard**: View own pets, generate QR codes, see upcoming events.
4.  **Partner Dashboard**: Search pets by ID, view medical history, add new records.
5.  **Admin Dashboard**: View system metrics and recent alerts.

## Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Run Development Server**:

    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Mock Data

The application uses simulated data located in `src/data/mockData.js`.

- **Owner**: Betsy Cueva
- **Partner**: Veterinaria Rondón
- **Admin**: Admin Mascota Segura
- **Pets**: Bobby (Dog), Luna (Cat)

## Folder Structure

- `src/context`: Application state (AppContext).
- `src/data`: Mock data source.
- `src/components/layout`: Main layout component.
- `src/components/ui`: Reusable UI components (Button, Card, Input, Modal).
- `src/pages`: Application views.
