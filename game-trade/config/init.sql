-- Tworzenie bazy danych
CREATE DATABASE IF NOT EXISTS game_trade CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE game_trade;

-- Tabela użytkowników
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(64) NOT NULL,  -- SHA-256 hex = 64 znaki
  balance DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela przedmiotów
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  game VARCHAR(100) NOT NULL,
  rarity ENUM('common', 'uncommon', 'rare', 'epic', 'legendary') DEFAULT 'common',
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela posiadanych przedmiotów (inventory)
CREATE TABLE IF NOT EXISTS user_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_id INT NOT NULL,
  price_listed DECIMAL(10, 2) DEFAULT NULL,  -- NULL = nie wystawiony na sprzedaż
  is_listed BOOLEAN DEFAULT FALSE,
  acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Tabela transakcji
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL,
  buyer_id INT NOT NULL,
  user_item_id INT NOT NULL,
  item_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  type ENUM('trade', 'shop') NOT NULL DEFAULT 'trade',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Tabela sklepu (przedmioty dostępne ze sklepu)
CREATE TABLE IF NOT EXISTS shop_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT -1,  -- -1 = nieograniczony
  is_available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Przykładowe przedmioty
INSERT INTO items (name, description, game, rarity, base_price, image_url) VALUES
('Miecz Ognia', 'Legendarny miecz skuty z płomieni wulkanu.', 'Dragon Quest', 'legendary', 500.00, '/public/img/sword.png'),
('Tarcza Lodu', 'Tarcza wykonana z wiecznego lodu północy.', 'Dragon Quest', 'epic', 300.00, '/public/img/shield.png'),
('Buty Wiatru', 'Buty pozwalające biec szybciej niż wiatr.', 'Speed Runner', 'rare', 150.00, '/public/img/boots.png'),
('Amulet Szczęścia', 'Zwiększa szansę na znalezienie rzadkich przedmiotów.', 'Loot Master', 'uncommon', 75.00, '/public/img/amulet.png'),
('Zwykły Miecz', 'Prosty żelazny miecz. Nic specjalnego.', 'Dragon Quest', 'common', 20.00, '/public/img/basic_sword.png'),
('Eliksir Mocy', 'Tymczasowo zwiększa siłę ataku.', 'Potion Wars', 'common', 15.00, '/public/img/potion.png'),
('Kapelusz Czarodzieja', 'Noszony przez najstarszego czarodzieja krainy.', 'Magic Academy', 'epic', 250.00, '/public/img/hat.png'),
('Smocze Skrzydła', 'Pozwalają latać przez krótki czas.', 'Sky Legends', 'legendary', 800.00, '/public/img/wings.png');

-- Przedmioty w sklepie
INSERT INTO shop_items (item_id, price, stock, is_available) VALUES
(5, 25.00, -1, TRUE),
(6, 18.00, -1, TRUE),
(4, 80.00, 50, TRUE),
(3, 160.00, 20, TRUE);
