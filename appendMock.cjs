const fs = require('fs');
let data = fs.readFileSync('src/mock/data.ts', 'utf8');

const appendData = fs.readFileSync('mockDataToAppend.txt', 'utf8');
const pMatch = appendData.match(/\/\* PATIENTS \*\/\n([\s\S]*?)\n\n\/\* ENCOUNTERS \*\//);
const eMatch = appendData.match(/\/\* ENCOUNTERS \*\/\n([\s\S]*?)\n\n\/\* LIFECYCLES \*\//);
const lMatch = appendData.match(/\/\* LIFECYCLES \*\/\n([\s\S]*)$/);

const patientsStr = pMatch[1];
const encountersStr = eMatch[1];
const lifecyclesStr = lMatch[1];

data = data.replace(
  `    isMember: false,
  },
];`,
  `    isMember: false,
  },
${patientsStr}
];`
);

data = data.replace(
  `  { id: 'E005', patientId: 'P005', specialty: 'phu_khoa', visitType: 'kham_phu_khoa', doctor: 'BS. Võ Hải', visitDate: '2026-05-10' },
];`,
  `  { id: 'E005', patientId: 'P005', specialty: 'phu_khoa', visitType: 'kham_phu_khoa', doctor: 'BS. Võ Hải', visitDate: '2026-05-10' },
${encountersStr}
];`
);

data = data.replace(
  `    startedAt: '2026-03-01',
    endedAt: null,
  },
];`,
  `    startedAt: '2026-03-01',
    endedAt: null,
  },
${lifecyclesStr}
];`
);

fs.writeFileSync('src/mock/data.ts', data);
console.log('Appended mock data!');
