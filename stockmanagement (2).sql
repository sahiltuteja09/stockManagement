-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 10, 2019 at 01:35 PM
-- Server version: 5.7.23
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stockmanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
CREATE TABLE IF NOT EXISTS `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` varchar(100) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `allowed_users` int(11) NOT NULL,
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(100) NOT NULL,
  `address` varchar(250) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile` varchar(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`id`, `app_id`, `status`, `allowed_users`, `date_added`, `name`, `address`, `email`, `mobile`) VALUES
(1, 'stockmanagementcom', 1, 20, '2019-06-29 13:23:10', 'Test', 'test address', 'email', 'mobile');

-- --------------------------------------------------------

--
-- Table structure for table `marketplaces`
--

DROP TABLE IF EXISTS `marketplaces`;
CREATE TABLE IF NOT EXISTS `marketplaces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `sequence` tinyint(4) NOT NULL DEFAULT '0',
  `date_added` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `marketplaces`
--

INSERT INTO `marketplaces` (`id`, `name`, `status`, `sequence`, `date_added`) VALUES
(1, 'Amazon', 1, 0, '2019-06-29 03:00:00'),
(2, 'Flipkart', 1, 1, '2019-06-29 04:00:00'),
(3, 'Paytm', 1, 2, '2019-06-29 14:00:00'),
(4, 'Shop', 1, 3, '2019-06-29 07:00:00'),
(5, 'Other Uid', 1, 4, '2019-06-29 07:00:00'),
(6, 'App Unique', 1, 5, '2019-08-03 03:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `price` varchar(5) NOT NULL DEFAULT '0',
  `msg_from` int(11) NOT NULL,
  `msg_to` int(11) NOT NULL,
  `requested_quotes_id` int(11) NOT NULL,
  `mark_read` tinyint(4) NOT NULL DEFAULT '0',
  `conversation_id` varchar(20) NOT NULL,
  `date_added` datetime NOT NULL,
  `date_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `product_id`, `comment`, `price`, `msg_from`, `msg_to`, `requested_quotes_id`, `mark_read`, `conversation_id`, `date_added`, `date_updated`) VALUES
(1, 1, 'hello', '0', 2, 1, 1, 1, '1_2', '2019-07-11 15:36:59', '2019-07-11 00:00:00'),
(2, 1, 'hello  sir', '0', 2, 1, 1, 1, '1_2', '2019-07-11 15:36:59', '2019-07-11 00:00:00'),
(3, 1, 'hello  sir', '0', 1, 2, 1, 1, '1_2', '2019-07-12 18:00:00', '2019-07-11 00:00:00'),
(4, 2, 'hi', '0', 2, 1, 2, 1, '1_2', '2019-07-13 06:52:17', '2019-07-13 12:22:17'),
(5, 2, 'hello', '0', 3, 1, 3, 1, '1_3', '2019-07-13 06:54:56', '2019-07-13 12:24:56'),
(13, 2, 'hi', '0', 1, 3, 3, 1, '1_3', '2019-07-14 07:56:11', '2019-07-14 13:26:11'),
(14, 2, 'hi', '0', 1, 3, 3, 1, '1_3', '2019-07-14 07:58:31', '2019-07-14 13:28:31'),
(15, 2, 'hi', '0', 1, 3, 3, 1, '1_3', '2019-07-14 08:29:59', '2019-07-14 13:59:59'),
(16, 2, 'h', '0', 1, 3, 3, 1, '1_3', '2019-07-14 08:50:44', '2019-07-14 14:20:44'),
(17, 2, 'hi', '0', 1, 3, 3, 1, '1_3', '2019-07-14 08:51:38', '2019-07-14 14:21:38'),
(18, 2, 'hi', '0', 1, 3, 3, 1, '1_3', '2019-07-14 08:52:22', '2019-07-14 14:22:22'),
(19, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 08:54:44', '2019-07-14 14:24:44'),
(20, 2, 'hi', '0', 1, 3, 3, 1, '1_3', '2019-07-14 09:49:26', '2019-07-14 15:19:26'),
(21, 2, 'hello sir', '0', 1, 3, 3, 1, '1_3', '2019-07-14 09:53:50', '2019-07-14 15:23:50'),
(22, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 09:55:11', '2019-07-14 15:25:11'),
(23, 2, 'hi', '0', 1, 3, 3, 1, '1_3', '2019-07-14 09:55:21', '2019-07-14 15:25:21'),
(24, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 09:55:48', '2019-07-14 15:25:48'),
(25, 2, 'hello sur', '0', 1, 3, 3, 1, '1_3', '2019-07-14 09:57:19', '2019-07-14 15:27:19'),
(26, 2, 'ok', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:03:06', '2019-07-14 15:33:06'),
(27, 2, 'hello', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:05:27', '2019-07-14 15:35:27'),
(28, 2, 'ok', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:06:06', '2019-07-14 15:36:06'),
(29, 2, 'hello mohit', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:12:10', '2019-07-14 15:42:10'),
(30, 2, 'hwllo', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:13:42', '2019-07-14 15:43:42'),
(31, 2, 'yuoo', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:15:58', '2019-07-14 15:45:58'),
(32, 2, 'ok', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:16:38', '2019-07-14 15:46:38'),
(33, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:26:37', '2019-07-14 15:56:37'),
(34, 2, 'mohit', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:26:55', '2019-07-14 15:56:55'),
(35, 2, 'yes', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:27:46', '2019-07-14 15:57:46'),
(36, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:29:28', '2019-07-14 15:59:28'),
(37, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:30:56', '2019-07-14 16:00:56'),
(38, 2, 'ok', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:31:27', '2019-07-14 16:01:27'),
(39, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:32:32', '2019-07-14 16:02:32'),
(40, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:33:08', '2019-07-14 16:03:08'),
(41, 2, 'ok', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:33:20', '2019-07-14 16:03:20'),
(42, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:33:49', '2019-07-14 16:03:49'),
(43, 2, 'djd', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:34:20', '2019-07-14 16:04:20'),
(44, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:34:58', '2019-07-14 16:04:58'),
(45, 2, 'ok', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:35:07', '2019-07-14 16:05:07'),
(46, 2, 'ok boss', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:36:17', '2019-07-14 16:06:17'),
(47, 2, 'hi', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:38:22', '2019-07-14 16:08:22'),
(48, 2, 'hello', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:38:30', '2019-07-14 16:08:30'),
(49, 2, 'hwz u', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:38:40', '2019-07-14 16:08:40'),
(50, 2, 'hello mohit', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:44:19', '2019-07-14 16:14:19'),
(51, 2, 'hello sahil', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:44:27', '2019-07-14 16:14:27'),
(52, 2, 'How are you', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:44:37', '2019-07-14 16:14:37'),
(53, 2, 'i am good ?', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:44:50', '2019-07-14 16:14:50'),
(54, 2, 'what about you', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:44:55', '2019-07-14 16:14:55'),
(55, 2, 'all good', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:45:03', '2019-07-14 16:15:03'),
(56, 2, 'okies', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:45:07', '2019-07-14 16:15:07'),
(57, 2, 'can we talk', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:45:42', '2019-07-14 16:15:42'),
(58, 2, 'yes plesase', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:45:46', '2019-07-14 16:15:46'),
(59, 2, 'Hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:49:03', '2019-07-14 16:19:03'),
(60, 2, 'HI mohit', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:50:14', '2019-07-14 16:20:14'),
(61, 2, 'Hello', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:50:19', '2019-07-14 16:20:19'),
(62, 2, 'How are you', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:50:27', '2019-07-14 16:20:27'),
(63, 2, 'I am fine', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:50:33', '2019-07-14 16:20:33'),
(64, 2, 'yes please', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:51:17', '2019-07-14 16:21:17'),
(65, 2, 'nohting', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:51:23', '2019-07-14 16:21:23'),
(66, 2, 'okies', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:51:32', '2019-07-14 16:21:32'),
(67, 2, 'well', '0', 3, 1, 3, 1, '1_3', '2019-07-14 10:51:38', '2019-07-14 16:21:38'),
(68, 2, 'hello', '0', 1, 3, 3, 1, '1_3', '2019-07-14 10:52:44', '2019-07-14 16:22:44'),
(69, 3, 'ad', '0', 1, 1, 6, 1, '1_1', '2019-08-03 09:34:18', '2019-08-03 15:04:18'),
(70, 3, 'hi', '0', 1, 1, 6, 1, '1_1', '2019-08-10 07:41:12', '2019-08-10 13:11:12'),
(71, 3, 'hi', '0', 1, 1, 6, 1, '1_1', '2019-08-10 07:44:22', '2019-08-10 13:14:22');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `image` varchar(250) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `purchase_cost` varchar(5) NOT NULL,
  `quantity` varchar(5) NOT NULL,
  `likes` int(11) DEFAULT '0',
  `product_placed` varchar(200) NOT NULL,
  `application_id` int(11) NOT NULL,
  `date_added` datetime NOT NULL,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `user_id`, `image`, `title`, `description`, `purchase_cost`, `quantity`, `likes`, `product_placed`, `application_id`, `date_added`, `date_modify`) VALUES
(1, 1, '', '1234fok', 'sdfs', '12', '36', 11, '', 1, '2019-08-15 06:50:56', '2019-08-28 21:00:36'),
(2, 1, '', '1234fok', 'sdfs', '12', '12', 4, '', 1, '2019-08-15 06:50:56', '2019-06-29 20:25:28'),
(3, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-07-28 18:44:47'),
(4, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-03 20:04:28'),
(5, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-03 20:12:10'),
(6, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-03 20:14:50'),
(7, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-03 20:15:24'),
(8, 1, '', '1234fok', 'sdfs', '12', '12', 1, '', 1, '2019-08-15 06:50:56', '2019-08-03 20:15:54'),
(9, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-15 11:26:09'),
(10, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-15 11:26:52'),
(11, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-15 11:36:35'),
(12, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-15 11:38:06'),
(13, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-15 11:40:07'),
(14, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-15 11:44:11'),
(15, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-15 11:45:43'),
(16, 1, '', '1234fok', 'sdfs', '12', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-15 11:59:31'),
(17, 1, '', 'name', 'desc', '13', '12', 0, '', 1, '2019-08-15 06:50:56', '2019-08-15 12:00:24'),
(18, 1, 'http://localhost/stockmanagement/uploads/hello', '123test', 'description', '12', '12', 0, '1,2', 1, '2019-08-15 06:50:56', '2019-08-18 14:48:16'),
(19, 1, '', '13DAsd', 'sdfsd', '12', '121', 0, 'sd', 1, '2019-08-15 06:50:56', '2019-08-18 14:51:50'),
(20, 1, '', 'asd', 'nnm', '12', '12', 0, '12', 1, '2019-08-18 09:23:36', '2019-08-18 14:53:36'),
(21, 1, '', 'title', 'desc', '12', '12', 0, '1', 1, '2019-08-18 09:24:19', '2019-08-18 09:27:17'),
(22, 1, '', 'test product name', 'test description', '10', '10', 0, 'na', 1, '2019-08-24 09:54:04', '2019-08-24 15:24:04'),
(23, 1, '', 'test id', 'tes desc', '11', '10', 0, 'na', 1, '2019-08-24 09:56:22', '2019-08-26 11:06:53');

-- --------------------------------------------------------

--
-- Table structure for table `product_history`
--

DROP TABLE IF EXISTS `product_history`;
CREATE TABLE IF NOT EXISTS `product_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `marketplace_id` int(11) NOT NULL,
  `product_status_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quantity` varchar(5) NOT NULL,
  `reason` text NOT NULL,
  `date_added` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_history`
--

INSERT INTO `product_history` (`id`, `product_id`, `marketplace_id`, `product_status_id`, `user_id`, `quantity`, `reason`, `date_added`) VALUES
(1, 1, 2, 1, 1, '3', '', '2019-07-01 06:04:15'),
(2, 1, 4, 3, 1, '12', '', '2019-07-10 06:06:08'),
(3, 6, 4, 2, 1, '6', '', '2019-06-30 06:07:44'),
(4, 1, 3, 6, 1, '1', '', '2019-06-30 07:33:44'),
(5, 7, 2, 1, 1, '1', '', '2019-06-30 08:00:11'),
(6, 8, 1, 7, 1, '2', '', '2019-06-30 08:00:34'),
(7, 1, 1, 1, 1, '1', '', '2019-08-04 13:36:37'),
(8, 1, 0, 1, 1, '1', 'Test 123', '2019-08-18 07:06:24'),
(9, 1, 0, 4, 1, '2', 'hello loss', '2019-08-18 07:22:03'),
(10, 1, 0, 1, 1, '1', 'hello &lt;test&gt; test', '2019-08-24 13:47:36'),
(11, 1, 4, 6, 1, '12', 'trst', '2019-08-28 20:57:54'),
(12, 1, 1, 1, 1, '12', '13232', '2019-08-28 20:58:21'),
(13, 1, 1, 2, 1, '12', 'qw', '2019-08-28 20:58:50'),
(14, 1, 1, 1, 1, '12', 'nnn', '2019-08-28 21:00:36');

-- --------------------------------------------------------

--
-- Table structure for table `product_likes`
--

DROP TABLE IF EXISTS `product_likes`;
CREATE TABLE IF NOT EXISTS `product_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `date_added` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_likes`
--

INSERT INTO `product_likes` (`id`, `user_id`, `product_id`, `date_added`) VALUES
(1, 1, 1, '2019-06-30 19:27:36'),
(2, 1, 2, '2019-06-30 20:03:54'),
(3, 1, 1, '2019-06-30 20:04:55'),
(4, 1, 1, '2019-06-30 20:05:11'),
(5, 1, 1, '2019-06-30 20:05:13'),
(6, 1, 2, '2019-06-30 20:05:25'),
(7, 1, 2, '2019-06-30 20:05:27'),
(8, 1, 2, '2019-06-30 20:05:29'),
(9, 1, 1, '2019-06-30 20:06:03'),
(10, 1, 1, '2019-06-30 20:06:04'),
(11, 1, 1, '2019-08-08 20:29:03'),
(12, 1, 1, '2019-08-08 20:48:47'),
(13, 1, 1, '2019-08-08 20:48:48'),
(14, 1, 1, '2019-08-08 20:48:49'),
(15, 1, 1, '2019-08-08 20:55:45'),
(16, 1, 8, '2019-08-08 20:57:32');

-- --------------------------------------------------------

--
-- Table structure for table `product_status`
--

DROP TABLE IF EXISTS `product_status`;
CREATE TABLE IF NOT EXISTS `product_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `stockType` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1=stockin 2 =stockout',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `sequence` tinyint(4) NOT NULL DEFAULT '0',
  `date_added` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_status`
--

INSERT INTO `product_status` (`id`, `type`, `stockType`, `status`, `sequence`, `date_added`) VALUES
(1, 'New', 1, 1, 0, '2019-06-30 09:50:48'),
(2, 'Old', 1, 1, 1, '2019-06-30 09:50:48'),
(3, 'Return', 1, 1, 2, '2019-06-30 09:51:33'),
(4, 'Loss', 2, 1, 3, '2019-06-30 09:51:33'),
(5, 'Other', 1, 1, 5, '2019-06-30 10:13:19'),
(6, 'Sold Out', 2, 1, 6, '2019-06-30 10:18:20'),
(7, 'Damaged', 2, 1, 7, '2019-06-30 10:18:20');

-- --------------------------------------------------------

--
-- Table structure for table `product_uids`
--

DROP TABLE IF EXISTS `product_uids`;
CREATE TABLE IF NOT EXISTS `product_uids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `marketplace_id` int(11) NOT NULL,
  `marketplace_unique_id` varchar(30) NOT NULL,
  `date_added` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=69 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_uids`
--

INSERT INTO `product_uids` (`id`, `user_id`, `product_id`, `marketplace_id`, `marketplace_unique_id`, `date_added`) VALUES
(1, 1, 1, 1, 'amazon_asin', '2019-06-29 09:06:16'),
(2, 1, 1, 2, 'flipkart_asin', '2019-06-29 09:06:16'),
(3, 1, 1, 3, 'paytm_asin', '2019-06-29 09:06:16'),
(4, 1, 1, 4, '12s', '2019-06-29 09:06:16'),
(5, 1, 2, 1, '123', '2019-06-29 14:55:28'),
(6, 1, 8, 2, '13', '2019-06-29 14:55:28'),
(7, 1, 7, 3, '23', '2019-06-29 14:55:28'),
(8, 1, 2, 4, '23d', '2019-06-29 14:55:28'),
(9, 1, 7, 6, 'fgfgg', '2019-08-03 14:45:24'),
(10, 1, 8, 6, 'fgfgg', '2019-08-03 14:45:54'),
(11, 1, 9, 6, 'fgfgg', '2019-08-15 05:56:09'),
(12, 1, 10, 6, '123', '2019-08-15 05:56:52'),
(13, 1, 11, 6, 'testid', '2019-08-15 06:06:35'),
(14, 1, 12, 6, 'uid', '2019-08-15 06:08:06'),
(15, 1, 13, 6, 'testid', '2019-08-15 06:10:07'),
(16, 1, 14, 1, 'we', '2019-08-15 06:14:11'),
(17, 1, 14, 2, 'sf', '2019-08-15 06:14:11'),
(18, 1, 14, 3, 'se', '2019-08-15 06:14:11'),
(19, 1, 14, 6, 'uid', '2019-08-15 06:14:11'),
(20, 1, 15, 1, 'amazon', '2019-08-15 06:15:43'),
(21, 1, 15, 2, 'flipkart', '2019-08-15 06:15:43'),
(22, 1, 15, 3, 'paytm', '2019-08-15 06:15:43'),
(23, 1, 15, 6, 'testid', '2019-08-15 06:15:43'),
(24, 1, 16, 1, 'am', '2019-08-15 06:29:31'),
(25, 1, 16, 2, 'flipkart', '2019-08-15 06:29:31'),
(26, 1, 16, 3, 'payrm', '2019-08-15 06:29:31'),
(27, 1, 16, 6, 'aasd', '2019-08-15 06:29:31'),
(36, 1, 17, 5, 'otheruid', '2019-08-15 06:55:02'),
(35, 1, 17, 3, 'paytm uid', '2019-08-15 06:55:02'),
(34, 1, 17, 2, 'flipkart uid', '2019-08-15 06:55:02'),
(33, 1, 17, 1, 'am uid', '2019-08-15 06:55:02'),
(37, 1, 17, 6, 'aasd uid', '2019-08-15 06:55:02'),
(38, 1, 18, 1, '12e3', '2019-08-18 09:18:17'),
(39, 1, 18, 2, '12', '2019-08-18 09:18:17'),
(40, 1, 18, 3, '123', '2019-08-18 09:18:17'),
(41, 1, 18, 5, '123', '2019-08-18 09:18:17'),
(42, 1, 18, 6, '123', '2019-08-18 09:18:17'),
(43, 1, 19, 1, 'sd', '2019-08-18 09:21:50'),
(44, 1, 19, 2, 'sd', '2019-08-18 09:21:50'),
(45, 1, 19, 3, 'sd', '2019-08-18 09:21:50'),
(46, 1, 19, 6, 'ad', '2019-08-18 09:21:50'),
(47, 1, 20, 6, 'uid', '2019-08-18 09:23:36'),
(49, 1, 21, 1, 'sa', '2019-08-18 09:27:17'),
(50, 1, 21, 2, 'asd', '2019-08-18 09:27:17'),
(51, 1, 21, 3, 'sd', '2019-08-18 09:27:17'),
(52, 1, 21, 5, 'sd', '2019-08-18 09:27:17'),
(53, 1, 21, 6, 'uid', '2019-08-18 09:27:17'),
(54, 1, 22, 1, '123', '2019-08-24 09:54:04'),
(55, 1, 22, 2, '123', '2019-08-24 09:54:04'),
(56, 1, 22, 3, '123', '2019-08-24 09:54:04'),
(57, 1, 22, 5, '123', '2019-08-24 09:54:04'),
(58, 1, 22, 6, 'testid', '2019-08-24 09:54:04'),
(67, 1, 23, 5, '12', '2019-08-26 11:06:53'),
(66, 1, 23, 3, '123', '2019-08-26 11:06:53'),
(65, 1, 23, 2, '123', '2019-08-26 11:06:53'),
(64, 1, 23, 1, '123', '2019-08-26 11:06:53'),
(68, 1, 23, 6, 'newid', '2019-08-26 11:06:53');

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
CREATE TABLE IF NOT EXISTS `purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `totalcost` varchar(10) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(200) NOT NULL,
  `purchase_date` date NOT NULL,
  `date_added` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modify` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `user_id`, `totalcost`, `description`, `image`, `purchase_date`, `date_added`, `date_modify`) VALUES
(1, 1, '10', 'test1 bill', '', '2019-09-07', '2019-09-07 13:24:41', '2019-09-07 13:24:41'),
(2, 1, '12', '2test bill', '', '2019-09-06', '2019-09-07 13:25:04', '2019-09-07 13:25:04'),
(3, 1, '1000', 'testing bill1', '', '2019-09-09', '2019-09-07 13:25:40', '2019-09-07 13:25:40'),
(4, 1, '12', '', '', '2019-09-09', '2019-09-07 13:26:10', '2019-09-07 13:26:10');

-- --------------------------------------------------------

--
-- Table structure for table `requested_quotes`
--

DROP TABLE IF EXISTS `requested_quotes`;
CREATE TABLE IF NOT EXISTS `requested_quotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `request_by` int(11) NOT NULL,
  `request_to` int(11) NOT NULL,
  `detail` text NOT NULL,
  `date_added` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `requested_quotes`
--

INSERT INTO `requested_quotes` (`id`, `product_id`, `request_by`, `request_to`, `detail`, `date_added`) VALUES
(1, 1, 2, 1, 'hello', '2019-07-11 15:36:59'),
(2, 2, 2, 1, 'hi', '2019-07-13 06:52:17'),
(3, 1, 3, 1, 'hello', '2019-07-13 06:54:56'),
(4, 1, 1, 2, 'akdjkjsfs', '2019-07-13 15:47:52'),
(5, 5, 1, 2, 'sfsfs sfsf sfs fs fs f sf s fs f s fs f sf s', '2019-07-13 15:53:36');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_name` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `mobile` varchar(12) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `device_limit` tinyint(4) NOT NULL COMMENT 'user device limit',
  `date_added` datetime NOT NULL,
  `date_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(250) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `address` varchar(250) NOT NULL,
  `application_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `store_name`, `name`, `mobile`, `password`, `email`, `device_limit`, `date_added`, `date_updated`, `image`, `city`, `state`, `address`, `application_id`, `status`) VALUES
(1, 'test', 'Sahil1', '9728488343', 'ffe623d2742248bce4051ddb39431480', 'sahiltuteja09@gmail.com', 0, '2019-06-29 08:52:07', '2019-08-03 12:12:44', '1564935482240-cropped.jpg', 'sdc', 'dfghj', 'sdcsdc', 1, 1),
(2, '', 'sahil2', '9898789098', 'ffe623d2742248bce4051ddb39431480', 'sahil@yopmail.com', 0, '2019-07-11 15:30:55', '2019-07-11 15:30:55', '', '', '', '', 1, 1),
(3, '', 'Mohit', '1818282828', 'ffe623d2742248bce4051ddb39431480', 'mohit@yopmail.com', 0, '2019-07-13 06:54:34', '2019-07-13 06:54:34', '', '', '', '', 1, 1),
(4, '', 'Sahiltutejanew', '9728488343', 'ffe623d2742248bce4051ddb39431480', 'sa@gmail.com', 0, '2019-08-24 07:55:14', '2019-08-24 07:55:14', '', '', '', '', 1, 1),
(5, '', 'test', '9728488232', 'ffe623d2742248bce4051ddb39431480', 'test@gmail.com', 0, '2019-09-21 16:58:05', '2019-09-21 16:58:05', '', '', '', '', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_tokens`
--

DROP TABLE IF EXISTS `user_tokens`;
CREATE TABLE IF NOT EXISTS `user_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `active_devices` tinyint(4) NOT NULL,
  `platform` varchar(10) NOT NULL,
  `device_id` varchar(100) NOT NULL,
  `api_key` varchar(100) NOT NULL,
  `application_id` tinyint(4) NOT NULL,
  `player_id` varchar(200) NOT NULL DEFAULT '0',
  `date_added` datetime NOT NULL,
  `last_login` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_tokens`
--

INSERT INTO `user_tokens` (`id`, `user_id`, `active_devices`, `platform`, `device_id`, `api_key`, `application_id`, `player_id`, `date_added`, `last_login`) VALUES
(1, 1, 1, 'browser', 'browser', '2190021322261582b892977e9b07c346', 1, '0', '2019-06-29 08:52:32', '2019-09-21 11:56:09'),
(2, 2, 0, 'browser', 'browser', '1cf9a3b72cf3ab352a42d6bd9c1ac78c', 1, '0', '2019-07-11 15:31:06', '2019-07-13 06:51:55'),
(3, 3, 1, 'browser', 'browser', '897beb9e0078399902c8fe839d6e8b3f', 1, '0', '2019-07-13 06:54:48', '2019-07-18 04:21:09'),
(4, 5, 0, 'browser', 'browser', 'c668099a80ce73aaf8bd91d3369cd871', 1, '0', '2019-09-21 16:58:39', '2019-09-21 16:58:39');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
