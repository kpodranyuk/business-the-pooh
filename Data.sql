#Промоушены пользователей
INSERT INTO Promotion(operationsCount, operationsToNext, percent, firstCommission, secondCommission, thirdCommission) 
VALUES(1,9,15, 15, 10, 5);

INSERT INTO Promotion(operationsCount, operationsToNext, percent, firstCommission, secondCommission, thirdCommission) 
VALUES(1,9,15, 15, 10, 5);

INSERT INTO Promotion(operationsCount, operationsToNext, percent, firstCommission, secondCommission, thirdCommission) 
VALUES(1,9,15, 15, 10, 5);

# Пользователи
INSERT INTO User(login, password, name, isAdmin, productAmount, honeyAmount,isDeactivation, idPromotion,nameUserType) 
VALUES('super_owl44', 'yasovaatinet', 'Екатерина', false, 35, 0.12, 0, 2, "Совунья");

INSERT INTO User(login, password, name, isAdmin, productAmount, honeyAmount,isDeactivation, idPromotion,nameUserType) 
VALUES('P9ltA40k', 'pyatak2828', 'Дмитрий', false, 0, 0.0375, 0, 3, "Пятачок");

INSERT INTO User(login, password, name, isAdmin, productAmount, honeyAmount,isDeactivation, idPromotion,nameUserType) 
VALUES('rraabbiitt', 'aaaaa1234', 'Евстрат', false, 5, 0.5, 0, 4, "Кролик");



# КУРС:flowersForHoneyPot = 10, balloonsForHoneyPot = 10, potForHoneyPot = 5; 
# ОПЕРАЦИИ: 'B' - покупка, 'E' - ввод, 'G' - вывод
# 		
# Krolic										
#1
INSERT INTO Operation(type, date, productAmount, honeyPots, honeyCount, comission, idProductType) 
VALUES('E', '2017-12-13 08:20:43', 45, 0, 0, 0, (select idProductType from ProductType where type='F'));
#2
INSERT INTO Operation(type, date, productAmount, honeyPots, honeyCount, comission, idProductType) 
VALUES('B', '2017-12-13 15:30:43', 40, 4, 1, 0.15, (select idProductType from ProductType where type='F'));
#3
INSERT INTO Operation(type, date, productAmount, honeyPots, honeyCount, comission, idProductType) 
VALUES('G', '2017-12-13 22:55:43', 0, 0,  0.5, 0, (select idProductType from ProductType where type='H'));

# Petya	
#4
INSERT INTO Operation(type, date, productAmount, honeyPots, honeyCount, comission, idProductType) 
VALUES('E', '2017-12-14 03:22:43', 10, 0, 0, 0, (select idProductType from ProductType where type='B'));
#5
INSERT INTO Operation(type, date, productAmount, honeyPots, honeyCount, comission, idProductType) 
VALUES('B', '2017-12-14 15:35:43', 10, 1, 0.25, 0.0375, (select idProductType from ProductType where type='B'));
#6
INSERT INTO Operation(type, date, productAmount, honeyPots, honeyCount, comission, idProductType) 
VALUES('G', '2017-12-15 13:30:43', 0, 0,  0.2125, 0, (select idProductType from ProductType where type='H'));

# Sova
#7
INSERT INTO Operation(type, date, productAmount, honeyPots, honeyCount, comission, idProductType) 
VALUES('E', '2017-12-13 22:25:00', 50, 0, 0, 0, (select idProductType from ProductType where type='B'));
#8
INSERT INTO Operation(type, date, productAmount, honeyPots, honeyCount, comission, idProductType) 
VALUES('B', '2017-12-15 6:30:43', 15, 3, 0.75, 0.1125, (select idProductType from ProductType where type='B'));
#9
INSERT INTO Operation(type, date, productAmount, honeyPots, honeyCount, comission, idProductType) 
VALUES('G', '2017-12-15 6:31:35', 0, 0,  0.63, 0, (select idProductType from ProductType where type='H'));

# КРОЛИКИ
INSERT INTO Deal(loginUser, idOperation) VALUES('rraabbiitt', 1);
INSERT INTO Deal(loginUser, idOperation) VALUES('rraabbiitt', 2);
INSERT INTO Deal(loginUser, idOperation) VALUES('rraabbiitt', 3);

# ПЯТАЧКИ
INSERT INTO Deal(loginUser, idOperation) VALUES('P9ltA40k', 4);
INSERT INTO Deal(loginUser, idOperation) VALUES('P9ltA40k', 5);
INSERT INTO Deal(loginUser, idOperation) VALUES('P9ltA40k', 6);

# СОВЫ
INSERT INTO Deal(loginUser, idOperation) VALUES('super_owl44', 7);
INSERT INTO Deal(loginUser, idOperation) VALUES('super_owl44', 8);
INSERT INTO Deal(loginUser, idOperation) VALUES('super_owl44', 9);
