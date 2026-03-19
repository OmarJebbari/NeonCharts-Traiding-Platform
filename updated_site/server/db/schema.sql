CREATE DATABASE IF NOT EXISTS tv_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tv_app;

-- =========================
-- Calendar events
-- =========================
DROP TABLE IF EXISTS calendar_events;

CREATE TABLE calendar_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  event_date DATE NOT NULL,
  event_time TIME NOT NULL,

  category ENUM('Economic','Earnings','Revenue','Dividends') NOT NULL,

  country VARCHAR(80) NOT NULL,
  country_code CHAR(2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  ticker VARCHAR(20) NULL,

  volatility TINYINT NULL,     -- 1=Low,2=Medium,3=High

  actual VARCHAR(40) NULL,
  forecast VARCHAR(40) NULL,
  prior VARCHAR(40) NULL,
  surprise VARCHAR(40) NULL,

  market_cap VARCHAR(40) NULL,
  period ENUM('pre','post') NULL,
  logo VARCHAR(20) NULL,

  dividend_amount VARCHAR(40) NULL,
  ex_dividend_date VARCHAR(40) NULL,
  payment_date VARCHAR(40) NULL,
  dividend_yield VARCHAR(40) NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_date_cat (event_date, category),
  INDEX idx_country (country),
  INDEX idx_title (title)
) ENGINE=InnoDB;

-- =========================
-- Users & plans (Free / Premium)
-- =========================
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  email VARCHAR(255) NOT NULL,
  username VARCHAR(50) NULL,

  password_hash VARCHAR(255) NULL,
  google_sub VARCHAR(255) NULL,

  full_name VARCHAR(255) NULL,
  avatar_url TEXT NULL,

  plan ENUM('free','premium') NOT NULL DEFAULT 'free',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_google_sub (google_sub)
) ENGINE=InnoDB;
