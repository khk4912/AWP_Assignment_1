// @ts-check

import { v4 as uuid } from 'uuid'
import { Student } from '../models/student.js'
import {
  createStudentRecord,
  deleteStudentRecord,
  getStudentRecordById,
  getStudentRecords,
} from '../data/studentData.js'

/**
 * @param {import('express').Request} req
 * @return {string|null}
 */
const getStudentIDFromReq = (req) => {
  const studentIDParam = req.params.studentID
  if (typeof studentIDParam === 'string') {
    return studentIDParam.trim()
  } else if (Array.isArray(studentIDParam) && studentIDParam.length > 0) {
    return studentIDParam[0].trim()
  }
  return null
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getAllStudents(req, res) {
  try {
    const students = await getStudentRecords()
    return res.status(200).json(students)
  } catch (error) {
    console.error('Failed to read students:', error)
    return res.status(500).json({ message: 'Failed to load students.' })
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getStudent(req, res) {
  try {
    const studentID = getStudentIDFromReq(req)
    if (!studentID) {
      return res.status(400).json({ message: 'Invalid student ID.' })
    }

    const student = await getStudentRecordById(studentID)

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' })
    }

    return res.status(200).json(student)
  } catch (error) {
    console.error('Failed to read student:', error)
    return res.status(500).json({ message: 'Failed to load the student.' })
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function addStudent(req, res) {
  try {
    const { name, age, gender, studentID, department } = req.body
    const parsedAge = Number(age)

    if (!name || Number.isNaN(parsedAge) || !gender || !department) {
      return res.status(400).json({
        message:
          'name, age, gender, and department are required. studentID is optional.',
      })
    }

    const resolvedStudentID = String(studentID || uuid()).trim()

    const student = new Student(
      String(name).trim(),
      parsedAge,
      String(gender).trim(),
      resolvedStudentID,
      String(department).trim(),
    )

    const createdStudent = await createStudentRecord(student)

    if (!createdStudent) {
      return res.status(409).json({ message: 'Student ID already exists.' })
    }

    return res.status(201).json({
      message: 'Student created successfully.',
      student: createdStudent,
    })
  } catch (error) {
    console.error('Failed to create student:', error)
    return res.status(500).json({ message: 'Failed to create the student.' })
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function deleteStudent(req, res) {
  try {
    const studentID = getStudentIDFromReq(req)
    if (!studentID) {
      return res.status(400).json({ message: 'Invalid student ID.' })
    }

    const deletedStudent = await deleteStudentRecord(studentID)

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found.' })
    }

    return res.status(200).json({
      message: 'Student deleted successfully.',
    })
  } catch (error) {
    console.error('Failed to delete student:', error)
    return res.status(500).json({ message: 'Failed to delete the student.' })
  }
}
