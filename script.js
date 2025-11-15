// All semester data (credits >0 only included)
const allSemesters = {
  "1":[
    {name:"Mathematics - I",credits:4},
    {name:"Physics",credits:4},
    {name:"Chemistry",credits:4},
    {name:"English for Communication",credits:3},
    {name:"Workshop and Manufacturing Practice",credits:1.5},
    {name:"Physics Laboratory",credits:1.5},
    {name:"Chemistry Laboratory",credits:1.5}
  ],
  "2":[
    {name:"Mathematics - II",credits:4},
    {name:"Basic Electrical Engineering",credits:4},
    {name:"Programming for Problem Solving",credits:3},
    {name:"Engineering Graphics and CAD",credits:3},
    {name:"Basic Electrical Engineering Lab",credits:1.5},
    {name:"Programming Lab",credits:1.5}
  ],
  "3":[
    {name:"Digital System Design",credits:3},
    {name:"Python Programming",credits:3},
    {name:"Data Structures",credits:3},
    {name:"Information Science Intro",credits:3},
    {name:"Biology for Engineers",credits:2},
    {name:"Python Lab",credits:1.5},
    {name:"Data Structures Lab",credits:1.5},
    {name:"Statistics with R Lab",credits:1.5}
  ],
  "4":[
    {name:"Mathematics for Computing",credits:4},
    {name:"Operating Systems",credits:3},
    {name:"OOP with Java",credits:3},
    {name:"Foundations of Data Science",credits:3},
    {name:"Design & Analysis of Algorithms",credits:3},
    {name:"OS Lab (Linux)",credits:1.5},
    {name:"Java Lab",credits:1.5},
    {name:"Algorithms Lab",credits:1.5}
  ],
  "5":[
    {name:"Database Management System",credits:3},
    {name:"Information Theory & Coding",credits:4},
    {name:"Computer Networks",credits:3},
    {name:"Machine Learning",credits:3},
    {name:"Program Elective I",credits:3},
    {name:"DBMS Lab",credits:1.5},
    {name:"Networks Lab",credits:1.5},
    {name:"Machine Learning Lab",credits:1.5},
    {name:"Open Elective",credits:3}
  ],
  "6":[
    {name:"Information Security",credits:3},
    {name:"Information Retrieval",credits:3},
    {name:"Cloud Computing",credits:3},
    {name:"Data Mining",credits:4},
    {name:"Program Elective II",credits:3},
    {name:"Program Elective III",credits:3},
    {name:"Women & Employability",credits:2},
    {name:"Information Retrieval Lab",credits:1.5},
    {name:"Cloud Lab",credits:1.5},
    {name:"Open Elective",credits:3}
  ],
  "7":[
    {name:"Artificial Intelligence",credits:3},
    {name:"Full Stack Development",credits:3},
    {name:"Industrial Economics",credits:3},
    {name:"Program Elective IV",credits:3},
    {name:"Program Elective V",credits:3},
    {name:"AI Lab",credits:1.5},
    {name:"FSD Lab",credits:1.5},
    {name:"Seminar",credits:1},
    {name:"Open Elective",credits:3}
  ],
  "8":[
    {name:"Open Elective (SWAYAM)",credits:2},
    {name:"Open Elective (SWAYAM)",credits:2},
    {name:"Comprehensive Test",credits:1},
    {name:"Internship",credits:2},
    {name:"Project Work",credits:8}
  ]
};

// grade points
const gradePoints = {S:10,A:9,B:8,C:7,D:6,E:5,F:0,FA:0};

// init
document.addEventListener('DOMContentLoaded', ()=>{
  createCGPAInputs();
  restoreFromLocal();
  document.getElementById('darkToggle').addEventListener('click', toggleDark);
  document.getElementById('clearAll').addEventListener('click', clearAllData);
});

