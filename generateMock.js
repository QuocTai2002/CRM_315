const fs = require('fs');
const patients = [];
const encounters = [];
const lifecycles = [];

let idCount = 6;
let encounterCount = 6;
let lcCount = 7;

// 10 Sản
for(let i=0; i<10; i++) {
  let pid = 'P' + String(idCount).padStart(3, '0');
  patients.push(`  {
    id: '${pid}',
    code: 'BN${String(idCount).padStart(4, '0')}',
    fullName: 'Bệnh nhân Sản ${i+1}',
    gender: 'female',
    dob: '199${Math.floor(Math.random() * 9)}-05-10',
    phone: '0901234${String(i).padStart(3, '0')}',
    avatar: '',
    isMember: false,
  }`);
  encounters.push(`  { id: 'E${String(encounterCount).padStart(3, '0')}', patientId: '${pid}', specialty: 'san', visitType: 'kham_thai', doctor: 'BS. Sản Khoa', visitDate: '2026-05-08' }`);
  lifecycles.push(`  { id: 'LC${String(lcCount).padStart(3, '0')}', patientId: '${pid}', program: 'maternity', specialty: 'san', stage: 'week_28', status: 'active', startedAt: '2026-05-01', endedAt: null }`);
  idCount++; encounterCount++; lcCount++;
}

// 15 Nhi
for(let i=0; i<15; i++) {
  let pid = 'P' + String(idCount).padStart(3, '0');
  patients.push(`  {
    id: '${pid}',
    code: 'BN${String(idCount).padStart(4, '0')}',
    fullName: 'Bệnh nhân Nhi ${i+1}',
    gender: i % 2 === 0 ? 'male' : 'female',
    dob: '202${Math.floor(Math.random() * 5)}-08-15',
    phone: '0912345${String(i).padStart(3, '0')}',
    avatar: '',
    isMember: false,
  }`);
  encounters.push(`  { id: 'E${String(encounterCount).padStart(3, '0')}', patientId: '${pid}', specialty: 'nhi', visitType: 'kham_nhi', doctor: 'BS. Nhi Khoa', visitDate: '2026-05-08' }`);
  lifecycles.push(`  { id: 'LC${String(lcCount).padStart(3, '0')}', patientId: '${pid}', program: 'pediatric', specialty: 'nhi', stage: 'month_6', status: 'active', startedAt: '2026-05-01', endedAt: null }`);
  idCount++; encounterCount++; lcCount++;
}

const out = "/* PATIENTS */\n" + patients.join(',\n') + "\n\n/* ENCOUNTERS */\n" + encounters.join(',\n') + "\n\n/* LIFECYCLES */\n" + lifecycles.join(',\n');

fs.writeFileSync('mockDataToAppend.txt', out);
console.log('DONE');
