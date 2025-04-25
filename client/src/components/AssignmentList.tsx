import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { fetchAssignments } from '../store/assignmentsSlice';
import { AppDispatch } from '../store';

import styles from '../styles/assignment.module.scss';

const AssignmentList: React.FC<{ studentId: number }> = ({ studentId }) => {
  const dispatch: AppDispatch = useDispatch();
  const assignments = useSelector(
    (state: RootState) => state.assignments.assignments,
  );
  const assignmentStatus = useSelector(
    (state: RootState) => state.assignments.status,
  );
  const error = useSelector((state: RootState) => state.assignments.error);

  useEffect(() => {
    if (assignmentStatus === 'idle') {
      dispatch(fetchAssignments(studentId));
    }
  }, [assignmentStatus, dispatch, studentId]);

  let content;

  if (assignmentStatus === 'loading') {
    content = <div>Loading...</div>;
  } else if (assignmentStatus === 'succeeded') {
    content = (
      <table className={styles.assignment__table}>
        <thead className={styles.assignment__thead}>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className={styles.assignment__tbody}>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.id}</td>
              <td>{assignment.title}</td>
              <td>{assignment.description}</td>
              <td>{assignment.dueDate}</td>
              <td>{assignment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else if (assignmentStatus === 'failed') {
    content = <div>{error}</div>;
  }

  return (
    <div className={styles.assignment}>
      <div className={styles.container}>
        <h1 className={styles.title}>Assignments</h1>
        {content}
      </div>
    </div>
  );
};

export default AssignmentList;
