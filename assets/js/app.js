let students = [];

// جلب البيانات
fetch('data/students.json')
    .then(r => r.json())
    .then(data => {
        students = data;
        initGrades();
    });

// التبديل بين التبويبات
function showTab(t) {
    document.getElementById('search-id').style.display = t === 'id' ? 'block' : 'none';
    document.getElementById('search-list').style.display = t === 'list' ? 'block' : 'none';
    
    // تحديث الأزرار النشطة
    document.getElementById('tab-id').classList.toggle('active', t === 'id');
    document.getElementById('tab-list').classList.toggle('active', t === 'list');
    
    // تفريغ النتائج عند التبديل لتجربة مستخدم أنظف
    document.getElementById('resultId').innerHTML = '';
    document.getElementById('resultList').innerHTML = '';
}

// دالة لدعم ضغط زر Enter في مربع البحث
function handleEnter(e) {
    if(e.key === 'Enter') searchById();
}

// البحث برقم الهوية
function searchById() {
    let id = document.getElementById('nationalId').value.trim();
    if(!id) return; // عدم البحث إذا كان الحقل فارغاً
    
    let s = students.find(x => x.national_id === id);
    let container = document.getElementById('resultId');
    
    if (s) {
        container.innerHTML = render(s);
    } else {
        container.innerHTML = `
            <div class="not-found">
                <i class="fas fa-exclamation-circle"></i>
                لم يتم العثور على طالب بهذا الرقم
            </div>`;
    }
}

// تهيئة القوائم
function initGrades() {
    let g = [...new Set(students.map(s => s.grade))];
    let sel = document.getElementById('grade');
    sel.innerHTML = '<option value="">-- اختر الصف الدراسي --</option>';
    g.forEach(x => sel.innerHTML += `<option>${x}</option>`);
}

function loadClasses() {
    let grade = document.getElementById('grade').value;
    let c = [...new Set(students.filter(s => s.grade === grade).map(s => s.class))];
    let sel = document.getElementById('class');
    sel.innerHTML = '<option value="">-- اختر الفصل --</option>';
    c.forEach(x => sel.innerHTML += `<option>${x}</option>`);
    
    // تصفير قائمة الطلاب
    document.getElementById('student').innerHTML = '<option value="">-- اختر الطالب --</option>';
}

function loadStudents() {
    let grade = document.getElementById('grade').value;
    let cls = document.getElementById('class').value;
    let list = students.filter(s => s.grade === grade && s.class === cls);
    let sel = document.getElementById('student');
    sel.innerHTML = '<option value="">-- اختر الطالب --</option>';
    list.forEach(s => sel.innerHTML += `<option value="${s.national_id}">${s.name}</option>`);
}

function showStudent() {
    let id = document.getElementById('student').value;
    if(!id) return;
    let s = students.find(x => x.national_id === id);
    document.getElementById('resultList').innerHTML = s ? render(s) : '';
}

// دالة العرض المحسنة (تصميم البطاقة)
function render(s) {
    return `
    <div class="result-card">
        <div class="result-header">
            <div class="result-icon">
                <i class="fas fa-user-graduate"></i>
            </div>
            <div>
                <span class="info-label">اسم الطالب</span>
                <div class="student-name">${s.name}</div>
            </div>
        </div>
        
        <div class="result-grid">
            <div class="info-item">
                <span class="info-label">الصف / الفصل</span>
                <span class="info-value">${s.grade} - ${s.class}</span>
            </div>
            <div class="info-item">
                <span class="info-label">رقم الجلوس</span>
                <span class="info-value" style="color:var(--primary-color)">${s.seat}</span>
            </div>
            <div class="info-item" style="grid-column: span 2; background: #eff6ff; border-color: #bfdbfe;">
                <span class="info-label">مقر اللجنة</span>
                <span class="info-value"><i class="fas fa-map-marker-alt"></i> لجنة رقم (${s.committee})</span>
            </div>
        </div>
    </div>`;
}
