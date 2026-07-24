-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 01, 2026 at 07:34 AM
-- Server version: 8.4.5
-- PHP Version: 8.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iwpaint`
--
CREATE DATABASE IF NOT EXISTS `iwpaint` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `iwpaint`;

-- --------------------------------------------------------

--
-- Table structure for table `dim_distributors`
--

CREATE TABLE `dim_distributors` (
  `id` int NOT NULL,
  `kode_distributor` varchar(10) NOT NULL,
  `nama_distributor` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dim_distributors`
--

INSERT INTO `dim_distributors` (`id`, `kode_distributor`, `nama_distributor`) VALUES
(1, 'CWP', 'Catur Sentosa Adiprana PT'),
(2, 'HCW', 'Harta Catur Wijaya'),
(3, 'HVN', 'Haven Light Indonesia'),
(4, 'LCR', 'Lancar Rejeki'),
(5, 'MS', 'Mitra Sejahtera'),
(6, 'NEW', 'Distributor Baru'),
(7, 'CXX', 'CWP'),
(8, 'HXX', 'HCW'),
(9, 'LXX', 'LCR'),
(10, 'MXX', 'MS');

-- --------------------------------------------------------

--
-- Table structure for table `dim_divisions`
--

CREATE TABLE `dim_divisions` (
  `id` int NOT NULL,
  `nama_divisi` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dim_divisions`
--

INSERT INTO `dim_divisions` (`id`, `nama_divisi`) VALUES
(1, 'AUTO'),
(2, 'DECO'),
(3, 'IND'),
(4, 'KKWPIP'),
(5, 'OTR IWP'),
(6, 'UNKNOWN');

-- --------------------------------------------------------

--
-- Table structure for table `dim_products`
--

CREATE TABLE `dim_products` (
  `id` int NOT NULL,
  `nama_produk` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dim_products`
--

INSERT INTO `dim_products` (`id`, `nama_produk`) VALUES
(12, 'ADLR'),
(10, 'ALFA'),
(17, 'ALFA ZC'),
(11, 'ATB'),
(3, 'CC'),
(6, 'DLTN'),
(9, 'KKG'),
(15, 'KKWPIP'),
(18, 'LAIN2'),
(13, 'MCT'),
(4, 'MJ EPX'),
(16, 'MJ GM'),
(1, 'MJ ZINC'),
(14, 'PRO'),
(19, 'PRODUK BARU'),
(7, 'PTC'),
(8, 'PTX'),
(5, 'STX'),
(20, 'UNKNOWN'),
(2, 'WRT');

-- --------------------------------------------------------

--
-- Table structure for table `fact_distributor_targets`
--

CREATE TABLE `fact_distributor_targets` (
  `id` int NOT NULL,
  `upload_log_id` int DEFAULT NULL,
  `bulan_nama` varchar(10) NOT NULL,
  `tahun` int NOT NULL,
  `distributor_id` int DEFAULT NULL,
  `target_value` decimal(15,2) DEFAULT '0.00',
  `acv_score` decimal(5,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fact_distributor_targets`
--

INSERT INTO `fact_distributor_targets` (`id`, `upload_log_id`, `bulan_nama`, `tahun`, `distributor_id`, `target_value`, `acv_score`) VALUES
(1, 1, 'JAN', 2026, 1, '30000000.00', '85.50'),
(2, 1, 'FEB', 2026, 2, '15000000.00', '90.00'),
(3, 1, 'MAR', 2026, 3, '10000000.00', '78.20'),
(4, 1, 'APR', 2026, 4, '20000000.00', '95.00'),
(5, 2, 'JUL', 2026, 6, '1000000.00', '885.00');

-- --------------------------------------------------------

--
-- Table structure for table `fact_sales`
--

CREATE TABLE `fact_sales` (
  `id` bigint NOT NULL,
  `upload_log_id` int DEFAULT NULL,
  `tanggal` date NOT NULL,
  `bulan_nama` varchar(10) NOT NULL,
  `distributor_id` int DEFAULT NULL,
  `division_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `price_per_unit` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_sales` decimal(15,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fact_sales`
--

INSERT INTO `fact_sales` (`id`, `upload_log_id`, `tanggal`, `bulan_nama`, `distributor_id`, `division_id`, `product_id`, `quantity`, `price_per_unit`, `total_sales`) VALUES
(1, 1, '2026-01-10', 'JAN', 1, 2, 1, 500, '50000.00', '25000000.00'),
(2, 1, '2026-02-14', 'FEB', 2, 1, 2, 300, '40000.00', '12000000.00'),
(3, 1, '2026-03-20', 'MAR', 3, 3, 3, 150, '60000.00', '9000000.00'),
(4, 1, '2026-04-25', 'APR', 4, 4, 4, 800, '20000.00', '16000000.00'),
(5, 2, '2026-06-30', 'JUL', 6, 2, 19, 10, '50000.00', '500000.00'),
(6, 3, '2026-02-01', 'FEB', 7, 6, 20, 110, '0.00', '19800000.00'),
(7, 3, '2026-02-10', 'FEB', 8, 6, 20, 210, '0.00', '25200000.00'),
(8, 3, '2026-02-14', 'FEB', 8, 6, 20, 400, '0.00', '10000000.00'),
(9, 3, '2026-02-22', 'FEB', 9, 6, 20, 150, '0.00', '12750000.00'),
(10, 3, '2026-02-28', 'FEB', 10, 6, 20, 300, '0.00', '12000000.00'),
(11, 4, '2026-03-03', 'MAR', 7, 6, 20, 500, '0.00', '60000000.00'),
(12, 4, '2026-03-07', 'MAR', 8, 6, 20, 250, '0.00', '23750000.00'),
(13, 4, '2026-03-15', 'MAR', 8, 6, 20, 180, '0.00', '37800000.00'),
(14, 4, '2026-03-22', 'MAR', 9, 6, 20, 600, '0.00', '18000000.00'),
(15, 4, '2026-03-29', 'MAR', 10, 6, 20, 350, '0.00', '19250000.00');

-- --------------------------------------------------------

--
-- Table structure for table `upload_logs`
--

CREATE TABLE `upload_logs` (
  `id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) NOT NULL DEFAULT 'success',
  `message` varchar(255) DEFAULT NULL,
  `total_rows` int NOT NULL DEFAULT '0',
  `processed_rows` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `upload_logs`
--

INSERT INTO `upload_logs` (`id`, `file_name`, `uploaded_at`, `status`, `message`, `total_rows`, `processed_rows`) VALUES
(1, 'dummy_sales_2026.xlsx', '2026-07-01 06:22:05', 'success', NULL, 0, 0),
(2, 'sample_import.csv', '2026-07-01 06:53:17', 'success', 'Import selesai', 1, 1),
(3, '2.xlsx', '2026-07-01 07:13:52', 'success', 'Import selesai', 5, 5),
(4, '3.xlsx', '2026-07-01 07:17:03', 'success', 'Import selesai', 5, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dim_distributors`
--
ALTER TABLE `dim_distributors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_distributor` (`kode_distributor`);

--
-- Indexes for table `dim_divisions`
--
ALTER TABLE `dim_divisions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_divisi` (`nama_divisi`);

--
-- Indexes for table `dim_products`
--
ALTER TABLE `dim_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_produk` (`nama_produk`);

--
-- Indexes for table `fact_distributor_targets`
--
ALTER TABLE `fact_distributor_targets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `upload_log_id` (`upload_log_id`),
  ADD KEY `distributor_id` (`distributor_id`);

--
-- Indexes for table `fact_sales`
--
ALTER TABLE `fact_sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `upload_log_id` (`upload_log_id`),
  ADD KEY `distributor_id` (`distributor_id`),
  ADD KEY `division_id` (`division_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `upload_logs`
--
ALTER TABLE `upload_logs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dim_distributors`
--
ALTER TABLE `dim_distributors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `dim_divisions`
--
ALTER TABLE `dim_divisions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `dim_products`
--
ALTER TABLE `dim_products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `fact_distributor_targets`
--
ALTER TABLE `fact_distributor_targets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `fact_sales`
--
ALTER TABLE `fact_sales`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `upload_logs`
--
ALTER TABLE `upload_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fact_distributor_targets`
--
ALTER TABLE `fact_distributor_targets`
  ADD CONSTRAINT `fact_distributor_targets_ibfk_1` FOREIGN KEY (`upload_log_id`) REFERENCES `upload_logs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fact_distributor_targets_ibfk_2` FOREIGN KEY (`distributor_id`) REFERENCES `dim_distributors` (`id`);

--
-- Constraints for table `fact_sales`
--
ALTER TABLE `fact_sales`
  ADD CONSTRAINT `fact_sales_ibfk_1` FOREIGN KEY (`upload_log_id`) REFERENCES `upload_logs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fact_sales_ibfk_2` FOREIGN KEY (`distributor_id`) REFERENCES `dim_distributors` (`id`),
  ADD CONSTRAINT `fact_sales_ibfk_3` FOREIGN KEY (`division_id`) REFERENCES `dim_divisions` (`id`),
  ADD CONSTRAINT `fact_sales_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `dim_products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
