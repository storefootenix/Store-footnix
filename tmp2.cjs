const fs = require('fs');
let c = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

c = c.replace(
  'const handleSaveApiKeys = async (e: React.FormEvent) => {\n    e.preventDefault();\n    const token = localStorage.getItem(\'footenixAdminToken\');',
  'const handleSaveApiKeys = async (e: React.FormEvent) => {\n    e.preventDefault();\n    setIsSavingKeys(true);\n    const token = localStorage.getItem(\'footenixAdminToken\');'
);

c = c.replace(
  'alert(\'✅ SUCCESS: API Keys have been securely saved to the database!\');\n        setTimeout(() => setKeysSaved(false), 3000);\n      } catch (err) {\n        alert(\'Network error while saving keys.\');\n      }\n    }',
  'alert(\'✅ SUCCESS: API Keys have been securely saved to the database!\');\n        setTimeout(() => setKeysSaved(false), 3000);\n      } catch (err) {\n        alert(\'Network error while saving keys.\');\n      } finally {\n        setIsSavingKeys(false);\n      }\n    } else {\n      setIsSavingKeys(false);\n    }'
);

c = c.replace(
  '          const err = await res.json();\n          alert(\'Failed to save keys: \' + (err.error || \'Server error\'));\n          return;',
  '          const err = await res.json();\n          alert(\'Failed to save keys: \' + (err.error || \'Server error\'));\n          setIsSavingKeys(false);\n          return;'
);

fs.writeFileSync('src/components/admin/AdminSettings.tsx', c);
