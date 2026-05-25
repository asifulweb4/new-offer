-- Nagarik Seba PostgreSQL Schema (Suitable for Neon Database, Supabase, or any serverless Postgres solution)
-- This SQL file sets up tables for Users, Offers, and Transactions, with premium design support.

-- Create table for Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_tier VARCHAR(20) DEFAULT 'personal' CHECK (account_tier IN ('personal', 'business', 'sub_admin')),
    balance DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Operators & Offers
CREATE TABLE IF NOT EXISTS offers (
    id SERIAL PRIMARY KEY,
    operator VARCHAR(20) NOT NULL CHECK (operator IN ('gp', 'banglalink', 'robi', 'airtel', 'teletalk')),
    title VARCHAR(255) NOT NULL,
    validity VARCHAR(50) NOT NULL,
    price_personal DECIMAL(10, 2) NOT NULL,
    price_business DECIMAL(10, 2) NOT NULL,
    price_sub_admin DECIMAL(10, 2) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('data', 'voice', 'combo')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Transactions (Add Money, Withdraw, Upgrade, Purchase)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('add_money', 'withdraw', 'buy_offer', 'upgrade_tier')),
    amount DECIMAL(10, 2) NOT NULL,
    details TEXT,
    gateway VARCHAR(30), -- 'bKash', 'Nagad', 'Rocket', 'Upay'
    target_number VARCHAR(20),
    transaction_id_ref VARCHAR(100), -- payment TrxID
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample offers matches the screenshot and standard rates in Bangladesh
INSERT INTO offers (operator, title, validity, price_personal, price_business, price_sub_admin, category) VALUES
('gp', '50GB + 1600 Min Combo Premium Pack', '30 Days', 799.00, 784.00, 767.00, 'combo'),
('gp', '45 GB High Speed Internet Pack', '30 Days', 499.00, 484.00, 467.00, 'data'),
('gp', '1000 Minutes Voice Bundle', '30 Days', 599.00, 584.00, 567.00, 'voice'),
('banglalink', '150 GB (High Speed FUP) Unlimited Super Intern', '30 Days', 1035.00, 1020.00, 1003.00, 'data'),
('banglalink', '80 GB + 1600 Minutes Extra Offer Combo', '30 Days', 945.00, 930.00, 913.00, 'combo'),
('banglalink', '50 GB + 1500 Minutes Talktime Bundle', '30 Days', 865.00, 850.00, 833.00, 'combo'),
('banglalink', '40 GB Internet High-Speed Pack', '30 Days', 740.00, 725.00, 708.00, 'data'),
('robi', '60 GB Cloud Internet Super Booster', '30 Days', 511.00, 496.00, 479.00, 'data'),
('robi', '850 Minutes Heavy Talktime Pack', '30 Days', 480.00, 465.00, 448.00, 'voice'),
('airtel', '45 GB Unlimited Access internet', '30 Days', 411.00, 396.00, 379.00, 'data'),
('airtel', '700 Minutes Voice Call Pack', '30 Days', 355.00, 340.00, 323.00, 'voice'),
('teletalk', '30GB Super Fast Govt Internet', '30 Days', 290.00, 275.00, 258.00, 'data')
ON CONFLICT DO NOTHING;

-- Create indexes for performance optimization
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_offers_operator ON offers(operator);

-- Instructions for Vercel Deployment with Next.JS:
-- 1. Create a Next.js application (using npx create-next-app@latest)
-- 2. Setup NEON_DATABASE_URL inside .env.local
-- 3. Install '@neondatabase/serverless' or 'pg' npm package
-- 4. Create server side route handlers (e.g., /api/auth/register, /api/payment/add-money) to interact safely with this schema.
