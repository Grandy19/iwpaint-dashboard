SET FOREIGN_KEY_CHECKS = 0;
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 27, 2026 at 01:08 PM
-- Server version: 8.4.5
-- PHP Version: 8.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `iwpaint2`
--
CREATE DATABASE IF NOT EXISTS `iwpaint2` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `iwpaint2`;

-- --------------------------------------------------------

--
-- Table structure for table `dim_distributors`
--

CREATE TABLE `dim_distributors` (
  `id` int NOT NULL,
  `kode_distributor` varchar(10) COLLATE utf8_general_ci NOT NULL,
  `nama_distributor` varchar(100) COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `dim_distributors`
--



-- --------------------------------------------------------

--
-- Table structure for table `dim_gudang`
--

CREATE TABLE `dim_gudang` (
  `kode_gudang` varchar(20) CHARACTER SET utf8 NOT NULL,
  `nama_gudang` varchar(150) CHARACTER SET utf8 NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `dim_gudang`
--



-- --------------------------------------------------------

--
-- Table structure for table `dim_products`
--

CREATE TABLE `dim_products` (
  `id` int NOT NULL,
  `kode_produk` varchar(50) DEFAULT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `harga_jual` decimal(15,2) DEFAULT '0.00',
  `satuan_kecil` varchar(50) DEFAULT NULL,
  `kategori` varchar(100) DEFAULT NULL,
  `berat` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `dim_products`
--




-- --------------------------------------------------------

--
-- Table structure for table `dim_salesman`
--

CREATE TABLE `dim_salesman` (
  `kode_salesman` varchar(20) NOT NULL,
  `nama_salesman` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `dim_salesman`
--



-- --------------------------------------------------------

--
-- Table structure for table `dim_supplier`
--

CREATE TABLE `dim_supplier` (
  `kode_supplier` varchar(50) NOT NULL,
  `nama_supplier` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `dim_supplier`
--



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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `fact_distributor_targets`
--



-- --------------------------------------------------------

--
-- Table structure for table `fact_sales`
--

CREATE TABLE `fact_sales` (
  `id` bigint NOT NULL,
  `upload_log_id` int DEFAULT NULL,
  `jenis` varchar(10) DEFAULT NULL,
  `nofaktur` varchar(50) DEFAULT NULL,
  `tanggal` datetime DEFAULT NULL,
  `noso` varchar(50) DEFAULT NULL,
  `tutupso` varchar(5) DEFAULT NULL,
  `jatuh_tempo` datetime DEFAULT NULL,
  `kodecustomer` varchar(20) DEFAULT NULL,
  `namacustomer` varchar(150) DEFAULT NULL,
  `alamatcustomer` varchar(255) DEFAULT NULL,
  `kode_salesman` varchar(20) DEFAULT NULL,
  `nama_salesman` varchar(150) DEFAULT NULL,
  `kode_gudang` varchar(20) DEFAULT NULL,
  `nama_gudang` varchar(150) DEFAULT NULL,
  `kode_barang` varchar(50) DEFAULT NULL,
  `nama_barang` varchar(255) DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `qty` decimal(15,2) DEFAULT '0.00',
  `hargajual` decimal(15,2) DEFAULT '0.00',
  `satuan_kecil` varchar(50) DEFAULT NULL,
  `pdiscountitem` decimal(5,2) DEFAULT '0.00',
  `pdiscountitem2` decimal(5,2) DEFAULT '0.00',
  `pdiscountitem3` decimal(5,2) DEFAULT '0.00',
  `discountitem` decimal(15,2) DEFAULT '0.00',
  `netto` decimal(15,2) DEFAULT '0.00',
  `keterangan` text,
  `kode_suplier` varchar(50) DEFAULT NULL,
  `nama_suplier` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `fact_targets`
--

CREATE TABLE `fact_targets` (
  `id` int NOT NULL,
  `kode_salesman` varchar(20) NOT NULL,
  `tahun` int NOT NULL,
  `bulan_nama` varchar(20) NOT NULL,
  `target_deco` decimal(15,2) DEFAULT '0.00',
  `target_auto` decimal(15,2) DEFAULT '0.00',
  `target_ind` decimal(15,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `upload_logs`
--

CREATE TABLE `upload_logs` (
  `id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'processing',
  `message` varchar(255) DEFAULT NULL,
  `total_rows` int NOT NULL DEFAULT '0',
  `processed_rows` int NOT NULL DEFAULT '0',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `nomor_hp` varchar(20) DEFAULT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Aktif',
  `supervisor_name` varchar(150) DEFAULT NULL,
  `tanggal_bergabung` date DEFAULT NULL,
  `kode_salesman` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--



-- --------------------------------------------------------

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
-- Indexes for table `dim_gudang`
--
ALTER TABLE `dim_gudang`
  ADD PRIMARY KEY (`kode_gudang`);

--
-- Indexes for table `dim_products`
--
ALTER TABLE `dim_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_kode_produk` (`kode_produk`);

--
-- Indexes for table `dim_salesman`
--
ALTER TABLE `dim_salesman`
  ADD PRIMARY KEY (`kode_salesman`);

--
-- Indexes for table `dim_supplier`
--
ALTER TABLE `dim_supplier`
  ADD PRIMARY KEY (`kode_supplier`);

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
  ADD KEY `ix_fact_tanggal` (`tanggal`),
  ADD KEY `ix_fact_nofaktur` (`nofaktur`),
  ADD KEY `upload_log_id` (`upload_log_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `kode_salesman` (`kode_salesman`),
  ADD KEY `kode_gudang` (`kode_gudang`),
  ADD KEY `kode_suplier` (`kode_suplier`);

--
-- Indexes for table `fact_targets`
--
ALTER TABLE `fact_targets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_sales_period` (`kode_salesman`,`tahun`,`bulan_nama`);

--
-- Indexes for table `upload_logs`
--
ALTER TABLE `upload_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `kode_salesman` (`kode_salesman`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dim_distributors`
--
ALTER TABLE `dim_distributors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `dim_products`
--
ALTER TABLE `dim_products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12882;

--
-- AUTO_INCREMENT for table `fact_distributor_targets`
--
ALTER TABLE `fact_distributor_targets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `fact_sales`
--
ALTER TABLE `fact_sales`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54665;

--
-- AUTO_INCREMENT for table `fact_targets`
--
ALTER TABLE `fact_targets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `upload_logs`
--
ALTER TABLE `upload_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fact_distributor_targets`
--
ALTER TABLE `fact_distributor_targets`
  ADD CONSTRAINT `fk_target_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `dim_distributors` (`id`),
  ADD CONSTRAINT `fk_target_upload` FOREIGN KEY (`upload_log_id`) REFERENCES `upload_logs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fact_sales`
--
ALTER TABLE `fact_sales`
  ADD CONSTRAINT `fact_sales_ibfk_1` FOREIGN KEY (`upload_log_id`) REFERENCES `upload_logs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fact_sales_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `dim_products` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fact_sales_ibfk_3` FOREIGN KEY (`kode_salesman`) REFERENCES `dim_salesman` (`kode_salesman`),
  ADD CONSTRAINT `fact_sales_ibfk_4` FOREIGN KEY (`kode_gudang`) REFERENCES `dim_gudang` (`kode_gudang`),
  ADD CONSTRAINT `fact_sales_ibfk_5` FOREIGN KEY (`kode_suplier`) REFERENCES `dim_supplier` (`kode_supplier`);

--
-- Constraints for table `fact_targets`
--
ALTER TABLE `fact_targets`
  ADD CONSTRAINT `fact_targets_ibfk_1` FOREIGN KEY (`kode_salesman`) REFERENCES `dim_salesman` (`kode_salesman`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`kode_salesman`) REFERENCES `dim_salesman` (`kode_salesman`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

SET FOREIGN_KEY_CHECKS = 1;

