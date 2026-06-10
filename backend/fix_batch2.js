const fs = require('fs');

const replacements = [
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\mappers\\company.mapper.ts",
    replacements: [
      { from: "companyDoc: import('../../infrastructure/database/mongoose/schemas/company.schema').CompanyDocument", to: "companyDoc: import('../../infrastructure/database/mongoose/schemas/company.schema').CompanyDocument & { employeeCount?: number, projectCounter?: number }" }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\mappers\\email-otp.mapper.ts",
    replacements: [
      { from: "(doc as unknown as { id?: string }).id,", to: "(doc as unknown as { id?: string }).id || ''," }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\presentation\\controllers\\auth.controller.ts",
    replacements: [
      { from: "const user = req.user as { userId?: string, id?: string, role?: string, companyId?: string };", to: "const user = req.user as { userId: string, id: string, role: string, companyId: string };" },
      { from: "const companyId = user.companyId;", to: "const companyId = user.companyId as string;" }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\super-admin\\application\\interfaces\\super-admin-use-cases.interface.ts",
    replacements: [
      { from: "Promise<unknown[]>", to: "Promise<import('../../../company-admin/domain/entities/company.entity').CompanyEntity[]>" }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\super-admin\\application\\use-cases\\suspend-company.use-case.ts",
    replacements: [
      { from: "status as 'active' | 'suspended',", to: "status as unknown as import('../../../users/domain/enums/user-status.enum').UserStatus," }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\shared\\services\\cloudinary\\cloudinary.service.ts",
    replacements: [
      { from: "resolve(result);", to: "resolve(result as import('cloudinary').UploadApiResponse);" }
    ]
  }
];

for (const rep of replacements) {
  if (fs.existsSync(rep.file)) {
    let content = fs.readFileSync(rep.file, 'utf8');
    for (const rule of rep.replacements) {
      content = content.replace(rule.from, rule.to);
    }
    fs.writeFileSync(rep.file, content);
    console.log(`Updated ${rep.file}`);
  } else {
    console.log(`File not found: ${rep.file}`);
  }
}
