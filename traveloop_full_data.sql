-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: traveloop
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stop_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `type` varchar(50) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT '0.00',
  `duration` varchar(50) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_activities_stop` (`stop_id`),
  KEY `idx_activities_type` (`type`),
  CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`stop_id`) REFERENCES `stops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,1,'Baga Beach','Relaxing on the beach','Beach',0.00,'4 hours','10:00:00',NULL),(2,2,'Dudhsagar Waterfalls','Trek to the falls','Adventure',25.00,'6 hours','08:00:00',NULL),(3,3,'Amber Fort','Historical tour','Sightseeing',15.00,'3 hours','09:00:00',NULL),(4,4,'City Palace','Royal residence','Sightseeing',20.00,'2 hours','11:00:00',NULL),(5,5,'Mehrangarh Fort','Majestic fort view','Sightseeing',18.00,'3 hours','10:00:00',NULL),(6,6,'Fort Kochi','Colonial architecture','Culture',10.00,'2 hours','16:00:00',NULL),(7,7,'Houseboat Cruise','Backwaters tour','Nature',150.00,'24 hours','12:00:00',NULL),(8,8,'Rohtang Pass','Snow adventure','Adventure',40.00,'5 hours','07:00:00',NULL),(9,9,'Kheerganga Trek','Hot springs trek','Adventure',10.00,'8 hours','06:00:00',NULL),(10,10,'Mall Road','Shopping and cafes','Shopping',50.00,'3 hours','18:00:00',NULL),(11,11,'Eiffel Tower','Landmark visit','Sightseeing',30.00,'2 hours','19:00:00',NULL),(12,12,'Anne Frank House','Museum visit','Culture',20.00,'2 hours','14:00:00',NULL),(13,13,'Berlin Wall','Historical site','Sightseeing',0.00,'2 hours','10:00:00',NULL),(14,14,'Charles Bridge','Walking tour','Sightseeing',0.00,'1 hour','17:00:00',NULL),(15,15,'Schonbrunn Palace','Palace tour','Culture',25.00,'3 hours','09:00:00',NULL),(16,16,'Grand Palace','Royal palace','Sightseeing',15.00,'3 hours','09:00:00',NULL),(17,17,'Phi Phi Islands','Island hopping','Beach',60.00,'8 hours','08:00:00',NULL),(18,18,'Doi Suthep','Temple visit','Culture',10.00,'2 hours','16:00:00',NULL),(19,19,'Monkey Forest','Wildlife sanctuary','Nature',5.00,'2 hours','10:00:00',NULL),(20,20,'Potato Head Beach Club','Sunset drinks','Nightlife',40.00,'4 hours','17:00:00',NULL);
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checklists`
--

DROP TABLE IF EXISTS `checklists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checklists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int DEFAULT NULL,
  `item_name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `is_packed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_checklists_trip` (`trip_id`),
  CONSTRAINT `checklists_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checklists`
--

LOCK TABLES `checklists` WRITE;
/*!40000 ALTER TABLE `checklists` DISABLE KEYS */;
/*!40000 ALTER TABLE `checklists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid') DEFAULT 'pending',
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_expenses_trip` (`trip_id`),
  KEY `idx_expenses_category` (`category`),
  KEY `idx_expenses_date` (`date`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,1,'Stay','Hotel stay',200.00,'paid','2025-02-10'),(2,1,'Transport','Flights',150.00,'paid','2025-02-01'),(3,1,'Meals','Seafood dinner',40.00,'paid','2025-02-11'),(4,2,'Stay','Heritage hotel',300.00,'paid','2025-04-25'),(5,2,'Activities','Fort tickets',50.00,'paid','2025-05-02'),(6,3,'Stay','Houseboat rental',150.00,'paid','2025-03-05'),(7,4,'Transport','Bus tickets',30.00,'paid','2025-07-01'),(8,5,'Transport','Eurail pass',350.00,'paid','2025-05-20'),(9,5,'Meals','Street food',60.00,'paid','2025-06-05'),(10,5,'Stay','Hostels',400.00,'paid','2025-05-25'),(11,6,'Stay','Resort',500.00,'paid','2025-08-25'),(12,7,'Activities','Spa',100.00,'paid','2025-04-22'),(13,8,'Transport','Bike rental',200.00,'paid','2025-06-15'),(14,9,'Meals','Local cuisine',80.00,'paid','2025-10-06'),(15,10,'Stay','Ryokan',450.00,'paid','2025-03-20'),(16,10,'Transport','JR Pass',250.00,'paid','2025-03-15'),(17,11,'Meals','Fine dining',150.00,'paid','2025-08-05'),(18,12,'Activities','Whisky tour',80.00,'paid','2025-05-12'),(19,13,'Stay','Hotels',200.00,'paid','2025-06-15'),(20,14,'Activities','Desert tour',120.00,'paid','2025-07-06'),(21,15,'Stay','Water villa',1200.00,'paid','2025-08-10'),(22,15,'Transport','Seaplane',300.00,'paid','2025-08-15'),(23,16,'Activities','Trekking permit',50.00,'paid','2025-09-02'),(24,17,'Stay','Hotels',150.00,'paid','2025-04-05'),(25,18,'Transport','Car rental',600.00,'paid','2025-06-25'),(26,19,'Stay','Villa',800.00,'paid','2025-06-05'),(27,20,'Activities','Camel safari',40.00,'paid','2025-11-02');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int DEFAULT NULL,
  `stop_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `stop_id` (`stop_id`),
  KEY `idx_notes_trip` (`trip_id`),
  CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`stop_id`) REFERENCES `stops` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stops`
--

DROP TABLE IF EXISTS `stops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stops` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int DEFAULT NULL,
  `city_name` varchar(100) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `arrival_date` date DEFAULT NULL,
  `departure_date` date DEFAULT NULL,
  `budget` decimal(10,2) DEFAULT '0.00',
  `order_index` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_stops_trip` (`trip_id`),
  KEY `idx_stops_city` (`city_name`),
  KEY `idx_stops_country` (`country`),
  CONSTRAINT `stops_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stops`
