-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 22, 2017 at 02:57 AM
-- Server version: 10.1.26-MariaDB
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tictactoe`
--

-- --------------------------------------------------------

--
-- Table structure for table `overall_stats`
--

CREATE TABLE `overall_stats` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `Games_played` int(20) NOT NULL DEFAULT '0',
  `Turns_taken` int(20) NOT NULL DEFAULT '0',
  `Time_spent` int(30) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `overall_stats`
--

INSERT INTO `overall_stats` (`ID`, `user_id`, `Games_played`, `Turns_taken`, `Time_spent`) VALUES
(1, 2, 12, 49, 167),
(2, 3, 0, 0, 0),
(3, 4, 0, 0, 0),
(8, 13, 0, 0, 0),
(9, 14, 0, 0, 0),
(10, 15, 0, 0, 0),
(11, 16, 0, 0, 0),
(12, 17, 0, 0, 0),
(13, 18, 0, 0, 0),
(14, 19, 18, 76, 326),
(15, 20, 7, 27, 168),
(16, 21, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `personal_scores`
--

CREATE TABLE `personal_scores` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `Wins` int(11) NOT NULL DEFAULT '0',
  `Loses` int(11) NOT NULL DEFAULT '0',
  `Draws` int(11) NOT NULL DEFAULT '0',
  `Wins_as_x` int(11) NOT NULL DEFAULT '0',
  `Loses_as_x` int(11) NOT NULL DEFAULT '0',
  `Draws_as_x` int(11) NOT NULL DEFAULT '0',
  `Wins_as_o` int(11) NOT NULL DEFAULT '0',
  `Loses_as_o` int(11) NOT NULL DEFAULT '0',
  `Draws_as_o` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `personal_scores`
--

INSERT INTO `personal_scores` (`ID`, `user_id`, `Wins`, `Loses`, `Draws`, `Wins_as_x`, `Loses_as_x`, `Draws_as_x`, `Wins_as_o`, `Loses_as_o`, `Draws_as_o`) VALUES
(1, 2, 6, 7, 1, 4, 1, 1, 1, 6, 0),
(2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(4, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(5, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(6, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(7, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(8, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(9, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(10, 19, 5, 7, 1, 3, 2, 0, 1, 5, 1),
(11, 20, 8, 3, 0, 5, 0, 0, 1, 3, 0),
(12, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `user_name`, `password`) VALUES
(2, 'Helios', '123456'),
(3, 'usr', '123456'),
(4, 'Smth', '123'),
(13, 'Smth2', '1234'),
(14, 'Smth3', '12345'),
(15, 'Smth4', '123456'),
(16, 'Bubble', '147258'),
(17, 'Trouble', '123456'),
(18, 'Moredots', '159159'),
(19, 'Bunny', 'rabbit'),
(20, 'MidorFeed', '123'),
(21, 'Bla', 'bla');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `overall_stats`
--
ALTER TABLE `overall_stats`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `personal_scores`
--
ALTER TABLE `personal_scores`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `overall_stats`
--
ALTER TABLE `overall_stats`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `personal_scores`
--
ALTER TABLE `personal_scores`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
