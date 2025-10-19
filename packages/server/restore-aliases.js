const { execSync } = require('child_process');

try {
    console.log('🔄 Restoring path aliases in source files...');

    const hasChanges = execSync('git status --porcelain src/', { encoding: 'utf8' });

    if (hasChanges.trim()) {
        execSync('git checkout -- src/', { stdio: 'inherit' });
        console.log('✅ Path aliases restored successfully!');
    } else {
        console.log('ℹ️  No changes to restore');
    }
} catch (error) {
    console.error('   Error:', error.message);
    process.exit(0);
}