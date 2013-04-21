-- drop tables
drop table if exists users;
drop table if exists follows;
drop table if exists tweets;

-- create tables
create table users (
	uid integer primary key autoincrement,
	uname varchar(255) not null,
	password varchar(255) not null,
	email varchar(255) not null,
	role varchar(255) not null
);

create table follows (
	uid int not null,
	followid int not null,
	day date not null,
	primary key (uid, followid)
);



-- add data