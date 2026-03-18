// @ts-check

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataFilePath = path.join(__dirname, 'students.json')

async function ensureDataFile() {
  await fs.mkdir(__dirname, { recursive: true })

  try {
    await fs.access(dataFilePath)
  } catch {
    await fs.writeFile(dataFilePath, '[]', 'utf8')
  }
}

/**
 * @returns {Promise<Array<import('../models/student.js').Student>>}
 */
export async function getStudentRecords() {
  await ensureDataFile()
  const fileContents = await fs.readFile(dataFilePath, 'utf8')
  return fileContents.trim() ? JSON.parse(fileContents) : []
}

/**
 * @param {string} studentID
 * @return {Promise<import('../models/student.js').Student|null>}
 */
export async function getStudentRecordById(studentID) {
  const students = await getStudentRecords()
  return students.find((student) => student.studentID === studentID) ?? null
}

/**
 * @param {import('../models/student.js').Student} student
 * @return {Promise<import('../models/student.js').Student|null>}
 */
export async function createStudentRecord(student) {
  const students = await getStudentRecords()
  const exists = students.some(
    (storedStudent) => storedStudent.studentID === student.studentID,
  )

  if (exists) {
    return null
  }

  students.push(student)

  await fs.writeFile(dataFilePath, JSON.stringify(students, null, 2), 'utf8')
  return student
}

/**
 * @param {string} studentID
 * @return {Promise<boolean>}
 */
export async function deleteStudentRecord(studentID) {
  const students = await getStudentRecords()
  const index = students.findIndex((student) => student.studentID === studentID)

  if (index === -1) {
    return false
  }

  students.splice(index, 1)
  await fs.writeFile(dataFilePath, JSON.stringify(students, null, 2), 'utf8')

  return true
}
