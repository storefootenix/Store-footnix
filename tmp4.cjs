const fs = require('fs');
let c = fs.readFileSync('src/components/admin/AdminSettings.tsx', 'utf8');

c = c.replace(
  '  const [credsSaved, setCredsSaved] = useState(false);\r\n  const [initialApiKeys, setInitialApiKeys] = useState(defaultKeys);\r\n  const [keysSaved, setKeysSaved] = useState(false);',
  '  const [credsSaved, setCredsSaved] = useState(false);\n  const [isSavingCreds, setIsSavingCreds] = useState(false);\n  const [initialApiKeys, setInitialApiKeys] = useState(defaultKeys);\n  const [keysSaved, setKeysSaved] = useState(false);\n  const [isSavingKeys, setIsSavingKeys] = useState(false);'
);

c = c.replace(
  '  const [credsSaved, setCredsSaved] = useState(false);\n  const [initialApiKeys, setInitialApiKeys] = useState(defaultKeys);\n  const [keysSaved, setKeysSaved] = useState(false);',
  '  const [credsSaved, setCredsSaved] = useState(false);\n  const [isSavingCreds, setIsSavingCreds] = useState(false);\n  const [initialApiKeys, setInitialApiKeys] = useState(defaultKeys);\n  const [keysSaved, setKeysSaved] = useState(false);\n  const [isSavingKeys, setIsSavingKeys] = useState(false);'
);


fs.writeFileSync('src/components/admin/AdminSettings.tsx', c);
