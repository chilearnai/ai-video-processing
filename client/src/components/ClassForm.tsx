import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';
import { addClass, updateClass } from '../store/classesSlice';

import styles from '../styles/classform.module.scss';

interface ClassFormProps {
  classToEdit?: {
    id: number;
    name: string;
    studentCount: number;
    teachers: { id: number; name: string }[];
  };
}

const ClassForm: React.FC<ClassFormProps> = ({ classToEdit }) => {
  const [name, setName] = useState(classToEdit ? classToEdit.name : '');
  const [studentCount, setStudentCount] = useState(
    classToEdit ? classToEdit.studentCount : 0,
  );
  const [teachers, setTeachers] = useState(
    classToEdit ? classToEdit.teachers : [{ id: 0, name: '' }],
  );

  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass = {
      id: classToEdit ? classToEdit.id : Math.random(),
      name,
      studentCount,
      teachers,
    };
    if (classToEdit) {
      dispatch(updateClass(newClass));
      // alert("Данные класса успешно перезаписаны");\*
    } else {
      dispatch(addClass(newClass));
      // alert("Данные класса успешно записаны");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Adding a class</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label>Class Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Student Count:</label>
          <input
            type="number"
            value={studentCount}
            onChange={(e) => setStudentCount(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Teachers:</label>
          {teachers.map((teacher, index) => (
            <div key={index} className={styles.teacher__item}>
              <input
                type="text"
                value={teacher.name}
                onChange={(e) => {
                  const newTeachers = [...teachers];
                  newTeachers[index].name = e.target.value;
                  setTeachers(newTeachers);
                }}
                required
              />
              <button
                className={styles.btn__remove}
                type="button"
                onClick={() => {
                  setTeachers(teachers.filter((_, i) => i !== index));
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className={styles.btn__add}
            type="button"
            onClick={() => {
              setTeachers([...teachers, { id: Math.random(), name: '' }]);
            }}
          >
            Add Teacher
          </button>
        </div>
        <button type="submit" className={styles.btn__save}>
          Save
        </button>
      </form>
    </div>
  );
};

export default ClassForm;
