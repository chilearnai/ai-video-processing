import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/TaskPage.module.scss';

interface Task {
  id: number;
  difficulty: string;
  testType: string;
  part: string;
  status: string;
}

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Загрузка задач при монтировании компонента
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/reading-adapted-tests');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const createTask = async (type: string) => {
    try {
      const newTask = {
        difficulty: 'hard',
        testType: 'academic',
        part: 'partOne'
      };
      await axios.post(`http://localhost:3000/${type}/create`, newTask);
      fetchTasks(); // Обновление списка задач
    } catch (error) {
      console.error(`Failed to create ${type} task:`, error);
    }
  };

  const handleFilterChange = (type: string) => {
    setFilter(type);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter !== 'All' && task.testType !== filter) return false;
    if (statusFilter !== 'All' && task.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className={styles.taskPage}>
      <h1>Task Management</h1>

      {/* Фильтры */}
      <div className={styles.filters}>
        <div className={styles.chips}>
          <span onClick={() => handleFilterChange('All')} className={filter === 'All' ? styles.activeChip : ''}>All</span>
          <span onClick={() => handleFilterChange('reading')} className={filter === 'reading' ? styles.activeChip : ''}>Reading</span>
          <span onClick={() => handleFilterChange('speaking')} className={filter === 'speaking' ? styles.activeChip : ''}>Speaking</span>
          <span onClick={() => handleFilterChange('writing')} className={filter === 'writing' ? styles.activeChip : ''}>Writing</span>
          <span onClick={() => handleFilterChange('listening')} className={filter === 'listening' ? styles.activeChip : ''}>Listening</span>
        </div>

        <div className={styles.statusChips}>
          <span onClick={() => handleStatusFilterChange('All')} className={statusFilter === 'All' ? styles.activeChip : ''}>All</span>
          <span onClick={() => handleStatusFilterChange('Paid')} className={statusFilter === 'Paid' ? styles.activeChip : ''}>Paid</span>
          <span onClick={() => handleStatusFilterChange('Due')} className={statusFilter === 'Due' ? styles.activeChip : ''}>Due</span>
          <span onClick={() => handleStatusFilterChange('Not Paid')} className={statusFilter === 'Not Paid' ? styles.activeChip : ''}>Not Paid</span>
        </div>
      </div>

      {/* Список задач */}
      <div className={styles.taskList}>
        {filteredTasks.map(task => (
          <div className={styles.taskItem} key={task.id}>
            <div className={styles.taskInfo}>
              <span className={styles.taskDate}>21/10/2024</span>
              <span className={styles.taskDifficulty}>{task.difficulty}</span>
              <span className={styles.taskType}>{task.testType}</span>
              <span className={styles.taskPart}>{task.part}</span>
              <span className={styles.taskStatus}>
                {task.status === 'Paid' && <span className={styles.statusPaid}>Paid</span>}
                {task.status === 'Due' && <span className={styles.statusDue}>Due</span>}
                {task.status === 'Not Paid' && <span className={styles.statusNotPaid}>Not Paid</span>}
              </span>
            </div>
            <div className={styles.taskActions}>
              <button className={styles.viewButton}>View</button>
              <button className={styles.downloadButton}>Download PDF</button>
            </div>
          </div>
        ))}
      </div>

      {/* Создание новой задачи */}
      <div className={styles.createTask}>
        <h2>Create New Task</h2>
        <div className={styles.createButtons}>
          <button onClick={() => createTask('reading')}>Add Reading Task</button>
          <button onClick={() => createTask('speaking')}>Add Speaking Task</button>
          <button onClick={() => createTask('writing')}>Add Writing Task</button>
          <button onClick={() => createTask('listening')}>Add Listening Task</button>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
