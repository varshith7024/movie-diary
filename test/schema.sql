drop table movies;

create table movies (
id integer primary key autoincrement,
title varchar(255),
review varchar(1024),
rating int,
poster varchar(1024)
);

insert into movies(title, review, poster, rating) values ("Fallen Angels", "like the vibes, i guess you have to know it to appreciate it", "https://theposterdb.com/api/assets/508627", 3.5);
insert into movies(title, review, poster, rating) values ("In The Mood For Love", "extremely slow cool tho", "https://theposterdb.com/api/assets/67467", 3);
insert into movies(title, review, poster, rating) values ("Shutter Island", "incredible thriller, my standard for thrillers", "https://theposterdb.com/api/assets/47513", 4.5);
insert into movies(title, review, poster, rating) values ("GoodFellas", "not bored for a single second, favourite movie of all time", "https://theposterdb.com/api/assets/54268", 5);
insert into movies(title, review, poster, rating) values ("Batman (2024)", "incredible opening and batman is cool as fuck all the way through", "https://theposterdb.com/api/assets/185105", 4);
insert into movies(title, review, poster, rating) values ("Tenet", "interesting confusing like the travis scott song", "https://theposterdb.com/api/assets/92785", 3.5);
insert into movies(title, review, poster, rating) values ("The Wolf Of Wall Street", "movie that made me like movies", "https://theposterdb.com/api/assets/24534", 5);
insert into movies(title, review, poster, rating) values ("Sinners", "great movie very interesting and florence pugh is hot", "https://theposterdb.com/api/assets/584649", 4);
insert into movies(title, review, poster, rating) values ("The Darjeeling Limited", "liked it", "https://theposterdb.com/api/assets/10865", 3.5);
insert into movies(title, review, poster, rating) values ("Se7en", "brad pitt was really good in this, also loved the idea", "https://theposterdb.com/api/assets/66490", 4);

select * from movies;