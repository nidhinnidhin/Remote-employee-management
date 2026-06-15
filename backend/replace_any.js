const fs = require('fs');
const path = require('path');

const files = [
  "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\interfaces\\auth\\auth-use-case.interface.ts",
  "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\interfaces\\auth\\auth.repository.ts",
  "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\interfaces\\documents\\document-use-case.interface.ts",
  "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\interfaces\\documents\\document.repository.ts",
  "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\interfaces\\onboarding\\onboarding-use-case.interface.ts",
  "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\interfaces\\onboarding\\onboarding.repository.ts",
  "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\interfaces\\otp\\otp-use-case.interface.ts",
  "c:\\Users\\nidhin\\Desktop\\employee-management-app\\backend\\src\\modules\\auth\\application\\interfaces\\otp\\otp.repository.ts"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  content = content.replace(/Promise<any>/g, 'Promise<unknown>');
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
