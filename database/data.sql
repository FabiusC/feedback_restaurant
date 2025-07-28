-- Employee 1
insert into employee (
   name,
   email,
   isactive
) values ( 'Alexander Roger Turriago',
           'aturriago@restaurant.com',
           true );

-- Employee 2
insert into employee (
   name,
   email,
   isactive
) values ( 'Leonardo Luis Torres',
           'ltorres@restaurant.com',
           true );

-- Employee 3
insert into employee (
   name,
   email,
   isactive
) values ( 'Joel Erick Barajas',
           'jbarajas@restaurant.com',
           true );

-- Employee 4
insert into employee (
   name,
   email,
   isactive
) values ( 'Oswaldo Juan Montoya',
           'omontoya@restaurant.com',
           true );

insert into review (
   idemployee,
   ratespeedservice,
   ratesatisfactionfood,
   rateemployee,
   comment,
   ispublic
) values ( 1,
           4,
           5,
           5,
           'The chef prepared an exceptional meal!',
           true ),( 2,
                    5,
                    4,
                    5,
                    'Very attentive service throughout dinner',
                    true ),( 3,
                             4,
                             4,
                             4,
                             'Creative cocktails with perfect balance',
                             false ),( 4,
                                       5,
                                       5,
                                       5,
                                       'The manager ensured everything was perfect',
                                       true );