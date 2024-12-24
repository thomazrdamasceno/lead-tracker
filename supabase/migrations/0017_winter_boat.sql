-- Add onboarding_completed field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Update existing users to have onboarding completed
UPDATE users SET onboarding_completed = true WHERE onboarding_completed IS NULL;