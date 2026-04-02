import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pathMappings = {
    '$application': 'src/application',
    '$config': 'src/config',
    '$domain': 'src/domain',
    '$infrastructure': 'src/infrastructure',
    '$presentation': 'src/presentation',
    '$types': 'src/types',
    '$utils': 'src/utils'
};

function getRelativePath(fromFile, toPath) {
    const fromDir = path.dirname(fromFile);
    let relative = path.relative(fromDir, toPath);

    if (!relative.startsWith('.')) {
        relative = './' + relative;
    }

    return relative.replace(/\\/g, '/');
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    Object.entries(pathMappings).forEach(([alias, basePath]) => {
        const regex = new RegExp(`from ['"]\\${alias}/([^'"]+)['"]`, 'g');

        content = content.replace(regex, (match, importPath) => {
            const absolutePath = path.join(__dirname, basePath, importPath);
            const relativePath = getRelativePath(filePath, absolutePath);
            modified = true;
            return `from '${relativePath}'`;
        });
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${path.relative(__dirname, filePath)}`);
        return 1;
    }
    return 0;
}

function walkDir(dir) {
    let count = 0;
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
            count += walkDir(filePath);
        } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
            count += processFile(filePath);
        }
    });

    return count;
}

console.log('🔧 Converting path aliases to relative imports...\n');
const fixed = walkDir(path.join(__dirname, 'src'));
console.log(`\n✅ Done! Converted ${fixed} file(s)`);