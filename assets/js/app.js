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
    <div class="ticket-container">
        <div class="ticket-header">
            <h3><i class="fas fa-address-card"></i> بطاقة لجنة اختبار</h3>
            <span class="id-badge">ID: ${s.national_id}</span>
        </div>

        <div class="ticket-body">
            <div class="student-main-info">
                <i class="fas fa-user-circle fa-3x" style="color:#cbd5e1; margin-bottom:10px"></i>
                <h2>${s.name}</h2>
                <p>${s.grade} - فصل (${s.class})</p>
            </div>

            <div class="ticket-grid">
                <div class="data-box highlight">
                    <i class="fas fa-chair icon"></i>
                    <span class="label">رقم الجلوس</span>
                    <span class="value">${s.seat}</span>
                </div>

                <div class="data-box highlight">
                    <i class="fas fa-door-open icon"></i>
                    <span class="label">رقم اللجنة</span>
                    <span class="value">${s.committee}</span>
                </div>
            </div>
            
            <div style="text-align:center; margin-top:20px;">
                <button onclick="window.print()" style="background:transparent; color:#64748b; border:1px solid #cbd5e1; width:auto; padding:8px 20px;">
                    <i class="fas fa-print"></i> طباعة البطاقة
                </button>
            </div>
        </div>
    </div>`;
}
