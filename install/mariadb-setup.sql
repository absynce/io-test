#!mysql

CREATE DATABASE	iotest;
CREATE USER 'iotestuser'@'localhost' IDENTIFIED BY 'iotest';
GRANT USAGE ON *.* TO 'iotestuser'@'localhost';
GRANT ALL PRIVILEGES ON iotest.* TO iotestuser@localhost;
