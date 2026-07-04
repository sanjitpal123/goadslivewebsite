import fs from 'fs';
import path from 'path';

const dirs = ['d:/gadslanding/html', 'd:/gadslanding/css', 'd:/gadslanding/js'];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

dirs.forEach(dir => {
    const files = walk(dir);
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content.replace(/elementor/g, 'theme-layout')
                               .replace(/Elementor/g, 'ThemeLayout');
        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log(`Updated content in ${file}`);
        }
        
        // Rename file if its name contains elementor
        const basename = path.basename(file);
        if (basename.includes('elementor') || basename.includes('Elementor')) {
            const newBasename = basename.replace(/elementor/g, 'theme-layout')
                                        .replace(/Elementor/g, 'ThemeLayout');
            const newPath = path.join(path.dirname(file), newBasename);
            fs.renameSync(file, newPath);
            console.log(`Renamed ${file} to ${newPath}`);
        }
    });
});
console.log('Done.');
