-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 27, 2026 at 12:19 PM
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
DROP DATABASE IF EXISTS `iwpaint`;
CREATE DATABASE `iwpaint` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `iwpaint`;

-- --------------------------------------------------------

--
-- Table structure for table `dim_distributors`
--

CREATE TABLE `dim_distributors` (
  `id` int NOT NULL,
  `kode_distributor` varchar(10) NOT NULL,
  `nama_distributor` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Table structure for table `dim_gudang`
--

CREATE TABLE `dim_gudang` (
  `kode_gudang` varchar(20) NOT NULL,
  `nama_gudang` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dim_gudang`
--

INSERT INTO `dim_gudang` (`kode_gudang`, `nama_gudang`, `created_at`) VALUES
('1', 'GUDANG BAIK', '2026-07-07 11:27:58'),
('2', 'GUDANG RUSAK', '2026-07-07 11:27:58'),
('3', 'GUDANG OPLOSAN', '2026-07-07 11:27:58'),
('4', 'GUDANG BOGOR', '2026-07-07 11:27:58'),
('G-001', 'Gudang Utama', '2026-07-08 02:12:55'),
('G-002', 'Gudang Cabang', '2026-07-08 02:13:24');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dim_products`
--

INSERT INTO `dim_products` (`id`, `kode_produk`, `nama_produk`, `harga_jual`, `satuan_kecil`, `kategori`, `berat`, `created_at`) VALUES
(12068, '240035', 'Petalac 2K PU Colour Base P.112 Mole Brown 0.8LT', '142000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12069, '240044', 'Petalac 2K PU CO Base VM152 0.8LT', '145000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12070, '240046', 'Attaboy High Gloss Acrylic Enamel S1002-G50Y 20LT', '2220000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12071, '240049', 'Petalac 2K PU CO Base Abu HPL Satin 0.8LT', '167000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12072, '2100006', 'Alfa Polyester Putty 1 KG', '47500.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12073, '2100007', 'Alfa Polyester Putty Hardener 20 GRAM', '15000.00', 'TUBE', 'AUTOMOTIVE', 0.02, '2026-07-22 05:29:23'),
(12074, '2100011', 'AlFa Polyester Putty 3KG', '120000.00', 'GLN', 'AUTOMOTIVE', 3, '2026-07-22 05:29:23'),
(12075, '2100012', 'Alfa Polyester Putty Hardener 60gr', '30000.00', 'TUBE', 'AUTOMOTIVE', 0.06, '2026-07-22 05:29:23'),
(12076, '2100015', 'Alfa Zinc Chromate Primer Grey 1 KG', '0.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12077, '2100016', 'Alfa Zinc Chromate Primer BM Grey 20kg', '820000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12078, '2100018', 'Alfa Zinc Chromate Primer GREEN 20 KG', '910200.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12079, '2100027', 'Adler Epoxy Undercoat BASE', '105000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12080, '2100029', 'Adler Epoxy Undercoat 1 LITER', '122000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12081, '2100043', 'Adler PU Primer Surfacer 8022 Grey 1 LITER', '135000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12082, '2100048', 'Adler Polyester Putty 3002 Hardener 25gr', '17000.00', 'TUBE', 'AUTOMOTIVE', 25, '2026-07-22 05:29:23'),
(12083, '2100049', 'Adler Polyester Putty 3002 1 KG SET', '72000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12084, '2100052', 'Adler Polyester Putty 3002 25 KG SET', '1500000.00', 'PAIL', 'AUTOMOTIVE', 25, '2026-07-22 05:29:23'),
(12085, '2100057', 'Adler Primer Surfacer EP 1050 Base 1lt', '171000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12086, '2100065', 'Adler Primer Surfacer EP 1050 40 LITER SET', '4410000.00', 'PAIL', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12087, '2100067', 'Adler Primer Surfacer EP 1050 8 LITER SET', '942000.00', 'GLN', 'AUTOMOTIVE', 8, '2026-07-22 05:29:23'),
(12088, '2100068', 'Adler Primer Surfacer EP 1050 2 LITER SET', '250000.00', 'KLG', 'AUTOMOTIVE', 2, '2026-07-22 05:29:23'),
(12089, '2100188', 'Adler PU Hardener 1lt', '275000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12090, '2100202', 'Adler Thinner PU T1001 20 LITER', '1053000.00', 'JRG', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12091, '2100217', 'Attaboy Colorant Blue MS 1 LITER', '400000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12092, '2100219', 'Attaboy Colorant Black TT 1 LITER', '239000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12093, '2100221', 'Attaboy Colorant Green Strong LS 1 LITER', '444000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12094, '2100224', 'Attaboy Colorant Orange Yellow US 1 LITER', '794000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12095, '2100225', 'Attaboy Colorant Red Oxide VT 1 LITER', '328000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12096, '2100227', 'Attaboy Colorant Red RS 1 LITER', '517000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12097, '2100229', 'Attaboy Colorant Violet FT 1 LITER', '471000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12098, '2100230', 'Attaboy Colorant White XT 1 LITER', '441000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12099, '2100231', 'Attaboy Colorant Yellow KS 1 LITER', '400000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12100, '2100232', 'Attaboy Colorant Yellow RT 1 LITER', '287000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12101, '2100333', 'Attaboy High Gloss Acrylic Enamel AG 6000 White20L', '3300000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12102, '2100346', 'Attaboy Multi Colour Paint S6612 4 LTR', '510000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12103, '2100360', 'Attaboy Multi Colour Paint S6616 4 LTR', '510000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12104, '2100367', 'Attaboy Multi Colour Paint S6624 4 LTR', '588000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12105, '2100370', 'Attaboy Multi Colour Paint S6627 4 LTR', '510000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12106, '2100384', 'Attaboy Multi Colour Paint DS 505 4 LTR', '510000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12107, '2100556', 'Attaboy Natural Stone Protector Black 1 LITER', '113000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12108, '2100558', 'Attaboy Natural Stone Protector Gloss 1 LITER', '113000.00', 'KLG', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12109, '2100596', 'Attaboy OS Facade paint PQ 8039 Rose white 18lts', '3152400.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12110, '2100705', 'Attaboy OS Super Primer White 18 LITER', '1500000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12111, '2100710', 'Attaboy OS Super Primer White 2 LITER', '200000.00', 'GLN', 'DECORATIVE', 2, '2026-07-22 05:29:23'),
(12112, '2100890', 'Attaboy Supercryl Super White 20 LITER', '1960000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12113, '2100891', 'Attaboy Supercryl Base A 2.5 LTR', '237000.00', 'GLN', 'DECORATIVE', 2.5, '2026-07-22 05:29:23'),
(12114, '2100894', 'Attaboy Supercryl Base B 2.5 LTR', '203000.00', 'GLN', 'DECORATIVE', 2.5, '2026-07-22 05:29:23'),
(12115, '2100909', 'Attaboy Supercryl Super White 2,5 Ltr', '295000.00', 'GLN', 'DECORATIVE', 2.5, '2026-07-22 05:29:23'),
(12116, '2100911', 'Attaboy Thinner Epoxy 20LT', '920000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12117, '2100913', 'Attaboy Thinner OS 2000 1 LITER', '66600.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12118, '2100932', 'Attaboy Weatherguard NCS S3050-G30Y', '2656000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12119, '2100933', 'Attaboy Weatherguard NCS S3560-R90B', '2817000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12120, '2101061', 'Attaboy Weatherguard DX Mirrage 20lt', '2220000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12121, '2101098', 'Attaboy Weatherguard New Sanbe Grey 20 LT', '2475000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12122, '2101109', 'Attaboy Weatherguard Super White 20 LITER', '2485000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12123, '2101114', 'Attaboy Weatherguard NCS 0580-Y', '3369000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12124, '2101318', 'Attaboy Weatherguard Base A 2,5 LITER', '339000.00', 'GLN', 'DECORATIVE', 2.5, '2026-07-22 05:29:23'),
(12125, '2101319', 'Attaboy Weatherguard Base B 2,5 LITER', '260000.00', 'GLN', 'DECORATIVE', 2.5, '2026-07-22 05:29:23'),
(12126, '2101330', 'Attaboy Wall Putty Instant Powder 2 KG', '38000.00', 'BKS', 'DECORATIVE', 2, '2026-07-22 05:29:23'),
(12127, '2101337', 'Attaboy Water Repellent Sealer 1lt', '98000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12128, '2101347', 'Crystal Coat Candytone Base Yellow', '500700.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12129, '2101361', 'Crystal Coat Candytone Black 1 LITER', '700000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12130, '2101363', 'Crystal Coat Candytone Copper 1Lts', '700000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12131, '2101365', 'Crystal Coat Candytone Golden Lacq 1 LITER', '777000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12132, '2101366', 'Crystal Coat Candytone Golden Metal 1 LTS', '700000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12133, '2101367', 'Crystal Coat Candytone Golden Oran 1 LITER', '700000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12134, '2101375', 'Crystal Coat Candytone Rayband 1LTS', '657000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12135, '2101377', 'Crystal Coat Candytone Vergoldet 1lts', '657000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12136, '2101379', 'Crystal Coat Candytone Yellow 1 LTR SET', '700000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12137, '2101387', 'Crystal Coat Clear Gloss 1 LITER', '832500.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12138, '2101391', 'Crystal Coat Clear Matt MV3 1 LITER', '750000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12139, '2101395', 'Crystal Coat Colour Black 1 LITER', '657000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12140, '2101398', 'Crystal Coat Clear Supermatt MV3 1 Lts', '750000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12141, '2101411', 'Crystal Coat Surfacer White 1,2 KG SET', '164000.00', 'KLG', 'INDUSTRIAL', 1.2, '2026-07-22 05:29:23'),
(12142, '2101412', 'Crystal Coat Surfacer White 24 KG SET', '3000000.00', 'PAIL', 'INDUSTRIAL', 20, '2026-07-22 05:29:23'),
(12143, '2101416', 'Crystal Coat Thinner 1 LITER', '77700.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12144, '2101419', 'Crystal Coat Thinner 5 LITER', '313000.00', 'GLN', 'INDUSTRIAL', 5, '2026-07-22 05:29:23'),
(12145, '2101421', 'Crystal Coat Thinner Surfacer 20 LITER', '910000.00', 'JRG', 'INDUSTRIAL', 20, '2026-07-22 05:29:23'),
(12146, '2101556', 'Kingkong Cat Genteng 701 Deep Bl 1 KG', '68000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12147, '2101557', 'Kingkong Cat Genteng 703 Chocola 1 KG', '68000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12148, '2101558', 'Kingkong Cat Genteng 704 Prime R 1 KG', '68000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12149, '2101559', 'Kingkong Cat Genteng 705 Maroon 1 KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12150, '2101560', 'Kingkong Cat Genteng 706 Tropic 1 KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12151, '2101564', 'Kingkong Cat Genteng 711 Special 1 KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12152, '2101565', 'Kingkong Cat Genteng 712 White 1 KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12153, '2101567', 'Kingkong Cat Genteng 714 1 KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12154, '2101570', 'Kingkong Cat Genteng 703 Chocola 20 KG', '614414.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12155, '2101575', 'Kingkong Cat Genteng 709 Coffee 20 KG', '1028000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12156, '2101578', 'Kingkong Cat Genteng 712 White 20 KG', '1028000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12157, '2101583', 'Kingkong Cat Genteng 703 Chocola 4 KG', '228000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12158, '2101584', 'Kingkong Cat Genteng 704 Prime R 4 KG', '228000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12159, '2101585', 'Kingkong Cat Genteng 705 Maroon 4 KG', '228000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12160, '2101586', 'Kingkong Cat Genteng 706 Tropic 4 KG', '228000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12161, '2101587', 'Kingkong Cat Genteng 708 Tile Re 4 KG', '228000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12162, '2101588', 'Kingkong Cat Genteng 709 Coffee 4 KG', '198000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12163, '2101589', 'Kingkong Cat Genteng 710 Willow 4 KG', '198000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12164, '2101590', 'Kingkong Cat Genteng 711 Special 4 KG', '228000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12165, '2101591', 'Kingkong Cat Genteng 712 White 4 KG', '228000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12166, '2101592', 'Kingkong Cat Genteng 713 Special 4 KG', '228000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12167, '2101593', 'Kingkong Cat genteng 714 Side Gr 4 KG', '228000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12168, '2101607', 'Kingkong Wall Putty Instant Powder 25 KG', '146300.00', 'ZAK', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12169, '2101608', 'Kingkong Wall Putty Instant Powder 5 KG', '38000.00', 'BKS', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12170, '2101615', 'Kingkong Wall Paint 105 CHIFFON 1 KG', '27000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12171, '2101619', 'Kingkong Wall Paint 109 APPLE W 1 KG', '27000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12172, '2101621', 'Kingkong Wall Paint 113 TILE RE 1 KG', '31000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12173, '2101625', 'Kingkong Wall Paint 117 ROSE 1 KG', '31000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12174, '2101627', 'Kingkong Wall Paint 119 Canary 1 KG', '31000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12175, '2101632', 'Kingkong Wall Paint 124 BLUE LA 1 KG', '31000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12176, '2101634', 'Kingkong Wall Paint 126 Bali Gr 1 KG', '31000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12177, '2101636', 'Kingkong Wall Paint 128 Minimal 1 KG', '31000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12178, '2101637', 'Kingkong Wall Paint 129 River S 1 KG', '31000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12179, '2101640', 'Kingkong Wall Paint 132 1 KG', '27000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12180, '2101641', 'Kingkong Wall Paint Black 1 KG', '31000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12181, '2101643', 'Kingkong Wall Paint Super White 1 KG', '31000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12182, '2101657', 'Kingkong Wall Paint Super White 200 KG', '3188000.00', 'DRUM', 'DECORATIVE', 200, '2026-07-22 05:29:23'),
(12183, '2101669', 'Kingkong Wall Paint 106 Apple G 25 KG', '112612.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12184, '2101670', 'Kingkong Wall Paint 107 BROKEN 25 KG', '102702.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12185, '2101682', 'Kingkong Wall Paint 121 Saphire 25 KG', '216000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12186, '2101693', 'Kingkong Wall Paint 132 25 KG', '214054.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12187, '2101697', 'Kingkong Wall Paint Putih Metro 25 KG', '213636.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12188, '2101701', 'Kingkong Wall Paint Super White 25 KG', '277500.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12189, '2101705', 'Kingkong Wall Paint 104 Cream 5 KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12190, '2101707', 'Kingkong Wall Paint 106 Apple G 5 KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12191, '2101708', 'Kingkong Wall Paint 107 BROKEN 5 KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12192, '2101710', 'Kingkong Wall Paint 109 APPLE W 5 KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12193, '2101711', 'Kingkong Wall Paint 110 Irish W 5 KG', '46576.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12194, '2101713', 'Kingkong Wall Paint 113 TILE RE 5 KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12195, '2101714', 'Kingkong Wall Paint 114 PINK 5 KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12196, '2101715', 'Kingkong Wall Paint 115 SALEM 5 KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12197, '2101716', 'Kingkong Wall Paint 116 ORCHID 5 KG', '58000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12198, '2101724', 'Kingkong Wall Paint 124 BLUE LA 5 KG', '58000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12199, '2101732', 'Kingkong Wall Paint 132 5 KG', '58000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12200, '2101734', 'KINGKONG WALL PAINT BS 5 KG', '38738.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12201, '2101913', 'Meiji Epoxy Filler 0.25 LTR SET', '30000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12202, '2101914', 'Meiji Epoxy Filler White 0.25 LTR SET', '26500.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12203, '2101915', 'Meiji Epoxy Filler 1 LTR SET', '93000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12204, '2101916', 'Meiji Epoxy Filler Black 1 LTR SET', '93000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12205, '2101917', 'Meiji Epoxy Filler White 1 LTR SET', '93000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12206, '2101918', 'Meiji Epoxy Filler 20 LTR SET', '1325000.00', 'PAIL', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12207, '2101920', 'Meiji Epoxy Filler White 20 LTR SET', '1600000.00', 'PAIL', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12208, '2101924', 'Meiji Gum Sealer 1 LTR SET', '182000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12209, '2101926', 'Meiji Lacquer Primer Surfacer IK 1 LITER', '62000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12210, '2101951', 'Meiji PU Rapid Clear 1 LTR SET', '103000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12211, '2102061', 'Meiji Zinc Chromate Primer 1 KG', '57500.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12212, '2102062', 'Meiji Zinc Chromate Primer Black 1 KG', '57500.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12213, '2102063', 'Meiji Zinc Chromate Primer Broken White 1 KG', '57500.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12214, '2102064', 'Meiji Zinc Chromate Primer Grey 1 KG', '57500.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12215, '2102065', 'Meiji Zinc Chromate Primer Iron Oxide 1 KG', '51000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12216, '2102066', 'Meiji Zinc Chromate Primer 20 KG', '962000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12217, '2102068', 'Meiji Zinc Chromate Primer Broken Whit 20 KG', '962000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12218, '2102069', 'Meiji Zinc Chromate Primer Grey 20 KG', '962000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12219, '2102072', 'Meiji Zinc Chromate Primer Oxide Red 20 KG', '825000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12220, '2102073', 'Meiji Zinc Chromate Primer Black 20 KG', '962000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12221, '2102074', 'Meiji Zinc Chromate Light Grey 20 KG', '962000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12222, '2102075', 'Meiji Zinc Chromate Primer Light Grey 5 KG', '258000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12223, '2102076', 'Meiji Zinc Chromate Primer 5 KG', '258000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12224, '2102077', 'Meiji Zinc Chromate Primer Black 5 KG', '258000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12225, '2102079', 'Meiji Zinc Chromate Primer Grey 5 KG', '258000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12226, '2102080', 'Meiji Zinc Chromate Oxide Red 5 KG', '225000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12227, '2102081', 'Meiji Zinc Chromate Primer Dark Grey 5 KG', '258000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12228, '2102084', 'Mascot Cement Additive 50 GRAM', '20000.00', 'BKS', 'DECORATIVE', 0.05, '2026-07-22 05:29:23'),
(12229, '2102093', 'Mascot Wall Filler 25 KG', '268000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12230, '2102095', 'Mascot Wall Filler 4 KG', '55000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12231, '2102109', 'Mascot Wall Paint Super White 200 KG', '2000000.00', 'DRUM', 'DECORATIVE', 200, '2026-07-22 05:29:23'),
(12232, '2102113', 'Mascot Wall Paint 203 Cream 20 KG', '215000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12233, '2102115', 'Mascot Wall Paint 206 Irish W 20 KG', '189709.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12234, '2102116', 'Mascot Wall Paint 207 Tile Re 20 KG', '140000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12235, '2102124', 'Mascot Wall Paint 2154 Mellow 20 KG', '189709.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12236, '2102126', 'Mascot Wall Paint 2156 Garden 20 KG', '162000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12237, '2102128', 'Mascot Wall Paint Putih Metro 20 KG', '162000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12238, '2102129', 'Mascot Wall Paint Super White 20 KG', '249000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12239, '2102137', 'Mascot Wall Paint 201 Apricot 25 KG', '317000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12240, '2102138', 'Mascot Wall Paint 203 Cream 25 KG', '317000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12241, '2102140', 'Mascot Wall Paint 206 Irish W 25 KG', '317000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12242, '2102141', 'Mascot Wall Paint 207 Tile Re 25 KG', '317000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12243, '2102143', 'Mascot Wall Paint 209 Spanish 25 KG', '317000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12244, '2102149', 'Mascot Wall Paint 2153 Mint G 25 KG', '270000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12245, '2102152', 'Mascot Wall Paint 2156 Garden 25 KG', '270000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12246, '2102154', 'Mascot Wall Paint Putih Metro 25 KG', '317000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12247, '2102155', 'Mascot Wall Paint Super White 25 KG', '317000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12248, '2102156', 'MASCOT WALL PAINT BLACK 25KG', '270000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12249, '2102158', 'Mascot Wall Paint 201 Apricot 5 KG', '65000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12250, '2102159', 'Mascot Wall Paint 203 Cream 5 KG', '65000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12251, '2102160', 'Mascot Wall Paint 205 Sky Blu 5 KG', '73000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12252, '2102161', 'Mascot Wall Paint 206 Irish W 5 KG', '73000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12253, '2102164', 'Mascot Wall Paint 209 Spanish 5 KG', '65000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12254, '2102167', 'Mascot Wall Paint 2126 Salem 5 KG', '65000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12255, '2102173', 'Mascot Wall Paint 2156 Garden 5 KG', '73000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12256, '2102177', 'Mascot Wall Paint Putih Metro 5 KG', '65000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12257, '2102178', 'Mascot Wall Paint Super White 5 KG', '73000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12258, '2102728', 'Petalac 2K PU Colour Base P004 Dark Yellow 0.8lt', '148000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12259, '2102730', 'Petalac 2K PU Colour Base P011 Green 0.8Lt', '138000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12260, '2102749', 'Petalac PU Clear Sealer 1 LTR SET', '135000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12261, '2102750', 'Petalac PU Clear Sealer 20 LTS', '2179000.00', 'PAIL', 'INDUSTRIAL', 20, '2026-07-22 05:29:23'),
(12262, '2102837', 'Petalac 2K PU Hardener Normal 200CC', '67710.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12263, '2102838', 'Petalac 2K PU Hardener Normal 1Liter', '308580.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12264, '2102840', 'Petalac 2K PU Hardener Special 200 CC', '67710.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12265, '2102842', 'Petalac 2K PU Hardener Metalic 200 CC', '55000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12266, '2103145', 'Petalac Thinner PU 1 LTR', '73815.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12267, '2103147', 'Petalac Thinner PU 200LT', '10091000.00', 'DRUM', 'INDUSTRIAL', 200, '2026-07-22 05:29:23'),
(12268, '2103148', 'Petalac Thinner PU 20 LTR', '1084500.00', 'JRG', 'INDUSTRIAL', 20, '2026-07-22 05:29:23'),
(12269, '2103149', 'Petalac Thinner PU 5 LTR', '286000.00', 'GLN', 'INDUSTRIAL', 5, '2026-07-22 05:29:23'),
(12270, '2103185', 'Protar Cat Proteksi Tahan Air 7204 Abu Muda 20 KG', '1150000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12271, '2103191', 'Protar Cat Proteksi Tahan Air 7200 Putih Solid 1KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12272, '2103194', 'Protar Cat Proteksi Tahan Air 7203 1KG', '0.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12273, '2103195', 'Protar Cat Proteksi Tahan Air 7204 Abu Muda 1KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12274, '2103211', 'Protar Cat Proteksi Tahan Air 7200 Putih Solid 4KG', '235000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12275, '2103219', 'Protar Cat Proteksi Tahan air 7203 20 KG', '1188000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12276, '2103222', 'Protar Cat Proteksi Tahan Air 7203 4KG', '235000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12277, '2103223', 'Protar Cat Proteksi Tahan Air 7204 Abu Muda 4KG', '235000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12278, '2103261', 'Petalux Acrylic Enamel Paint PHB Blue 20lt', '2553000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12279, '2103280', 'Petalux Alkali Resistant Wall Sealer White 20 KG', '688000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12280, '2103283', 'Petalux Alkali Resistant Wall Sealer White 4KG', '150000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12281, '2103284', 'Petalux Base A 25 KG', '757000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12282, '2103285', 'Petalux Base B 25 KG', '590000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12283, '2103286', 'Petalux Base A 5KG', '160000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12284, '2103287', 'Petalux Base B 5KG', '128000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12285, '2103293', 'Petalux Celling & Gypsum Paint Putih Wangi 25 KG', '692000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12286, '2103297', 'Petalux Ceiling & Gypsum Paint Putih Wangi 5KG', '150000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12287, '2103423', 'Petalux Thinner Acrylic Enamel Paint 1LTR', '60000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12288, '2103516', 'Petalux Wall Paint 602 Berlian 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12289, '2103518', 'Petalux Wall Paint 605 Adinda 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12290, '2103519', 'Petalux Wall Paint 608 Butter 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12291, '2103520', 'Petalux Wall Paint 612 Cream 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12292, '2103521', 'Petalux Wall Paint 614 Off Whi 25 KG', '686182.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12293, '2103529', 'Petalux Wall Paint 6303 Stone 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12294, '2103532', 'Petalux Wall Paint 6306 Orange 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12295, '2103534', 'Petalux Wall Paint 6308 Golden 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12296, '2103538', 'Petalux Wall Paint 6312 Light 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12297, '2103539', 'Petalux Wall Paint 6314 Dream 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12298, '2103541', 'Petalux Wall Paint 6316 Spring 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12299, '2103543', 'Petalux Wall Paint 6318 Junipe 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12300, '2103544', 'Petalux Wall Paint 6319 Golden 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12301, '2103545', 'Petalux Wall Paint 632 Borobud 25 KG', '686182.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12302, '2103546', 'Petalux Wall Paint 6320 Fresh 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12303, '2103547', 'Petalux Wall Paint 6321 Flagst 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12304, '2103548', 'Petalux Wall Paint 6322 Earl g 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12305, '2103551', 'Petalux Wall Paint 6325 Elixir 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12306, '2103552', 'PETALUX WALL PAINT 6326 Pinky 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12307, '2103553', 'Petalux Wall Paint 6328 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12308, '2103554', 'Petalux Wall Paint 6329 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12309, '2103555', 'Petalux Wall Paint 6331 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12310, '2103556', 'Petalux Wall Paint 6332 25 KG', '686182.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12311, '2103562', 'Petalux Wall Paint 641 Apple W 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12312, '2103564', 'Petalux Wall Paint 643 Irish W 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12313, '2103565', 'Petalux Wall Paint 644 Rose Wh 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12314, '2103566', 'Petalux Wall Paint 645 Misty B 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12315, '2103568', 'Petalux Wall Paint 661 Romanti 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12316, '2103572', 'Petalux Wall Paint 674 Valenti 25 KG', '0.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12317, '2103578', 'Petalux Wall Paint 682 Almond 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12318, '2103584', 'Petalux Wall Paint 690 Pacific 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12319, '2103593', 'Petalux Wall Paint CM 602 Matahari 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12320, '2103601', 'Petalux Wall Paint DX NBC Whit 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12321, '2103611', 'Petalux Pos Wall Paint HJ Catty Mery gold 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12322, '2103618', 'Petalux Wall Paint Putih Hemat 01 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12323, '2103621', 'Petalux Wall Paint Putih hemat 04 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12324, '2103623', 'Petalux Wall Paint Putih hemat 06 25 KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12325, '2103625', 'Petalux Wall Paint Putih Wangi 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12326, '2103630', 'Petalux Wall Paint POS PH04 25 KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12327, '2103640', 'Petalux Wall Paint Super White 25 KG', '850000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12328, '2103650', 'Petalux Wall Paint 602 Berlian 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12329, '2103651', 'Petalux Wall Paint 603 Pastel Green 5KG', '90000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12330, '2103653', 'Petalux Wall Paint 605 Adinda 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12331, '2103654', 'Petalux Wall Paint 608 Butter 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12332, '2103655', 'Petalux Wall Paint 612 Cream 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12333, '2103656', 'Petalux Wall Paint 614 Off Whi 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12334, '2103664', 'Petalux Wall Paint 6303 Stone 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12335, '2103666', 'Petalux Wall Paint 6305 Hazel 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12336, '2103667', 'Petalux Wall Paint 6306 Orange 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12337, '2103669', 'Petalux Wall Paint 6308 Golden 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12338, '2103670', 'Petalux Wall Paint 6309 Cottag 5KG', '90000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12339, '2103673', 'Petalux Wall Paint 6312 Light 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12340, '2103676', 'Petalux Wall Paint 6316 Spring 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12341, '2103678', 'Petalux Wall Paint 6318 Junipe 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12342, '2103679', 'Petalux Wall Paint 6319 Golden 5KG', '142504.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12343, '2103680', 'Petalux Wall Paint 632 Borobud 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12344, '2103681', 'Petalux Wall Paint 6320 Fresh 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12345, '2103683', 'Petalux Wall Paint 6322 Earl g 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12346, '2103685', 'Petalux Wall Paint 6324 Printe 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12347, '2103686', 'Petalux Wall Paint 6325 Elixir 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12348, '2103687', 'Petalux Wall Paint 6326 Pinky 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12349, '2103688', 'Petalux Wall Paint 6328 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12350, '2103689', 'Petalux Wall Paint 6329 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12351, '2103690', 'Petalux Wall Paint 6330 5KG', '83636.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12352, '2103691', 'Petalux Wall Paint 6331 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12353, '2103693', 'Petalux Wall Paint 6333 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12354, '2103696', 'Petalux Wall Paint 638 Orchid 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12355, '2103698', 'Petalux Wall Paint 641 Apple W 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12356, '2103700', 'Petalux Wall Paint 643 Irish W 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12357, '2103701', 'Petalux Wall Paint 644 Rose Wh 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12358, '2103704', 'Petalux Wall Paint 661 Romanti 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12359, '2103708', 'Petalux Wall Paint 674 Valenti 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12360, '2103712', 'Petalux Wall Paint 679 Fresh C 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12361, '2103713', 'Petalux Wall Paint 681 Pink Wh 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12362, '2103714', 'Petalux Wall Paint 682 Almond 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12363, '2103719', 'Petalux Wall Paint 688 Mellow 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12364, '2103723', 'Petalux Wall Paint 693 Blue Sk 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12365, '2103730', 'Petalux Wall Paint Putih Hemat 01 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12366, '2103731', 'Petalux Wall Paint Putih hemat 02 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12367, '2103734', 'Petalux Wall Paint Putih hemat 05 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12368, '2103735', 'Petalux Wall Paint Putih hemat 06 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12369, '2103737', 'Petalux Wall Paint Putih Wangi 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12370, '2103741', 'Petalux Wall Paint Super White 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12371, '2103782', 'Shintex Cat Bak 001 Aquarin 1 KG', '64000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12372, '2103783', 'Shintex Cat Bak 009 Sky Blu 1 KG', '64000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12373, '2103786', 'Shintex Cat Bak White 1 KG', '64000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12374, '2103789', 'Shintex Cat Genteng 301 Black 1KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12375, '2103790', 'Shintex Cat Genteng 303 Gold Ac 1KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12376, '2103791', 'Shintex Cat Genteng 304 Orange 1KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12377, '2103792', 'Shintex Cat Genteng 305 Fire Br 1KG', '57000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12378, '2103793', 'Shintex Cat Genteng 308 Tile Re 1KG', '57000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12379, '2103794', 'Shintex Cat Genteng 309 Leather 1KG', '57000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12380, '2103796', 'Shintex Cat Genteng 312 White 1KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12381, '2103797', 'Shintex Cat Genteng 315 Side Gr 1KG', '61000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12382, '2103798', 'Shintex Cat Genteng 316 Minimal Grey 1KG', '57000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12383, '2103799', 'Shintex Cat Genteng 301 Black 20 KG', '865000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12384, '2103802', 'Shintex Cat Genteng 305 Fire Br 20 KG', '957000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12385, '2103803', 'Shintex Cat Genteng 308 Tile Re 20 KG', '957000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12386, '2103804', 'Shintex Cat Genteng 309 Leather 20 KG', '957000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12387, '2103805', 'Shintex Cat Genteng 310 Willow 20 KG', '957000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12388, '2103806', 'Shintex Cat Genteng 312 White 20 KG', '957000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12389, '2103807', 'Shintex Cat Genteng 315 Side Gr 20 KG', '957000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12390, '2103808', 'Shintex Cat Genteng 316 Minimal Grey 20 KG', '957000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12391, '2103810', 'Shintex Cat Genteng 301 Black 4KG', '204000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12392, '2103811', 'Shintex Cat Genteng 303 Gold Ac 4KG', '204000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12393, '2103812', 'Shintex Cat Genteng 304 Orange 4KG', '204000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12394, '2103813', 'Shintex Cat Genteng 305 Fire Br 4KG', '204000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12395, '2103814', 'Shintex Cat Genteng 308 Tile Re 4KG', '204000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12396, '2103815', 'Shintex Cat Genteng 309 Leather 4KG', '204000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12397, '2103816', 'Shintex Cat Genteng 310 Willow 4KG', '204000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12398, '2103817', 'Shintex Cat Genteng 312 White 4KG', '204000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12399, '2103818', 'Shintex Cat Genteng 315 Side Gr 4KG', '204000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12400, '2103819', 'Shintex Cat Genteng 316 Minimal Grey 4KG', '204000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12401, '2103825', 'Shintex Cat Genteng Sp 306 Tropic 1KG', '65000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12402, '2103826', 'Shintex Cat Genteng Sp 311 Special 1KG', '66000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12403, '2103827', 'Shintex Cat Genteng Sp 313 Special 1KG', '66000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12404, '2103828', 'Shintex Cat Genteng Sp 314 Red A 1KG', '65000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12405, '2103830', 'Shintex Cat Genteng Sp 306 Tropic 20 KG', '1150000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12406, '2103831', 'Shintex Cat Genteng Sp 311 Special 20 KG', '1100000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12407, '2103834', 'Shintex Cat Genteng Sp 302 Chartre 4 KG', '236000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12408, '2103835', 'Shintex Cat Genteng Sp 306 Tropic 4 KG', '236000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12409, '2103836', 'Shintex Cat Genteng Sp 311 Special 4 KG', '236000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12410, '2103837', 'Shintex Cat Genteng Sp 313 Special 4 KG', '236000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12411, '2103838', 'Shintex Cat Genteng Sp 314 Red A 4 KG', '236000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12412, '2103860', 'Shintex Synthetic Enamel White', '1760000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12413, '2103863', 'Shintex Wall Filler 1 KG', '26000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12414, '2103866', 'Shintex Wall Filler 25 KG', '298000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12415, '2103872', 'Shintex Wall Paint BS3040 Crea 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12416, '2103873', 'Shintex Wall Paint BS4053 Prim 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12417, '2103882', 'Shintex Wall Paint 9101 Orange 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12418, '2103883', 'Shintex Wall Paint 9102 Yellow 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12419, '2103888', 'Shintex Wall Paint 9107 Libert 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12420, '2103891', 'Shintex Wall paint 9110 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12421, '2103892', 'Shintex Wall Paint 9111 1KG', '35000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12422, '2103894', 'Shintex Wall Paint 9114 Rosy Brown 1KG', '35000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12423, '2103896', 'Shintex Wall Paint 914 Lake Bl 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12424, '2103898', 'Shintex Wall Paint 918 Ice Blu 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12425, '2103901', 'Shintex Wall Paint 927 Rose 1KG', '35000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12426, '2103906', 'Shintex Wall Paint 943 Sunshin 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12427, '2103907', 'Shintex Wall Paint 944 Ocean B 1KG', '35000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12428, '2103918', 'Shintex Wall Paint Black 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12429, '2103922', 'Shintex Wall Paint Super White 1KG', '35000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12430, '2103941', 'Shintex Wall Paint BS3040 Crea 25 KG', '510000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12431, '2103946', 'Shintex Wall Paint 902 Berlian 25 KG', '510000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12432, '2103954', 'Shintex Wall Paint 9106 Gallan 25 KG', '510000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12433, '2103960', 'Shintex Wall Paint 9112 25 KG', '510000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12434, '2103986', 'Shintex Wall Paint Putih Prima 25 KG', '510000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12435, '2103989', 'Shintex Wall Paint Super White 25 KG', '538000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12436, '2103992', 'Shintex Wall Paint BS3033 Brok 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12437, '2103998', 'Shintex Wall Paint 902 Berlian 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12438, '2104005', 'Shintex Wall Paint 9105 Samoa 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12439, '2104009', 'Shintex Wall Paint 9109 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12440, '2104029', 'Shintex Wall Paint 966 Apple W 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12441, '2104030', 'Shintex Wall Paint 974 Chiffon 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12442, '2104032', 'Shintex Wall Paint 988 Yellow 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12443, '2104035', 'Shintex Wall Paint 999 Adinda 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12444, '2104039', 'Shintex Wall Paint Putih Prima 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12445, '2104042', 'Shintex Wall Paint Super White 5KG', '118000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12446, '2104044', 'Shintex Wall Paint Warna Khusus A Biru 1KG', '35000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12447, '2104045', 'Shintex Wall Paint Warna Khusus A Hijau 1KG', '35000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12448, '2104046', 'Shintex Wall Paint Warna Khusus A Kuning Muda 1KG', '32000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12449, '2104047', 'Shintex Wall Paint Warna Khusus A Kuning 1KG', '35000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12450, '2104056', 'Shintex Wall Paint Warna Khusus A Kuning Muda 5KG', '118000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12451, '2104059', 'Shintex Wall Paint Warna Khusus B Merah 1KG', '42000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12452, '2104073', 'Tawon Kembang Meni Kayu & Besi 0.8 KG', '48000.00', 'KLG', 'DECORATIVE', 0.8, '2026-07-22 05:29:23'),
(12453, '2104075', 'Tawon Kembang Meni Kayu & Besi 4.5 KG', '220000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12454, '2104090', 'Wiratex Ceiling & Gypsum Paint Putih Prima 20 KG', '338000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12455, '2104093', 'Wiratex Ceiling & Gypsum Paint Putih Prima 5 KG', '91000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12456, '2104109', 'Wiratex Wall Paint 801 Spanish 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12457, '2104113', 'Wiratex Wall Paint 806 Cream 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12458, '2104115', 'Wiratex Wall Paint 809 Jonquil 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12459, '2104117', 'Wiratex Wall Paint 814 Adinda 25 KG', '390000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12460, '2104119', 'Wiratex Wall Paint 820 Apple W 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12461, '2104120', 'Wiratex Wall Paint 822 Palazo 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12462, '2104122', 'Wiratex Wall Paint 824 Durian 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12463, '2104127', 'Wiratex Wall Paint 830 Blue Be 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12464, '2104128', 'Wiratex Wall Paint 831 Fresh B 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12465, '2104130', 'Wiratex Wall Paint 833 Mellow 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12466, '2104131', 'Wiratex Wall Paint 834 Warm Gr 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12467, '2104136', 'Wiratex Wall Paint 845 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12468, '2104137', 'Wiratex Wall Paint 846 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12469, '2104138', 'Wiratex Wall Paint 847 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12470, '2104139', 'Wiratex Wall Paint 848 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12471, '2104140', 'Wiratex Wall Paint 849 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12472, '2104141', 'Wiratex Wall Paint 850 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12473, '2104143', 'Wiratex Wall Paint 852 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12474, '2104145', 'Wiratex Wall Paint Black 25 KG', '390000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12475, '2104146', 'Wiratex Wall Paint Putih Metro 25 KG', '390000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12476, '2104147', 'Wiratex Wall Paint Putih Salju 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12477, '2104148', 'Wiratex Wall Paint Super White 25 KG', '435000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12478, '2104153', 'Wiratex Wall Paint 801 Spanish 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12479, '2104154', 'Wiratex Wall Paint 802 Blue Ha 5KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12480, '2104155', 'Wiratex Wall Paint 803 Broken 5KG', '48648.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12481, '2104156', 'Wiratex Wall Paint 805 Surf Gr 5KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12482, '2104157', 'Wiratex Wall Paint 806 Cream 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12483, '2104158', 'Wiratex Wall Paint 807 Ice Ber 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12484, '2104160', 'Wiratex Wall Paint 809 Jonquil 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12485, '2104161', 'Wiratex Wall Paint 812 Ice Blu 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12486, '2104162', 'Wiratex Wall Paint 814 Adinda 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12487, '2104163', 'Wiratex Wall Paint 820 Apple W 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12488, '2104164', 'Wiratex Wall Paint 822 Palazo 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12489, '2104165', 'Wiratex Wall Paint 823 Poppy O 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12490, '2104166', 'Wiratex Wall Paint 824 Durian 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23');
INSERT INTO `dim_products` (`id`, `kode_produk`, `nama_produk`, `harga_jual`, `satuan_kecil`, `kategori`, `berat`, `created_at`) VALUES
(12491, '2104167', 'Wiratex Wall Paint 826 Fresh P 5KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12492, '2104168', 'Wiratex Wall Paint 827 Carnati 5KG', '31531.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12493, '2104169', 'Wiratex Wall Paint 828 Valenti 5KG', '83000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12494, '2104170', 'Wiratex Wall Paint 829 Deep Pi 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12495, '2104171', 'Wiratex Wall Paint 830 Blue Be 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12496, '2104172', 'Wiratex Wall Paint 831 Fresh B 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12497, '2104173', 'Wiratex Wall Paint 832 Pacific 5KG', '50450.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12498, '2104174', 'Wiratex Wall Paint 833 Mellow 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12499, '2104175', 'Wiratex Wall Paint 834 Warm Gr 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12500, '2104176', 'Wiratex Wall Paint 841 Barley 5KG', '40540.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12501, '2104177', 'Wiratex Wall Paint 842 Sandy B 5KG', '50450.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12502, '2104178', 'Wiratex Wall Paint 843 Coral R 5KG', '50450.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12503, '2104179', 'Wiratex Wall Paint 844 Terraco 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12504, '2104180', 'Wiratex Wall Paint 845 River S 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12505, '2104181', 'Wiratex Wall Paint 846 Plum Fr 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12506, '2104182', 'Wiratex Wall Paint 847 Spring 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12507, '2104183', 'Wiratex Wall paint 848 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12508, '2104184', 'Wiratex Wall Paint 849 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12509, '2104185', 'Wiratex Wall Paint 850 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12510, '2104186', 'Wiratex Wall paint 851 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12511, '2104187', 'Wiratex Wall Paint 852 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12512, '2104188', 'Wiratex Wall Paint 853 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12513, '2104189', 'Wiratex Wall Paint Black 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12514, '2104190', 'Wiratex Wall Paint Putih Metro 5KG', '83000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12515, '2104191', 'Wiratex Wall Paint Putih Salju 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12516, '2104192', 'Wiratex Wall Paint Super White 5KG', '93000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12517, '2104367', 'ADLER PU PRIMER SURF 8022 GREY HARDENER 200CC', '35500.00', 'TUBE', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12518, '2104460', 'ATTABOY WEATHERGUARD NCS S1005-B20G 20LT', '2535000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12519, '2104492', 'Crystal Coat Clear Gloss Hardener 200cc', '394000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12520, '2104494', 'Daltone Clear CoaT MS 4100 1LTS', '128000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12521, '2104537', 'Meiji Zinc Chromate Dark Grey 1 Kg', '51000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12522, '2104539', 'Meiji Zinc Chromate Light Grey 1 Kg', '57500.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12523, '2104540', 'Meiji Zinc Chromate Primer Broken White 5kg', '258000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12524, '2104828', 'Petalux pos wall paint JYKT 8D3 Cream 25kg', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12525, '2104836', 'PETALUX WALL PAINT CM 602 MATAHARI 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12526, '2104840', 'PETALUX WALL PAINT NCS S1002-Y 25KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12527, '2104863', 'Shintex Wall Filler 4 KG', '62000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12528, '2104937', 'Bonus Kuas', '0.00', 'PCS', 'BONUS', 0, '2026-07-22 05:29:23'),
(12529, '2104949', 'Bonus Roller', '0.00', 'PCS', 'BONUS', 0, '2026-07-22 05:29:23'),
(12530, '2104955', 'Bonus Sarung', '0.00', 'PCS', 'BONUS', 0, '2026-07-22 05:29:23'),
(12531, '2104960', 'Protar Raston CK 1 KG', '46000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12532, '2104964', 'Daltone Clear Coat 1010 0.5LTS', '79500.00', 'KLG', 'AUTOMOTIVE', 5, '2026-07-22 05:29:23'),
(12533, '2105067', 'DALTONE PU SURFACER FD 1 LTS', '105000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12534, '2105076', 'Daltone Epoxy Filler White 1Lts', '70000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12535, '2105077', 'Daltone Epoxy Filler Grey 1Lts', '90000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12536, '2105078', 'Daltone Epoxy Filler Grey 0.25 Lts', '32000.00', 'KLG', 'AUTOMOTIVE', 0.25, '2026-07-22 05:29:23'),
(12537, '2105139', 'DALTONE CLEAR COAT HS8021 1.5LTS', '220000.00', 'KLG', 'AUTOMOTIVE', 1.5, '2026-07-22 05:29:23'),
(12538, '2105145', 'SHINTEX WALL PAINT 999 ADINDA 200KG', '3172500.00', 'DRUM', 'DECORATIVE', 200, '2026-07-22 05:29:23'),
(12539, '2105189', 'Attaboy Dampseal 5KG', '260000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12540, '2105202', 'Petalux Wall Paint NCS S1502-Y', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12541, '2105214', 'Meiji Zinc Chromate Primer Dark Grey 20KG', '962000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12542, '2105295', 'ALFA ZINC CHROMATE PRIMER BLACK 20KG', '820000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12543, '2105310', 'ATTABOY WEATHERGUARD NCS S 4500N 20LT', '2535000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12544, '2105346', 'Adler PU Topcoat HS9021 1.5 Liter Set', '300000.00', 'KLG', 'AUTOMOTIVE', 1.5, '2026-07-22 05:29:23'),
(12545, '2200013', 'Protar Base A 4Kg', '253000.00', 'GLN', 'DECORATIVE', 4, '2026-07-22 05:29:23'),
(12546, '2200039', 'ATTABOY WEATHERGUARD NCS S0507-B20G 20LT', '2535000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12547, '2200041', 'ATTABOY WEATHERGUARD NCS S1080-R 20LT', '3398000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12548, '2200046', 'Petalac 2K PU Clear Gloss Base 0.8LT', '133200.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12549, '2200047', 'Petalac 2K PU Clear Satin Base 0.8Lt', '125000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12550, '2200048', 'Petalac 2K PU Clear Semi Gloss Base 0.8Lt', '125000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12551, '2200049', 'Petalac 2K PU Clear Matt M20 Base 0.8Lt', '125000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12552, '2200050', 'Petalac 2K PU Clear Matt MV3 Base 0,8Lt', '138750.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12553, '2200052', 'Petalac 2K PU Clear Gloss Base 20lt', '2703000.00', 'PAIL', 'INDUSTRIAL', 20, '2026-07-22 05:29:23'),
(12554, '2200053', 'Petalac 2K PU Clear Satin Base 20Lt', '2509500.00', 'PAIL', 'INDUSTRIAL', 20, '2026-07-22 05:29:23'),
(12555, '2200057', 'Petalac 2K PU Colour Mutiara Base 0.8Lt', '163000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12556, '2200058', 'Petalac 2K PU Colour Sparkling Base 0.8Lt', '180000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12557, '2200068', 'Petalac 2K PU Colour P.101 Special White Base 0.8L', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12558, '2200070', 'Petalac 2K PU Colour P.101 Special White Base 20Lt', '3147000.00', 'PAIL', 'INDUSTRIAL', 20, '2026-07-22 05:29:23'),
(12559, '2200071', 'Petalac 2K PU Colour P.002 Black Base 0.8Lt', '175000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12560, '2200074', 'Petalac 2K PU Colour Special White Matt Base 0.8Lt', '148000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12561, '2200077', 'Petalac 2K PU Metalix MX206 Base 0.8Lt', '231000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12562, '2200079', 'Petalac 2K PU Colour P.008 Rosa Pink Base 0.8Lt', '138000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12563, '2200086', 'Petalac 2K Surfacer FD 21 Base 1LT', '89000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12564, '2200087', 'Petalac Hardener Surfacer FD 0.5LT', '66000.00', 'KLG', 'DECORATIVE', 0.5, '2026-07-22 05:29:23'),
(12565, '2200096', 'Synteix 115 Yellow Canary 20KG', '1590000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12566, '2200102', 'Daltone Clear Coat MS 4100 0.25Lts', '42000.00', 'KLG', 'AUTOMOTIVE', 0.25, '2026-07-22 05:29:23'),
(12567, '2200106', 'Petalac 2K PU Metalix Gold MX02 Base 0.8Lt', '169000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12568, '2200112', 'Petalac Hardener Special M20 0.2Lt', '55000.00', 'KLG', 'INDUSTRIAL', 0.2, '2026-07-22 05:29:23'),
(12569, '2200117', 'Shintex wall paint 9211 25KG', '510000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12570, '2200119', 'Shintex Wall Paint 9212 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12571, '2200122', 'Shintex Wall paint 9213 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12572, '2200123', 'Shintex wall Paint 9213 25KG', '510000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12573, '2200130', 'Petalac 2K PU CO P.110 Broken White Base 0.8Lt', '158000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12574, '2200131', 'Petalac 2K PU CO Base P.013 Bright Red 0.8Lt', '148000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12575, '2200139', 'Kingkong Wall Paint Super White 4.5Kg', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12576, '2200143', 'Kingkong Wall Paint 121 Shapire 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12577, '2200152', 'Petalac 2K PU Colour Base P.147 Smoke Gr 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12578, '2200156', 'Kingkong Wall Paint 109 Apple W 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12579, '2200161', 'Petalac 2K PU Colour P.133 Deep Blue Base 0.8Lt', '150000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12580, '2200162', 'Kingkong Wall paint Super White 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12581, '2200166', 'Kingkong Wall paint Black 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12582, '2200167', 'Kingkong Wall Paint Putih Metro 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12583, '2200173', 'Petalac 2K PU Metalix MX01 Base 0.8Lt', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12584, '2200177', 'Petalac 2K PU Metalix Base HD Medium Grey 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12585, '2200178', 'Petalac 2K PU Colour Special White Satin Base 0.8L', '148000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12586, '2200183', 'Kingkong Wall Paint 105 Chiffon 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12587, '2200187', 'Kingkong Wall Paint Special 524 Purple 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12588, '2200188', 'Kingkong Wall Paint Special 548 Aquarin 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12589, '2200189', 'Kingkong Wall Paint Special 532 Mountai 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12590, '2200190', 'Kingkong Wall Paint Special 537 Primros 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12591, '2200191', 'Kingkong Wall Paint Special 542 Orange 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12592, '2200195', 'Kingkong Wall Paint Special 526 Fresh G 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12593, '2200196', 'Kingkong Wall Paint Special 542 Orange 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12594, '2200197', 'Petalac 2K PU Hardener Special 1LITER', '278000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12595, '2200198', 'Kingkong Wall Paint Special 506 Sunny Y 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12596, '2200199', 'Kingkong Wall Paint Special 507 Poppy O 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12597, '2200201', 'Shintex Wall paint 9101 Orange 200KG', '3172500.00', 'DRUM', 'DECORATIVE', 200, '2026-07-22 05:29:23'),
(12598, '2200203', 'Kingkong Wall Paint Special 507 Poppy O 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12599, '2200204', 'Kingkong Wall Paint Special 548 Aquarin 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12600, '2200206', 'Kingkong Wall Piant Special 537 Primerose 18KG', '288000.00', 'PAIL', 'DECORATIVE', NULL, '2026-07-22 05:29:23'),
(12601, '2200207', 'Kingkong Wall Paint Special 521 Meadow 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12602, '2200208', 'Kingkong Wall Paint Special 521 Meadow 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12603, '2200213', 'Kingkong Wall Paint Special 551 Sky Blu 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12604, '2200214', 'Kingkong Wall Paint Special 519 Bahama 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12605, '2200215', 'Kingkong Wall Paint Special 519 Bahama 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12606, '2200216', 'Kingkong Wall Paint Special 524 Purple 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12607, '2200217', 'Kingkong Wall Paint Special 506 Sunny Y 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12608, '2200222', 'Kingkong Wall Paint Putih Metropolitan 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12609, '2200223', 'Kingkong Wall Paint 127 Sun Flo 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12610, '2200224', 'Kingkong Wall Paint Special 549 Rose Ga 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12611, '2200228', 'Petalac 2K PU CO P118 Dark O Base 0.8LT', '143000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12612, '2200230', 'Kingkong Wall Paint Special 532 Mountai 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12613, '2200246', 'Kingkong Wall Paint 116 Orchid 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12614, '2200248', 'Kingkong Wall Paint 131 Spring Green 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12615, '2200249', 'Kingkong Wall Paint 119 Canary 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12616, '2200250', 'Kingkong Wall Paint 124 Blue La 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12617, '2200251', 'Kingkong Wall Paint 121 Saphire 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12618, '2200252', 'Kingkong Wall Paint 128 Minimal 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12619, '2200253', 'Kingkong Wall Paint 120 Aqua Gr 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12620, '2200254', 'Kingkong Wall Paint 132 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12621, '2200273', 'Petalac 2K PU CO Base Carolina Grey 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12622, '2200277', 'Crystal Coat Vergoldet For Metal 1Lts', '716000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12623, '2200286', 'Kingkong Wall Paint 104 Cream 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12624, '2200287', 'Kingkong Wall Paint 131 Spring 18 Kg', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12625, '2200291', 'Petalac 2K PU Metalix MX 149 New Champ Base 0.8LT', '170000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12626, '2200293', 'Kingkong Wall Paint 117 Rose 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12627, '2200297', 'Kingkong Wall Paint 109 Aple W 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12628, '2200302', 'Petalac 2K PU Metalix MX 138 Stey Gold Base 0.8LT', '231000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12629, '2200303', 'Petalac Ext 4:1 Special White Matt Base 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12630, '2200304', 'Petalac Ext 4:1 Special White Base 0.8LT', '151500.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12631, '2200310', 'Kingkong Wall Paint Black 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12632, '2200313', 'Kingkong Wall Paint 113 Tile Re 4.5kg', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12633, '2200319', 'Kingkong Wall Paint 127 Sun Flower 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12634, '2200320', 'Kingkong Wall Paint 117 Rose 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12635, '2200321', 'Petalac 2K PU Colour Base P.114 Eart Br 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12636, '2200331', 'Kingkong Wall Paint 116 Orchid 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12637, '2200339', 'Kingkong Wall Paint 119 Canary 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12638, '2200340', 'Kingkong Wall Paint 128 Minimal 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12639, '2200341', 'Kingkong WAll Paint 105 Chiffon 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12640, '2200342', 'Kingkong Wall Paint 124 Blue La 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12641, '2200344', 'Kingkong Wall Paint 118 Poplar4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12642, '2200345', 'Kingkong Wall Paint 130 Plum Fr 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12643, '2200350', 'Daltone Clear Coat Doff 1Lts', '165000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12644, '2200357', 'Kingkong Wall Paint 113 Tile Re 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12645, '2200364', 'Petalac 2K PU CO Base P.154 Lemon Ye 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12646, '2200369', 'Kingkong Wall Paint 132 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12647, '2200370', 'Kingkong Wall Paint 110 Irish W 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12648, '2200373', 'Petalux Base C 25KG', '450000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12649, '2300011', 'Petalac 2K PU Metalix MX127 Tam Silver Base 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12650, '2300023', 'Kingkong Wall Paint 126 Bali Gr18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12651, '2300024', 'Kingkong Wall Paint 126 Bali Gr 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12652, '2300025', 'Kingkong Wall Paint 123 Summer 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12653, '2300026', 'Kingkong Wall Paint 129 River Stone 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12654, '2300041', 'Kingkong Wall Paint 120 Aqua Green 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12655, '2300042', 'Petalac Ext 4:1 Clear Matt Base 0.8LT', '132000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12656, '2300043', 'Petalac Ext 4:1 Clear Gloss Base 0.8LT', '119000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12657, '2300045', 'Petalac Ext 4:1 CO Base Akara Abu Satin 0.8LT', '162000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12658, '2300050', 'Kingkong Wall Paint 104 Cream 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12659, '2300053', 'Petalac 2K PU CO Base P.113 Lava Brown 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12660, '2300063', 'Kingkong Wall Paint 110 Irish W 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12661, '2300066', 'Petalac 2K PU Metalix MX141 Redish Gold Base 0.8LT', '231000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12662, '2300067', 'Kingkong Wall Paint 130 Plum fr 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12663, '2300068', 'Kingkong Wall Paint 118 Poplar 18KG', '288000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12664, '2300084', 'Petalac 2K PU Metalix MX110 Granite Base 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12665, '2300086', 'Petalac 2K PU CO Base Black Satin 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12666, '2300087', 'Kingkong Wall Paint 123 Summer 4.5KG', '84000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12667, '2300088', 'Petalac 2K PU Colour Base Black Matt 0.8LT', '148000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12668, '2300092', 'Petalac Hardener Special Black Matt 200CC', '55000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12669, '2300100', 'Daltone PU Base Coat D010 White 1Lt', '165000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12670, '2300105', 'Kingkong Wall Paint 115 Salem 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12671, '2300111', 'Kingkong Wall Paint 129 River S 18KG', '323000.00', 'PAIL', 'DECORATIVE', 18, '2026-07-22 05:29:23'),
(12672, '2300113', 'Petalac 2K PU CO Base PE 925 Brown KJ Matt 0.8LT', '166000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12673, '2300116', 'Petalac 2K PU Metalix MX142 Royal Gold Base 0.8LT', '231000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12674, '2300117', 'Kingkong Wall Paint 107 Broken 4.5KG', '76000.00', 'GLN', 'DECORATIVE', 4.5, '2026-07-22 05:29:23'),
(12675, '2300126', 'Petalac 2K PU Metalix MX210 Platin Silver Base 0.8', '172000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12676, '2300135', 'Petalux Acrylic Enamel Sanbe Grey 7203 20KG', '2550000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12677, '2300158', 'Petalac 2K PU CO Base Crystal White 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12678, '2300161', 'Petalac 2K PU CO Base P.143 Duck Grey 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12679, '2300168', 'Petalac 2K PU CO Base P.114 Earth Brown 0.8LT', '148000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12680, '2300170', 'Petalac 2K PU CO Base P.010 Blue 0.8LT', '133000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12681, '2300180', 'Daltone PU Base Coat D020 Deep Black 1Lt', '175000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12682, '2300181', 'Daltone PU Base Coat D021 Tinting Black 1Lt', '165000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12683, '2300248', 'Daltone BaseCoat Metalix D113 Extra Coarse Sil 1LT', '155000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12684, '2300258', 'Attaboy Masonry Sealer White 20LT', '1200000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12685, '2300261', 'Petalac 2K PU CO Base P.117 Warm Red 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12686, '2300263', 'Petalac 2K PU CO Base Scroll Beige 0.8LT', '155000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12687, '2300265', 'Petalac 2K PU CO Base City Sensation 0.8LT', '135000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12688, '2300304', 'Petalac Ext 4:1 CO Base P.143 Duck Grey 0.8LT', '155500.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12689, '2300314', 'Shintex Base A 5KG', '120000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12690, '2300315', 'Shintex Base A 25KG', '520000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12691, '2300316', 'Shintex Base B 5KG', '110000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12692, '2300317', 'Shintex Base B 25KG', '485000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12693, '2300318', 'Shintex Base C 5KG', '100000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12694, '2300319', 'Shintex Base C 25KG', '433000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12695, '2300333', 'Attaboy Colorant Ext.Red Shade Yellow AR 1Liter', '666000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12696, '2300334', 'Attaboy Colorant Bright Red HL 1Liter', '860000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12697, '2300363', 'Petalac 2K PU CO Base Studio 8 Cream 0.8LT', '152000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12698, '2300368', 'Protar Cat Proteksi Tahan Air DX NBC White 20KG', '1188000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12699, '2400107', 'Crystal Coat For Metal Bronze 2 1LT', '816000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12700, '2400109', 'Meiji Zinc Chromate Primer Blue 20KG', '962000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12701, '2400115', 'Meiji Zinc Chromate Primer Blue 1KG', '51000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12702, '2400116', 'Meiji Zinc Chromate Primer Blue 5KG', '258000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12703, '2400123', 'Adler PU Base Coat CO Base APV Blind Van White 1LT', '190325.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12704, '2400131', 'COFFEE GAJAH', '0.00', 'BKS', 'BONUS', 0, '2026-07-22 05:29:23'),
(12705, '2400147', 'Petalac Ext 4:1 CO Base LDC 0552 Matt 0.8LT', '147000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12706, '2400148', 'Petalac 2K PU CO Base LDC 0885 Matt 0.8LT', '134000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12707, '2400154', 'Attaboy Supercryl NCS S1502-B 2.5LT', '239000.00', 'GLN', 'DECORATIVE', 2.5, '2026-07-22 05:29:23'),
(12708, '2400159', 'Crystal Coat Thinner For Metal 1LITER', '68500.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12709, '2400160', 'Shintex Cat Bak Hitam 1KG', '60000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12710, '2400164', 'Shintex Wall Paint 92402 AB Light Grey 25KG', '410000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12711, '2400165', 'Shintex Wall Paint 92403 AB White 25KG', '410000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12712, '2400167', 'Petalac 2K PU CO Base P.139 Forest Green 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12713, '2400174', 'Petalac 2K PU CO Base PE.904 Soft Cream Matt 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12714, '2400180', 'Petalac 2K PU CO Base Abu Matt 0.8LT', '175000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12715, '2400181', 'Shintex Wall Paint 92404 PJK Dark Grey 25KG', '410000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12716, '2400214', 'Petalac 2K PU CO Base MX Gold ST8 0.8LT', '168000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12717, '2400217', 'Petalac 2K PU Metalix Gold Matt Base 0.8LT', '145000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12718, '2400225', 'Petalac 2K PU CO Base OFF White II 20LT', '3432000.00', 'PAIL', 'INDUSTRIAL', 20, '2026-07-22 05:29:23'),
(12719, '2400260', 'Petalac 2K PU CO Base P.148 Winter Sky Satin 0.8LT', '150000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12720, '2400266', 'Daltone Stoving Enamel 200-30 Black Semi Glos 20LT', '2100000.00', 'PAIL', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12721, '2400314', 'Crystal Coat For Metal Rose Gold 2 1LT', '816000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12722, '2500003', 'Petalac 2K PU CO Base P.004 Dark Yellow Matt 0.8LT', '150000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12723, '2500013', 'Petalac 2K PU CO Base Abu Tua Matt 0.8LT', '155000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12724, '2500020', 'Petalac 2K PU CO Base Havana Brown MF Matt 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12725, '2500052', 'Wiratex Wall Paint Black 200KG', '2750000.00', 'DRUM', 'DECORATIVE', 200, '2026-07-22 05:29:23'),
(12726, '2500059', 'Petalac 2K PU CO Base Buce Brown Matt 0.8LT', '168000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12727, '2500074', 'Daltone PU Base Coat D910 Pearl White 1LT', '200000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12728, '2500078', 'Petalac Ext 4:1 CO Base MX Iron AJ Matt 0.8LT', '152000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12729, '2500079', 'Daltone PU Base Coat Olive Green 20LT', '4200000.00', 'PAIL', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12730, '2500104', 'Attaboy Epoxy Floor Top Coat SL Light Blue 20KGS', '2700000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12731, '2500107', 'Petalac 2K PU Colour Base P.001 White 0.8LT', '126000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12732, '2500110', 'Petalac Dark Grey Sadewa Metalix Base 4LT', '737595.00', 'GLN', 'INDUSTRIAL', 4, '2026-07-22 05:29:23'),
(12733, '2500115', 'Crystal Coat For Metal Bronze 1 1LTS', '816000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12734, '2500120', 'Adler PU Base Coat CO Base Army Brown 1LT', '190325.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12735, '2500125', 'Adler PU Base Coat CO Base New Carry White II 1KGS', '190325.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12736, '2500130', 'Daltone Thinner Slow Dry 1LT', '50000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12737, '2500133', 'Petalac 2K PU CO Base White LKR 130m 0.8LT', '138000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12738, '2500134', 'Petalac 2K PU CO Base PJI Dark Grey 1 0.8LT', '145000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12739, '2500145', 'Daltone PU Base Coat CO Pentone 2965 C Metalix 1LT', '201000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12740, '2500148', 'Petalac Ext 4:1 CO Base Abu Satin 0.8LT', '162000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12741, '2500153', 'Adler PU Bse Coat CO Base Silver APV 1LT', '190325.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12742, '2500162', 'Crystal Coat For Metal Gloss Clear Gloss 1Lts', '716000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12743, '2500178', 'Petalac 2K PU CO Base Cream Muda Satin 0.8LT', '172000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12744, '2500198', 'Petalac 2K PU CO Base Simply White Satin 0.8LT', '137000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12745, '2500233', 'Petalux Wall paint Kemtone 4I-2 5KG', '161000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12746, '2500243', 'Petalac 2K PU CO Base Eco Grey Matt 0.8LT', '150000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12747, '2500255', 'Petalac 2K PU Insulator B 1LTS', '125000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12748, '2500270', 'Attaboy Epoxy Floor Primer SL MT380 20KG', '2390000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12749, '2500289', 'Petalac 2K PU CO Base Admiral Blue 0.8LT', '168000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12750, '2500290', 'Petalac 2K PU CO Base Sosro Orange 0.8LT', '145000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12751, '2500294', 'DALTONE PU SURFACER FD 0.25LTS', '34000.00', 'KLG', 'AUTOMOTIVE', 0.25, '2026-07-22 05:29:23'),
(12752, '2500297', 'Attaboy Natural Stone Protector Black Doff V2 1LT', '98000.00', 'KLG', 'DECORATIVE', 1, '2026-07-22 05:29:23'),
(12753, '2500300', 'Petalac 2K PU CO Base Sun Blue 20LT', '3150000.00', 'PAIL', 'INDUSTRIAL', 20, '2026-07-22 05:29:23'),
(12754, '2500304', 'Crystal Coat Candytone For Metal Golden Metal 1LTS', '716000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12755, '2500308', 'Petalac 2K PU Metalix CO Base Bronze TZ 0.8LT', '157000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12756, '2500326', 'Daltone Stoving Enamel New 200-30 Carbon Black 20L', '2300000.00', 'PAIL', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12757, '2500333', 'Petalac 2K PU CO Base Brown Muda matt 0.8LT', '135000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12758, '2500341', 'Petalac 2K PU CO Base P.148 Winter Sky Matt 0.8LT', '0.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12759, '2500343', 'Petalac 2K PU CO Base Topic White Matt 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12760, '2500344', 'Petalac 2K PU CO Base Dark Gold Maevy 0.8LT', '170000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12761, '2500345', 'Petalac 2K PU CO Base NBC White Matt 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12762, '2500348', 'Daltone Thinner Stoving Enamel New 20LT', '1470000.00', 'JRG', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12763, '2500357', 'Petalac 2K PU CO Base HPL Grey Satin 0.8LT', '152000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12764, '2500358', 'Meiji Zinc Chromate SAC KS Green 20KG', '1299810.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12765, '2500359', 'Shintex Syntetix Enamel Medium Grey CD 20LT', '1733820.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12766, '2500365', 'Crystal Coat Candytone CO Havana 4 1LTS', '720000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12767, '2500366', 'Crystal Coat Candytone CO Havana 2 1LTS', '825000.00', 'KLG', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12768, '2500367', 'Petalac 2K PU CO Base Silk Moire Matt 0.8LT', '152000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12769, '2500373', 'Daltone PU Base Coat Black Elizabeth 1Lt', '185000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12770, '2500374', 'Daltone PU Base Coat Brown Elizabeth 1Lt', '185000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12771, '2500375', 'Daltone PU Base Coat Maroon Elizabeth 1Lt', '220000.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12772, '2500376', 'Petalac 2K PU CO Base Natural White Satin 20Lt', '3333700.00', 'PAIL', 'INDUSTRIAL', 20, '2026-07-22 05:29:23'),
(12773, '2500377', 'Petalac 2K PU CO Base Coklat Muda Satin 0.8LT', '150000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12774, '2500379', 'Petalac 2K PU CO Base Marble Grey MD 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12775, '2530001', 'Petalac 2K PU Colour special white matt base 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12776, '2530003', 'Petalac 2K PU Colour P.002 Black base 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12777, '2530004', 'Petalac 2k PU Colour P.004 Dark Yellow 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12778, '2530005', 'Petalac 2K PU Colour P.005 Ocher 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12779, '2530006', 'Petalac 2K PU Colour P.006 Oxired 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12780, '2530007', 'Petalac 2K PU Colour P.008 rosa pink 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12781, '2530008', 'Petalac 2K PU Colour P.011 Green 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12782, '2530013', 'Petalac 2k PO Colour P.013 Bright red 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12783, '2530019', 'Petalac 2K PU Base Black Matt 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12784, '2530020', 'Matting Agent 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12785, '2530021', 'Petalac 2K PU Colour P.001 White Base 1 gr', '0.00', 'GR', 'INDUSTRIAL', 1, '2026-07-22 05:29:23'),
(12786, '2600001', 'Attaboy Epoxy Floor Primer MT380 20KG', '2390000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12787, '2600002', 'Attaboy Floor Epoxy Top Coat SL Silver Sentosa 20L', '2700000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12788, '2600003', 'Petalac 2K PU Metalix CO Base Black Metal 0.8LT', '188000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12789, '2600004', 'Petalac 2K PU CO Base Cream Matt Topic 0.8LT', '162000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12790, '2600005', 'Petalac 2K PU Metalic CO Champagne Base 0.8LT', '145000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12791, '2600006', 'Petalac 2K PU CO Base Winter Bird Matt 0.8LT', '145000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12792, '2600007', 'Petalac 2K PU CO Base Stome Grey Matt 0.8LT', '147000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12793, '2600008', 'Petalac 2K PU Metalix CO Base Rose Gold MX 0.8LT', '155000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12794, '2600009', 'Petalux Wall Paint DX Universal Grey 25KG', '765000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12795, '2600010', 'Petalac 2K PU CO Base Merah Maroon Satin', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12796, '2600011', 'Petalac 2K PU CO Base Cream Matt Ranggamalela 0.8L', '145000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12797, '2600012', 'Petalac 2K PU CO Base Cream Tua Satin 0.8LT', '172000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12798, '2600013', 'Petalac 2K PU CO Base Fango MD 010.8LT', '145000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12799, '2600014', 'Petalac 2k PU CO Base Snow Field 0.8LT', '156000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12800, '2600018', 'Petalac Ext 4:1 CO Base MX Iron AJ Matt+Doff 0.8LT', '152000.00', 'KLG', 'DECORATIVE', 0.8, '2026-07-22 05:29:23'),
(12801, '2600019', 'Attaboy Texroll Putih 5KG', '325000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12802, '2600020', 'Attaboy Elastroll Putih 5KG', '325000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12803, '2600021', 'Petalac 2K PU CO Base Classic Ivory TA 0.8LT', '154000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12804, '2600022', 'Petalac 2K PU CO Base Citroen Ice 0.8LT', '167000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12805, '2600023', 'Petalac 2K PU CO Base Pink Frost 0.8LT', '165000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12806, '2600024', 'Kingkong Wall Paint 12601 PJK Grey Marison 200KG', '2300000.00', 'DRUM', 'DECORATIVE', 200, '2026-07-22 05:29:23'),
(12807, '2600025', 'Petalac 2K PU CO Base Sky High Blue 0.8LT', '170000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12808, '2600026', 'Petalac 2K PU CO Base Elf Hatt 0.8LT', '164000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12809, '2600027', 'Petalac 2K PU CO Base Champagne KA Matt 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12810, '2600028', 'Petalac 2K PU CO Base WhitE Matt Andre 0.8LT', '150000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12811, '2600029', 'Petalux Wall Paint NCS S7020-Y40R 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12812, '2600030', 'Petalux Wall Paint NCS S1002-Y 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12813, '2600031', 'Petalac 2K PU CO Base White Lamitak Matt 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12814, '2600032', 'Petalac 2K PU CO Base Zir 119 Phtallo Green 0.8LT', '163000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12815, '2600035', 'Petalux Wall Paint NCS S8010-Y50R 5KG', '158000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12816, '2600036', 'Petalux Wall Paint NCS S7020-Y70R 5KG', '166000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12817, '2600037', 'Petalac 2K PU CO Base Abu Satin 0.8LT', '175000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12818, '2600039', 'Petalac 2K PU CO Base Broken White 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12819, '2600040', 'Petalac 2K PU CO Base Blue Lullaby 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12820, '2600041', 'Petalac 2K PU CO Base Brush Wood 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12821, '2600042', 'Petalac 2K PU CO Base Heirloom 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12822, '2600043', 'Petalac 2K PU CO Base Connesticut Blue 0.8LT', '150000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12823, '2600044', 'Petalac 2K PU CO Base Veil 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12824, '2600045', 'Petalac 2K PU CO Base White On White 0.8LT', '155000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12825, '2600046', 'Adler PU Base Coat CO Base White New Carry 2026 1L', '161363.00', 'KLG', 'AUTOMOTIVE', 1, '2026-07-22 05:29:23'),
(12826, '2600047', 'Petalac 2K PU CO Base Midnight Hour 0.8LT', '142000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12827, '2600048', 'Petalac 2K PU CO Base White CT-01 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12828, '2600049', 'Petalac 2K PU CO Base Moon Walk 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12829, '2600051', 'Attaboy Weatherguard NCS S1550-R80B 20LT', '2267000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12830, '2600052', 'Petalac 2K PU CO Base PE912 SG Nice Beige Matt 0.8', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12831, '2600053', 'Petalac Ext 4:1 CO Base PE910 Wall White Matt 0.8L', '176000.00', 'KLG', 'DECORATIVE', 0.8, '2026-07-22 05:29:23'),
(12832, '2600054', 'Crystal Coat Candytone Golden Orange Base 0.8LT', '500700.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12833, '2600055', 'Petalac 2K PU CO Base Olive Green Muda Matt 0.8LT', '138000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12834, '2600056', 'Petalac 2K PU CO Base Olive Green 10% Matt Base 0.', '138000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12835, '2600057', 'Petalac 2K PU CO Base Olive Green 20% Matt Base 0.', '138000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12836, '2600058', 'Daltone PU Base Coat CO Pentone 2965 C Metalix 20L', '4020000.00', 'PAIL', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12837, '2600059', 'Petalac 2K PU CO Base Red Purple Matt 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12838, '2600060', 'Petalac 2K PU CO Base Dark Brown Matt 0.8LT', '140000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12839, '2600061', 'Petalac 2K PU CO Base Pink Brown Matt 0.8LT', '145000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12840, '2600062', 'Petalac 2K PU Base Clear Matt MVP 0.8LT', '110000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12841, '2600063', 'Daltone PU Base Coat CO Pasir Palm 20LT', '3910000.00', 'PAIL', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12842, '2600064', 'Petalac 2K PU CO Base Abu Semen Matt 0.8LT', '145000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12843, '2600065', 'Petalux Wall Paint NCS S2002-Y 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12844, '2600066', 'Petalac 2K PU CO Base Natural White Satin 0.8LT', '148000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12845, '2600067', 'Petalux Wall Paint NCS S2502-R 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12846, '2600068', 'Petalux Wall Paint NCS S5502-R 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12847, '2600069', 'Petalux Wall Paint NCS S3502-R 5KG', '175000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12848, '2600070', 'Petalac 2K PU CO Base Black Coko Satin 0.8LT', '155000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12849, '2600071', 'Petalux Wall Paint NCS S5502-R 25KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12850, '2600072', 'Petalac 2K PU CO Base Spice Gold 0.8LT', '150000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12851, '2600073', 'Alfa Zinc Chromate Primer Black Gloss 20KG', '858000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12852, '2600074', 'Petalac 2K PU CO Base P.013 Bright Red Matt 0.8LT', '150000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12853, '2600075', 'Petalac 2K PU CO Base Desert Castle 0.8LT', '150000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12854, '2600076', 'Petalac 2K PU CO Base Mild Wind 0.8LT', '155000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12855, '2600077', 'Petalac 2K PU CO Base Taupe Pink 0.8LT', '155000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12856, '2600078', 'Petalac 2K PU CO Base Pink Keramik 0.8LT', '155000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12857, '2600079', 'Petalac 2K PU CO Base Grey FL-03MX Matt 0.8LT', '162000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12858, '2600080', 'Petalac 2K PU CO Base Silver Backle Matt 0.8LT', '155000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12859, '2600082', 'Petalac 2K PU CO Base Coklat Tua Satin 0.8LT', '166000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12860, '2600083', 'Petalac 2K PU Metalix MX Grey Luksligue Base 0.8LT', '170000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12861, '2600085', 'SHINTEX SYNTETIX ENAMEL 102 LIGHT GREY 20LT', '1450000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12862, '2600088', 'Attaboy Weatherguard CM11268 IW Orange PHB 20LT', '4083000.00', 'PAIL', 'DECORATIVE', 20, '2026-07-22 05:29:23'),
(12863, '2600089', 'Petalac 2K PU CO Base DX Stone Harbor Matt 0.8L', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12864, '2600092', 'Petalux Wall Paint 62611 JN Green Smoke 25KG', '870000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12865, '2600093', 'Petalux Wall Paint CM 62610 JN White Sand 25KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12866, '2600095', 'Petalac 2K PU CO Base P.120 Soft Pink 0.8LT', '159000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12867, '2600096', 'Attaboy Textroll 162603 JN Timeless 25KG', '1500000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12868, '2600097', 'Petalux Wall Paint CM 62609 JN Timeless 25KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12869, '2600098', 'Attaboy Textroll JN Front III 25KG', '1500000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12870, '2600099', 'Attaboy Textroll White Sands 25KG', '1500000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12871, '2600100', 'Petalux Wall Paint Ext 222604 JN Front III 25KG', '1050000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12872, '2600102', 'Petalux Wall Paint Ext 222601 JN Green Smoke 25KG', '1050000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12873, '2600103', 'Petalux Wall Paint 62613 MX Super White 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12874, '2600104', 'Petalux Wall Paint 62614 MX Chrysant White 5KG', '168000.00', 'GLN', 'DECORATIVE', 5, '2026-07-22 05:29:23'),
(12875, '2600115', 'Petalux Wall Paint NCS S1000N 25KG', '800000.00', 'PAIL', 'DECORATIVE', 25, '2026-07-22 05:29:23'),
(12876, '2600117', 'Adler PU CO Base 819 Tangerin 20LT', '4037000.00', 'PAIL', 'AUTOMOTIVE', 20, '2026-07-22 05:29:23'),
(12877, '2600122', 'Pertalac 2K PU CO Base Cream Satin 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12878, '2600128', 'Petalac 2K PU CO Base PIK Mayang White Matt 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12879, '2600129', 'Petalac 2K PU CO Base Zamrud Cream Satin 0.8LT', '170000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12880, '26000131', 'Petalac 2K PU CO Base China White 0.8LT', '160000.00', 'KLG', 'INDUSTRIAL', 0.8, '2026-07-22 05:29:23'),
(12881, '2103216', 'PROTEX PROXY COALTAR PRO 525 -310 BLACK 20 LT', '0.00', NULL, NULL, NULL, '2026-07-22 05:32:59');

-- --------------------------------------------------------

--
-- Table structure for table `dim_salesman`
--

CREATE TABLE `dim_salesman` (
  `kode_salesman` varchar(20) NOT NULL,
  `nama_salesman` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dim_salesman`
--

INSERT INTO `dim_salesman` (`kode_salesman`, `nama_salesman`, `created_at`) VALUES
('013', 'BU RINI', '2026-07-08 02:30:50'),
('014', 'DEPO BANDUNG', '2026-07-08 02:30:50'),
('13', 'BU RINI', '2026-07-07 11:27:58'),
('14', 'DEPO BANDUNG', '2026-07-07 11:27:58'),
('C', 'YONATHAN', '2026-07-07 11:27:58'),
('D', 'WILLY', '2026-07-07 11:27:58'),
('G', 'JULIANTO', '2026-07-07 11:27:58'),
('H', 'YANSENG', '2026-07-07 11:27:58'),
('H1', 'MIMING', '2026-07-07 11:27:58'),
('I', 'B CIANG', '2026-07-07 11:27:58'),
('J', 'FRANSISKUS', '2026-07-07 11:27:58'),
('L', 'RUDI *', '2026-07-07 11:27:58'),
('M', 'UMUM', '2026-07-07 11:27:58'),
('R', 'SIMON QIRENE', '2026-07-07 11:27:58'),
('S-001', 'Joni Sales', '2026-07-08 02:12:55'),
('S-002', 'Budi Sales', '2026-07-08 02:13:24'),
('U', 'GANIS', '2026-07-07 11:27:58'),
('Y', 'KEN - Y', '2026-07-07 11:27:58');

-- --------------------------------------------------------

--
-- Table structure for table `dim_supplier`
--

CREATE TABLE `dim_supplier` (
  `kode_supplier` varchar(50) NOT NULL,
  `nama_supplier` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dim_supplier`
--

INSERT INTO `dim_supplier` (`kode_supplier`, `nama_supplier`, `created_at`) VALUES
('1', 'INDOWIRA, PT', '2026-07-07 11:27:58');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fact_distributor_targets`
--

INSERT INTO `fact_distributor_targets` (`id`, `upload_log_id`, `bulan_nama`, `tahun`, `distributor_id`, `target_value`, `acv_score`) VALUES
(1, NULL, 'JAN', 2026, 1, '30000000.00', '85.50'),
(2, NULL, 'FEB', 2026, 2, '15000000.00', '90.00'),
(3, NULL, 'MAR', 2026, 3, '10000000.00', '78.20'),
(4, NULL, 'APR', 2026, 4, '20000000.00', '95.00'),
(5, NULL, 'JUL', 2026, 6, '1000000.00', '885.00');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `name`, `nomor_hp`, `alamat`, `area`, `status`, `supervisor_name`, `tanggal_bergabung`, `kode_salesman`, `created_at`) VALUES
(1, 'admin', 'admin@iwpaint.com', 'password123', 'admin', 'Admin IW Paint', '081290922800', 'Office', 'All', 'Aktif', NULL, '2026-01-01', NULL, '2026-07-22 11:31:58'),
(2, 'julianto123', 'julianto@gmail.com', 'password123', 'sales', 'JULIANTO', '081290922801', 'Bandung', 'Bandung', 'Aktif', 'Andi', '2026-01-12', 'G', '2026-07-22 11:31:58'),
(3, 'fransiskus45', 'fransiskus@gmail.com', 'password123', 'sales', 'FRANSISKUS', '081290922802', 'Bandung', 'Bandung', 'Aktif', 'Andi', '2026-02-15', 'J', '2026-07-22 11:31:58'),
(4, 'rudi_sales', 'rudi@gmail.com', 'password123', 'sales', 'RUDI *', '081290922803', 'Bandung', 'Bandung', 'Aktif', 'Andi', '2026-03-10', 'L', '2026-07-22 11:31:58'),
(5, 'depobdg', 'depobdg@gmail.com', 'password123', 'sales', 'DEPO BANDUNG', '081290922804', 'Bandung', 'Bandung', 'Aktif', 'Andi', '2026-04-05', '14', '2026-07-22 11:31:58'),
(6, 'ganis', 'ganis@gmail.com', 'password123', 'sales', 'GANIS', '081290922805', 'Cirebon', 'Cirebon', 'Aktif', 'Hartono', '2026-05-20', 'U', '2026-07-22 11:31:58'),
(7, 'keny123', 'keny@gmail.com', 'password123', 'sales', 'KEN - Y', '081290922806', 'Cirebon', 'Cirebon', 'Aktif', 'Hartono', '2026-06-01', 'Y', '2026-07-22 11:31:58'),
(8, 'simon', 'simon@gmail.com', 'password123', 'sales', 'SIMON QIRENE', '081290922807', 'Cirebon', 'Cirebon', 'Aktif', 'Hartono', '2026-07-15', 'R', '2026-07-22 11:31:58'),
(9, 'yonathan', 'yonathan@gmail.com', 'password123', 'sales', 'YONATHAN', '081290922808', 'Tasikmalaya', 'Tasikmalaya', 'Aktif', 'Rahmat', '2026-08-10', 'C', '2026-07-22 11:31:58'),
(10, 'willy', 'willy@gmail.com', 'password123', 'sales', 'WILLY', '081290922810', 'Tasikmalaya', 'Tasikmalaya', 'Aktif', 'Rahmat', '2026-08-11', 'D', '2026-07-22 11:31:58'),
(11, 'burini', 'burini@gmail.com', 'password123', 'sales', 'BU RINI', '081290922811', 'Tasikmalaya', 'Tasikmalaya', 'Aktif', 'Rahmat', '2026-08-12', '13', '2026-07-22 11:31:58'),
(12, 'yanseng123', 'yanseng@gmail.com', 'password123', 'sales', 'YANSENG', '081290922812', 'Jakarta', 'Jakarta', 'Aktif', 'Eka', '2026-08-13', 'H', '2026-07-22 11:31:58'),
(13, 'miming', 'miming@gmail.com', 'password123', 'sales', 'MIMING', '081290922813', 'Jakarta', 'Jakarta', 'Aktif', 'Eka', '2026-08-14', 'H1', '2026-07-22 11:31:58'),
(14, 'umum', 'umum@gmail.com', 'password123', 'sales', 'UMUM', '081290922814', 'Jakarta', 'Jakarta', 'Aktif', 'Eka', '2026-08-15', 'M', '2026-07-22 11:31:58'),
(15, 'bciang', 'bciang@gmail.com', 'password123', 'sales', 'B CIANG', '081290922815', 'Jakarta', 'Jakarta', 'Aktif', 'Eka', '2026-08-16', 'I', '2026-07-22 11:31:58'),
(16, 'andi', 'andi@gmail.com', 'password123', 'supervisor', 'Andi', '081290923456', 'Bandung', 'Bandung', 'Aktif', NULL, '2026-07-16', NULL, '2026-07-22 11:31:58'),
(17, 'hartono', 'hartono@gmail.com', 'password123', 'supervisor', 'Hartono', '081290923456', 'Cirebon', 'Cirebon', 'Aktif', NULL, '2026-07-16', NULL, '2026-07-22 11:31:58'),
(18, 'deni', 'deni@gmail.com', 'password123', 'supervisor', 'Deni', '081290923456', 'Kuningan', 'Kuningan', 'Aktif', NULL, '2026-07-16', NULL, '2026-07-22 11:31:58'),
(19, 'rahmat', 'rahmat@gmail.com', 'password123', 'supervisor', 'Rahmat', '081290923456', 'Tasikmalaya', 'Tasikmalaya', 'Aktif', NULL, '2026-07-15', NULL, '2026-07-22 11:31:58'),
(20, 'dudu', 'dudu@gmail.com', 'password123', 'supervisor', 'Dudu', '081290923456', 'Bogor', 'Bogor', 'Aktif', NULL, '2026-07-15', NULL, '2026-07-22 11:31:58'),
(21, 'eka', 'eka@gmail.com', 'password123', 'supervisor', 'Eka', '081290923456', 'Jakarta', 'Jakarta', 'Aktif', NULL, '2026-07-14', NULL, '2026-07-22 11:31:58'),
(22, 'bambang', 'bambang@gmail.com', 'password123', 'distributor', 'Bambang', '089567182781', 'Bandung', 'Jawa Barat', 'Aktif', NULL, '2026-07-16', NULL, '2026-07-22 11:31:58'),
(23, 'hendra_dist', 'hendra@gmail.com', 'password123', 'distributor', 'Hendra', '089567182781', 'Semarang', 'Jawa Tengah', 'Aktif', NULL, '2026-07-16', NULL, '2026-07-22 11:31:58'),
(24, 'dedi', 'dedi@gmail.com', 'password123', 'distributor', 'Dedi', '089567182781', 'Surabaya', 'Jawa Timur', 'Aktif', NULL, '2026-07-16', NULL, '2026-07-22 11:31:58'),
(25, 'anton', 'anton@gmail.com', 'password123', 'distributor', 'Anton', '089567182781', 'Medan', 'Sumatera', 'Aktif', NULL, '2026-07-15', NULL, '2026-07-22 11:31:58'),
(26, 'gery', 'gery@gmail.com', 'password123', 'distributor', 'Gery', '089567182781', 'Jakarta', 'DKI Jakarta', 'Aktif', NULL, '2026-07-15', NULL, '2026-07-22 11:31:58');

-- --------------------------------------------------------

--
-- Views for reporting
--
DROP VIEW IF EXISTS `vw_distribusi_kategori`;
CREATE VIEW `vw_distribusi_kategori` AS
SELECT COALESCE(p.kategori, 'UNKNOWN') AS `kategori`,
       COALESCE(SUM(f.netto), 0) AS `total_netto`
FROM `fact_sales` f
LEFT JOIN `dim_products` p
  ON p.id = f.product_id OR p.kode_produk = f.kode_barang
GROUP BY COALESCE(p.kategori, 'UNKNOWN');

DROP VIEW IF EXISTS `vw_penjualan_per_sales`;
CREATE VIEW `vw_penjualan_per_sales` AS
SELECT COALESCE(f.nama_salesman, f.kode_salesman, 'UNKNOWN') AS `nama_salesman`,
       SUM(f.netto) AS `total_penjualan`
FROM `fact_sales` f
GROUP BY COALESCE(f.nama_salesman, f.kode_salesman, 'UNKNOWN');

DROP VIEW IF EXISTS `vw_top10_produk`;
CREATE VIEW `vw_top10_produk` AS
SELECT COALESCE(f.nama_barang, p.nama_produk) AS `nama_produk`,
       COALESCE(p.kode_produk, f.kode_barang) AS `kode_produk`,
       SUM(f.netto) AS `total_netto`,
       SUM(f.qty) AS `total_qty`
FROM `fact_sales` f
LEFT JOIN `dim_products` p
  ON p.id = f.product_id OR p.kode_produk = f.kode_barang
GROUP BY COALESCE(f.nama_barang, p.nama_produk),
         COALESCE(p.kode_produk, f.kode_barang)
ORDER BY total_netto DESC
LIMIT 10;

DROP VIEW IF EXISTS `vw_total_penjualan`;
CREATE VIEW `vw_total_penjualan` AS
SELECT COALESCE(SUM(netto), 0) AS `total_penjualan`
FROM `fact_sales`;

DROP VIEW IF EXISTS `vw_total_qty`;
CREATE VIEW `vw_total_qty` AS
SELECT COALESCE(SUM(qty), 0) AS `total_qty`
FROM `fact_sales`;

DROP VIEW IF EXISTS `vw_total_transaksi`;
CREATE VIEW `vw_total_transaksi` AS
SELECT COUNT(DISTINCT COALESCE(nofaktur, '')) AS `total_transaksi`
FROM `fact_sales`;

DROP VIEW IF EXISTS `vw_tren_penjualan`;
CREATE VIEW `vw_tren_penjualan` AS
SELECT MONTH(tanggal) AS `bulan_num`,
       DATE_FORMAT(tanggal, '%Y') AS `tahun`,
       COALESCE(SUM(netto), 0) AS `total_netto`
FROM `fact_sales`
WHERE tanggal IS NOT NULL
GROUP BY YEAR(tanggal), MONTH(tanggal);

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
