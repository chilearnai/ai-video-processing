import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchStudents } from '../../store/studentsSlice';
import { RootState, AppDispatch } from '../../store';

import styles from '../../styles/studentlist.module.scss';

// interface StudentListProps {
//   teacherId?: number;
// }

// const StudentList: React.FC<StudentListProps> = ({ teacherId }) => {
//   const dispatch: AppDispatch = useDispatch();
//   const students = useSelector((state: RootState) => state.students.students);
//   const studentStatus = useSelector((state: RootState) => state.students.status);
//   const error = useSelector((state: RootState) => state.students.error);

//   useEffect(() => {
//     if (teacherId) {
//         dispatch(fetchStudents(teacherId));
//     }
// }, []);

//   useEffect(() => {
//     console.log('Fetching students for teacher ID:', teacherId);
//     if (studentStatus === 'idle' && teacherId) {
//       dispatch(fetchStudents(teacherId));
//     }
//   }, [studentStatus, dispatch, teacherId]);

//   let content;

//   if (studentStatus === 'loading') {
//     content = <div>Loading...</div>;
//   } else if (studentStatus === 'succeeded') {
//     content = (
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Student Name</th>
//             <th>Class Name</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student.id}>
//               <td>{student.id}</td>
//               <td>{student.name}</td>
//               <td>{student.className}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   } else if (studentStatus === 'failed') {
//     content = <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h1>Students</h1>
//       {content}
//     </div>
//   );
// };

interface StudentIdProps {
  studentId: (id: number) => void;
}

const StudentList: React.FC<StudentIdProps> = ({ studentId }) => {
  const dispatch: AppDispatch = useDispatch();
  const students = useSelector((state: RootState) => state.students.students);
  const studentStatus = useSelector(
    (state: RootState) => state.students.status,
  );
  const error = useSelector((state: RootState) => state.students.error);

  useEffect(() => {
    if (studentStatus === 'idle') {
      dispatch(fetchStudents());
    }
  }, [studentStatus, dispatch]);

  let content;

  if (studentStatus === 'loading') {
    content = (
      <div className={styles['load-container']}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  } else if (studentStatus === 'succeeded') {
    content = (
      <div className={styles.container}>
        <h1 className={styles.title}>Students</h1>
        <table className={styles.studentlist__table}>
          <thead className={styles.studentlist__thead}>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Class Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.studentlist__tbody}>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.className}</td>
                <td>
                  <Link to={'/assignment'}>
                    <button
                      className={styles.btn__works}
                      onClick={() => {
                        studentId(student.id);
                      }}
                    >
                      works
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (studentStatus === 'failed') {
    content = <div>{error}</div>;
  }

  return <div className={styles.studentsList}>{content}</div>;
};

export default StudentList;
