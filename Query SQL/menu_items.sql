-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 17, 2025 at 09:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_resto`
--

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` varchar(20) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `category`, `name`, `price`, `description`) VALUES
(1, 'Breakfast & Starters', 'Classic Caesar Salad', '$12', 'Crisp romaine lettuce, parmesan cheese, and crunchy croutons tossed in our signature Caesar dressing.'),
(2, 'Breakfast & Starters', 'Garlic Butter Shrimp', '$18', 'Succulent shrimp sautéed in a rich garlic butter sauce, served with toasted sourdough bread.'),
(3, 'Breakfast & Starters', 'Belgian Waffle', '$13', 'A light and airy waffle topped with fresh seasonal berries, maple syrup, and a dollop of whipped cream.'),
(4, 'Breakfast & Starters', 'Pizza ', '$15', 'pizza here '),
(5, 'Main Course', 'Rosemary Grilled Steak', '$55', 'Premium tenderloin steak grilled to perfection with a rosemary crust, served with potato gratin and asparagus.'),
(6, 'Main Course', 'Pan-Seared Salmon', '$42', 'Crispy-skin salmon fillet served on a bed of lemon-dill risotto and steamed vegetables.'),
(7, 'Main Course', 'Chicken Cordon Bleu', '$38', 'Tender chicken breast stuffed with ham and swiss cheese, breaded and fried until golden brown.'),
(8, 'Main Course', 'Spaghetti Aglio e Olio', '$25', 'A simple yet elegant pasta dish with garlic, olive oil, chili flakes, and a sprinkle of fresh parsley.'),
(9, 'Desserts', 'New York Cheesecake', '$15', 'A rich and creamy classic cheesecake with a graham cracker crust, topped with a berry compote.'),
(10, 'Desserts', 'Chocolate Lava Cake', '$16', 'Warm, molten chocolate cake that flows from the center, served with a scoop of vanilla bean ice cream.'),
(11, 'Desserts', 'Tiramisu', '$14', 'An Italian classic featuring layers of coffee-soaked ladyfingers and a delicate mascarpone cream.'),
(12, 'Desserts', 'Panna Cotta', '$12', 'A silky smooth Italian cream pudding, served with a vibrant raspberry coulis.'),
(13, 'Drinks & Beverages', 'Classic Mojito', '$14', 'A refreshing mix of white rum, fresh mint, lime juice, sugar, and soda water.'),
(14, 'Drinks & Beverages', 'Espresso Martini', '$16', 'A sophisticated cocktail of vodka, coffee liqueur, and a shot of freshly brewed espresso.'),
(15, 'Drinks & Beverages', 'Fresh Orange Juice', '$8', '100% freshly squeezed orange juice, served chilled.'),
(16, 'Drinks & Beverages', 'Cappuccino', '$7', 'A perfect balance of rich espresso, steamed milk, and a smooth layer of foam.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