function loadSubjects(){
  const sem = document.getElementById('semesterSelect').value;
  const container = document.getElementById('subjects-container');
  container.innerHTML='';
  if(!sem) return;
  const subs = allSemesters[sem];
  subs.forEach((s,idx)=>{
    const div = document.createElement('div');
    div.className='subject-box';
    div.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <strong>${s.name}</strong><span>Credits: ${s.credits}</span></div>
      <select class="grade-select" data-credits="${s.credits}" aria-label="grade">
        <option value="">-- Grade --</option>
        <option value="S">S</option><option value="A">A</option><option value="B">B</option>
        <option value="C">C</option><option value="D">D</option><option value="E">E</option>
        <option value="F">F</option><option value="FA">FA</option>
      </select>`;
    container.appendChild(div);
  });
  // try restore grades for that semester if saved
  restoreSemesterGrades(sem);
}

// SGPA calculation with validation (alerts ON)
function calculateSGPA(){
  const selects = document.querySelectorAll('#subjects-container .grade-select');
  if(selects.length===0){ alert('Please select a semester first.'); return; }
  let totalC=0, totalP=0;
  for(let i=0;i<selects.length;i++){
    const g = selects[i].value;
    const c = parseFloat(selects[i].dataset.credits||0);
    if(g===''){ alert('Please fill all subject grades before calculating SGPA.'); return; }
    totalC += c;
    totalP += gradePoints[g]*c;
  }
  const sgpa = (totalP/totalC).toFixed(2);
  document.getElementById('sgpa-result').innerText = 'SGPA: '+sgpa;
  return sgpa;
}

// save semester SGPA into CGPA inputs and localStorage
function saveSemesterSGPA(){
  const sem = document.getElementById('semesterSelect').value;
  if(!sem){ alert('Select semester first'); return; }
  const sgpa = calculateSGPA();
  if(!sgpa) return;
  const idx = parseInt(sem,10)-1;
  const inputs = document.querySelectorAll('.sgpa-input');
  inputs[idx].value = sgpa;
  saveToLocal();
}

// create CGPA input boxes dynamically
function createCGPAInputs(){
  const container = document.getElementById('cgpa-inputs');
  container.innerHTML='';
  for(let i=1;i<=8;i++){
    const div = document.createElement('div');
    div.className='subject';
    div.innerHTML = `<label>Semester ${i} SGPA</label><input class="sgpa-input" type="number" step="0.01" min="0" max="10" data-sem="${i}" />`;
    container.appendChild(div);
  }
}

// CGPA calculation (no alerts, skip empty)
function calculateCGPA(){
  const inputs = document.querySelectorAll('.sgpa-input');
  let total=0, filled=0;
  inputs.forEach(inp=>{
    const v = inp.value.trim();
    if(v==='') return;
    const n = parseFloat(v);
    if(isNaN(n) || n<0 || n>10) return;
    total+=n; filled++;
  });
  if(filled===0){ document.getElementById('cgpa-result').innerText='CGPA: --'; document.getElementById('percent-result').innerText='Percentage: --'; return; }
  const cgpa = (total/filled).toFixed(2);
  document.getElementById('cgpa-result').innerText = 'CGPA: '+cgpa;
  // update percentage if factor provided
  const factor = parseFloat(document.getElementById('percFactor').value)||9.5;
  document.getElementById('percent-result').innerText = 'Percentage: '+ ( (cgpa*factor).toFixed(2) ) + '%';
  saveToLocal();
}

// convert current CGPA to percentage using factor input
function convertToPercentage(){
  const cgText = document.getElementById('cgpa-result').innerText;
  if(!cgText.includes(':')) return;
  const val = cgText.split(':')[1].trim();
  if(val==='--') return;
  const cg = parseFloat(val);
  const factor = parseFloat(document.getElementById('percFactor').value)||9.5;
  document.getElementById('percent-result').innerText = 'Percentage: '+ ( (cg*factor).toFixed(2) ) + '%';
}

// download printable report (uses print to PDF)
function downloadReport(){
  // build printable content
  const title = document.querySelector('header h1').innerText;
  let html = `<html><head><title>${title} - Report</title><style>body{font-family:Arial;padding:20px}h1{color:#333}</style></head><body>`;
  html += `<h1>${title} - Report</h1>`;
  // SGPA saved inputs
  html += '<h2>SGPAs</h2><ul>';
  document.querySelectorAll('.sgpa-input').forEach((inp,idx)=>{ html += '<li>Semester '+(idx+1)+': '+(inp.value||'--')+'</li>'; });
  html += '</ul>';
  html += '<h2>'+document.getElementById('cgpa-result').innerText+'</h2>';
  html += '<h3>'+document.getElementById('percent-result').innerText+'</h3>';
  html += '</body></html>';
  const w = window.open('','_blank','width=800,height=600');
  w.document.write(html);
  w.document.close();
  w.focus();
  // trigger print (user can choose Save as PDF)
  w.print();
}

// local storage helpers
function saveToLocal(){
  const data = {sgpas:[], grades:{}};
  document.querySelectorAll('.sgpa-input').forEach(inp=> data.sgpas.push(inp.value));
  // also save selected grades per semester
  for(let s=1;s<=8;s++){
    const semKey = 'grades_sem_'+s;
    const selects = document.querySelectorAll('#subjects-container .grade-select');
    // if current semester selected, save those into storage under key, else skip
  }
  localStorage.setItem('ise_cgpa_data', JSON.stringify(data));
}

// restore SGPA inputs from localStorage and saved grades
function restoreFromLocal(){
  const raw = localStorage.getItem('ise_cgpa_data');
  if(!raw) return;
  try{
    const data = JSON.parse(raw);
    if(Array.isArray(data.sgpas)){
      const inputs = document.querySelectorAll('.sgpa-input');
      inputs.forEach((inp,idx)=>{ inp.value = data.sgpas[idx] || ''; });
    }
  }catch(e){}
}

// remove saved semester grade attempts (not storing per-subject for brevity)
function restoreSemesterGrades(sem){ /* placeholder - no per-subject restore */ }

function toggleDark(){
  document.body.classList.toggle('dark');
  // save preference
  localStorage.setItem('ise_theme_dark', document.body.classList.contains('dark')?'1':'0');
}

function clearAllData(){
  if(!confirm('Clear all saved SGPA and grades?')) return;
  document.querySelectorAll('.sgpa-input').forEach(i=> i.value='');
  document.querySelectorAll('#subjects-container .grade-select').forEach(s=> s.value='');
  document.getElementById('sgpa-result').innerText='SGPA: --';
  document.getElementById('cgpa-result').innerText='CGPA: --';
  document.getElementById('percent-result').innerText='Percentage: --';
  localStorage.removeItem('ise_cgpa_data');
}
