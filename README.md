# Clean Water Alert System

A professional web application for reporting and tracking water supply issues in communities. Built with React, TypeScript, and Supabase.

## Features

- **Report Water Issues** - Submit detailed reports about water supply problems
- **Active Alerts Dashboard** - View all water issues with real-time updates
- **Location-Based View** - Browse reports grouped by location
- **Status Tracking** - Monitor issue status (Active, Investigating, Resolved)
- **Severity Levels** - Categorize issues by severity (Low, Medium, High, Critical)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - The `.env` file contains your Supabase credentials
   - Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to the local development URL

## Database Schema

The application uses a single `water_reports` table with the following structure:

- `id` - Unique identifier
- `title` - Brief issue title
- `description` - Detailed problem description
- `location` - Address or area name
- `latitude/longitude` - Geographic coordinates (optional)
- `status` - Current status (active, investigating, resolved)
- `severity` - Issue severity (low, medium, high, critical)
- `reported_by` - Reporter's name
- `contact_info` - Optional contact information
- `created_at/updated_at` - Timestamps

## Usage

### Reporting an Issue

1. Click "Report Issue" in the navigation
2. Fill out the form with issue details
3. Submit to create a new alert

### Viewing Alerts

- **Home** - See all alerts with filtering options
- **Map View** - Browse reports grouped by location

### Status Filters

Filter alerts by:
- All reports
- Active issues
- Under investigation
- Resolved issues

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── AlertList.tsx       # Main alerts dashboard
│   ├── AlertCard.tsx       # Individual alert display
│   ├── ReportForm.tsx      # Issue submission form
│   └── MapView.tsx         # Location-based view
├── lib/
│   └── supabase.ts         # Database client and types
├── App.tsx                 # Main application component
└── main.tsx                # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Security

- Row Level Security (RLS) enabled on all database tables
- Public read access for community transparency
- Anonymous reporting allowed for easier submission
- Environment variables for secure credential management

## License

This project is open source and available for community use.
