const fs = require('fs');
let c = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

c = c.replace(
  'alert(\'✅ SUCCESS: Admin Credentials updated!\');\n        setTimeout(() => setCredsSaved(false), 3000);\n      } catch (err) {\n        alert(\'Network error while saving credentials.\');\n      }\n    }',
  'alert(\'✅ SUCCESS: Admin Credentials updated!\');\n        setTimeout(() => setCredsSaved(false), 3000);\n      } catch (err) {\n        alert(\'Network error while saving credentials.\');\n      } finally {\n        setIsSavingCreds(false);\n      }\n    } else {\n      setIsSavingCreds(false);\n    }'
);

c = c.replace(
  'const handleSaveApiKeys = async (e: React.FormEvent) => {\n    e.preventDefault();',
  'const handleSaveApiKeys = async (e: React.FormEvent) => {\n    e.preventDefault();\n    setIsSavingKeys(true);'
);

c = c.replace(
  'alert(\'✅ SUCCESS: API Keys have been securely saved to the database!\');\n        setTimeout(() => setKeysSaved(false), 3000);\n      } catch (err) {\n        alert(\'Network error while saving keys.\');\n      }\n    }',
  'alert(\'✅ SUCCESS: API Keys have been securely saved to the database!\');\n        setTimeout(() => setKeysSaved(false), 3000);\n      } catch (err) {\n        alert(\'Network error while saving keys.\');\n      } finally {\n        setIsSavingKeys(false);\n      }\n    } else {\n      setIsSavingKeys(false);\n    }'
);

c = c.replace(
  '          const err = await res.json().catch(() => ({}));\n          alert(\'Failed to save credentials: \' + (err.error || \'Server error\'));\n          return;',
  '          const err = await res.json().catch(() => ({}));\n          alert(\'Failed to save credentials: \' + (err.error || \'Server error\'));\n          setIsSavingCreds(false);\n          return;'
);

c = c.replace(
  '          const err = await res.json();\n          alert(\'Failed to save keys: \' + (err.error || \'Server error\'));\n          return;',
  '          const err = await res.json();\n          alert(\'Failed to save keys: \' + (err.error || \'Server error\'));\n          setIsSavingKeys(false);\n          return;'
);

// Remove the text
c = c.replace(
  '<p className=\"text-[11px] text-neutral-500\">\n          Set the username and password for this admin panel. This updates the primary store account, leaving the developer backup account intact.\n        </p>',
  ''
);

// Update buttons
c = c.replace(
  '<Save className=\"w-4 h-4\" />\n            <span>Update Login</span>',
  '{isSavingCreds ? <div className=\"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin\" /> : <Save className=\"w-4 h-4\" />}\n            <span>{isSavingCreds ? \"Saving...\" : \"Update Login\"}</span>'
);

c = c.replace(
  '<Save className=\"w-4 h-4\" />\n            <span>Save API Keys</span>',
  '{isSavingKeys ? <div className=\"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin\" /> : <Save className=\"w-4 h-4\" />}\n            <span>{isSavingKeys ? \"Saving...\" : \"Save API Keys\"}</span>'
);

// Add disabled={... || isSavingCreds}
c = c.replace(
  'disabled={JSON.stringify(creds) === JSON.stringify(initialCreds)}',
  'disabled={JSON.stringify(creds) === JSON.stringify(initialCreds) || isSavingCreds}'
);
c = c.replace(
  'disabled={JSON.stringify(apiKeys) === JSON.stringify(initialApiKeys)}',
  'disabled={JSON.stringify(apiKeys) === JSON.stringify(initialApiKeys) || isSavingKeys}'
);

fs.writeFileSync('src/components/admin/AdminSettings.tsx', c);
