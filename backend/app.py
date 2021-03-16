# encoding: utf-8
import sqlite3
from flask import Flask, jsonify, g
from flask_cors import CORS

# Configuration: Create "app" which contains the entire API
app = Flask(__name__)
# CORS allows this API code to be called from other domains,
# for example, if the website is http://www.students.edu/ and this
# API is located on http://api.students.edu/ this CORS library
# allows overcoming of Cross Origin.
CORS(app)
# Location of our SQLITE DB
DATABASE = '/Users/ellaneumann/Desktop/Ella-Tutor/backend/db/school.db'


def get_db():
    """ This is a "utility" function that will be *only*
        used by the "query_db()" method, it essentially
        sets up the database and makes it ready for a
        new HTTP request, since HTTP requests are stateless,
        this has to be executed on each request.

        Note this DB init code is part of flask's documentation
        on "best practices".
    """
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)

    def make_dicts(cursor, row):
        return dict(
            (cursor.description[idx][0], value)
            for idx, value in enumerate(row))

    db.row_factory = make_dicts
    return db


@app.teardown_appcontext
def close_connection(exception):
    """ This is another utility function made available by Flask's
        "best practices", after each HTTP requests, the connection
        to the Db must be properly closed.
    """
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def query_db(query, args=(), one=False):
    """ this is the "query" function that off of our API methods
        will call to retrieve information from the DB, also
        part of Flask's best practices when working with SQLite
    """
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def update_db(query, args=()):
    """ Use this method when updating (or deleting) records,
        it functions similar to the "query_db" method above
        but with 2 main differences:
        1 - There is no return value
        2 - I force a DB "commit" so changes are actually saved
    """
    connection = get_db()
    cursor = connection.execute(query, args)
    cursor.close()
    connection.commit()


@app.route('/')
def index():
    """ This returns when accessing the API as http://[api]/
        Just return a simple message
    """
    return jsonify({'message': 'SCHOOL API v1.0'})


@app.route('/students')
def get_students():
    """ Queries the database and retrieves all students:
        http://[api]/students
    """
    students = query_db('select * from students')
    return jsonify(students)


@app.route('/courses')
def get_courses():
    """ Queries the database and retrieves all courses:
        http://[api]/courses
    """
    courses = query_db('select * from courses order by course_time')
    return jsonify(courses)


@app.route('/students/login/<string:student_code>')
def login(student_code):
    """ Attempts to authenticate a student given a provided code

        http://[api]/students/login/STUDENTCODE
    """
    student = query_db(
        'select * from students where student_code=?', [student_code], True)

    # If the code was found, this call will return the actual student
    # record, otherwise it will return null.
    return jsonify(student)


@app.route('/students/courses/<int:student_id>')
def get_student_courses(student_id):
    """ Retrieves the courses assigned to a student

        http://[api]/students/courses/3
    """

    # Put the entire SQL query in a variable so we can visualize it better
    sql = '''
        select
        s.name as student_name,
        s.email,
        sc.id as student_course_id,
        c.course_id as course_code,
        c.id as course_id,
        c.name as course_name,
        c.course_time
        from
        students s, courses c, student_courses sc
        where
        s.id = ? and s.id = sc.student_id and c.id = sc.course_id
        order by c.course_time
    '''
    student_courses = query_db(sql, [student_id])

    # If the code was found, this call will return the actual student
    # record, otherwise it will return null.
    return jsonify(student_courses)


@app.route(
    '/students/<int:student_id>/course/<int:course_id>/add', methods=['POST'])
def add_student_to_course(student_id, course_id):
    """ Adds a student to a course, returns the new full course set back """
    sql = 'insert into student_courses (student_id, course_id) values (?, ?)'
    update_db(sql, [student_id, course_id])
    return get_student_courses(student_id)


@app.route(
    '/students/<int:student_id>/course/<int:course_id>/remove',
    methods=['POST'])
def remove_student_from_course(student_id, course_id):
    """ Adds a student to a course, returns the new full course set back """
    sql = 'delete from student_courses where student_id=? and course_id=?'
    update_db(sql, [student_id, course_id])
    return get_student_courses(student_id)


app.run(debug=True)