--

LOCK TABLES `stops` WRITE;
/*!40000 ALTER TABLE `stops` DISABLE KEYS */;
INSERT INTO `stops` VALUES (1,1,'Panaji','India','2025-02-10','2025-02-12',0.00,1),(2,1,'Calangute','India','2025-02-12','2025-02-15',0.00,2),(3,2,'Jaipur','India','2025-05-01','2025-05-04',0.00,1),(4,2,'Udaipur','India','2025-05-04','2025-05-06',0.00,2),(5,2,'Jodhpur','India','2025-05-06','2025-05-08',0.00,3),(6,3,'Kochi','India','2025-03-15','2025-03-17',0.00,1),(7,3,'Alleppey','India','2025-03-17','2025-03-20',0.00,2),(8,4,'Manali','India','2025-07-10','2025-07-13',0.00,1),(9,4,'Kasol','India','2025-07-13','2025-07-15',0.00,2),(10,4,'Shimla','India','2025-07-15','2025-07-17',0.00,3),(11,5,'Paris','France','2025-06-01','2025-06-04',0.00,1),(12,5,'Amsterdam','Netherlands','2025-06-04','2025-06-07',0.00,2),(13,5,'Berlin','Germany','2025-06-07','2025-06-10',0.00,3),(14,5,'Prague','Czech Republic','2025-06-10','2025-06-13',0.00,4),(15,5,'Vienna','Austria','2025-06-13','2025-06-15',0.00,5),(16,6,'Bangkok','Thailand','2025-09-10','2025-09-13',0.00,1),(17,6,'Phuket','Thailand','2025-09-13','2025-09-16',0.00,2),(18,6,'Chiang Mai','Thailand','2025-09-16','2025-09-18',0.00,3),(19,7,'Ubud','Indonesia','2025-04-20','2025-04-23',0.00,1),(20,7,'Seminyak','Indonesia','2025-04-23','2025-04-27',0.00,2),(21,8,'Leh','India','2025-06-15','2025-06-19',0.00,1),(22,8,'Nubra Valley','India','2025-06-19','2025-06-22',0.00,2),(23,8,'Pangong Lake','India','2025-06-22','2025-06-25',0.00,3),(24,9,'Colombo','Sri Lanka','2025-10-05','2025-10-07',0.00,1),(25,9,'Kandy','Sri Lanka','2025-10-07','2025-10-09',0.00,2),(26,9,'Ella','Sri Lanka','2025-10-09','2025-10-12',0.00,3),(27,10,'Tokyo','Japan','2025-03-25','2025-03-29',0.00,1),(28,10,'Kyoto','Japan','2025-03-29','2025-04-02',0.00,2),(29,10,'Osaka','Japan','2025-04-02','2025-04-05',0.00,3),(30,11,'Rome','Italy','2025-08-01','2025-08-04',0.00,1),(31,11,'Florence','Italy','2025-08-04','2025-08-07',0.00,2),(32,11,'Venice','Italy','2025-08-07','2025-08-10',0.00,3),(33,12,'Edinburgh','UK','2025-05-10','2025-05-13',0.00,1),(34,12,'Inverness','UK','2025-05-13','2025-05-16',0.00,2),(35,13,'Hanoi','Vietnam','2025-06-20','2025-06-24',0.00,1),(36,13,'Ha Long Bay','Vietnam','2025-06-24','2025-06-27',0.00,2),(37,13,'Ho Chi Minh','Vietnam','2025-06-27','2025-06-30',0.00,3),(38,14,'Marrakech','Morocco','2025-07-05','2025-07-08',0.00,1),(39,14,'Fez','Morocco','2025-07-08','2025-07-12',0.00,2),(40,15,'Male','Maldives','2025-08-15','2025-08-20',0.00,1),(41,16,'Kathmandu','Nepal','2025-09-01','2025-09-04',0.00,1),(42,16,'Pokhara','Nepal','2025-09-04','2025-09-08',0.00,2),(43,16,'Annapurna','Nepal','2025-09-08','2025-09-12',0.00,3),(44,17,'Delhi','India','2025-04-10','2025-04-12',0.00,1),(45,17,'Agra','India','2025-04-12','2025-04-14',0.00,2),(46,17,'Jaipur','India','2025-04-14','2025-04-16',0.00,3),(47,18,'Chicago','USA','2025-07-01','2025-07-04',0.00,1),(48,18,'Amarillo','USA','2025-07-04','2025-07-07',0.00,2),(49,18,'Flagstaff','USA','2025-07-07','2025-07-10',0.00,3),(50,18,'Los Angeles','USA','2025-07-10','2025-07-14',0.00,4),(51,19,'Athens','Greece','2025-06-10','2025-06-12',0.00,1),(52,19,'Santorini','Greece','2025-06-12','2025-06-15',0.00,2),(53,19,'Mykonos','Greece','2025-06-15','2025-06-18',0.00,3),(54,20,'Jaisalmer','India','2025-11-01','2025-11-04',0.00,1),(55,20,'Sam Sand Dunes','India','2025-11-04','2025-11-06',0.00,2),(56,21,'Istanbul','Turkey','2025-10-10','2025-10-14',0.00,1),(57,21,'Cappadocia','Turkey','2025-10-14','2025-10-18',0.00,2),(58,22,'Queenstown','New Zealand','2025-12-01','2025-12-05',0.00,1),(59,22,'Milford Sound','New Zealand','2025-12-05','2025-12-08',0.00,2),(60,22,'Wanaka','New Zealand','2025-12-08','2025-12-12',0.00,3),(61,23,'Shillong','India','2025-11-10','2025-11-13',0.00,1),(62,23,'Cherrapunji','India','2025-11-13','2025-11-16',0.00,2),(63,24,'Taipei','Taiwan','2026-01-05','2026-01-08',0.00,1),(64,24,'Kaohsiung','Taiwan','2026-01-08','2026-01-12',0.00,2),(65,25,'Varanasi','India','2026-01-15','2026-01-19',0.00,1),(66,26,'Amalfi','Italy','2026-02-01','2026-02-04',0.00,1),(67,26,'Positano','Italy','2026-02-04','2026-02-08',0.00,2),(68,27,'Bhuj','India','2026-02-15','2026-02-18',0.00,1),(69,27,'White Rann','India','2026-02-18','2026-02-20',0.00,2),(70,28,'Macau','China','2026-03-01','2026-03-04',0.00,1),(71,29,'Darjeeling','India','2026-03-20','2026-03-23',0.00,1),(72,29,'Gangtok','India','2026-03-23','2026-03-26',0.00,2),(73,30,'Banff','Canada','2026-04-10','2026-04-14',0.00,1),(74,30,'Lake Louise','Canada','2026-04-14','2026-04-18',0.00,2),(75,31,'Srinagar','India','2026-01-20','2026-01-24',0.00,1),(76,31,'Gulmarg','India','2026-01-24','2026-01-27',0.00,2),(77,32,'Sapa','Vietnam','2026-02-05','2026-02-08',0.00,1),(78,32,'Ha Long Bay','Vietnam','2026-02-08','2026-02-12',0.00,2),(79,33,'Cusco','Peru','2026-03-01','2026-03-05',0.00,1),(80,33,'Machu Picchu','Peru','2026-03-05','2026-03-10',0.00,2),(81,34,'Port Blair','India','2025-08-05','2025-08-08',0.00,1),(82,34,'Havelock','India','2025-08-08','2025-08-12',0.00,2),(83,35,'Lisbon','Portugal','2025-10-15','2025-10-18',0.00,1),(84,35,'Porto','Portugal','2025-10-18','2025-10-22',0.00,2),(86,37,'Church and Convent of St. John of God','India','2026-06-11','2026-06-29',5000.00,0),(87,37,'Chapel of St. Catherine of Alexandria','India','2026-06-11','2026-06-29',5000.00,0),(88,37,'Big Foot Goa','India','2026-06-11','2026-06-29',5000.00,0),(89,37,'Dudhsagar Falls','India','2026-06-11','2026-06-29',5000.00,0),(90,38,'Elephanta Caves','India','2026-06-29','2026-07-07',5000.00,0),(91,38,'Haji Ali Dargah','India','2026-06-29','2026-07-07',5000.00,0),(92,38,'Kanheri Caves','India','2026-06-29','2026-07-07',5000.00,0);
/*!40000 ALTER TABLE `stops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `cover_photo` varchar(255) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT '0',
  `source_place` varchar(100) DEFAULT '',
  `destination_place` varchar(100) DEFAULT '',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_trips_user` (`user_id`),
  KEY `idx_trips_created` (`created_at`),
  KEY `idx_trips_dates` (`start_date`,`end_date`),
  CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES (1,1,'Goa Beach Vacation','Sun sand and seafood','2025-02-10','2025-02-15','',1,'Mumbai','Goa','2025-01-31 18:30:00'),(2,1,'Rajasthan Heritage','Exploring royal forts','2025-05-01','2025-05-08','',1,'Mumbai','Jaipur','2025-04-19 18:30:00'),(3,2,'Kerala Backwaters','Houseboat experience','2025-03-15','2025-03-20','',1,'Ahmedabad','Kochi','2025-02-28 18:30:00'),(4,2,'Himachal Adventure','Mountain trekking','2025-07-10','2025-07-17','',1,'Ahmedabad','Manali','2025-06-24 18:30:00'),(5,3,'Europe Backpacking','15 days across Europe','2025-06-01','2025-06-15','',1,'Delhi','Paris','2025-05-14 18:30:00'),(6,3,'Thailand Trip','Bangkok and islands','2025-09-10','2025-09-18','',1,'Delhi','Bangkok','2025-08-19 18:30:00'),(7,4,'Bali Retreat','Wellness and temples','2025-04-20','2025-04-27','',1,'Bangalore','Bali','2025-04-04 18:30:00'),(8,5,'Ladakh Road Trip','Highest motorable roads','2025-06-15','2025-06-25','',1,'Pune','Leh','2025-05-31 18:30:00'),(9,5,'Sri Lanka Circuit','Cultural triangle','2025-10-05','2025-10-12','',1,'Pune','Colombo','2025-09-19 18:30:00'),(10,6,'Japan Cherry Blossom','Spring in Japan','2025-03-25','2025-04-05','',1,'New York','Tokyo','2025-03-09 18:30:00'),(11,6,'Italy Food Tour','Pasta pizza gelato','2025-08-01','2025-08-10','',1,'New York','Rome','2025-07-14 18:30:00'),(12,7,'Scottish Highlands','Castles and whisky','2025-05-10','2025-05-16','',1,'London','Edinburgh','2025-04-24 18:30:00'),(13,8,'Vietnam Explorer','Hanoi to Ho Chi Minh','2025-06-20','2025-06-30','',1,'Tokyo','Hanoi','2025-06-04 18:30:00'),(14,9,'Morocco Adventure','Desert and medinas','2025-07-05','2025-07-12','',1,'Barcelona','Marrakech','2025-06-19 18:30:00'),(15,10,'Maldives Getaway','Island paradise','2025-08-15','2025-08-20','',1,'Singapore','Male','2025-07-31 18:30:00'),(16,11,'Nepal Trek','Annapurna base camp','2025-09-01','2025-09-12','',1,'Hyderabad','Kathmandu','2025-08-14 18:30:00'),(17,12,'Golden Triangle','Delhi Agra Jaipur','2025-04-10','2025-04-16','',1,'Chennai','Delhi','2025-03-27 18:30:00'),(18,13,'Route 66 Drive','Classic American road trip','2025-07-01','2025-07-14','',1,'Chicago','Los Angeles','2025-06-14 18:30:00'),(19,14,'Greek Islands','Santorini and Mykonos','2025-06-10','2025-06-18','',1,'Paris','Athens','2025-05-24 18:30:00'),(20,15,'Desert Safari','Thar desert experience','2025-11-01','2025-11-06','',1,'Jaipur','Jaisalmer','2025-10-14 18:30:00'),(21,16,'Turkey Delight','Istanbul and Cappadocia','2025-10-10','2025-10-18','',1,'Dubai','Istanbul','2025-09-24 18:30:00'),(22,17,'New Zealand Adventure','South Island tour','2025-12-01','2025-12-12','',1,'Sydney','Queenstown','2025-11-14 18:30:00'),(23,18,'Meghalaya Explore','Living root bridges','2025-11-10','2025-11-16','',1,'Kochi','Shillong','2025-10-24 18:30:00'),(24,19,'Taiwan Circuit','Taipei to Kaohsiung','2026-01-05','2026-01-12','',1,'Seoul','Taipei','2025-12-19 18:30:00'),(25,20,'Varanasi Spiritual','Ghats and temples','2026-01-15','2026-01-19','',1,'Lucknow','Varanasi','2026-01-04 18:30:00'),(26,21,'Amalfi Coast','Italian coastline drive','2026-02-01','2026-02-08','',1,'Rome','Amalfi','2026-01-14 18:30:00'),(27,22,'Kutch Festival','Rann Utsav experience','2026-02-15','2026-02-20','',1,'Surat','Bhuj','2026-01-31 18:30:00'),(28,23,'Macau Weekend','Casino and heritage','2026-03-01','2026-03-04','',1,'Hong Kong','Macau','2026-02-19 18:30:00'),(29,24,'Darjeeling Hills','Tea gardens and trains','2026-03-20','2026-03-26','',1,'Kolkata','Darjeeling','2026-03-09 18:30:00'),(30,25,'Banff National Park','Canadian Rockies','2026-04-10','2026-04-18','',1,'Vancouver','Banff','2026-03-24 18:30:00'),(31,1,'Kashmir Paradise','Dal Lake houseboat','2026-01-20','2026-01-27','',1,'Mumbai','Srinagar','2026-01-09 18:30:00'),(32,3,'Vietnam North','Sapa and Ha Long Bay','2026-02-05','2026-02-12','',1,'Delhi','Hanoi','2026-01-19 18:30:00'),(33,6,'Peru Machu Picchu','Inca trail adventure','2026-03-01','2026-03-10','',1,'New York','Cusco','2026-02-14 18:30:00'),(34,4,'Andaman Islands','Beach and scuba diving','2025-08-05','2025-08-12','',1,'Bangalore','Port Blair','2025-07-19 18:30:00'),(35,9,'Portugal Explorer','Lisbon and Porto','2025-10-15','2025-10-22','',1,'Barcelona','Lisbon','2025-09-30 18:30:00'),(37,26,'summer holiday','My amazing journey','2026-06-12','2026-06-30','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800',0,'','Goa, ','2026-05-10 10:20:11'),(38,26,'summer holiday','My amazing journey','2026-06-30','2026-07-08','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800',0,'','Mumbai, ','2026-05-10 10:20:48');
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `bio` text,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_city` (`city`),
  KEY `idx_users_country` (`country`),
  KEY `idx_users_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Aarav','Sharma','aarav@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543210','Mumbai','India',NULL,'Love exploring new places','user','2025-01-14 18:30:00'),(2,'Priya','Patel','priya@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543211','Ahmedabad','India',NULL,'Adventure seeker','user','2025-02-09 18:30:00'),(3,'Rahul','Verma','rahul@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543212','Delhi','India',NULL,'Travel blogger','user','2025-03-04 18:30:00'),(4,'Sara','Khan','sara@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543213','Bangalore','India',NULL,'Nature lover','user','2025-03-19 18:30:00'),(5,'Nitin','Joshi','nitin@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543214','Pune','India',NULL,'Solo traveler','user','2025-03-31 18:30:00'),(6,'Emma','Wilson','emma@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','4155551234','New York','USA',NULL,'Foodie traveler','user','2025-04-14 18:30:00'),(7,'James','Brown','james@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','4155551235','London','UK',NULL,'History buff','user','2025-04-30 18:30:00'),(8,'Yuki','Tanaka','yuki@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','8155551236','Tokyo','Japan',NULL,'Culture explorer','user','2025-05-19 18:30:00'),(9,'Carlos','Garcia','carlos@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','3455551237','Barcelona','Spain',NULL,'Beach lover','user','2025-06-09 18:30:00'),(10,'Mei','Chen','mei@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','8655551238','Singapore','Singapore',NULL,'City explorer','user','2025-06-30 18:30:00'),(11,'Arjun','Reddy','arjun@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543215','Hyderabad','India',NULL,'Mountain trekker','user','2025-07-14 18:30:00'),(12,'Ananya','Iyer','ananya@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543216','Chennai','India',NULL,'Heritage traveler','user','2025-07-31 18:30:00'),(13,'Liam','Johnson','liam@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','2125551239','Chicago','USA',NULL,'Road trip fan','user','2025-08-19 18:30:00'),(14,'Sophie','Martin','sophie@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','3315551240','Paris','France',NULL,'Art enthusiast','user','2025-09-04 18:30:00'),(15,'Ravi','Kumar','ravi@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543217','Jaipur','India',NULL,'Desert explorer','user','2025-09-30 18:30:00'),(16,'Aisha','Mohammed','aisha@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9715551241','Dubai','UAE',NULL,'Luxury traveler','user','2025-10-19 18:30:00'),(17,'Tom','Anderson','tom@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','6135551242','Sydney','Australia',NULL,'Surfer','user','2025-11-04 18:30:00'),(18,'Deepa','Nair','deepa@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543218','Kochi','India',NULL,'Backpacker','user','2025-11-24 18:30:00'),(19,'Alex','Kim','alex@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','8215551243','Seoul','South Korea',NULL,'Tech nomad','user','2025-12-09 18:30:00'),(20,'Pooja','Singh','pooja@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543219','Lucknow','India',NULL,'Food explorer','user','2026-01-04 18:30:00'),(21,'Marco','Rossi','marco@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','3915551244','Rome','Italy',NULL,'History lover','user','2026-01-19 18:30:00'),(22,'Sneha','Desai','sneha@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543220','Surat','India',NULL,'Weekend traveler','user','2026-02-09 18:30:00'),(23,'David','Lee','david@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','8525551245','Hong Kong','China',NULL,'Business traveler','user','2026-02-27 18:30:00'),(24,'Kavita','Gupta','kavita@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','9876543221','Kolkata','India',NULL,'Cultural explorer','user','2026-03-14 18:30:00'),(25,'Noah','Smith','noah@gmail.com','$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5','6045551246','Vancouver','Canada',NULL,'Nature photographer','user','2026-03-31 18:30:00'),(26,'Neha','Patel','neha@gmail.com','$2a$12$dsra1X1FdypBfKrddSxGdeFuL9Wzx0yQI7i.2/tsUaWB3IQa29B4S',NULL,'Bharuch','India',NULL,NULL,'user','2026-05-10 10:19:45');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-10 15:56:23
