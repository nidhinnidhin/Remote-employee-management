const fs = require('fs');

const replacements = [
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\mappers\\company.mapper.ts",
    replacements: [
      { from: "companyDoc: any", to: "companyDoc: import('../../infrastructure/database/mongoose/schemas/company.schema').CompanyDocument" }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\mappers\\email-otp.mapper.ts",
    replacements: [
      { from: "(doc as any).id", to: "(doc as unknown as { id?: string }).id" }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\mappers\\profile\\update-user-profile.mapper.ts",
    replacements: [
      { from: "Record<string, any>", to: "Record<string, unknown>" },
      { from: "Record<string, any>", to: "Record<string, unknown>" }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\use-cases\\register\\onboard-company.usecase.ts",
    replacements: [
      { from: "updateData: any", to: "updateData: Record<string, unknown>" }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\infrastructure\\database\\repositories\\mongo-company.repository.ts",
    replacements: [
      { from: "companyDoc: any", to: "companyDoc: import('./company.schema').CompanyDocument" }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\presentation\\controllers\\auth.controller.ts",
    replacements: [
      { from: "const user = req.user as any;", to: "const user = req.user as { userId?: string, id?: string, role?: string, companyId?: string };" }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\super-admin\\application\\interfaces\\super-admin-use-cases.interface.ts",
    replacements: [
      { from: "Promise<any[]>", to: "Promise<unknown[]>" }
    ]
  },
  {
    file: "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\super-admin\\application\\use-cases\\suspend-company.use-case.ts",
    replacements: [
      { from: "status as any,", to: "status as 'active' | 'suspended'," }
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
