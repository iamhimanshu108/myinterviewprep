import { WorkflowTopicData } from '../../types';

export const crudWorkflow: WorkflowTopicData = {
    id: 'crud',
    title: 'CRUD Operations & Database',
    subtitle: 'Create, Read, Update, Delete',
    tagline: 'The foundational operations of all persistent storage systems.',
    accentColor: '#10B981', // Emerald
    tags: ['Database', 'SQL', 'NoSQL', 'ORM', 'CRUD'],
    sections: [
      { id: 'crud-01', num: 1, label: 'The Core Concept', group: 'Phase 1: Beginner' },
      { id: 'crud-02', num: 2, label: 'Implementation', group: 'Phase 2: Intermediate' }
    ],
    flowSteps: [
      {
        name: 'Create (INSERT)',
        detail: 'Adding new records or documents into the database.',
        lit: ['client', 'db']
      },
      {
        name: 'Read (SELECT)',
        detail: 'Retrieving existing records based on conditions.',
        lit: ['client', 'db']
      },
      {
        name: 'Update (UPDATE)',
        detail: 'Modifying existing records.',
        lit: ['client', 'db']
      },
      {
        name: 'Delete (DELETE)',
        detail: 'Removing records permanently or soft-deleting.',
        lit: ['client', 'db']
      }
    ],
    codebases: {
      express: {
        framework: 'express',
        frameworkName: 'Express.js (Node)',
        language: 'typescript',
        fileLabel: 'src/controllers/userController.ts',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        code: `// CREATE
export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

// READ
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json(user);
};

// UPDATE
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(user);
};

// DELETE
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
};`,
        explanation: 'Standard Mongoose CRUD methods implemented inside an Express controller.',
        architectureHighlights: [
          'RESTful mapping to standard HTTP verbs (POST, GET, PUT/PATCH, DELETE)',
          'Mongoose handles the underlying MongoDB driver logic'
        ]
      }
    },
    quiz: undefined,
    comparisonPoints: [],
    bestPractices: [],
    commonMistakes: []
};
