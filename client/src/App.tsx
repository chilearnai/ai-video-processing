import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { store } from './store';

import ClassList from './components/Pages/ClassList';
import ClassForm from './components/ClassForm';
import StudentList from './components/Pages/StudentList';
import AssignmentList from './components/AssignmentList';
import Header from './components/Header';
import Home from './components/Pages/Home';
import { TeachersList } from './components/Pages/TeachersList';

import AuthWrapper from './components/AuthWrapper';

import styles from './styles/main.module.scss';
import Auth from './components/Auth';
import Sidebar from './components/Elements/Sidebar';
import Container from './components/Elements/Container';
import PrivateRoute from './route/PrivateRoute';

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(true);

  interface ClassObject {
    id: number;
    name: string;
    studentCount: number;
    teachers: { id: number; name: string }[];
  }

  const [Classes, setClasses] = useState<ClassObject | null>(null);
  const [studentsId, setStudentsId] = useState(0);

  const handleObject = (newObject: ClassObject) => {
    setClasses(newObject);
  };

  const handleStudentId = (id: number) => {
    setStudentsId(id);
  };

  if (!isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<Auth />} />
      </Routes>
    );
  } else {
    return (
      // <AuthWrapper>
      <Provider store={store}>
        <div className={styles.App}>
          <Header />
          <Sidebar />
          <Container>
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute isAuth={isAuth}>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="classes"
                element={
                  <PrivateRoute isAuth={isAuth}>
                    <ClassList onObject={handleObject} />
                  </PrivateRoute>
                }
              />
              <Route
                path="class/form"
                element={
                  <PrivateRoute isAuth={isAuth}>
                    <ClassForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="edit/form"
                element={
                  <PrivateRoute isAuth={isAuth}>
                    <ClassForm
                      classToEdit={
                        Classes
                          ? {
                              id: Classes.id,
                              name: Classes.name,
                              studentCount: Classes.studentCount,
                              teachers: Classes.teachers,
                            }
                          : undefined
                      }
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="teachers"
                element={
                  <PrivateRoute isAuth={isAuth}>
                    <TeachersList />
                  </PrivateRoute>
                }
              />
              <Route
                path="classes/students"
                element={
                  <PrivateRoute isAuth={isAuth}>
                    <StudentList studentId={handleStudentId} />
                  </PrivateRoute>
                }
              />
              <Route
                path="assignment"
                element={
                  <PrivateRoute isAuth={isAuth}>
                    <AssignmentList studentId={studentsId} />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Container>
        </div>
      </Provider>
      // {/* </AuthWrapper> */}
    );
  }
};

export default App;
