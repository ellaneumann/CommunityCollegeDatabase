# CommunityCollegeDatabase
The following is an online tool for community college student course registration. The database contains 3 tables: students, courses, and student_courses (links the student IDs to the course IDs based on the courses students are taking). There is an API, app.py, that connects our database to the index.html file for the front end of the online registration tool.

NOTE: At this time, no unit tests have been created due to the time scope of this project

How to run the program:
1) Clone repo and navigate to the folder in your terminal
2) In app.py in the backend folder, change the file path on line 15 to configure to your computer
DATABASE = 'whereverLocated/CommunityCollegeDatabase/backend/db/college.db'
3) cd into CommunityCollegeDatabase/backend and create a virtual environment and activate the virtual environment
4) In the virtual environment, pip install flask and flask_cors
5) While in the backend folder and running your virtual environment, type into your terminal python app.py. Keep app.py running while using the student registration system. If you run into any problems running app.py, take a look at requirements.txt in the backend folder.
6) Move the index.html file from the frontend folder into your browser
7) Use a student_code to log into a student account. 
Choose from the following student codes or create your own in the college database college.db:
    - RACHELLEE (cooresponds to student Rachel Lee, ID: 2, email: leer@college.edu)
    - JESSEMILES (cooresponds to student Jesse Miles, ID: 3, email: milesj@college.edu)
    - JILLHAZE (cooresponds to student Jill Hazel, ID: 4, email: hazej@college.edu)
    - SOPHIAGILBERT (cooresponds to student Sophia Gilbert, ID: 5, email: gilberts@college.edu)
    - MAXHART (cooresponds to student Max Hart, ID: 6, email: hartm@college.ewu)
8) You have now logged into an account. Add or drop classes and logout when you have completed the course changes

