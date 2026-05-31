import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectDocument, ProjectSchema } from './infrastructure/database/mongoose/schemas/project.schema';
import { UserStoryDocument, UserStorySchema } from './infrastructure/database/mongoose/schemas/user-story.schema';
import { TaskDocument, TaskSchema } from './infrastructure/database/mongoose/schemas/task.schema';
import { SprintDocument, SprintSchema } from './infrastructure/database/mongoose/schemas/sprint.schema';
import { MongoProjectRepository } from './infrastructure/database/repositories/mongo-project.repository';
import { MongoUserStoryRepository } from './infrastructure/database/repositories/mongo-user-story.repository';
import { MongoTaskRepository } from './infrastructure/database/repositories/mongo-task.repository';
import { MongoSprintRepository } from './infrastructure/database/repositories/mongo-sprint.repository';
import { CreateProjectUseCase } from './application/use-cases/project/create-project.usecase';
import { GetProjectUseCase } from './application/use-cases/project/get-project.usecase';
import { ListProjectsUseCase } from './application/use-cases/project/list-projects.usecase';
import { UpdateProjectUseCase } from './application/use-cases/project/update-project.usecase';
import { DeleteProjectUseCase } from './application/use-cases/project/delete-project.usecase';
import { SearchProjectsUseCase } from './application/use-cases/project/search-projects.usecase';
import { CreateUserStoryUseCase } from './application/use-cases/story/create-story.usecase';
import { GetUserStoriesByProjectUseCase } from './application/use-cases/story/get-stories-by-project.usecase';
import { UpdateUserStoryUseCase } from './application/use-cases/story/update-story.usecase';
import { DeleteUserStoryUseCase } from './application/use-cases/story/delete-story.usecase';
import { SearchStoriesUseCase } from './application/use-cases/story/search-stories.usecase';
import { CreateTaskUseCase } from './application/use-cases/task/create-task.usecase';
import { GetTasksByStoryUseCase } from './application/use-cases/task/get-tasks-by-story.usecase';
import { GetTasksByProjectUseCase } from './application/use-cases/task/get-tasks-by-project.usecase';
import { GetMyTasksUseCase } from './application/use-cases/task/get-my-tasks.usecase';
import { UpdateTaskUseCase } from './application/use-cases/task/update-task.usecase';
import { MoveTaskUseCase } from './application/use-cases/task/move-task.usecase';
import { DeleteTaskUseCase } from './application/use-cases/task/delete-task.usecase';
import { SearchTasksUseCase } from './application/use-cases/task/search-tasks.usecase';
import { CreateSprintUseCase } from './application/use-cases/sprint/create-sprint.usecase';
import { UpdateSprintUseCase } from './application/use-cases/sprint/update-sprint.usecase';
import { GetSprintUseCase } from './application/use-cases/sprint/get-sprint.usecase';
import { ListProjectSprintsUseCase } from './application/use-cases/sprint/list-project-sprints.usecase';
import { DeleteSprintUseCase } from './application/use-cases/sprint/delete-sprint.usecase';
import { ProjectController } from './presentation/controllers/project.controller';
import { StoryController } from './presentation/controllers/story.controller';
import { TaskController } from './presentation/controllers/task.controller';
import { SprintController } from './presentation/controllers/sprint.controller';
import { AuthModule } from '../auth/presentation/auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { ChatModule } from '../chat/chat.module';
import { NotificationModule } from '../notification/notification.module';
import { CommentDocument, CommentSchema } from './infrastructure/database/mongoose/schemas/comment.schema';
import { MongoCommentRepository } from './infrastructure/database/repositories/mongo-comment.repository';
import { AddCommentUseCase } from './application/use-cases/add-comment.usecase';
import { GetCommentsUseCase } from './application/use-cases/get-comments.usecase';
import { CommentController } from './presentation/controllers/comment.controller';
import { UserDocument, UserSchema } from '../auth/infrastructure/database/mongoose/schemas/userSchema';

// 🔹 Import ActivityLogsModule
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [
    AuthModule,
    SubscriptionModule,
    ChatModule,
    NotificationModule,
    forwardRef(() => ActivityLogsModule), // 🔹 Added with forwardRef
    MongooseModule.forFeature([
      { name: ProjectDocument.name, schema: ProjectSchema },
      { name: UserStoryDocument.name, schema: UserStorySchema },
      { name: TaskDocument.name, schema: TaskSchema },
      { name: SprintDocument.name, schema: SprintSchema },
      { name: CommentDocument.name, schema: CommentSchema },
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProjectController, StoryController, TaskController, SprintController, CommentController],
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
    {
      provide: 'ISprintRepository',
      useClass: MongoSprintRepository,
    },
    {
      provide: 'ICommentRepository',
      useClass: MongoCommentRepository,
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
    {
      provide: 'ISearchProjectsUseCase',
      useClass: SearchProjectsUseCase,
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
    {
      provide: 'ISearchUserStoriesUseCase',
      useClass: SearchStoriesUseCase,
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
      provide: 'IGetTasksByProjectUseCase',
      useClass: GetTasksByProjectUseCase,
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
    {
      provide: 'ISearchTasksUseCase',
      useClass: SearchTasksUseCase,
    },
    // Sprint Use Cases
    {
      provide: 'ICreateSprintUseCase',
      useClass: CreateSprintUseCase,
    },
    {
      provide: 'IUpdateSprintUseCase',
      useClass: UpdateSprintUseCase,
    },
    {
      provide: 'IGetSprintUseCase',
      useClass: GetSprintUseCase,
    },
    {
      provide: 'IListProjectSprintsUseCase',
      useClass: ListProjectSprintsUseCase,
    },
    {
      provide: 'IDeleteSprintUseCase',
      useClass: DeleteSprintUseCase,
    },
    AddCommentUseCase,
    GetCommentsUseCase,
  ],
  exports: ['IProjectRepository', 'ICommentRepository'],
})
export class ProjectModule { }