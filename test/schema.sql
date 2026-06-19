drop table movies;

create table movies (
id integer primary key autoincrement,
title varchar(255),
review varchar(1024),
rating int,
poster varchar(1024)
);

select * from movies;
