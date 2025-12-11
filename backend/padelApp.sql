-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Dec 11, 2025 at 08:01 PM
-- Server version: 8.0.35
-- PHP Version: 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `padelApp`
--

-- --------------------------------------------------------

--
-- Table structure for table `courts`
--

CREATE TABLE `courts` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `indoor` tinyint(1) DEFAULT '0',
  `capacity` int DEFAULT '4',
  `price` int DEFAULT '0',
  `currency` varchar(10) DEFAULT 'EUR',
  `timezone` varchar(50) DEFAULT 'Europe/Bucharest'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courts`
--

INSERT INTO `courts` (`id`, `name`, `description`, `indoor`, `capacity`, `price`, `currency`, `timezone`) VALUES
(1, 'Court 1', 'Clay surface, indoor', 1, 4, 120, 'EUR', 'Europe/Bucharest'),
(2, 'Court 2', 'Artificial turf, indoor with lights', 1, 4, 100, 'EUR', 'Europe/Bucharest'),
(3, 'Court 3', 'Hard surface, indoor', 1, 4, 90, 'EUR', 'Europe/Bucharest'),
(4, 'Court 4', 'Synthetic grass, indoor', 1, 4, 80, 'EUR', 'Europe/Bucharest'),
(5, 'Court 5', 'Clay surface, indoor', 1, 4, 90, 'EUR', 'Europe/Bucharest');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int NOT NULL,
  `court_id` int NOT NULL,
  `user_id` varchar(200) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'confirmed',
  `players_count` int DEFAULT '4',
  `price_cents` int DEFAULT '0',
  `currency` varchar(10) DEFAULT 'EUR',
  `payment_id` varchar(100) DEFAULT NULL,
  `cancel_reason` text,
  `cancelled_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `court_id`, `user_id`, `start_time`, `end_time`, `status`, `players_count`, `price_cents`, `currency`, `payment_id`, `cancel_reason`, `cancelled_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'WtwqVG7qf1WAJQaElNbMIfP58Ys2', '2025-12-01 21:57:00', '2025-12-27 21:57:00', 'confirmed', 4, 12000, 'EUR', NULL, NULL, NULL, '2025-12-11 19:57:51', '2025-12-11 19:57:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `photo` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `name`, `email`, `photo`) VALUES
(0, 'denis denis', 'dd2341093@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocK1fcvK6eRcgMMkPmdRDgcWjU-6fG2AWecxJIEq08lHHUdynX6V=s96-c'),
(9999, 'alex1234', 'alex@yahoo.com', 'img.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courts`
--
ALTER TABLE `courts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `court_id` (`court_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courts`
--
ALTER TABLE `courts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`court_id`) REFERENCES `courts` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
