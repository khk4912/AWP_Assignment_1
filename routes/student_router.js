// @ts-check

import express from 'express'
import {
  addStudent,
  deleteStudent,
  getStudent,
  getAllStudents,
} from '../controllers/student_controller.js'

const router = express.Router()

router.route('/').get(getAllStudents).post(addStudent)
router.route('/:studentID').get(getStudent).delete(deleteStudent)

export default router
