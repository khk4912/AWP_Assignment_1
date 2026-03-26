// @ts-check
async function getAllStudents() {
    const response = await fetch('/api/students')
    if (!response.ok) {
        throw new Error('Failed to fetch students')
    }

    return await response.json()
}

/**
 * @param {string} studentID 
 * @returns {Promise<import('../../models/student.js').Student>}
 */
async function getStudent(studentID) {
    const response = await fetch(`/api/students/${studentID}`)
    if (!response.ok) {
        throw new Error('Failed to fetch the student')
    }

    return await response.json()
}

/**
 * @param {import('../../models/student.js').Student} student
 * @returns {Promise<import('../../models/student.js').Student>}
 */ 
async function createStudent(student) {
    const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
    })

    if (!response.ok) {
        throw new Error('Failed to create the student')
    }

    return await response.json()
}           


/**
 * @param {string} studentID 
 */
async function deleteStudent(studentID) {
    const response = await fetch(`/api/students/${studentID}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Failed to delete the student')
    }
}