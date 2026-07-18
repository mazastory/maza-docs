const fs = require('fs');
const path = '/Users/m/Downloads/MazaWorkspace/maza-docs/src/data/docsTree.ts';
let content = fs.readFileSync(path, 'utf8');

const demosBlockRegex = /  \{\n    id: 'demos',[\s\S]*?  \},\n/;
const match = content.match(demosBlockRegex);
if (match) {
    const demosBlock = match[0];
    content = content.replace(demosBlockRegex, '');
    
    // Insert after golden-path
    const goldenPathRegex = /  \{\n    id: 'golden-path',[\s\S]*?  \},\n/;
    content = content.replace(goldenPathRegex, (gMatch) => gMatch + demosBlock);
    
    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully moved 'demos' right after 'golden-path'");
} else {
    console.log("Could not find demos block");
}
