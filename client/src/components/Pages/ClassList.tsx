import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from '../../store';
import { fetchClasses, deleteClass } from '../../store/classesSlice';
import { AppDispatch } from '../../store';

import styles from "../../styles/classlist.module.scss";

export interface ClassObject {
  id: number;
  name: string;
  studentCount: number;
  teachers: { id: number; name: string }[];
}

interface ClassListProps {
  onObject: (newObject: ClassObject) => void;
}

const ClassList: React.FC<ClassListProps> = ({onObject}) => {
  const dispatch: AppDispatch = useDispatch();
  const classes = useSelector((state: RootState) => state.classes.classes);
  const classStatus = useSelector((state: RootState) => state.classes.status);
  const error = useSelector((state: RootState) => state.classes.error);

  // const handleChangeId = (event: number) => {
  //   onChange(event);
  // }

  useEffect(() => {
    if (classStatus === 'idle') {
      dispatch(fetchClasses());
    }
  }, [classStatus, dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      dispatch(deleteClass(id));
    }
  };

  let content;

  if (classStatus === 'loading') {
    content = <div>Loading...</div>;
  } else if (classStatus === 'succeeded') {
    // console.log(classes)
    content = (
      <table className={styles.classlist__table}>
        <thead className={styles.classlist__thead}>
          <tr>
            <th>ID</th>
            <th>Class Name</th>
            <th>Student Count</th>
            <th>Teachers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.classlist__tbody}>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.id}</td>
              <td>{cls.name}</td>
              <td>{cls.studentCount}</td>
              <td>{cls.teachers.map((teacher) => teacher.name).join(', ')}</td>
              <td>
                <Link to="">
                  <button className={`${styles.classlist__btn} ${styles.classlist__view}`} onClick={() => {return}}>View</button>
                </Link>
                <Link to={"/edit/form"}>
                  <button className={`${styles.classlist__btn} ${styles.classlist__edit}`} onClick={() => {onObject(cls)}}>Edit</button>
                </Link>
                <button className={`${styles.classlist__btn} ${styles.classlist__delete}`} onClick={() => handleDelete(cls.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else if (classStatus === 'failed') {
    content = <div>{error}</div>;
  }

  return (
    <div className={styles.classlist}>
      <div className={styles.container}>
        <h1 className={styles.title}>Classes</h1>
        {content}
        <Link to="/class/form"><button className={`${styles.classlist__btn} ${styles.addForm}`}>Add class +</button></Link>
        <Link to="/classes/students"><button className={`${styles.classlist__btn} ${styles.allStudents}`}>All students</button></Link>
      </div>
    </div>
  );
};

export default ClassList;
