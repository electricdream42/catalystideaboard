# Supabase Setup Guide for Catalyst Group Ideaboard

This guide will walk you through setting up the Supabase database for the Catalyst Group Ideaboard application.

## Prerequisites

- A Supabase account (you can sign up at [supabase.com](https://supabase.com))
- Access to the Supabase dashboard

## Step 1: Create a New Supabase Project

1. Log in to your Supabase account
2. Click on "New Project"
3. Enter a name for your project (e.g., "catalyst-ideaboard")
4. Set a secure database password
5. Choose a region closest to your users
6. Click "Create new project"

## Step 2: Get Your API Keys

Once your project is created, you'll need to get your API keys:

1. Go to the project dashboard
2. In the left sidebar, click on "Project Settings"
3. Click on "API" in the settings menu
4. You'll see your project URL and anon/public key
5. Copy these values to your `.env` file:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Step 3: Set Up the Database Schema

1. In the Supabase dashboard, go to the "SQL Editor" section
2. Create a new query
3. Copy and paste the contents of the `supabase/schema.sql` file from this repository
4. Run the query to create all the necessary tables, functions, and policies

The schema will create the following:

- `ideas` table: Stores all submitted ideas
- `comments` table: Stores comments on ideas
- `idea_votes` table: Tracks votes to prevent duplicate voting
- `increment_votes` function: Safely increments the vote count for an idea
- Row Level Security (RLS) policies: Controls access to the tables

## Step 4: Verify the Setup

To verify that your database is set up correctly:

1. Go to the "Table Editor" section in the Supabase dashboard
2. You should see the `ideas`, `comments`, and `idea_votes` tables
3. Click on each table to verify the columns match the schema

## Step 5: Test the Connection

1. Start your application with `npm run dev`
2. Try submitting a new idea through the form
3. Check the "Table Editor" in Supabase to see if the idea was added to the `ideas` table

## Database Schema Details

### Ideas Table

| Column       | Type      | Description                           |
|--------------|-----------|---------------------------------------|
| id           | UUID      | Primary key                           |
| title        | TEXT      | Idea title                            |
| description  | TEXT      | Detailed description of the idea      |
| author       | TEXT      | Name of the person submitting the idea|
| organization | TEXT      | Which Catalyst organization it's for  |
| votes        | INTEGER   | Number of votes the idea has received |
| created_at   | TIMESTAMP | When the idea was submitted           |

### Comments Table

| Column     | Type      | Description                           |
|------------|-----------|---------------------------------------|
| id         | UUID      | Primary key                           |
| idea_id    | UUID      | Foreign key to the ideas table        |
| text       | TEXT      | Comment content                       |
| author     | TEXT      | Name of the commenter                 |
| created_at | TIMESTAMP | When the comment was submitted        |

### Idea Votes Table

| Column     | Type      | Description                           |
|------------|-----------|---------------------------------------|
| id         | UUID      | Primary key                           |
| idea_id    | UUID      | Foreign key to the ideas table        |
| voter_id   | TEXT      | Unique identifier for the voter       |
| created_at | TIMESTAMP | When the vote was cast                |

## Troubleshooting

### Common Issues

1. **"Error: relation 'ideas' does not exist"**
   - Make sure you've run the SQL schema script in the SQL Editor

2. **"Error: permission denied for table ideas"**
   - Check that the RLS policies are correctly set up

3. **"Error: duplicate key value violates unique constraint"**
   - This usually happens when trying to vote for the same idea twice

### Getting Help

If you encounter any issues with the Supabase setup, you can:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Visit the [Supabase GitHub repository](https://github.com/supabase/supabase)
3. Join the [Supabase Discord community](https://discord.supabase.com) 