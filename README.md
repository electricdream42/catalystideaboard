# Catalyst Group Ideaboard

A modern web application for sharing and voting on ideas across the Catalyst Group family of organizations.

## Features

- Submit ideas for any Catalyst Group organization
- Vote on ideas
- Comment on ideas
- View top ideas on the leaderboard
- Filter ideas by organization

## Organizations

- Swasti
- Vrutti
- Fuzhio
- Green Foundation
- Catalyst Foundation
- Solvist Financial Services
- Impact Catalysts Foundation

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Environment Setup

1. Clone this repository
2. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase project URL and anonymous key.

### Supabase Setup

1. Create a new Supabase project
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL commands from `supabase/schema.sql` to set up the required tables and functions
4. Make sure Row Level Security (RLS) policies are properly configured as specified in the schema file

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Database Schema

The application uses the following tables:

- **ideas**: Stores all submitted ideas with organization information
- **comments**: Stores comments on ideas
- **idea_votes**: Tracks votes to prevent duplicate voting

## Development

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint to check for code issues

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting provider of choice.

3. Make sure to set the environment variables in your hosting environment.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
