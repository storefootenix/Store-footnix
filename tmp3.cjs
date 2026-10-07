const fs = require('fs');
let c = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

c = c.replace(
  '<Save className="w-4 h-4" />\n            <span>Save API Keys</span>',
  '{isSavingKeys ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}\n            <span>{isSavingKeys ? "Saving..." : "Save API Keys"}</span>'
);

c = c.replace(
  '<Save className="w-4 h-4" />\r\n            <span>Save API Keys</span>',
  '{isSavingKeys ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}\n            <span>{isSavingKeys ? "Saving..." : "Save API Keys"}</span>'
);

fs.writeFileSync('src/components/admin/AdminSettings.tsx', c);
