-- Sample Employees Data
-- Insert sample employees for testing

insert into employee (
   name,
   email,
   isactive
) values ( 'John Smith',
           'john.smith@restaurant.com',
           true ),( 'Maria Garcia',
                    'maria.garcia@restaurant.com',
                    true ),( 'David Johnson',
                             'david.johnson@restaurant.com',
                             true ),( 'Sarah Wilson',
                                      'sarah.wilson@restaurant.com',
                                      true ),( 'Michael Brown',
                                               'michael.brown@restaurant.com',
                                               true ),( 'Lisa Davis',
                                                        'lisa.davis@restaurant.com',
                                                        true ),( 'Robert Miller',
                                                                 'robert.miller@restaurant.com',
                                                                 true ),( 'Jennifer Taylor',
                                                                          'jennifer.taylor@restaurant.com',
                                                                          true );

-- Verify the insertions
select *
  from employee
 where isactive = true
 order by name;