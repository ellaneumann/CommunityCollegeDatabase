# CommunityCollegeDatabase
The following is an online tool for community college student course registration. The database contains 3 tables: students, courses, and student_courses (links the student IDs to the course IDs based on the courses students are taking). There is an API, app.py, that connects our database to the index.html file for the front end of the online registration tool.

NOTE: At this time, no unit tests have been created due to the time scope of this project

How to run the program:
1) Clone repo and navigate to the folder in your terminal
2) In app.py in the backend folder, change the file path on line 14 to configure to your computer
DATABASE = 'whereverLocated/CommunityCollegeDatabase/backend/db/college.db'
3) cd into CommunityCollegeDatabase/backend and create a virtual environment and activate the virtual environment
4) In the virtual environment, pip install flask and flask_cors
5) Move the index.html file into your browser
6) Use a student_code to log into a student account
Choose from the following student codes or create your own in the college database college.db:
    - RACHELLEE (cooresponds to student Rachel Lee, ID: 2, email: leer@college.edu)
    - ELLANEUMANN (cooresponds to student Ella Neumann, ID: 3, email: neumanne@college.edu)
    - JILLHAZE (cooresponds to student Jill Hazel, ID: 4, email: hazej@college.edu)
    - SOPHIAGILBERT (cooresponds to student Sophia Gilbert, ID: 5, email: gilberts@college.edu)
    - MAXHART (cooresponds to student Max Hart, ID: 6, email: hartm@college.ewu)
7) You have now logged into an account. Add or drop classes and logout when you have completed the course changes

