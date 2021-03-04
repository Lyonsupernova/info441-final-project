create table if not exists Users (
    UserID int not null auto_increment primary key,
    UserName nvarchar(255) not null unique,
    FirstName nvarchar(255) not null,
    LastName nvarchar(255) not null,
    Email nvarchar(255) not null unique, 
    PassHash binary(60) not null, 
    Phone nvarchar(255) not null, unique
);


create table if not exists LogInfo (
    ID int not null auto_increment primary key,
    UserID int not null,
    LogTime DateTime not null,
    IpAddress varchar(255) not null
);