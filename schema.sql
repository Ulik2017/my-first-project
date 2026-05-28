CREATE DATABASE IF NOT EXISTS sales_app;
USE sales_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role ENUM('regular','project','administrator') NOT NULL,
  sales_id INT NULL
);

CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  category ENUM('regular','project','administrator') NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  pic VARCHAR(150) NOT NULL,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  website VARCHAR(200) NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quotations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sales_id INT NOT NULL,
  customer_id INT NOT NULL,
  need_text VARCHAR(255) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  remark VARCHAR(255) NULL,
  deadline DATE NOT NULL,
  progress ENUM('lead','contacted','qualified','proposal made','won','lost') NOT NULL,
  FOREIGN KEY (sales_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

INSERT IGNORE INTO sales (id,name,email,phone,category,username,password) VALUES
(1,'Admin Utama','admin@corp.com','080000000','administrator','admin','admin123'),
(2,'Sales Reguler','sales1@corp.com','081111111','regular','sales1','sales123');

INSERT IGNORE INTO users (username,password,role,sales_id) VALUES
('admin','admin123','administrator',1),
('sales1','sales123','regular',2);
