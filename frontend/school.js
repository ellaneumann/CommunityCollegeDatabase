var School = (() => {
    let initialize = () => {
        /* Create Events */
        $('#submit-code').on('click', handleLogin);
        $('#logout').on('click', handleLogout);
        //$('#selected-courses input[type=button]').on('click', removeCourse);
    };

    /* 
     * opts is a dictionary containing:
     * {endpoint: '', method: ''}
     * Example { endPoint: '/student/1', method: 'GET' }
    */
    let queryAPI = (opts) => {
        /* Returns the standard ajax promise object, use .then() and .fail()
         * to handle it in your calling function/method
         */
        let ajaxOpts = {};

        /* This is standard AJAX "stuff", define the object containing
         * the information to pass to the Python process..
         */
        ajaxOpts = {
            url: 'http://127.0.0.1:5000' + opts.endPoint,
            method: opts.method,
            dataType: 'json',
            beforeSend: function (jqXHR) {
                jqXHR.setRequestHeader('Content-Type', 'application/json');
            }
        };
        return $.ajax(ajaxOpts);
    };

    let handleLogin = (event) => {
        let student_code = $('#student-code').val();
        if (student_code.length > 0) {
            queryAPI({ endPoint: `/students/login/${student_code}`, method: 'GET' }).then(function (results) {
                if (results) {
                    STUDENT = { name: results.name, id: results.id };
                    $('#student-name').html(results.name);
                    $('#content').show();
                    $('#login').hide();
                    $('#success-login').show();
                    showSubscriptions();
                } else {
                    alert('Student Not Found. Please Try Again.');
                }
            }).fail(function (err) {
                alert('Error executing AJAX, is the backend server running?');
            });
        } else {
            alert('Please enter a valid student code value.')
        }
        return false;
    };

    let handleLogout = (event) => {
        STUDENT = {};
        $('#content').hide();
        $('#login').show();
        $('#success-login').hide();
    };

    let showSubscriptions = () => {
        /* Populate Subscriptions */
        $('#selected-courses').empty();
        STUDENT.courses = [];
        /* Keep tally of currently taken courses so the student does not choose the same course twice */
        queryAPI({ endPoint: `/students/courses/${STUDENT.id}`, method: 'GET' }).then((courses) => {
            if (courses) {
                courses.forEach(element => {
                    let ampmTime = prettyTime(element.course_time)
                    $('#selected-courses').append(
                        `<tr><td>${element.course_code}</td><td>${element.course_name}</td><td>${ampmTime}</td><td><input type="button" value="Remove" onclick="School.handleCourse(this)" data-action-id="remove" data-course-id="${element.course_id}"></td></tr>`);
                    STUDENT.courses.push(element.course_id);
                });
                showCourses();
            }
        }).fail((err) => {
            alert('Error executing AJAX, is the backend server running?');
        });
    };

    let showCourses = () => {
        /* Populate all courses section */
        $('#available-courses').empty();
        queryAPI({ endPoint: '/courses', method: 'GET' }).then((courses) => {
            if (courses) {
                let buttonState = '';
                courses.forEach(element => {
                    if (STUDENT.courses.indexOf(element.id) >= 0) {
                        buttonState = 'disabled';
                    } else {
                        buttonState = '';
                    }
                    let ampmTime = prettyTime(element.course_time);
                    $('#available-courses').append(
                        `<tr><td>${element.course_id}</td><td>${element.name}</td><td>${ampmTime}</td><td><input type="button" value="Add" onclick="School.handleCourse(this)" data-action-id="add" data-course-id="${element.id}" ${buttonState}></td></tr>`);
                });
            } else {
                alert('Courses Not Found. Please Try Again Later.');
            }
        }).fail((err) => {
            alert('Error executing AJAX, is the backend server running?');
        });
    };

    let handleCourse = (elem) => {
        let courseId = $(elem).data('courseId');
        let action = $(elem).data('actionId');
        queryAPI({ endPoint: `/students/${STUDENT.id}/course/${courseId}/${action}`, method: 'POST' }).then(() => {
            showSubscriptions();
        }).fail((err) => {
            alert('Error executing AJAX, is the backend server running?');
        });
    };

    let prettyTime = (minutes) => {
        let ampm = '';
        let min = Math.floor(Math.abs(minutes));
        let sec = Math.floor((Math.abs(minutes) * 60) % 60);
        if (min > 12) {
            min = min - 12;
            ampm = 'PM'
        } else {
            ampm = 'AM'
        }
        return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec + ' ' + ampm;
    };

    return {
        initialize: initialize,
        handleCourse: handleCourse,
        prettyTime: prettyTime
    };
})();