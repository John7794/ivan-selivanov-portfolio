import fs from 'fs';
import path from 'path';

const driveMap = JSON.parse(fs.readFileSync('ivan-selivanov-portfolio/src/data/driveMap.json', 'utf8'));
const projectScreens = JSON.parse(fs.readFileSync('ivan-selivanov-portfolio/src/data/projectScreensMap.json', 'utf8'));

// 1. Generate Google Apps Script snippet
const gasScript = `/**
 * Автоматична заміна посилань Google Диску на високоякісні посилання GitHub (jsDelivr CDN)
 * 
 * Інструкція:
 * 1. Відкрийте вашу Google Таблицю
 * 2. У верхньому меню оберіть: Розширення > Apps Script (Extensions > Apps Script)
 * 3. Вставте цю функцію в кінець файлу
 * 4. У випадаючому списку функцій оберіть "replaceDriveLinksWithGithub" і натисніть кнопку "Виконати" (Run ▶)
 * 5. Усі посилання в таблиці автоматично оновляться!
 */
function replaceDriveLinksWithGithub() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Projects") || ss.getSheetByName("Проєкти") || ss.getActiveSheet();
  var range = sheet.getDataRange();
  var values = range.getValues();
  
  var driveMap = ${JSON.stringify(driveMap, null, 2)};
  
  var replacementCount = 0;
  
  for (var r = 0; r < values.length; r++) {
    for (var c = 0; c < values[r].length; c++) {
      var cellVal = String(values[r][c] || "");
      if (cellVal.indexOf("drive.google.com") !== -1) {
        var lines = cellVal.split(/\\n/);
        var modified = false;
        
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line) continue;
          
          for (var driveId in driveMap) {
            if (line.indexOf(driveId) !== -1) {
              lines[i] = driveMap[driveId];
              modified = true;
              replacementCount++;
              break;
            }
          }
        }
        
        if (modified) {
          values[r][c] = lines.join("\\n");
        }
      }
    }
  }
  
  range.setValues(values);
  SpreadsheetApp.getUi().alert("Успішно замінено " + replacementCount + " посилань Google Диску на CDN GitHub!");
}
`;

fs.writeFileSync('ivan-selivanov-portfolio/scripts/replaceDriveLinks.gs', gasScript);
console.log('Saved Google Apps Script to ivan-selivanov-portfolio/scripts/replaceDriveLinks.gs');

// 2. Generate updated TSV for Projects sheet
let dumpStr = fs.readFileSync('live_apps_script_dump.json', 'utf8');
if (dumpStr.charCodeAt(0) === 0xFEFF) dumpStr = dumpStr.slice(1);
const liveDump = JSON.parse(dumpStr);
const headers = [
  'id', 'title_ua', 'title_en', 'year', 'role_ua', 'role_en', 'client_ua', 'client_en',
  'category', 'status', 'status_ua', 'status_en', 'featured', 'thumbnailUrl', 'mobileThumbnailUrl',
  'heroImage', 'liveLink', 'tagline_ua', 'tagline_en', 'overview_ua', 'overview_en', 'tools',
  'challenge_ua', 'challenge_en', 'solution_ua', 'solution_en', 'impact_ua', 'impact_en',
  'fonts', 'fonts_ua', 'fonts_en', 'palette', 'colors_ua', 'colors_en', 'figmaUrl', 'figmaEmbedUrl'
];

const replaceTextWithGithub = (text) => {
  if (!text || typeof text !== 'string') return text || '';
  let updated = text;
  for (const [id, ghUrl] of Object.entries(driveMap)) {
    if (updated.includes(id)) {
      // Replace any drive url containing this id with the ghUrl
      const regex = new RegExp(`https:\\/\\/drive\\.google\\.com\\/[^\\s\\n;,"]*${id}[^\\s\\n;,"]*`, 'g');
      updated = updated.replace(regex, ghUrl);
    }
  }
  return updated;
};

const tsvRows = [headers.join('\t')];
liveDump.projects.forEach(p => {
  const row = headers.map(h => {
    let val = p[h] !== undefined ? p[h] : '';
    if (typeof val === 'object' && val !== null) {
      val = val.ua || val.en || JSON.stringify(val);
    }
    val = String(val);
    val = replaceTextWithGithub(val);
    // Escape tabs and wrap multiline in quotes for Excel/Sheets TSV
    if (val.includes('\n') || val.includes('\t') || val.includes('"')) {
      val = `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  });
  tsvRows.push(row.join('\t'));
});

fs.writeFileSync('ivan-selivanov-portfolio/scripts/projects_updated.tsv', tsvRows.join('\n'));
console.log('Saved updated TSV to ivan-selivanov-portfolio/scripts/projects_updated.tsv');

// 3. Generate updated defaultData.ts DEFAULT_PROJECTS galleries
console.log('Done preparing scripts and TSV.');
