// @ts-check

import { Person } from './person.js'

export class Student extends Person {
  /**
   * @param {string} name
   * @param {number} age
   * @param {string} gender
   * @param {string} studentID
   * @param {string} department
   */
  constructor(name, age, gender, studentID, department) {
    super(name, age, gender)
    this.studentID = studentID
    this.department = department
  }
}
