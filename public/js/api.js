// @ts-check

const addStudentForm = document.querySelector('#add-student-form')
const findStudentForm = document.querySelector('#find-student-form')
const refreshButton = document.querySelector('#refresh-button')
const studentList = document.querySelector('#student-list')
const studentResult = document.querySelector('#student-result')
const message = document.querySelector('#message-log')



async function getAllStudents() {
  const response = await fetch('/api/students')
  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch students')
  }

  return data
}

/**
 * @param {string} studentID
 */
async function getStudent(studentID) {
  const response = await fetch(`/api/students/${encodeURIComponent(studentID)}`)
  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch the student')
  }

  return data
}

/**
 * @param {{
 *   name: string
 *   age: string
 *   gender: string
 *   studentID: string
 *   department: string
 * }} student
 */
async function createStudent(student) {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  })
  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to create the student')
  }

  return data
}

/**
 * @param {string} studentID
 */
async function deleteStudent(studentID) {
  const response = await fetch(`/api/students/${encodeURIComponent(studentID)}`, {
    method: 'DELETE',
  })
  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to delete the student')
  }

  return data
}

/**
 * @param {Response} response
 */
async function readResponse(response) {
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

/**
 * Edit the message displayed to the user
 * 
 * @param {string} text
 */
function addMessage(text) {
  if (message) {
    message.textContent += `${text}\n`
  }
}

/**
 * @param {{
 *   name: string
 *   age: number
 *   gender: string
 *   studentID: string
 *   department: string
 * }} student
 */
function formatStudent(student) {
  return `${student.name} | ${student.studentID} | ${student.department} |  ${student.age} | ${student.gender}`
}

/**
 * @param {string} studentID
 */
async function handleDeleteStudent(studentID) {
  try {
    const result = await deleteStudent(studentID)
    addMessage(result?.message || 'Student deleted successfully.')

    if (studentResult) {
      studentResult.textContent = 'No student selected.'
    }

    await renderStudentList()
  } catch (error) {
    addMessage(
      error instanceof Error ? error.message : 'Failed to delete the student',
    )
  }
}

async function renderStudentList() {
  if (!studentList) {
    return
  }

  try {
    const students = await getAllStudents()
    studentList.innerHTML = ''

    if (!students.length) {
      const item = document.createElement('li')
      item.textContent = 'No students found.'
      studentList.append(item)
      return
    }

    for (const student of students) {
      const item = document.createElement('li')
      const text = document.createElement('span')
      const button = document.createElement('button')

      text.textContent = formatStudent(student)

      // delete
      button.type = 'button'
      button.textContent = 'Delete'
      button.addEventListener('click', () => handleDeleteStudent(student.studentID))

      item.append(text, document.createTextNode(' '), button)
      studentList.append(item)
    }
  } catch (error) {
    addMessage(error instanceof Error ? error.message : 'Failed to load students')
  }
}

/**
 * @param {SubmitEvent} event
 */
async function handleAddStudentSubmit(event) {
  event.preventDefault()

  if (!addStudentForm || !(addStudentForm instanceof HTMLFormElement)) {
    return
  }



  const formData = new FormData(addStudentForm)
  const payload = {
    name: String(formData.get('name') || '').trim(),
    age: String(formData.get('age') || '').trim(),
    gender: String(formData.get('gender') || '').trim(),
    studentID: String(formData.get('studentID') || '').trim(),
    department: String(formData.get('department') || '').trim(),
  }

  try {
    const result = await createStudent(payload)
    addMessage(result?.message || 'Student created successfully.')
    addStudentForm.reset()
    await renderStudentList()
  } catch (error) {
    addMessage(error instanceof Error ? error.message : 'Failed to add student')
  }
}

/**
 * @param {SubmitEvent} event
 */
async function handleFindStudentSubmit(event) {
  event.preventDefault()

  if (!findStudentForm || !(findStudentForm instanceof HTMLFormElement)) {
    return
  }

  const formData = new FormData(findStudentForm)
  const studentID = String(formData.get('studentID') || '').trim()

  try {
    const student = await getStudent(studentID)

    if (studentResult) {
      studentResult.textContent = formatStudent(student)
    }

    addMessage('Student loaded successfully.')
  } catch (error) {
    if (studentResult) {
      studentResult.textContent =
        error instanceof Error ? error.message : 'Student not found.'
    }

    addMessage(error instanceof Error ? error.message : 'Student not found.')
  }
}

async function handleRefreshClick() {
  addMessage('')
  await renderStudentList()
}

if (addStudentForm && addStudentForm instanceof HTMLFormElement) {
  addStudentForm.addEventListener('submit', handleAddStudentSubmit)
}

if (findStudentForm && findStudentForm instanceof HTMLFormElement) {
  findStudentForm.addEventListener('submit', handleFindStudentSubmit)
}

if (refreshButton && refreshButton instanceof HTMLButtonElement) {
  refreshButton.addEventListener('click', handleRefreshClick)
}

renderStudentList()
