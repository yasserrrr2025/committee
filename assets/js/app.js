let students = [];

// تحميل البيانات
fetch('data/students.json')
    .then(r => r.json())
    .then(data => {
        students = data;
        initGrades();
    });

// التبديل بين الأوضاع
function switchMode(mode) {
    // إخفاء النتائج السابقة
    document.getElementById('resultArea').innerHTML = '';
    
    // تحديث الأزرار
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${mode}`).classList.add('active');

    // إظهار القسم المطلوب مع تأثير بسيط
    const sId = document.getElementById('search-id');
    const sList = document.getElementById('search-list');

    if (mode === 'id') {
        sList.style.display = 'none';
        sId.style.display = 'block';
        sId.style.opacity = 0;
        setTimeout(() => sId.style.opacity = 1, 50);
    } else {
        sId.style.display = 'none';
        sList.style.display = 'block';
        sList.style.opacity = 0;
        setTimeout(() => sList.style.opacity = 1, 50);
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') startSearch('id');
}

// دالة البحث مع تأثير التحميل
function startSearch(type) {
    const resultArea = document.getElementById('resultArea');
    const loader = document.getElementById('loader');
    
    let studentData = null;

    if (type === 'id') {
        const val = document.getElementById('nationalId').value.trim();
        if (!val) return;
        studentData = students.find(x => x.national_id === val);
    } else {
        const val = document.getElementById('student').value;
        if (!val) return;
        studentData = students.find(x => x.national_id === val);
    }

    // إظهار اللودر وإخفاء النتيجة السابقة
    resultArea.innerHTML = '';
    loader.style.display = 'block';

    // محاكاة تأخير الشبكة لإعطاء شعور "النظام التقني"
    setTimeout(() => {
        loader.style.display = 'none';
        
        if (studentData) {
            resultArea.innerHTML = renderCard(studentData);
        } else {
            resultArea.innerHTML = `
                <div class="not-found-msg">
                    <i class="fas fa-times-circle"></i><br>
                    لم يتم العثور على بيانات مطابقة في السجلات
                </div>
            `;
        }
    }, 800); // تأخير 800 جزء من الثانية
}

// تعبئة القوائم
function initGrades() {
    let g = [...new Set(students.map(s => s.grade))];
    let sel = document.getElementById('grade');
    sel.innerHTML = '<option value="">اختر المرحلة الدراسية</option>';
    g.forEach(x => sel.innerHTML += `<option>${x}</option>`);
}

function loadClasses() {
    let grade = document.getElementById('grade').value;
    let c = [...new Set(students.filter(s => s.grade === grade).map(s => s.class))];
    let sel = document.getElementById('class');
    sel.innerHTML = '<option value="">اختر الفصل</option>';
    c.forEach(x => sel.innerHTML += `<option>${x}</option>`);
    
    // تصفير
    document.getElementById('student').innerHTML = '<option value="">اختر الطالب</option>';
}

function loadStudents() {
    let grade = document.getElementById('grade').value;
    let cls = document.getElementById('class').value;
    let list = students.filter(s => s.grade === grade && s.class === cls);
    let sel = document.getElementById('student');
    sel.innerHTML = '<option value="">اختر الطالب من القائمة</option>';
    list.forEach(s => sel.innerHTML += `<option value="${s.national_id}">${s.name}</option>`);
}

// تصميم البطاقة الرقمية (Holo Card)
function renderCard(s) {
    return `
    <div class="holo-card">
        <div class="card-header">
            <span style="color:var(--neon-blue); font-size:0.8rem; letter-spacing:1px">DATA VERIFIED</span>
            <div class="card-status">نشط</div>
        </div>
        
        <div class="card-body">
            <div class="student-name-display">${s.name}</div>
            <div class="student-grade-display">${s.grade} - ${s.class}</div>
            
            <div class="info-grid">
                <div class="info-box highlight">
                    <span class="box-label">رقم الجلوس (Seat)</span>
                    <span class="box-value">${s.seat}</span>
                </div>
                
                <div class="info-box highlight">
                    <span class="box-label">اللجنة (Committee)</span>
                    <span class="box-value">${s.committee}</span>
                </div>

                <div class="info-box">
                     <span class="box-label">رقم الهوية</span>
                     <div style="font-weight:bold; letter-spacing:1px; margin-top:5px">${s.national_id}</div>
                </div>

                <div class="info-box">
                     <span class="box-label">رقم التسلسل</span>
                     <div style="font-weight:bold; margin-top:5px">#${s.seat_full.slice(-4)}</div>
                </div>
            </div>

            <div style="margin-top:20px; font-size:0.7rem; color:var(--text-sec);">
                يرجى التوجه لمقر اللجنة قبل موعد الاختبار بـ 15 دقيقة
            </div>
        </div>
    </div>
    `;
}
