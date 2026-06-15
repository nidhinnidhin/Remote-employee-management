import { DepartmentEntity } from '../../domain/entities/department.entity';

export class DepartmentResponseMapper {
  static toEnrichedResponse(department: DepartmentEntity, employeeMap: Map<string, { id: string; name: string; email: string; avatar?: string }>) {
    const populatedEmployees = (department.employeeIds || [])
      .map((id) => employeeMap.get(id))
      .filter((e): e is { id: string; name: string; email: string; avatar?: string } => !!e)
      .map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        avatar: e.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.name)}&background=random`,
      }));

    return {
      id: department.id,
      name: department.name,
      companyId: department.companyId,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
      employeeIds: populatedEmployees, 
    };
  }
}