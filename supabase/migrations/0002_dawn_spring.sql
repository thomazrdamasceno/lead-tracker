/*
  # Create websites table and policies

  1. New Tables
    - `websites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `name` (text)
      - `domain` (text)
      - `pixel_id` (text, optional)
      - `pixel_token` (text, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on websites table
    - Add policy for authenticated users to manage their own websites
*/

CREATE TABLE IF NOT EXISTS websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  domain text NOT NULL,
  pixel_id text,
  pixel_token text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own websites"
  ON websites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);