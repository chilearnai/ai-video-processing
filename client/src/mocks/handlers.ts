import { http, HttpResponse } from 'msw';

const Students = [
  {
    id: 1,
    name: 'Vito Carleone',
    classId: 1,
    className: 'Class 1',
    teacherId: 1,
    teacherName: 'Anna Maria',
  },
  {
    id: 2,
    name: 'Fabio Skoleti',
    classId: 2,
    className: 'Class 2',
    teacherId: 2,
    teacherName: 'Constansia Lukreze',
  },
  {
    id: 4,
    name: 'Sanny Banano',
    classId: 1,
    className: 'Class 1',
    teacherId: 1,
    teacherName: 'Anna Maria',
  },
  {
    id: 5,
    name: "Karol de'Marko",
    classId: 3,
    className: 'Class 3',
    teacherId: 3,
    teacherName: 'Emilian Antonio',
  },
  {
    id: 6,
    name: 'Alfredo Genovese',
    classId: 4,
    className: 'Class 4',
    teacherId: 1,
    teacherName: 'Anna Maria',
  },
  {
    id: 7,
    name: 'Shiesa Kastelanno',
    classId: 2,
    className: 'Class 2',
    teacherId: 4,
    teacherName: 'Luka Giovanni',
  },
];

const teacherNames = [...new Set(Students.map((student) => student.teacherId))]
  .map((teacherId) => {
    const student = Students.find((student) => student.teacherId === teacherId);
    if (student) {
      return { teacherId, teacherName: student.teacherName };
    }
    return null;
  })
  .filter(Boolean);

let Classes = [
  {
    id: 1,
    name: 'Class 1',
    studentCount: 30,
    teachers: [{ id: 1, name: 'Anna Maria' }],
  },
  {
    id: 2,
    name: 'Class 2',
    studentCount: 25,
    teachers: [{ id: 2, name: 'Constansia Lukreze' }],
  },
  {
    id: 3,
    name: 'Class 3',
    studentCount: 20,
    teachers: [
      { id: 1, name: 'Anna Maria' },
      { id: 3, name: 'Emilian Antonio' },
    ],
  },
  {
    id: 4,
    name: 'Class 4',
    studentCount: 15,
    teachers: [{ id: 4, name: 'Luka Giovanni' }],
  },
];

// async function fetchClasses() {
//   try {
//     const response = await fetch(`./dataBase.json`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch data');
//     }
//     const data = await response.json();
//     if (data && Array.isArray(data.classes)) {
//       return data.classes;
//     } else {
//       throw new Error("Classes data is not in expected format.");
//     }
//   } catch (error) {
//     console.error("Error fetching classes:", error);
//     return [];
//   }
// }

export const handlers = [
  http.get('/api/classes', async () => {
    return HttpResponse.json(Classes);
  }),

  //    http.put("/api/classes/", async (request, params ) => {
  //      const classId = params;
  //      const updatedClass = params.body;

  //       const classIndex = Class.findIndex(cls => cls.id === classId);
  //       if (classIndex !== -1 && classIndex > 0) {
  //         Classes[classIndex] = updatedClass;
  //         request.json(updatedClass);
  //       } else {
  //         request.status(404).send('Class not found');
  //       }
  //    }),

  http.post('', async () => {}),

  http.put('/api/classes/:id', async ({ request, params }) => {
    const { id } = params;
    const nextPost = await request.json();
    console.log('Updating post "%s" with:', id, nextPost);
  }),

  http.post('/api/classes', async ({ request }) => {
    const newClassData = (await request.json()) as {
      name: string;
      studentCount: number;
      teachers: { id: number; name: string }[];
    };
    const newClass = {
      id: Math.max(...Classes.map((cls) => cls.id)) + 1,
      ...newClassData,
    };
    Classes = [...Classes, newClass];

    return HttpResponse.json(newClass);
  }),

  http.delete('/api/classes/:id', (resolver) => {}),

  http.get('/api/students', () => {
    return HttpResponse.json(Students);
  }),

  http.get('/api/teachers', () => {
    return HttpResponse.json(teacherNames);
  }),

  http.get('/api/teachers/:teacherId/students', ({ params }) => {
    const { teacherId } = params;
    const filteredStudents = Students.filter(
      (student) => student.teacherId === Number(teacherId),
    );
    return HttpResponse.json(filteredStudents);
  }),

  http.get('/api/students/:id/assignments', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Assignment 1',
        description: 'Description 1',
        dueDate: '2024-06-12',
        status: 'не выполнено',
      },
      {
        id: 2,
        title: 'Assignment 2',
        description: 'Description 2',
        dueDate: '2024-06-20',
        status: 'выполнено',
      },
      {
        id: 3,
        title: 'Assignment 3',
        description: 'Description 3',
        dueDate: '2024-06-01',
        status: 'выполнено',
      },
      {
        id: 4,
        title: 'Assignment 4',
        description: 'Description 4',
        dueDate: '2024-05-24',
        status: 'не выполнено',
      },
    ]);
  }),

  http.get('/api/speaking-adapted-tests/tasks', () => {}),
];
