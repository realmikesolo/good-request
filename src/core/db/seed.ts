import { sequelize } from './db';
import ExerciseModel, { ExerciseDifficulty } from '../../app/models/exercise.model';
import ProgramModel from '../../app/models/program.model';

const seedDB = async (): Promise<void> => {
  await sequelize.sync({ force: true });

  await ProgramModel.bulkCreate(
    [
      {
        name: 'Program 1',
      },
      {
        name: 'Program 2',
      },
      {
        name: 'Program 3',
      },
    ],
    { returning: true },
  );

  await ExerciseModel.bulkCreate([
    {
      name: 'Exercise 1',
      difficulty: ExerciseDifficulty.EASY,
      programId: 1,
    },
    {
      name: 'Exercise 2',
      difficulty: ExerciseDifficulty.EASY,
      programId: 2,
    },
    {
      name: 'Exercise 3',
      difficulty: ExerciseDifficulty.MEDIUM,
      programId: 1,
    },
    {
      name: 'Exercise 4',
      difficulty: ExerciseDifficulty.MEDIUM,
      programId: 2,
    },
    {
      name: 'Exercise 5',
      difficulty: ExerciseDifficulty.HARD,
      programId: 1,
    },
    {
      name: 'Exercise 6',
      difficulty: ExerciseDifficulty.HARD,
      programId: 2,
    },
  ]);
};

seedDB()
  .then(() => {
    console.log('DB seed done');
    process.exit(0);
  })
  .catch((e) => {
    console.error('error in seed, check your data and model \n \n', e);
    process.exit(1);
  });
