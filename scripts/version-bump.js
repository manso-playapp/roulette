#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USAGE = `
🚀 Version Bump Script - PlayApp Roulette Platform

Uso:
  npm run version:patch    # 1.0.0 -> 1.0.1 (bug fixes)
  npm run version:minor    # 1.0.0 -> 1.1.0 (new features)
  npm run version:major    # 1.0.0 -> 2.0.0 (breaking changes)

Ejemplos:
  npm run version:patch -- --message "Fix authentication bug"
  npm run version:minor -- --message "Add roulette customization" --codename "Nexus"
`;

function parseArgs() {
  const args = process.argv.slice(2);
  const bumpType = args[0]; // patch, minor, major
  
  let message = 'Version bump';
  let codename = null;
  
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--message' && args[i + 1]) {
      message = args[i + 1];
      i++;
    } else if (args[i] === '--codename' && args[i + 1]) {
      codename = args[i + 1];
      i++;
    }
  }
  
  return { bumpType, message, codename };
}

function bumpVersion(currentVersion, bumpType) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${bumpType}`);
  }
}

function updatePackageJson(newVersion) {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
}

function updateVersionJson(newVersion, message, codename, bumpType) {
  const versionPath = path.join(__dirname, '..', 'version.json');
  const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Actualizar información principal
  versionData.version = newVersion;
  versionData.releaseDate = currentDate;
  versionData.build = (versionData.build || 0) + 1;
  
  if (codename) {
    versionData.codename = codename;
  }
  
  // Agregar entrada al changelog
  versionData.changelog[newVersion] = {
    date: currentDate,
    type: bumpType,
    title: `📦 ${message}`,
    description: message,
    highlights: [
      'Mejoras de rendimiento',
      'Correcciones de bugs',
      'Nuevas características'
    ]
  };
  
  fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2) + '\n');
}

function updateChangelog(newVersion, message, bumpType) {
  const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
  const currentDate = new Date().toISOString().split('T')[0];
  
  let changelog = '';
  if (fs.existsSync(changelogPath)) {
    changelog = fs.readFileSync(changelogPath, 'utf8');
  }
  
  const typeEmoji = {
    major: '🚀',
    minor: '✨', 
    patch: '🔧'
  };
  
  const newEntry = `## [${newVersion}] - ${currentDate} ${typeEmoji[bumpType]} ${message}

### Cambios
- ${message}

---

${changelog}`;
  
  fs.writeFileSync(changelogPath, newEntry);
}

function main() {
  const { bumpType, message, codename } = parseArgs();
  
  if (!['patch', 'minor', 'major'].includes(bumpType)) {
    console.log(USAGE);
    process.exit(1);
  }
  
  try {
    // Leer versión actual
    const versionPath = path.join(__dirname, '..', 'version.json');
    const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    const currentVersion = versionData.version;
    
    // Calcular nueva versión
    const newVersion = bumpVersion(currentVersion, bumpType);
    
    console.log(`🚀 Bumping version: ${currentVersion} -> ${newVersion}`);
    console.log(`📝 Message: ${message}`);
    if (codename) console.log(`🏷️  Codename: ${codename}`);
    
    // Actualizar archivos
    updatePackageJson(newVersion);
    updateVersionJson(newVersion, message, codename, bumpType);
    updateChangelog(newVersion, message, bumpType);
    
    console.log('✅ Version bump completed successfully!');
    console.log(`\n📦 Next steps:`);
    console.log(`   git add .`);
    console.log(`   git commit -m "🔖 Release v${newVersion}: ${message}"`);
    console.log(`   git tag v${newVersion}`);
    console.log(`   git push origin main --tags`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar solo si es el módulo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
