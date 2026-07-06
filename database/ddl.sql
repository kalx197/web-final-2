-- Create database
CREATE DATABASE IF NOT EXISTS garage_tool_shop;
USE garage_tool_shop;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_price (price),
    INDEX idx_stock (stock_quantity),
    CHECK (price >= 0),
    CHECK (stock_quantity >= 0)
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'card', 'mobile_payment') NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    CHECK (total_amount >= 0)
);

-- Sale items table
CREATE TABLE IF NOT EXISTS sale_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_sale (sale_id),
    INDEX idx_product (product_id),
    CHECK (quantity > 0),
    CHECK (price_at_time >= 0)
);

-- Insert sample data
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@garagetools.com', '$2a$10$YourHashedPasswordHere', 'admin'),
('staff1', 'staff1@garagetools.com', '$2a$10$YourHashedPasswordHere', 'staff');

INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES
('Cordless Drill 18V', 'High-performance cordless drill with 2 batteries', 149.99, 25, 'Power Tools', 'drill.jpg'),
('Circular Saw 7-1/4"', 'Professional circular saw with laser guide', 199.99, 15, 'Power Tools', 'saw.jpg'),
('Mechanics Tool Set', '250-piece mechanics tool set with case', 299.99, 10, 'Hand Tools', 'toolset.jpg'),
('Digital Torque Wrench', 'Precision digital torque wrench with backlight', 129.99, 8, 'Measuring Tools', 'torque.jpg'),
('Welding Helmet', 'Auto-darkening welding helmet with solar power', 89.99, 12, 'Safety', 'helmet.jpg'),
('Air Compressor 20L', 'Oil-free air compressor with accessories', 249.99, 6, 'Air Tools', 'compressor.jpg'),
('Socket Set 1/2" Drive', 'Comprehensive socket set with ratchet', 79.99, 20, 'Hand Tools', 'socket.jpg'),
('Multimeter Digital', 'Professional digital multimeter with temperature', 59.99, 18, 'Measuring Tools', 'multimeter.jpg');
