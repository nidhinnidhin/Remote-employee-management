import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Inject,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';
import { SubscriptionLimitGuard } from 'src/shared/guards/subscription-limit.guard';
import { CheckSubscriptionLimit } from 'src/shared/decorators/subscription-limit.decorator';
import { CreateProjectDto } from '../../application/dto/project/create-project.dto';
import { UpdateProjectDto } from '../../application/dto/project/update-project.dto';
import { SearchProjectsDto } from '../../application/dto/project/search-projects.dto';
import type {
  ICreateProjectUseCase,
  IGetProjectUseCase,
  IListProjectsUseCase,
  ISearchProjectsUseCase,
  IUpdateProjectUseCase,
  IDeleteProjectUseCase,
} from '../../application/interfaces/project/project-use-cases.interface';
import type { ICloudinaryService } from 'src/shared/services/cloudinary/interfaces/icloudinary.service';
import { CLOUDINARY_PATH } from 'src/shared/constants/path/cloudinary.path';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(
    @Inject('ICreateProjectUseCase')
    private readonly _createProjectUseCase: ICreateProjectUseCase,
    @Inject('IGetProjectUseCase')
    private readonly _getProjectUseCase: IGetProjectUseCase,
    @Inject('IListProjectsUseCase')
    private readonly _listProjectsUseCase: IListProjectsUseCase,
    @Inject('IUpdateProjectUseCase')
    private readonly _updateProjectUseCase: IUpdateProjectUseCase,
    @Inject('IDeleteProjectUseCase')
    private readonly _deleteProjectUseCase: IDeleteProjectUseCase,
    @Inject('ISearchProjectsUseCase')
    private readonly _searchProjectsUseCase: ISearchProjectsUseCase,
    @Inject('ICloudinaryService')
    private readonly _cloudinaryService: ICloudinaryService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this._cloudinaryService.uploadFile(
      file,
      CLOUDINARY_PATH.UPLOAD_DOCUMENT_PATH,
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  @Post()
  @UseGuards(CompanyAdminGuard, SubscriptionLimitGuard)
  @CheckSubscriptionLimit('projects')
  async create(@Req() req: Request, @Body() projectDto: CreateProjectDto) {
    return this._createProjectUseCase.execute(req.user!.companyId!, req.user!.userId, projectDto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this._listProjectsUseCase.execute(req.user!.companyId!);
  }

  @Get('search')
  async search(@Req() req: Request, @Query() dto: SearchProjectsDto) {
    console.log('Project search endpoint hit:', { companyId: req.user?.companyId, dto });
    return this._searchProjectsUseCase.execute(req.user!.companyId!, dto);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    return this._getProjectUseCase.execute(id, req.user!.companyId!);
  }

  @Patch(':id')
  @UseGuards(CompanyAdminGuard)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() projectDto: UpdateProjectDto,
  ) {
    return this._updateProjectUseCase.execute(id, req.user!.companyId!, projectDto);
  }

  @Delete(':id')
  @UseGuards(CompanyAdminGuard)
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this._deleteProjectUseCase.execute(id, req.user!.companyId!);
  }
}
