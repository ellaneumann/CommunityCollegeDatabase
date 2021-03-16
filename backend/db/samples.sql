-- Retrieves All Students
select * from students
-- Retrieves All Courses
select * from courses
-- Retrieves courses information assigned to student #3 (Ella)
select
  s.name as student_name,
  s.email,
  sc.id as student_course_id,
  c.course_id,
  c.name as course_name,
  c.course_time
from
  students s, courses c, student_courses sc
where
  s.id = 3 and s.id = sc.student_id and c.id = sc.course_id
order by c.course_time