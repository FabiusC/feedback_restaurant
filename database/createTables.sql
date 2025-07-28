create table employee (
   idemployee serial primary key,
   name       varchar(35) not null,
   email      varchar2(255) check ( regexp_like ( email,
                                             '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$' ) ),
   isactive   boolean default true,
   createdat  timestamp with time zone default current_timestamp
);

create table review (
   idreview             serial primary key,
   idemployee           int
      references employee ( idemployee )
         on delete set null,
   date                 timestamp with time zone default current_timestamp,
   ratespeedservice     smallint not null check ( ratespeedservice between 1 and 5 ),
   ratesatisfactionfood smallint not null check ( ratesatisfactionfood between 1 and 5 ),
   rateemployee         smallint check ( rateemployee between 1 and 5 ),
   comment              varchar(500),
   ispublic             boolean default false,
   constraint chk_employee_rating
      check ( ( rateemployee is null
         and idemployee is null )
          or ( rateemployee is not null
         and idemployee is not null ) )
);

-- Explicit foreign key
alter table review
   add constraint fk_employee
      foreign key ( idemployee )
         references employee ( idemployee )
            on delete set null;

-- Indexes for faster queries
create index idx_review_employee on
   review (
      idemployee
   );
create index idx_review_date on
   review (
      date
   );
create index idx_review_public on
   review (
      ispublic
   );