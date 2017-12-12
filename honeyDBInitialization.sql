CREATE DATABASE IF NOT EXISTS honeyDB;
USE honeyDB;

DROP TABLE IF EXISTS Deal;
DROP TABLE IF EXISTS Operation;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Promotion;
DROP TABLE IF EXISTS Bees;
DROP TABLE IF EXISTS UserType;
DROP TABLE IF EXISTS ProductType;

CREATE TABLE ProductType (
  idProductType int NOT NULL auto_increment,
  type enum('F','B','P','H') NOT NULL,
  name varchar(45) NOT NULL,
  rate int NOT NULL,
  primary key (idProductType)
);

INSERT INTO ProductType(type, name, rate) 
VALUES('F', 'Цветочек', 10),('B', 'Шарик', 10),('P','Горшочек', 5),('H','Мед', 1);

CREATE TABLE UserType (
  name varchar(20) NOT NULL,
  isDeleted boolean NOT NULL,
  productType int NOT NULL,
  primary key (name),
  foreign key (productType) references ProductType(idProductType) on update cascade on delete cascade
);

INSERT INTO UserType(name, isDeleted, productType) 
VALUES('Кролик', false, 1),('Пятачок', false, 2),('Совунья', false, 3), ('Винни-Пух', false, 4);

CREATE TABLE Promotion (
  idPromotion int NOT NULL auto_increment,
  operationsCount int NOT NULL,
  operationsToNext int NOT NULL,
  percent int NOT NULL,
  primary key (idPromotion)
);

INSERT INTO Promotion(operationsCount, operationsToNext, percent) VALUES(0,10,15);

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
  isDeactivation boolean NOT NULL,
  idPromotion int NOT NULL,
  nameUserType varchar(20) NOT NULL,
  primary key (login),
  foreign key (nameUserType) references UserType(name) on update cascade on delete cascade,
  foreign key (idPromotion) references Promotion(idPromotion) on update cascade on delete cascade
);

INSERT INTO User(login, password, name, isAdmin, productAmount, honeyAmount, isDeactivation, idPromotion, nameUserType) 
VALUES('superpooh', 'honeyismylife', 'Администратор', true, 0, 0, false, 1, 'Винни-Пух');

CREATE TABLE Deal (
  idDeal int NOT NULL auto_increment,
  loginUser varchar(20) NOT NULL,
  idOperation int NOT NULL,
  primary key (idDeal),
  foreign key (idOperation) references Operation(idOperation) on update cascade on delete cascade,
  foreign key (loginUser) references User(login) on update cascade on delete cascade
);

CREATE TABLE Bees (
  id int NOT NULL,
  login varchar(20) NOT NULL,
  password varchar(32) NOT NULL,
  potsCount int NOT NULL,
  honeyInPot double NOT NULL,
  idProductType int NOT NULL,
  primary key (id),
  foreign key (idProductType) references ProductType(idProductType) on update cascade on delete cascade
);

INSERT INTO Bees(id, login, password, potsCount, honeyInPot, idProductType) 
VALUES(1, 'admin', 'admin', 50, 12.5, (select idProductType from ProductType where type='H'));
