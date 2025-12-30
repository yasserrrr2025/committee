
let students=[];

fetch('data/students.json')
.then(r=>r.json())
.then(data=>{
students=data;
initGrades();
});

function showTab(t){
document.getElementById('search-id').style.display=t==='id'?'block':'none';
document.getElementById('search-list').style.display=t==='list'?'block':'none';
document.getElementById('tab-id').classList.toggle('active',t==='id');
document.getElementById('tab-list').classList.toggle('active',t==='list');
}

function searchById(){
let id=document.getElementById('nationalId').value.trim();
let s=students.find(x=>x.national_id===id);
document.getElementById('resultId').innerHTML=s?render(s):'لم يتم العثور على نتيجة';
}

function initGrades(){
let g=[...new Set(students.map(s=>s.grade))];
let sel=document.getElementById('grade');
sel.innerHTML='<option value="">اختر الصف</option>';
g.forEach(x=>sel.innerHTML+=`<option>${x}</option>`);
}

function loadClasses(){
let grade=document.getElementById('grade').value;
let c=[...new Set(students.filter(s=>s.grade===grade).map(s=>s.class))];
let sel=document.getElementById('class');
sel.innerHTML='<option value="">اختر الفصل</option>';
c.forEach(x=>sel.innerHTML+=`<option>${x}</option>`);
}

function loadStudents(){
let grade=document.getElementById('grade').value;
let cls=document.getElementById('class').value;
let list=students.filter(s=>s.grade===grade && s.class===cls);
let sel=document.getElementById('student');
sel.innerHTML='<option value="">اختر الطالب</option>';
list.forEach(s=>sel.innerHTML+=`<option value="${s.national_id}">${s.name}</option>`);
}

function showStudent(){
let id=document.getElementById('student').value;
let s=students.find(x=>x.national_id===id);
document.getElementById('resultList').innerHTML=s?render(s):'';
}

function render(s){
return `<div class="result">
<strong>الاسم:</strong> ${s.name}<br>
<strong>الصف:</strong> ${s.grade} / ${s.class}<br>
<strong>اللجنة:</strong> ${s.committee}<br>
<strong>رقم الجلوس:</strong> ${s.seat}
</div>`;
}
