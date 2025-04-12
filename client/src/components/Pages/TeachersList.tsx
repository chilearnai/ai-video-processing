import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';


import { RootState, AppDispatch } from '../../store';
import { fetchStudents } from '../../store/studentsSlice';
import { host } from '../../config';

import styles from "../../styles/teacherlist.module.scss";

interface StudentListProps {
  teacherId?: number;
}

const StudentList: React.FC<StudentListProps> = ({ teacherId }) => {
  const dispatch: AppDispatch = useDispatch();
  const students = useSelector((state: RootState) => state.students.students);
  const studentStatus = useSelector((state: RootState) => state.students.status);
  const error = useSelector((state: RootState) => state.students.error);

  useEffect(() => {
    if (teacherId) {
      dispatch(fetchStudents(teacherId));
    }
  }, [dispatch, teacherId]);

  let content;

  if (studentStatus === 'loading') {
    content = (
    <div className={styles['load-container']}>
      <div className={styles.loading}>Loading...</div>
    </div>
    );
    } else if (studentStatus === 'succeeded') {
    content = (
      <table className={styles.teacherlist__table}>
        <thead className={styles.teacherlist__thead}>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Class Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.teacherlist__tbody}>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.className}</td>
              <td>
                <button>Works</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else if (studentStatus === 'failed') {
    content = <div>{error}</div>;
  }

  return (
    <div>
      {content}
    </div>
  );
};


export const TeachersList: React.FC = () => {
  const [teachers, setTeachers] = useState<{ teacherId: number, teacherName: string }[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  useEffect(() => {
    axios.get(`${host}/api/teachers`)
      .then(response => {
        const teachersData = response.data;
        setTeachers(teachersData);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  }, []);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    setSelectedTeacherId(selectedId);
  };

  return (
    <div className="teachersList">
      <div className={styles.container}>
        <select onChange={handleSelect} value={selectedTeacherId || ''}>
          <option disabled value="">Select a teacher</option>
          {teachers.map(teacher => (
            <option key={teacher.teacherId} value={teacher.teacherId}>{teacher.teacherName}</option>
            ))}
        </select>
        <h1 className={styles.title}>Teacher's students</h1>
        {selectedTeacherId !== null && <StudentList teacherId={selectedTeacherId} />}
      </div>

      </div>
  );
};


