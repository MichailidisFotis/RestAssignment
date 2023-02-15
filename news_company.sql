-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 15 Φεβ 2023 στις 19:02:29
-- Έκδοση διακομιστή: 10.4.24-MariaDB
-- Έκδοση PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `news_company`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `comments`
--

CREATE TABLE `comments` (
  `comment_id` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `comment_state_id` int(11) DEFAULT NULL,
  `date_of_creation` date NOT NULL,
  `news_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Άδειασμα δεδομένων του πίνακα `comments`
--

INSERT INTO `comments` (`comment_id`, `content`, `user_id`, `firstname`, `surname`, `comment_state_id`, `date_of_creation`, `news_id`) VALUES
('1673597566612', 'comment_admin', '1669478490457', 'admin', 'admin', 2, '2023-01-13', '1673597427458'),
('1673597658976', 'comment_2', NULL, 'Iasonas', 'Argiantzis', 2, '2023-01-13', '1673597427458');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `comment_state`
--

CREATE TABLE `comment_state` (
  `comment_state_id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Άδειασμα δεδομένων του πίνακα `comment_state`
--

INSERT INTO `comment_state` (`comment_state_id`, `description`) VALUES
(1, 'created'),
(2, 'accepted');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `news`
--

CREATE TABLE `news` (
  `news_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` mediumtext NOT NULL,
  `date_of_creation` date NOT NULL,
  `news_state_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Άδειασμα δεδομένων του πίνακα `news`
--

INSERT INTO `news` (`news_id`, `user_id`, `title`, `content`, `date_of_creation`, `news_state_id`) VALUES
('1673096424309', '1669478490457', 'adminNews', 'content', '2023-01-07', 1),
('1673597427458', '1673597073908', 'news_edited', 'content1', '2023-01-13', 4);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `news_states`
--

CREATE TABLE `news_states` (
  `news_state_id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Άδειασμα δεδομένων του πίνακα `news_states`
--

INSERT INTO `news_states` (`news_state_id`, `description`) VALUES
(1, 'created'),
(2, 'submited'),
(3, 'accepted'),
(4, 'published');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `news_topics`
--

CREATE TABLE `news_topics` (
  `news_id` varchar(255) DEFAULT NULL,
  `topic_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Άδειασμα δεδομένων του πίνακα `news_topics`
--

INSERT INTO `news_topics` (`news_id`, `topic_id`) VALUES
('1673096424309', '1673096402799'),
('1673597427458', '1673597193798');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Άδειασμα δεδομένων του πίνακα `roles`
--

INSERT INTO `roles` (`role_id`, `description`) VALUES
(1, 'admin'),
(2, 'journalist');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `topics`
--

CREATE TABLE `topics` (
  `topic_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date_of_creation` date NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `father_id` varchar(255) DEFAULT NULL,
  `child_id` varchar(255) DEFAULT NULL,
  `topic_state_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Άδειασμα δεδομένων του πίνακα `topics`
--

INSERT INTO `topics` (`topic_id`, `title`, `date_of_creation`, `user_id`, `father_id`, `child_id`, `topic_state_id`) VALUES
('1673096402799', 'adminTopic', '2023-01-07', '1669478490457', NULL, NULL, 2),
('1673597193798', 'topic_1', '2023-01-13', '1673597073908', NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `topics_state`
--

CREATE TABLE `topics_state` (
  `topic_state_id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Άδειασμα δεδομένων του πίνακα `topics_state`
--

INSERT INTO `topics_state` (`topic_state_id`, `description`) VALUES
(1, 'created'),
(2, 'accepted');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `user_id` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`user_id`, `firstname`, `surname`, `username`, `user_password`, `role_id`) VALUES
('1669478490457', 'admin', 'admin', 'admin', '81dc9bdb52d04dc20036dbd8313ed055', 1),
('1673597073908', 'Fotios', 'Michailidis', 'icsd19138', '81dc9bdb52d04dc20036dbd8313ed055', 2);

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `comment_state_id` (`comment_state_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `news_id` (`news_id`);

--
-- Ευρετήρια για πίνακα `comment_state`
--
ALTER TABLE `comment_state`
  ADD PRIMARY KEY (`comment_state_id`);

--
-- Ευρετήρια για πίνακα `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`news_id`),
  ADD UNIQUE KEY `title` (`title`),
  ADD KEY `news_state_id` (`news_state_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Ευρετήρια για πίνακα `news_states`
--
ALTER TABLE `news_states`
  ADD PRIMARY KEY (`news_state_id`);

--
-- Ευρετήρια για πίνακα `news_topics`
--
ALTER TABLE `news_topics`
  ADD KEY `news_id` (`news_id`),
  ADD KEY `topic_id` (`topic_id`);

--
-- Ευρετήρια για πίνακα `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Ευρετήρια για πίνακα `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`topic_id`),
  ADD UNIQUE KEY `UQ_topics_title` (`title`),
  ADD KEY `father_id` (`father_id`),
  ADD KEY `child_id` (`child_id`),
  ADD KEY `topic_state_id` (`topic_state_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Ευρετήρια για πίνακα `topics_state`
--
ALTER TABLE `topics_state`
  ADD PRIMARY KEY (`topic_state_id`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `role_id` (`role_id`);

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`comment_state_id`) REFERENCES `comment_state` (`comment_state_id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`news_id`) REFERENCES `news` (`news_id`);

--
-- Περιορισμοί για πίνακα `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`news_state_id`) REFERENCES `news_states` (`news_state_id`),
  ADD CONSTRAINT `news_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `news_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Περιορισμοί για πίνακα `news_topics`
--
ALTER TABLE `news_topics`
  ADD CONSTRAINT `news_topics_ibfk_1` FOREIGN KEY (`news_id`) REFERENCES `news` (`news_id`),
  ADD CONSTRAINT `news_topics_ibfk_2` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`topic_id`);

--
-- Περιορισμοί για πίνακα `topics`
--
ALTER TABLE `topics`
  ADD CONSTRAINT `topics_ibfk_1` FOREIGN KEY (`father_id`) REFERENCES `topics` (`topic_id`),
  ADD CONSTRAINT `topics_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `topics` (`topic_id`),
  ADD CONSTRAINT `topics_ibfk_3` FOREIGN KEY (`topic_state_id`) REFERENCES `topics_state` (`topic_state_id`),
  ADD CONSTRAINT `topics_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Περιορισμοί για πίνακα `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
