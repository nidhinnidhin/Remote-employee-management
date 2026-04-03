import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectDocument, ProjectSchema } from './infrastructure/database/mongoose/schemas/project.schema';
import { UserStoryDocument, UserStorySchema } from './infrastructure/database/mongoose/schemas/user-story.schema';
import { TaskDocument, TaskSchema } from './infrastructure/database/mongoose/schemas/task.schema';
import { MongoProjectRepository } from './infrastructure/database/repositories/mongo-project.repository';
import { MongoUserStoryRepository } from './infrastructure/database/repositories/mongo-user-story.repository';
import { MongoTaskRepository } from './infrastructure/database/repositories/mongo-task.repository';
import { CreateProjectUseCase } from './application/use-cases/project/create-project.usecase';
import { GetProjectUseCase } from './application/use-cases/project/get-project.usecase';
import { ListProjectsUseCase } from './application/use-cases/project/list-projects.usecase';
import { UpdateProjectUseCase } from './application/use-cases/project/update-project.usecase';
import { DeleteProjectUseCase } from './application/use-cases/project/delete-project.usecase';
import { CreateUserStoryUseCase } from './application/use-cases/story/create-story.usecase';
import { GetUserStoriesByProjectUseCase } from './application/use-cases/story/get-stories-by-project.usecase';
import { UpdateUserStoryUseCase } from './application/use-cases/story/update-story.usecase';
import { DeleteUserStoryUseCase } from './application/use-cases/story/delete-story.usecase';
import { CreateTaskUseCase } from './application/use-cases/task/create-task.usecase';
import { GetTasksByStoryUseCase } from './application/use-cases/task/get-tasks-by-story.usecase';
import { GetMyTasksUseCase } from './application/use-cases/task/get-my-tasks.usecase';
import { UpdateTaskUseCase } from './application/use-cases/task/update-task.usecase';
import { MoveTaskUseCase } from './application/use-cases/task/move-task.usecase';
import { DeleteTaskUseCase } from './application/use-cases/task/delete-task.usecase';
import { ProjectController } from './presentation/controllers/project.controller';
import { StoryController } from './presentation/controllers/story.controller';
import { TaskController } from './presentation/controllers/task.controller';
import { AuthModule } from '../auth/presentation/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: ProjectDocument.name, schema: ProjectSchema },
      { name: UserStoryDocument.name, schema: UserStorySchema },
      { name: TaskDocument.name, schema: TaskSchema },
    ]),
  ],
  controllers: [ProjectController, StoryController, TaskController],
  providers: [
    // Repositories
    {
      provide: 'IProjectRepository',
      useClass: MongoProjectRepository,
    },
    {
      provide: 'IUserStoryRepository',
      useClass: MongoUserStoryRepository,
    },
    {
      provide: 'ITaskRepository',
      useClass: MongoTaskRepository,
    },
    // Project Use Cases
    {
      provide: 'ICreateProjectUseCase',
      useClass: CreateProjectUseCase,
    },
    {
      provide: 'IGetProjectUseCase',
      useClass: GetProjectUseCase,
    },
    {
      provide: 'IListProjectsUseCase',
      useClass: ListProjectsUseCase,
    },
    {
      provide: 'IUpdateProjectUseCase',
      useClass: UpdateProjectUseCase,
    },
    {
      provide: 'IDeleteProjectUseCase',
      useClass: DeleteProjectUseCase,
    },
    // User Story Use Cases
    {
      provide: 'ICreateUserStoryUseCase',
      useClass: CreateUserStoryUseCase,
    },
    {
      provide: 'IGetUserStoriesByProjectUseCase',
      useClass: GetUserStoriesByProjectUseCase,
    },
    {
      provide: 'IUpdateUserStoryUseCase',
      useClass: UpdateUserStoryUseCase,
    },
    {
      provide: 'IDeleteUserStoryUseCase',
      useClass: DeleteUserStoryUseCase,
    },
    // Task Use Cases
    {
      provide: 'ICreateTaskUseCase',
      useClass: CreateTaskUseCase,
    },
    {
      provide: 'IGetTasksByStoryUseCase',
      useClass: GetTasksByStoryUseCase,
    },
    {
      provide: 'IGetMyTasksUseCase',
      useClass: GetMyTasksUseCase,
    },
    {
      provide: 'IUpdateTaskUseCase',
      useClass: UpdateTaskUseCase,
    },
    {
      provide: 'IMoveTaskUseCase',
      useClass: MoveTaskUseCase,
    },
    {
      provide: 'IDeleteTaskUseCase',
      useClass: DeleteTaskUseCase,
    },
  ],
})
export class ProjectModule {}
