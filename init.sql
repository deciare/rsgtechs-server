-- Destroy and recreate the database from scratch
DROP TABLE IF EXISTS technician_region;
DROP TABLE IF EXISTS technician;
DROP TABLE IF EXISTS depot_region;
DROP TABLE IF EXISTS depot;
DROP TABLE IF EXISTS site;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS city_region;
DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS province;
DROP TABLE IF EXISTS country;
DROP TABLE IF EXISTS region;

CREATE TABLE customer (
	id			INTEGER AUTO_INCREMENT PRIMARY KEY,
	name		VARCHAR(128) NOT NULL,
	email		VARCHAR(128),
	phone		VARCHAR(32)
) Engine = InnoDB;

CREATE TABLE region (
	id			INTEGER AUTO_INCREMENT PRIMARY KEY,
	name		VARCHAR(128) NOT NULL
) Engine = InnoDB;

CREATE TABLE country (
	id			INTEGER PRIMARY KEY,
	name		VARCHAR(128) NOT NULL
) Engine = InnoDB;

CREATE TABLE province (
	id			INTEGER PRIMARY KEY,
	name		VARCHAR(128) NOT NULL,
	country_id	INTEGER NOT NULL,
	CONSTRAINT fk_province_country
		FOREIGN KEY (country_id) REFERENCES country (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) Engine = InnoDB;

CREATE TABLE city (
	id			INTEGER AUTO_INCREMENT PRIMARY KEY,
	name		VARCHAR(128) NOT NULL,
	province_id	INTEGER,
	country_id	INTEGER NOT NULL,
	CONSTRAINT `fk_city_country`
		FOREIGN KEY (country_id) REFERENCES country (id)
		ON DELETE RESTRICT
		ON UPDATE CASCADE
) Engine = InnoDB;

CREATE TABLE city_region (
	city_id		INTEGER NOT NULL,
	region_id	INTEGER NOT NULL,
	CONSTRAINT fk_city_region_city
		FOREIGN KEY (city_id) REFERENCES city (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_city_region_region
		FOREIGN KEY (region_id) REFERENCES region (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) Engine = InnoDB;

CREATE TABLE depot (
	id			INTEGER PRIMARY KEY,
	name		VARCHAR(128) NOT NULL,
	address		VARCHAR(255) NOT NULL,
	city_id		INTEGER NOT NULL,
	province_id	INTEGER,
	country_id	INTEGER NOT NULL,
	postal_code	VARCHAR(16),
	fallback_country_id	INTEGER,
	CONSTRAINT fk_depot_city
		FOREIGN KEY (city_id) REFERENCES city (id)
		ON DELETE RESTRICT
		ON UPDATE CASCADE,
	CONSTRAINT fk_depot_country
		FOREIGN KEY (country_id) REFERENCES country (id)
		ON DELETE RESTRICT
		ON UPDATE CASCADE
) Engine = InnoDB;

CREATE TABLE depot_region (
	depot_id	INTEGER NOT NULL,
	region_id	INTEGER NOT NULL,
	CONSTRAINT fk_depot_region_depot
		FOREIGN KEY (depot_id) REFERENCES depot (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_depot_region_region
		FOREIGN KEY (region_id) REFERENCES region (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) Engine = InnoDB;

CREATE TABLE technician (
	id			INTEGER PRIMARY KEY,
	name		VARCHAR(128) NOT NULL,
	email		VARCHAR(128),
	phone		VARCHAR(32)
) Engine = InnoDB;

CREATE TABLE technician_region (
	technician_id	INTEGER NOT NULL,
	region_id		INTEGER NOT NULL,
	CONSTRAINT fk_technician_region_technician
		FOREIGN KEY (technician_id) REFERENCES technician (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_technician_region_region
		FOREIGN KEY (region_id) REFERENCES region (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) Engine = InnoDB;

CREATE TABLE site (
	id			INTEGER PRIMARY KEY,
	name		VARCHAR(128) NOT NULL,
	customer_id	INTEGER NOT NULL,
	address		VARCHAR(255) NOT NULL,
	city_id		INTEGER NOT NULL,
	province_id	INTEGER,
	country_id	INTEGER NOT NULL,
	postal_code	VARCHAR(16),
	region_id	INTEGER,
	CONSTRAINT fk_site_city
		FOREIGN KEY (city_id) REFERENCES city (id)
		ON DELETE RESTRICT
		ON UPDATE CASCADE,
	CONSTRAINT fk_site_customer
		FOREIGN KEY (customer_id) REFERENCES customer (id)
		ON DELETE RESTRICT
		ON UPDATE CASCADE,
	CONSTRAINT fk_site_country
		FOREIGN KEY (country_id) REFERENCES country (id)
		ON DELETE RESTRICT
		ON UPDATE CASCADE
) Engine = InnoDB;