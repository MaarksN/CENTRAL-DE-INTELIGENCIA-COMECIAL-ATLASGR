const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, regex, replacement) {
    const fullPath = path.resolve(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(fullPath, content);
}

// 1. activities.test.ts
replaceInFile('tests/integration/activities.test.ts', /delete \(data as never\)\.lead;/g, 'delete (data as any).lead;');
replaceInFile('tests/integration/activities.test.ts', /activityService\.create\(\s*data as never\s*\)/g, "activityService.create('test-org-id', data as any)");

// 2. companies.test.ts
replaceInFile('tests/integration/companies.test.ts', /companyService\.create\((.*)\)/g, "companyService.create('test-org-id', $1)");
replaceInFile('tests/integration/companies.test.ts', /companyService\.update\((.*)\)/g, "companyService.update('test-org-id', $1)");
replaceInFile('tests/integration/companies.test.ts', /companyService\.findAll\(\)/g, "companyService.findAll('test-org-id')");

// 3. contacts.test.ts
replaceInFile('tests/integration/contacts.test.ts', /delete \(data as never\)\.company;/g, 'delete (data as any).company;');
replaceInFile('tests/integration/contacts.test.ts', /contactService\.create\((.*)\)/g, "contactService.create('test-org-id', $1)");

// 4. leads.test.ts
replaceInFile('tests/integration/leads.test.ts', /leadService\.create\((.*)\)/g, "leadService.create('test-org-id', $1)");

// 5. notes.test.ts
replaceInFile('tests/integration/notes.test.ts', /delete \(data as never\)\.lead;/g, 'delete (data as any).lead;');

// 6. timeline.test.ts
replaceInFile('tests/integration/timeline.test.ts', /delete \(data as never\)\.lead;/g, 'delete (data as any).lead;');

// 7. company.service.test.ts
replaceInFile('tests/unit/features/companies/services/company.service.test.ts', /companyService\.create\('test-org-id', input\)/g, "companyService.create('test-org-id', input as any)");

// 8. errorHandler.test.ts
replaceInFile('tests/unit/shared/middlewares/errorHandler.test.ts', /err\.errors/g, 'err.issues');

console.log('Fixed tests');
