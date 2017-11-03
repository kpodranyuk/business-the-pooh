CREATE DATABASE IF NOT EXISTS honeyDB;
USE honeyDB;

DROP TABLE IF EXISTS Deal;
DROP TABLE IF EXISTS Operation;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Promotion;
DROP TABLE IF EXISTS Bees;
DROP TABLE IF EXISTS ExchangeRate;
DROP TABLE IF EXISTS ProductType;

CREATE TABLE ProductType (
  idProductType int NOT NULL auto_increment,
  type enum('F','B','P','H') NOT NULL,
  primary key (idProductType)
);

INSERT INTO ProductType(type) VALUES('F'),('B'),('P'),('H');

CREATE TABLE Promotion (
  idPromotion int NOT NULL auto_increment,
  operationsCount int NOT NULL,
  operationsToNext int NOT NULL,
  percent double NOT NULL,
  primary key (idPromotion)
);

INSERT INTO Promotion(operationsCount, operationsToNext, percent) VALUES(0,10,15);

CREATE TABLE ExchangeRate (
  idExchangeRate int NOT NULL auto_increment,
  flowersForHoneyPot int NOT NULL,
  balloonsForHoneyPot int NOT NULL,
  potForHoneyPot int NOT NULL,
  primary key (idExchangeRate)
);
INSERT INTO ExchangeRate(flowersForHoneyPot,balloonsForHoneyPot,potForHoneyPot) VALUES(10,10,5); 

CREATE TABLE Operation (
  idOperation int NOT NULL auto_increment,
  type enum('B','E','G') NOT NULL,
  date datetime NOT NULL,
  productAmount int NOT NULL,
  honeyPots int NOT NULL, 
  honeyCount double NOT NULL,
  comission double NOT NULL,
  idProductType int NOT NULL,
  primary key (idOperation),
  foreign key (idProductType) references ProductType(idProductType) on update cascade on delete cascade
);

CREATE TABLE User (
  login varchar(20) NOT NULL,
  password varchar(32) NOT NULL,
  name varchar(40) NOT NULL,
  isAdmin boolean NOT NULL,
  productAmount int NOT NULL,
  honeyAmount double NOT NULL,
  idProductType int NOT NULL,
  idPromotion int NOT NULL,
  primary key (login),
  foreign key (idProductType) references ProductType(idProductType) on update cascade on delete cascade,
  foreign key (idPromotion) references Promotion(idPromotion) on update cascade on delete cascade
);

INSERT INTO User(login, password, name, isAdmin, productAmount, honeyAmount, idProductType, idPromotion) 
VALUES('superpooh', 'honeyismylife', 'Администратор', true, 0, 0, (select idProductType from ProductType where type='H'), 1);

CREATE TABLE Deal (
  idDeal int NOT NULL auto_increment,
  loginUser varchar(20) NOT NULL,
  idOperation int NOT NULL,
  primary key (idDeal),
  foreign key (idOperation) references Operation(idOperation) on update cascade on delete cascade,
  foreign key (loginUser) references User(login) on update cascade on delete cascade
);

CREATE TABLE Bees (
  potsCount int NOT NULL,
  honeyInPot double NOT NULL,
  idExchangeRate int NOT NULL,
  idProductType int NOT NULL,
  foreign key (idExchangeRate) references ExchangeRate(idExchangeRate) on update cascade on delete cascade,
  foreign key (idProductType) references ProductType(idProductType) on update cascade on delete cascade
);