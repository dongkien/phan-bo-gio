/* Bộ nghiệm thu đề cương FTU mẫu 2025. Chạy trên trình duyệt, không có máy chủ.
   API: NghiemThu.parseDocx(xml) -> blocks; NghiemThu.check(blocks, opts) -> findings;
        NghiemThu.checkFile(file, opts) -> {name, lang, findings, meta}
   opts: {expect:{x,y,z,e}|null, bomon:true|false (áp quy ước Bộ môn KT&QL), ctdt: kết quả parseCtdt (tùy chọn)}
   Finding: {g: nhóm, status: fail|warn|pass, t: tiêu đề, d: chi tiết, src: 'truong'|'bomon'} */
(function(global){
'use strict';
const VERSION='1.9 (8/9/2026)';
function cloRefs(t){ const out=new Set(); String(t||'').replace(/CLO/gi,' ').replace(/(\d+)\s*[-–]\s*(\d+)/g,(m,a,b)=>{ for(let k=+a;k<=+b&&k<100;k++) out.add(k); return ' '; }).split(/[^\d]+/).forEach(x=>{ if(x) out.add(parseInt(x,10)); }); return [...out].filter(n=>n>0); }
const W='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const lower=s=>String(s||'').normalize('NFC').toLowerCase();
const num=s=>{ if(s==null) return NaN; s=String(s).trim().replace(/\s+/g,''); if(!s) return NaN; if(/^-?\d+,\d+$/.test(s)) s=s.replace(',','.'); const v=parseFloat(s); return isNaN(v)?NaN:v; };
const fmt=v=>Math.abs(v-Math.round(v))<1e-9?String(Math.round(v)):v.toLocaleString('vi-VN',{maximumFractionDigits:2});
const isInt=v=>Math.abs(v-Math.round(v))<1e-9;
const viChars=/[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/;
const enWords=/\b(the|and|of|edition|press|introduction|analysis|economics|handbook|journal|review|university|publishing|principles|management|theory)\b/i;
const isEnglish=t=>!viChars.test(t.replace(/\([^)]*\)/g,''))&&enWords.test(t);
const isVietnamese=t=>viChars.test(t.replace(/\([^)]*\)/g,''));

/* ---------- đọc docx ---------- */
function parseDocx(xml){
  const doc=new DOMParser().parseFromString(xml,'application/xml');
  const body=doc.getElementsByTagNameNS(W,'body')[0];
  const blocks=[];
  const textOf=el=>{ let s=''; const walk=n=>{ for(const c of n.childNodes){ if(c.nodeType!==1) continue; const ln=c.localName; if(ln==='t') s+=c.textContent; else if(ln==='tab') s+='\t'; else if(ln==='br'&&c.getAttributeNS(W,'type')!=='page') s+='\n'; else if(ln==='footnoteReference'||ln==='drawing'||ln==='pict') {} else walk(c); } }; walk(el); return s.normalize('NFC'); };
  const paraInfo=p=>{
    const info={type:'p',text:textOf(p).trim(),red:[],footnote:0,pageBreak:0,drawing:0};
    for(const r of p.getElementsByTagNameNS(W,'r')){
      const col=r.getElementsByTagNameNS(W,'color')[0]; const val=col?col.getAttributeNS(W,'val').toUpperCase():'';
      const t=textOf(r).trim();
      if(t&&(val==='FF0000'||val==='C00000'||val==='RED')) info.red.push(t);
      info.footnote+=r.getElementsByTagNameNS(W,'footnoteReference').length;
      for(const br of r.getElementsByTagNameNS(W,'br')) if(br.getAttributeNS(W,'type')==='page') info.pageBreak++;
      info.drawing+=r.getElementsByTagNameNS(W,'drawing').length+r.getElementsByTagNameNS(W,'pict').length;
    }
    const ppr=p.getElementsByTagNameNS(W,'pPr')[0]; if(ppr&&ppr.getElementsByTagNameNS(W,'pageBreakBefore').length) info.pageBreak++;
    return info;
  };
  const tableGrid=tbl=>{
    const grid=[]; const red=[]; let footnote=0;
    for(const tr of [...tbl.childNodes].filter(n=>n.nodeType===1&&n.localName==='tr')){
      const row=[];
      for(const tc of [...tr.childNodes].filter(n=>n.nodeType===1&&n.localName==='tc')){
        const ps=[...tc.childNodes].filter(n=>n.nodeType===1&&n.localName==='p').map(paraInfo);
        const text=ps.map(x=>x.text).filter(Boolean).join('\n');
        ps.forEach(x=>{ red.push(...x.red); footnote+=x.footnote; });
        const tcPr=tc.getElementsByTagNameNS(W,'tcPr')[0]; const gs=tcPr?tcPr.getElementsByTagNameNS(W,'gridSpan')[0]:null; const span=gs?parseInt(gs.getAttributeNS(W,'val'),10)||1:1;
        for(let i=0;i<span;i++) row.push(text);
      }
      grid.push(row);
    }
    return {type:'t',grid,red,footnote};
  };
  const walkBody=n=>{ for(const c of n.childNodes){ if(c.nodeType!==1) continue; if(c.localName==='p') blocks.push(paraInfo(c)); else if(c.localName==='tbl') blocks.push(tableGrid(c)); else if(c.localName==='sdt'||c.localName==='sdtContent') walkBody(c); } };
  walkBody(body);
  return blocks;
}

/* ---------- cấu hình theo ngôn ngữ ---------- */
const CFG={
  vn:{
    name:'tiếng Việt', title:/ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN/, otherTitle:/^SYLLABUS$/m, otherName:'tiếng Anh',
    decision:/Kèm theo QĐ/, decisionKeep:/Kèm theo|QĐ-ĐHNT|Hiệu trưởng|Attached to|President/, decisionLabel:'"Kèm theo QĐ số … /QĐ-ĐHNT"',
    fields:[['Tên học phần',['tên học phần'],'tiếng việt (tiếng anh)'],['Mã học phần',['mã học phần'],''],['Khoa phụ trách',['khoa phụ trách'],''],['Trường/Khoa',['trường/khoa','trường','khoa'],''],['Số tín chỉ',['số tín chỉ'],'']],
    oldFields:[['bộ môn phụ trách','"Bộ môn phụ trách:" là nhãn cũ. Trường đã bỏ Bộ môn, đổi thành "Khoa phụ trách:" và ghi tên Khoa.'],['viện/khoa','"Viện/Khoa:" là nhãn cũ, đổi thành "Trường/Khoa:" (ghi "Trường:" hoặc "Khoa:" theo đơn vị quản lý học phần).'],['viện','"Viện:" là nhãn cũ, đổi thành "Trường:" hoặc "Khoa:".']],
    vkMissing:'Thiếu dòng "Trường:" hoặc "Khoa:" (đơn vị quản lý học phần)', bmMissing:'Thiếu dòng "Khoa phụ trách:" (Trường đã bỏ Bộ môn)', prereq:['điều kiện tiên quyết',/Tên học phần \(Mã học phần tiên quyết\)/],
    headings:[['1.','THÔNG TIN VỀ GIẢNG VIÊN'],['2.','MÔ TẢ HỌC PHẦN'],['3.','CHUẨN ĐẦU RA'],['3.1.','Chuẩn đầu ra của học phần'],['3.2.','Ma trận đóng góp'],['4.','HỌC LIỆU'],['5.','NỘI DUNG, PHƯƠNG PHÁP'],['5.1.','Nội dung học phần'],['5.2.','Phương pháp và kế hoạch giảng dạy'],['6.','QUY ĐỊNH ĐỐI VỚI HỌC PHẦN'],['6.1.','Nhiệm vụ của sinh viên'],['6.2.','Quy định về thi cử'],['7.','PHƯƠNG PHÁP, HÌNH THỨC KIỂM TRA']],
    sec4:{gt:'giáo trình',bb:'tài liệu tham khảo bắt buộc',tc:'tài liệu tham khảo tự chọn',web:'website',bbShort:/^4\.\d\.?\s+Tài liệu\s+(bắt buộc|tự chọn)/i,shortFix:'"Tài liệu tham khảo bắt buộc" / "Tài liệu tham khảo tự chọn"'},
    gtGuide:/đề nghị sử dụng giáo trình/i, matGuide:/Xem Bảng phân nhiệm/i, descGuide:/Bao gồm mục tiêu đào tạo/i,
    clo:/^-?\s*CLO\s*\d+/i, cloEmpty:/^-?\s*CLO\s*\d+\s*:?\s*$/i, dots:/^…$|^\.\.\.$/, starLabel:/^\*\s/,
    tbl:{instr:/họ và tên/i,t51:/phân bổ thời gian|lý thuyết/i,t52:/hoạt động dạy và học/i,assess:/trọng số/i,sig:/trưởng bộ môn|trưởng khoa|viện trưởng|hiệu trưởng/i,matRow:/^(học phần|tổng phân nhiệm|tổng hợp)/i}, special:/khóa luận|đề án tốt nghiệp|luận văn|luận án|thực tập tốt nghiệp/i,
    instrName:1,
    cols51:{ht:['hình thức'],x:['lý thuyết'],y:['thực hành'],z:['tiểu luận','bài tập lớn'],e:['tự học'],clo:['clo'],onclass:'giảng dạy trên lớp'},
    buoi:/buổi/i, totalRow:/^tổng/i, tiet:/\btiết\b/i,
    acts:[['lt','Lý thuyết',/lý thuyết/],['th','Thực hành thảo luận',/thực hành|thảo luận/],['tl','Tiểu luận BTL',/tiểu luận|bài tập|thực tế/],['tu','Tự học',/tự học/],['kt','Kiểm tra đánh giá',/kiểm tra|đánh giá/]],
    note52:/Lưu ý:\s*Các hoạt động kết nối thực tiễn/i, note52Old:/quyết định của Bộ môn/i, note52Text:'"Lưu ý: Các hoạt động kết nối thực tiễn và phương pháp kiểm tra đánh giá có thể linh hoạt theo điều kiện thực tế và quyết định của Khoa."',
    assess:{cc:/chuyên cần/i,ck:/cuối kỳ|kết thúc học phần|tổng kết/i,total:/^tổng/i,example:/ví dụ:/i},
    ktForm:/chuyên cần|giữa kỳ|cuối kỳ|thường xuyên|kết thúc học phần|tổng kết|bài tập lớn|tiểu luận|thuyết trình/i, ktHint:'Dòng "Kiểm tra, đánh giá" không ghi giờ; ô Nội dung chính ghi tên hình thức đánh giá sẽ dùng nội dung của buổi này (Chuyên cần, Giữa kỳ, Cuối kỳ), không ghi câu hỏi hay nội dung ôn tập.',
    oldUnit:/\bBộ môn\b/, oldUnitMsg:'Còn chữ "Bộ môn" trong văn bản. Trường đã bỏ Bộ môn, thay bằng "Khoa".',
    ph:/\(mô tả chi tiết\)|Ví dụ:|…{1,}%|\.{4,}\s*%|^…$|1,2,\.\.\.|5,6,\.\.\.|\(nếu có\)/, phSkip:/Kèm theo/,
    sig:{bm:/trưởng khoa/i,vk:/hiệu trưởng/i,old:/trưởng bộ môn|viện trưởng/i,gv:/giảng viên biên soạn/i,bmName:'Trưởng Khoa',vkName:'Hiệu trưởng',oldMsg:'Khối ký còn chức danh cũ (Trưởng Bộ môn / Viện trưởng). Trường đã bỏ Bộ môn: ô trái TRƯỞNG KHOA, ô phải HIỆU TRƯỞNG.'},
    otherLang:isEnglish, otherLangName:'tiếng Anh', leftover:/^(Course title|Course code|Credit hours|COURSE DESCRIPTION|READING MATERIALS)/,
    unit:'giờ'
  },
  en:{
    name:'tiếng Anh', title:/^SYLLABUS$/m, otherTitle:/ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN/, otherName:'tiếng Việt',
    decision:/Attached to Decision/, decisionKeep:/Attached to|QD-ĐHNT|QĐ-ĐHNT|President|Kèm theo/, decisionLabel:'"Attached to Decision No. … /QD-ĐHNT"',
    fields:[['Course title',['course title'],'english (vietnamese)'],['Course code',['course code'],''],['Department',['department'],''],['Faculty/College',['faculty/college','college','faculty'],''],['Credit hours',['credit hours','credits'],'']],
    oldFields:[['faculty/school','"Faculty/School:" là nhãn cũ, đổi thành "Faculty/College:" (ghi "College:" cho trường thuộc hoặc "Faculty:" cho khoa độc lập).'],['school','"School:" là nhãn cũ, trường thuộc ghi "College:".']],
    vkMissing:'Thiếu dòng "Faculty/College:" (ghi "College:" cho trường thuộc hoặc "Faculty:" cho khoa độc lập)', bmMissing:'Thiếu dòng "Department:" (Khoa chuyên môn)', prereq:['prerequisite',/^$/],
    headings:[['1.','INSTRUCTOR'],['2.','COURSE DESCRIPTION'],['3.','COURSE LEARNING OUTCOMES'],['3.1.','Course learning outcomes'],['3.2.','Matrix'],['4.','READING MATERIALS'],['5.','COURSE CONTENTS'],['5.1.','Course contents'],['5.2.','Teaching method'],['6.','COURSE POLICY'],['6.1.','Student Responsibilities'],['6.2.','Regulations on examination'],['7.','COURSE ASSESSMENT']],
    sec4:{gt:'textbook',bb:'compulsory reading',tc:'optional reading',web:'website',bbShort:/^$/,shortFix:''},
    gtGuide:/It is required to use textbooks/i, matGuide:/See the Guidance/i, descGuide:/Include Course Objectives/i,
    clo:/^-?\s*CLO\s*\d+/i, cloEmpty:/^-?\s*CLO\s*\d+\s*:?\s*$/i, dots:/^…$|^\.\.\.$/, starLabel:/^\*\s/,
    tbl:{instr:/full name/i,t51:/time allocation|lecture/i,t52:/teaching and learning activit/i,assess:/proportion/i,sig:/head of department|dean|president|rector/i,matRow:/^(course|total)/i}, special:/thesis|dissertation|graduation project|capstone|internship report/i,
    instrName:1,
    cols51:{ht:['mode','format','delivery'],x:['lecture'],y:['practice','seminar'],z:['essay','assignment','exercise'],e:['self-study','self study'],clo:['clo'],onclass:'hour(s) on the class'},
    buoi:/no\.?|session|week/i, totalRow:/^total/i, tiet:/\bperiods?\b/i,
    acts:[['lt','Lecture',/lecture/],['th','Practice, seminar',/practice|seminar|discussion/],['tl','Essays, assignments',/essay|assignment|exercise|project|field/],['tu','Self-study',/self.study/],['kt','Assessment',/assessment|test|exam|quiz/]],
    note52:/^Note:.*(flexib|adjust)/im, note52Old:/^$/, note52Text:'"Note: Practical activities and assessment methods may be adjusted according to actual conditions and the decision of the Department."',
    assess:{cc:/attendance/i,ck:/final/i,total:/^total/i,example:/for example:/i},
    ktForm:/attendance|mid-?term|final|quiz|test|exam|assignment|project|presentation/i, ktHint:'The "Assessment" row has no hours; its Content names the assessment form(s) that use this session (Attendance, Mid-term, Final exam), not review questions.',
    oldUnit:/^$/, oldUnitMsg:'',
    ph:/\(describe the details\)|For example:|…{1,}%|\.{4,}\s*%|^…$|1,2,\.\.\.|5,6,\.\.\.|\(if any\)|^Note: Please list all/, phSkip:/Attached to/,
    sig:{bm:/head of department/i,vk:/\bdean\b/i,old:/president|rector|vice dean/i,gv:/prepared by|compiled by/i,bmName:'Head of Department (Trưởng Khoa)',vkName:'Dean (Hiệu trưởng trường thuộc)',oldMsg:'Khối ký bản tiếng Anh: ô trái HEAD OF DEPARTMENT (Trưởng Khoa), ô phải DEAN (Hiệu trưởng trường thuộc). Không dùng President.'},
    otherLang:isVietnamese, otherLangName:'tiếng Việt', leftover:/^(Tên học phần|Mã học phần|Số tín chỉ|MÔ TẢ HỌC PHẦN|HỌC LIỆU)/,
    unit:'giờ'
  }
};

/* ---------- tiện ích bảng ---------- */
function findTable(tables,pred){ return tables.find(t=>pred(t.grid)); }
function headerRows(grid,cfg){ const rows=[]; for(const r of grid){ const c0=(r[0]||'').trim(); if(rows.length&&(/^\d/.test(c0)||new RegExp('^'+cfg.buoi.source+'\\s*\\d','i').test(c0)||r.some(c=>cfg.totalRow.test((c||'').trim())))) break; rows.push(r); if(rows.length>=4) break; } return rows; }
function colIndex(hdrRows,ncol,kw){ for(let c=0;c<ncol;c++){ for(let i=hdrRows.length-1;i>=0;i--){ const t=lower(hdrRows[i][c]); if(kw.some(k=>t.includes(k))) return c; } } return -1; }

/* ---------- kiểm ---------- */
function detectLang(paras){ const all=paras.map(p=>p.text).join('\n'); const vn=CFG.vn.title.test(all), en=CFG.en.title.test(all); return {vn,en,lang:vn?'vn':(en?'en':'vn')}; }

function check(blocks,opts){
  opts=opts||{}; const expect=opts.expect||null; const bomon=opts.bomon!==false;
  const R=[]; const add=(g,status,t,d,src)=>{ R.push({g,status,t,d:d||'',src:src||'truong'}); };
  const BM='bomon';
  const paras=blocks.filter(b=>b.type==='p'); const tables=blocks.filter(b=>b.type==='t');
  const {vn,en,lang}=detectLang(paras); const C=CFG[lang];
  const allText=paras.map(p=>p.text).join('\n');
  const G1='Cấu trúc',G2='Nội dung',G3='Giờ và bảng 5.1, 5.2',G4='Đánh giá',G5='Hình thức',G6='Đối chiếu CTĐT';
  const meta={lang,tc:NaN,title:'',code:'',tot51:null};

  if(vn&&en) add(G1,'warn','Chưa tách song ngữ','File còn cả "ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN" và "SYLLABUS". Nộp bản một thứ tiếng thì tách nửa còn lại ra. Đang kiểm theo bản '+C.name+'.');
  else add(G1,'pass',`Bản ${C.name}, đã tách song ngữ`);
  if(C.decision.test(allText)) add(G1,'pass','Còn dòng '+C.decisionLabel); else add(G1,'fail','Mất dòng '+C.decisionLabel,'Đây là cấu phần chính thức, không phải chú thích. Khôi phục từ mẫu.');

  // đầu đề
  const field=(labels)=>{ const p=paras.find(p=>{ const t=lower(p.text); return labels.some(a=>t.startsWith(a)&&/^\s*:/.test(t.slice(a.length))); }); if(!p) return null; return p.text.slice(p.text.indexOf(':')+1).trim(); };
  (C.oldFields||[]).forEach(([lab,msg])=>{ if(field([lab])!=null) add(G1,'fail',msg.split('.')[0],msg,'truong'); });
  C.fields.forEach(([name,labels,ph])=>{ const v=field(labels); if(v==null){ const isVK=/^(Trường\/Khoa|Faculty\/College)$/.test(name), isBM=/^(Khoa phụ trách|Department)$/.test(name); if((isVK&&field(['viện/khoa','viện','faculty/school','school']))||(isBM&&field(['bộ môn phụ trách','bộ môn']))) return; add(G1,'fail',isVK?C.vkMissing:isBM?C.bmMissing:`Thiếu dòng "${name}:"`); return; } else if(!v||lower(v)===ph) add(G2,'fail',`"${name}:" chưa điền`); else { add(G2,'pass',`${name}: ${v.length>90?v.slice(0,90)+'…':v}`); if(name==='Tên học phần'||name==='Course title') meta.title=v; if(/^(Khoa phụ trách)$/.test(name)&&C.oldUnit.test(v)) add(G2,'fail','Tên đơn vị phụ trách còn "Bộ môn"',`"${v}". Ghi tên Khoa.`); if(name==='Mã học phần'||name==='Course code') meta.code=v; if(name==='Số tín chỉ'||name==='Credit hours'){ meta.tc=num((v.match(/\d+([.,]\d+)?/)||[''])[0]); if(vn&&/\(/.test(v)) add(G2,'warn','Số tín chỉ ghi kèm ngoặc phân bổ giờ',`"${v}". Quy ước ghi gọn, ví dụ "03"; phân bổ giờ đã có ở bảng 5.1.`,BM); } } });
  const tq=field([C.prereq[0]]); if(tq&&C.prereq[1].source!=='^$'&&C.prereq[1].test(tq)) add(G2,'fail','"Điều kiện tiên quyết" còn nguyên chữ mẫu','Ghi tên và mã học phần tiên quyết, hoặc "Không".');
  const tc=meta.tc; const special=C.special.test(meta.title||''); meta.special=special;
  if(special) add(G1,'pass','Đề cương đặc thù (khóa luận, đề án tốt nghiệp, luận văn): được phép không có bảng giảng viên, bảng đánh giá, dòng lưu ý cuối 5.2; không kiểm công thức quy đổi giờ; chỉ một chữ ký '+C.sig.vkName);

  // mục
  const missing=[]; const idx={};
  C.headings.forEach(([n,name])=>{ const i=paras.findIndex(p=>p.text.startsWith(n)&&lower(p.text).includes(lower(name).slice(0,18))); if(i<0) missing.push(n+' '+name); else idx[n]=i; });
  const find4=(n,name)=>paras.findIndex(p=>new RegExp('^'+n.replace('.','\\.')+'\\.?\\s').test(p.text)&&lower(p.text).includes(lower(name)));
  const shortTL=paras.filter(p=>C.sec4.bbShort.source!=='^$'&&C.sec4.bbShort.test(p.text)); if(shortTL.length) add(G5,'fail','Tên mục viết "Tài liệu" thay vì "Tài liệu tham khảo"',shortTL.map(p=>'"'+p.text.slice(0,60)+'"').join('\n')+'\nSửa thành '+C.sec4.shortFix+' đúng mẫu.');
  const hasGT=find4('4.1',C.sec4.gt)>=0;
  const L=hasGT?[['4.1','gt'],['4.2','bb'],['4.3','tc']]:[['4.1','bb'],['4.2','tc']];
  L.forEach(([n,k])=>{ let i=find4(n,C.sec4[k]); if(i<0&&k!=='gt'&&vn) i=find4(n,C.sec4[k].replace('tài liệu tham khảo','tài liệu')); if(i<0) missing.push(n+'. '+C.sec4[k]+(hasGT?'':' (không có giáo trình thì đánh số lại từ 4.1)')); else idx[k.toUpperCase()]=i; });
  const iWeb=find4(hasGT?'4.4':'4.3',C.sec4.web); if(iWeb>=0) idx.WEB=iWeb;
  if(missing.length) add(G1,'fail','Thiếu mục của mẫu: '+missing.join('; ')); else add(G1,'pass',hasGT?'Đủ 7 mục và các tiểu mục theo mẫu':'Đủ 7 mục; mục 4 không có giáo trình, đánh số lại từ 4.1 '+C.sec4.bb);
  if(idx.GT!=null&&C.gtGuide.test(paras[idx.GT].text)) add(G5,'warn','Tiêu đề 4.1 còn nguyên câu hướng dẫn trong ngoặc của mẫu','Rút gọn thành "4.1. '+(vn?'Giáo trình':'Textbook(s)')+'".',BM);
  if(idx['3.2.']!=null&&C.matGuide.test(paras[idx['3.2.']].text)) add(G5,'warn','Tiêu đề 3.2 còn câu hướng dẫn của mẫu','Bỏ phần "(Xem Bảng phân nhiệm…)".',BM);
  if(idx['2.']!=null){ const nxt=paras[idx['2.']+1]; if(nxt&&C.descGuide.test(nxt.text)) add(G5,'warn','Dưới mục 2 còn dòng hướng dẫn của mẫu','Bỏ dòng "(Bao gồm mục tiêu đào tạo của học phần)".',BM); }

  // mô tả
  let desc='';
  if(idx['2.']!=null&&idx['3.']!=null){ desc=paras.slice(idx['2.']+1,idx['3.']).map(p=>p.text).filter(t=>t&&!C.descGuide.test(t)).join(' '); meta.desc=desc; if(desc.length<200) add(G2,'fail','Mô tả học phần quá ngắn hoặc chưa điền',`${desc.length} ký tự. Mô tả phải chép nguyên văn từ Bản mô tả CTĐT.`); else add(G2,'pass',`Mô tả học phần có ${desc.length} ký tự`,opts.ctdt?'':'Tự đối chiếu nguyên văn với Bản mô tả CTĐT (hoặc nạp file CTĐT để trang đối chiếu).'); }

  // CLO
  let nCLO=0;
  if(idx['3.1.']!=null&&idx['3.2.']!=null){ const seg=paras.slice(idx['3.1.']+1,idx['3.2.']); nCLO=seg.filter(p=>C.clo.test(p.text)).length; meta.nCLO=nCLO;
    if(!nCLO) add(G2,'fail','Mục 3.1 chưa có CLO nào'); else add(G2,'pass',`Mục 3.1 có ${nCLO} CLO`);
    if(seg.some(p=>C.dots.test(p.text))) add(G5,'fail','Mục 3.1 còn dòng "…" của mẫu');
    const empty=seg.filter(p=>C.cloEmpty.test(p.text)); if(empty.length) add(G2,'fail',`${empty.length} dòng CLO chưa có nội dung`); }

  // ma trận 3.2
  const mat=findTable(tables,g=>g.length>1&&g.slice(0,2).some(r=>r.some(c=>/PLO\s*\d/i.test(c)))&&g.some(r=>r.slice(0,2).some(c=>/^CLO\s*\d/i.test((c||'').trim()))));
  if(!mat) add(G2,'fail','Không có bảng ma trận 3.2 (CLO tới PLO)','Mẫu không kèm sẵn bảng này, phải dựng thêm: các dòng CLO và dòng tổng của học phần.');
  else { const g=mat.grid; const nPLO=new Set(g.slice(0,2).flat().filter(c=>/PLO\s*\d/i.test(c)).map(c=>c.trim())).size;
    const cloCol=g.find(r=>r.slice(0,2).some(c=>/^CLO\s*\d/i.test((c||'').trim()))).findIndex(c=>/^CLO\s*\d/i.test((c||'').trim()));
    const cloRows=g.filter(r=>/^CLO\s*\d/i.test((r[cloCol]||'').trim())); const hp=g.find(r=>r.slice(0,2).some(c=>C.tbl.matRow.test((c||'').trim())));
    meta.mat={nPLO,cloRows:cloRows.length,course:hp?hp.slice(cloCol+1).map(c=>c.trim()):null,ploHeader:g.slice(0,2).flat().filter(c=>/PLO\s*\d/i.test(c)).map(c=>c.trim())};
    add(G2,'pass',`Ma trận 3.2: ${nPLO} PLO, ${cloRows.length} dòng CLO`);
    if(nCLO&&cloRows.length!==nCLO) add(G2,'fail',`Số CLO trong ma trận (${cloRows.length}) khác mục 3.1 (${nCLO})`);
    if(!hp) add(G2,'warn','Ma trận 3.2 chưa có dòng tổng của học phần ("Học phần" hoặc "Tổng phân nhiệm")','Dòng này lấy đúng từ ma trận đóng góp học phần vào PLO trong CTĐT.',BM); else if(!hp.slice(cloCol+1).some(c=>c.trim())) add(G2,'fail','Dòng tổng của học phần trong ma trận 3.2 để trống');
    const emptyClo=cloRows.filter(r=>!r.slice(cloCol+1).some(c=>c.trim())); if(emptyClo.length) add(G2,'warn',`${emptyClo.length} dòng CLO trong ma trận không đánh dấu PLO nào`); }

  // giảng viên
  const ins=findTable(tables,g=>C.tbl.instr.test(g[0].join(' ')));
  if(!ins){ if(special) add(G2,'pass','Không có bảng giảng viên (đề cương đặc thù, được phép)'); else add(G2,'fail','Không có bảng thông tin giảng viên'); } else { const filled=ins.grid.slice(1).filter(r=>(r[C.instrName]||'').trim()); if(!filled.length) add(G2,'fail','Bảng giảng viên chưa có tên'); else { add(G2,'pass',`Bảng giảng viên: ${filled.length} người`); const empties=ins.grid.slice(1).filter(r=>!r.slice(1).some(c=>c.trim())).length; if(empties) add(G5,'warn',`Bảng giảng viên còn ${empties} dòng trống`,'Xóa dòng thừa cho gọn.'); } }

  // học liệu
  const entriesBetween=(a,b)=>paras.slice(a+1,b).filter(p=>p.text&&!C.starLabel.test(p.text)).map(p=>p.text);
  const after=k=>{ const order=['GT','BB','TC','WEB']; const i=order.indexOf(k); for(let j=i+1;j<order.length;j++) if(idx[order[j]]!=null) return idx[order[j]]; return idx['5.']; };
  const langFix=vn?'Giáo trình và tài liệu bắt buộc phải cùng ngôn ngữ giảng dạy. Tìm bản dịch; chưa có thì ghi "Tập bài giảng do giảng viên biên soạn (trên cơ sở …)" và đưa sách gốc xuống tài liệu tự chọn.':'Textbook and compulsory readings must be in the language of instruction (English). Move other-language items to optional readings.';
  if(idx.GT!=null){ const seg=entriesBetween(idx.GT,after('GT')); if(!seg.length) add(G2,'fail','Mục 4.1 Giáo trình để trống','Chưa có giáo trình thì bỏ mục này và đánh số lại từ 4.1 '+C.sec4.bb+'.'); else { add(G2,'pass',`Giáo trình: ${seg[0].slice(0,80)}${seg[0].length>80?'…':''}`,'Tự kiểm: đúng NXB, năm, ấn bản thật.'); const o=seg.filter(C.otherLang); if(o.length) add(G2,'fail',`Giáo trình ${C.otherLangName} trong đề cương ${C.name}`,o.map(t=>'"'+t.slice(0,80)+'"').join('\n')+'\n'+langFix); } }
  else add(G2,'pass','Học phần không có giáo trình, dùng tài liệu tham khảo bắt buộc','Chấp nhận theo quy ước; tài liệu bắt buộc phải đủ để dạy và cùng ngôn ngữ giảng dạy.');
  if(idx.BB!=null){ const seg=entriesBetween(idx.BB,after('BB')); if(!seg.length) add(G2,'warn','Mục Tài liệu tham khảo bắt buộc chưa có gì'); else { add(G2,'pass',`Tài liệu tham khảo bắt buộc: ${seg.length} mục`); const o=seg.filter(C.otherLang); if(o.length) add(G2,'fail',`${o.length} tài liệu bắt buộc bằng ${C.otherLangName} trong đề cương ${C.name}`,o.map(t=>'"'+t.slice(0,80)+'"').join('\n')+'\nTài liệu khác ngôn ngữ giảng dạy đưa xuống mục tự chọn.'); }
    const end=idx['5.']||paras.length; const emptyStars=[]; for(let i=idx.BB+1;i<end;i++){ const p=paras[i]; if(!C.starLabel.test(p.text)) continue; let j=i+1; while(j<end&&!paras[j].text) j++; const nx=j<end?paras[j].text:''; if(!nx||C.starLabel.test(nx)||/^\d+\.(\d+\.)?\s/.test(nx)) emptyStars.push(p.text); } if(emptyStars.length) add(G5,'warn',`Còn ${emptyStars.length} nhãn "* …" của mẫu không có tài liệu bên dưới`,[...new Set(emptyStars)].join(', ')+'. Xóa nhãn trống.',BM); }

  // 5.1
  const t51=findTable(tables,g=>new RegExp('^'+C.buoi.source,'i').test(g[0][0]||'')&&C.tbl.t51.test(g.slice(0,3).map(r=>r.join(' ')).join(' ')));
  let rows51=[];
  if(!t51) add(G3,'fail','Không tìm thấy bảng 5.1 (đầu bảng "Buổi | Nội dung | … | Phân bổ thời gian")');
  else { const g=t51.grid; const hdr=headerRows(g,C); const ncol=Math.max(...g.map(r=>r.length));
    const ci={ht:colIndex(hdr,ncol,C.cols51.ht),x:colIndex(hdr,ncol,C.cols51.x),y:colIndex(hdr,ncol,C.cols51.y),z:colIndex(hdr,ncol,C.cols51.z),e:colIndex(hdr,ncol,C.cols51.e),clo:colIndex(hdr,ncol,C.cols51.clo)};
    if(ci.x<0||ci.y<0){ const gd=[]; for(let c=0;c<ncol;c++){ if(hdr.some(r=>lower(r[c]).includes(C.cols51.onclass))) gd.push(c); } if(gd.length>=2){ ci.x=gd[0]; ci.y=gd[1]; } }
    const tietRows=[...hdr,...g.filter(r=>C.totalRow.test((r.find(c=>(c||'').trim())||'').trim()))]; if(tietRows.some(r=>r.some(c=>C.tiet.test(c||'')))) add(G3,'fail','Bảng 5.1 dùng đơn vị "tiết"','Không dùng tiết nữa. Quy đổi sang giờ chuẩn: 1 tín chỉ = 15 giờ lý thuyết = 30 giờ thực hành, thảo luận = 50 giờ thực tế, bài tập lớn = 50 giờ tự học. Tổng bốn cột = 50 giờ × số tín chỉ.');
    if(ci.ht<0) add(G3,bomon?'fail':'warn','Bảng 5.1 thiếu cột "Hình thức"','Cột này đứng ngay sau cột Nội dung (Trực tiếp / Trực tuyến).',BM); else add(G3,'pass','Bảng 5.1 có cột Hình thức',null,BM);
    if(ci.x<0||ci.y<0||ci.z<0||ci.e<0) add(G3,'fail','Bảng 5.1 không nhận ra đủ 4 cột giờ (lý thuyết, thực hành, tiểu luận, tự học)');
    else { const body=g.slice(hdr.length); const isBuoi=r=>{ const c=(r[0]||'').trim(); return (/^\d+/.test(c)||new RegExp('^'+C.buoi.source+'\\s*\\d+','i').test(c))&&!C.totalRow.test(c); };
      rows51=body.filter(isBuoi);
      const totalRow=body.find(r=>{ const c=(r.find(c=>(c||'').trim())||'').trim(); return C.totalRow.test(c); });
      const sum={x:0,y:0,z:0,e:0}; const bad=[];
      rows51.forEach(r=>{ for(const k of ['x','y','z','e']){ const v=num(r[ci[k]]); if(isNaN(v)) bad.push(`buổi ${r[0].trim()} cột ${k}`); else sum[k]+=v; } });
      meta.tot51=sum; const T=sum.x+sum.y+sum.z+sum.e;
      if(!rows51.length) add(G3,'fail','Bảng 5.1 chưa có buổi nào'); else add(G3,'pass',`Bảng 5.1: ${rows51.length} buổi, tổng ${fmt(sum.x)} / ${fmt(sum.y)} / ${fmt(sum.z)} / ${fmt(sum.e)} = ${fmt(T)} giờ`);
      if(bad.length) add(G3,'fail','Ô giờ trong 5.1 để trống hoặc không phải số: '+bad.slice(0,6).join(', ')+(bad.length>6?'…':''));
      if(!totalRow) add(G3,'fail','Bảng 5.1 thiếu dòng "Tổng cộng"'); else { const tv=['x','y','z','e'].map(k=>num(totalRow[ci[k]])); const diff=['x','y','z','e'].filter((k,i)=>!isNaN(tv[i])&&Math.abs(tv[i]-sum[k])>1e-9); if(diff.length) add(G3,'fail','Dòng Tổng cộng trong 5.1 không bằng tổng các buổi',`Dòng tổng ghi ${tv.map(v=>isNaN(v)?'?':fmt(v)).join(' / ')}, cộng thực ${fmt(sum.x)} / ${fmt(sum.y)} / ${fmt(sum.z)} / ${fmt(sum.e)}.`); else add(G3,'pass','Dòng Tổng cộng khớp tổng các buổi'); }
      if(!isNaN(tc)){ if(Math.abs(T-50*tc)>1e-9) add(G3,'fail',`Tổng giờ ${fmt(T)} khác 50 × ${fmt(tc)} TC = ${fmt(50*tc)}`); else add(G3,'pass',`Tổng giờ bằng 50 × ${fmt(tc)} TC`); }
      const ex=expect||null;
      if(ex){ const d=['x','y','z','e'].filter(k=>!isNaN(ex[k])&&Math.abs(ex[k]-sum[k])>1e-9); const srcName=expect?'đã nhập':'trong CTĐT'; if(d.length) add(expect?G3:G6,'fail','Tổng 5.1 lệch phân bổ CTĐT '+srcName,`CTĐT: ${['x','y','z','e'].map(k=>isNaN(ex[k])?'–':fmt(ex[k])).join(' / ')}; bảng: ${fmt(sum.x)} / ${fmt(sum.y)} / ${fmt(sum.z)} / ${fmt(sum.e)}.`); else add(expect?G3:G6,'pass','Tổng 5.1 khớp phân bổ CTĐT '+srcName); }
      else if(!isNaN(tc)&&!special){ const h=sum.x/15+sum.y/30, z=50*(tc-h), e=50*tc-(sum.x+sum.y+z); if(Math.abs(z-sum.z)>1e-9||Math.abs(e-sum.e)>1e-9) add(G3,'warn','Cột z và tự học không theo công thức quy đổi tín chỉ',`Theo x=${fmt(sum.x)}, y=${fmt(sum.y)}, ${fmt(tc)} TC thì z=${fmt(z)}, tự học=${fmt(e)}. Chỉ chấp nhận nếu CTĐT quy định khác.`); }
      const htEmpty=ci.ht>=0?rows51.filter(r=>!(r[ci.ht]||'').trim()).length:0; if(htEmpty) add(G3,'warn',`${htEmpty} buổi chưa ghi Hình thức`,null,BM);
      const cloEmpty=ci.clo>=0?rows51.filter(r=>!(r[ci.clo]||'').trim()).length:0; if(cloEmpty) add(G3,'warn',`${cloEmpty} buổi trong 5.1 chưa ghi CLO`);
      if(ci.clo>=0){ meta.clo51=rows51.map(r=>({n:r[0].replace(C.buoi,'').replace(/\s+/g,'').trim(),refs:cloRefs(r[ci.clo])})); }
      rows51=rows51.map(r=>({n:r[0].replace(C.buoi,'').replace(/\s+/g,'').trim(),x:num(r[ci.x]),y:num(r[ci.y]),z:num(r[ci.z]),e:num(r[ci.e])}));
    } }

  // 5.2
  const t52=findTable(tables,g=>C.tbl.t52.test(g[0].join(' ')));
  if(!t52) add(G3,'fail','Không tìm thấy bảng 5.2 (đầu bảng "Buổi | Hoạt động dạy và học | Số giờ…")');
  else { const g=t52.grid.slice(1); const by={}; let cur=null; const order=[];
    const clo52={}; g.forEach(r=>{ const b=(r[0]||'').replace(C.buoi,'').replace(/\s+/g,'').trim(); if(b){ cur=b; if(!by[cur]){ by[cur]=[]; order.push(cur);} } if(cur==null) return; by[cur].push({act:lower(r[1]),h:num(r[2]),nd:(r[3]||'').trim()}); if((r[4]||'').trim()) clo52[cur]=[...new Set([...(clo52[cur]||[]),...cloRefs(r[4])])]; }); meta.clo52=clo52;
    const short=[],mism=[],noContent=[],zeroWithContent=[],ktHours=[],ktBad=[],ktEmpty=[];
    order.forEach(b=>{ const acts=by[b]; const have=C.acts.map(a=>acts.some(x=>a[2].test(x.act))); if(have.some(v=>!v)) short.push(`buổi ${b} thiếu ${C.acts.filter((a,i)=>!have[i]).map(a=>a[1]).join(', ')}`);
      const r51=rows51.find(r=>r.n===b);
      if(r51){ const s=k=>acts.filter(x=>C.acts.find(a=>a[0]===k)[2].test(x.act)&&!(k!=='kt'&&C.acts[4][2].test(x.act)&&!C.acts.slice(0,4).some(a=>a[2].test(x.act)))).reduce((t,x)=>t+(isNaN(x.h)?0:x.h),0);
        const d=[['x','lt'],['y','th'],['z','tl'],['e','tu']].filter(([k5,k])=>!isNaN(r51[k5])&&Math.abs(s(k)-r51[k5])>1e-9); if(d.length) mism.push(`buổi ${b} (${d.map(([k5,k])=>`${k}: 5.2=${fmt(s(k))} vs 5.1=${fmt(r51[k5])}`).join('; ')})`); }
      const empties=acts.filter(x=>!C.acts[4][2].test(x.act)&&!x.nd&&!(x.h===0)).length; if(empties) noContent.push(`buổi ${b}: ${empties} dòng`);
      acts.forEach(x=>{ const isKT=C.acts[4][2].test(x.act)&&!C.acts.slice(0,4).some(a=>a[2].test(x.act)); if(isKT){ if(!isNaN(x.h)&&x.h>0) ktHours.push(`buổi ${b}: ${fmt(x.h)} giờ`); if(!x.nd) ktEmpty.push(b); else if(!C.ktForm.test(x.nd)) ktBad.push(`buổi ${b}: "${x.nd.slice(0,60)}"`); return; } if(!x.nd) return; const zero=isNaN(x.h)||x.h===0; if(!zero) return; const name=x.act.replace(/\s+/g,' ').trim(); zeroWithContent.push(`buổi ${b}, dòng ${name.slice(0,30)}: "${x.nd.slice(0,50)}"`); }); });
    add(G3,'pass',`Bảng 5.2: ${order.length} buổi, ${g.length} dòng hoạt động`);
    if(rows51.length&&order.length!==rows51.length) add(G3,'fail',`Số buổi trong 5.2 (${order.length}) khác 5.1 (${rows51.length})`);
    if(short.length) add(G3,'fail','Buổi trong 5.2 chưa đủ 5 dòng hoạt động',short.join('\n')); else if(order.length) add(G3,'pass','Mỗi buổi trong 5.2 đủ 5 dòng hoạt động');
    if(mism.length) add(G3,'fail','Giờ trong 5.2 lệch 5.1',mism.join('\n')); else if(rows51.length&&order.length) add(G3,'pass','Giờ từng buổi trong 5.2 khớp 5.1');
    if(zeroWithContent.length) add(G3,'fail','Dòng trong 5.2 có nội dung hoạt động nhưng không phân bổ giờ',zeroWithContent.join('\n')+'\nHoặc phân bổ giờ cho hoạt động đó (và sửa 5.1 cho khớp), hoặc bỏ nội dung.');
    if(ktHours.length) add(G3,'warn','Dòng Kiểm tra, đánh giá có ghi giờ',ktHours.join('; ')+'\n'+C.ktHint);
    if(ktBad.length) add(G3,'fail','Dòng Kiểm tra, đánh giá ghi sai ý nghĩa',ktBad.join('\n')+'\n'+C.ktHint);
    if(ktEmpty.length&&!special) add(G3,'warn',`${ktEmpty.length} buổi chưa ghi hình thức đánh giá ở dòng Kiểm tra, đánh giá`,'Buổi '+ktEmpty.join(', ')+'. '+C.ktHint,BM);
    if(!ktHours.length&&!ktBad.length&&!ktEmpty.length&&order.length) add(G3,'pass','Dòng Kiểm tra, đánh giá ghi hình thức đánh giá, không ghi giờ');
    if(noContent.length) add(G3,'warn','Dòng hoạt động trong 5.2 chưa có "Nội dung chính"',noContent.slice(0,8).join('; ')+(noContent.length>8?'…':'')+'\nMỗi dòng hoạt động ghi nội dung riêng; chỉ gộp dọc ô Buổi và ô CLO.',BM);
  }
  if(C.note52.test(allText)){ if(C.note52Old.source!=='^$'&&C.note52Old.test(allText)) add(G3,'fail','Dòng lưu ý cuối 5.2 còn "quyết định của Bộ môn"','Đổi thành: '+C.note52Text); else add(G3,'pass','Có dòng lưu ý linh hoạt cuối mục 5.2',null,BM); } else if(!special) add(G3,'warn','Thiếu dòng lưu ý cuối mục 5.2',C.note52Text,BM);
  { const hits=[]; if(C.oldUnit.source!=='^$'){ paras.forEach(p=>{ if(C.oldUnit.test(p.text)&&!C.decisionKeep.test(p.text)) hits.push(p.text.slice(0,70)); }); tables.forEach(t=>t.grid.forEach(r=>r.forEach(c=>{ if(C.oldUnit.test(c)) hits.push(c.slice(0,70)); }))); } const u=[...new Set(hits)]; if(u.length) add(G5,'fail',`Còn ${u.length} chỗ nhắc "${vn?'Bộ môn':'Department'}"`,C.oldUnitMsg+'\n'+u.slice(0,6).map(x=>'"'+x+'"').join('\n')); }

  // đánh giá
  const ta=findTable(tables,g=>C.tbl.assess.test(g[0].join(' ')));
  if(!ta){ if(special) add(G4,'pass','Không có bảng đánh giá (đề cương đặc thù, được phép)'); else add(G4,'fail','Không tìm thấy bảng đánh giá (cột "Trọng số")'); }
  else { const g=ta.grid.slice(1); const wi=ta.grid[0].findIndex(c=>C.tbl.assess.test(c)); let sum=0; let cc=NaN,ck=NaN; const ex=[];
    g.forEach(r=>{ if(r.some(c=>C.assess.total.test((c||'').trim()))) return; const lbl=r.filter((c,i)=>i!==wi).join(' '); const w=num((r[wi]||'').replace('%','')); if(isNaN(w)){ if(!/[\d]/.test(r[wi]||'')) ex.push(lbl.trim().slice(0,60)||'(dòng trống)'); return; } sum+=w; if(C.assess.cc.test(lbl)) cc=w; if(C.assess.ck.test(lbl)) ck=w; if(C.assess.example.test(r.join(' '))) ex.push(lbl.trim().slice(0,40)+' còn "Ví dụ:"'); });
    meta.assess={sum,cc,ck}; const cloCol=ta.grid[0].findIndex(c=>/clo/i.test(c)); if(cloCol>=0) meta.cloAssess=g.filter(r=>!r.some(c=>C.assess.total.test((c||'').trim()))).map(r=>({lbl:(r.filter((c,i)=>i!==wi&&i!==cloCol).join(' ').trim().slice(0,40)),refs:cloRefs(r[cloCol])}));
    if(Math.abs(sum-100)>1e-9) add(G4,'fail',`Tổng trọng số = ${fmt(sum)}%, phải bằng 100%`); else add(G4,'pass','Tổng trọng số bằng 100%');
    if(isNaN(cc)) add(G4,'warn','Không thấy dòng Chuyên cần có trọng số'); else if(Math.abs(cc-10)>1e-9) add(G4,'warn',`Chuyên cần ${fmt(cc)}%`,'Quy ước Bộ môn là 10%.',BM); else add(G4,'pass','Chuyên cần 10%',null,BM);
    if(isNaN(ck)) add(G4,'warn','Không thấy dòng Cuối kỳ có trọng số'); else if(ck<50) add(G4,'fail',`Cuối kỳ ${fmt(ck)}%, phải ít nhất 50%`); else add(G4,'pass',`Cuối kỳ ${fmt(ck)}%`);
    if(ex.length) add(G4,'warn','Bảng đánh giá còn dòng chưa điền hoặc còn chữ mẫu',ex.join('; ')); }

  // CLO tham chiếu ở 5.1 / 5.2 / đánh giá phải tồn tại ở mục 3.1
  if(nCLO){ const bad51=[],bad52=[],badDG=[],used=new Set(),mismatch=[];
    (meta.clo51||[]).forEach(r=>{ r.refs.forEach(k=>{ if(k>nCLO) bad51.push(`buổi ${r.n}: CLO${k}`); else used.add(k); }); });
    Object.entries(meta.clo52||{}).forEach(([b,refs])=>{ refs.forEach(k=>{ if(k>nCLO) bad52.push(`buổi ${b}: CLO${k}`); else used.add(k); }); const r51=(meta.clo51||[]).find(r=>r.n===b); if(r51&&r51.refs.length&&refs.length&&(r51.refs.length!==refs.length||r51.refs.some(k=>!refs.includes(k)))) mismatch.push(`buổi ${b}: 5.1 ghi ${r51.refs.join(',')} / 5.2 ghi ${refs.join(',')}`); });
    (meta.cloAssess||[]).forEach(r=>r.refs.forEach(k=>{ if(k>nCLO) badDG.push(`${r.lbl}: CLO${k}`); }));
    if(bad51.length||bad52.length||badDG.length) add(G2,'fail',`Tham chiếu CLO không tồn tại (học phần chỉ có ${nCLO} CLO)`,[bad51.length?'Bảng 5.1: '+bad51.join('; '):'',bad52.length?'Bảng 5.2: '+bad52.join('; '):'',badDG.length?'Bảng đánh giá: '+badDG.join('; '):''].filter(Boolean).join('\n')); else if((meta.clo51||[]).length) add(G2,'pass',`CLO ở 5.1, 5.2 và bảng đánh giá đều nằm trong CLO1 đến CLO${nCLO}`);
    if(mismatch.length) add(G3,'warn','CLO của cùng một buổi khác nhau giữa 5.1 và 5.2',mismatch.join('\n'));
    const unused=[]; for(let k=1;k<=nCLO;k++) if(!used.has(k)) unused.push('CLO'+k); if(unused.length&&(meta.clo51||[]).length) add(G2,'warn',`${unused.join(', ')} không được buổi nào đóng góp trong 5.1/5.2`,'Mỗi CLO cần ít nhất một buổi hướng tới; nếu không thì xem lại CLO hoặc kế hoạch giảng dạy.');
    if(meta.cloAssess&&meta.cloAssess.length){ const assessed=new Set(); meta.cloAssess.forEach(r=>r.refs.forEach(k=>assessed.add(k))); const na=[]; for(let k=1;k<=nCLO;k++) if(!assessed.has(k)) na.push('CLO'+k); if(na.length) add(G4,'warn',`${na.join(', ')} không được hình thức đánh giá nào kiểm tra`,'Cột "Kiểm tra, đánh giá mức độ đạt CLOs" của bảng đánh giá phải phủ hết các CLO.'); } }
  // khối ký
  const sigT=findTable(tables,g=>C.tbl.sig.test(g.map(r=>r.join(' ')).join(' ')));
  const sigP=paras.slice(-15).filter(p=>C.tbl.sig.test(p.text));
  const sig=sigT?{grid:sigT.grid}:(sigP.length?{grid:[sigP.map(p=>p.text.split(/\t+|\s{3,}/).map(x=>x.trim()).filter(Boolean)).flat()]}:null);
  if(!sig) add(G1,'fail',`Thiếu khối ký (${C.sig.bmName} bên trái, ${C.sig.vkName} bên phải)`);
  else { const s=sig.grid.map(r=>r.join(' | ')).join(' '); const names=sig.grid[0].map(c=>c.replace(/\s+/g,' ').trim()).filter(Boolean).join(' | ');
    if(C.sig.gv.test(s)) add(G1,'warn','Khối ký có "Giảng viên biên soạn"','Chỉ cần '+C.sig.bmName+' và '+C.sig.vkName+'.',BM);
    if(C.sig.old.test(s)) add(G1,'fail','Khối ký còn chức danh cũ',C.sig.oldMsg+' Hiện có: '+names);
    else if(special){ if(!C.sig.vk.test(s)) add(G1,'fail','Đề cương đặc thù: khối ký phải có '+C.sig.vkName,names); else if(C.sig.bm.test(s)) add(G1,'warn','Đề cương đặc thù (khóa luận, đề án, luận văn) chỉ một chữ ký '+C.sig.vkName,'Bỏ ô '+C.sig.bmName+'. Hiện có: '+names); else add(G1,'pass','Khối ký đề cương đặc thù: '+names); }
    else if(!C.sig.bm.test(s)) add(G1,'fail','Khối ký thiếu '+C.sig.bmName,names); else if(!C.sig.vk.test(s)) add(G1,'fail','Khối ký thiếu '+C.sig.vkName,names); else add(G1,'pass','Khối ký: '+names); }

  // hình thức
  const redP=paras.filter(p=>p.red.length&&!C.decisionKeep.test(p.text)); const redT=tables.reduce((a,t)=>a+t.red.length,0);
  if(redP.length+redT) add(G5,'fail',`Còn chữ đỏ của mẫu: ${redP.length} đoạn, ${redT} ô bảng`,redP.slice(0,4).map(p=>'"'+p.red.join(' ').slice(0,80)+'"').join('\n')); else add(G5,'pass','Không còn chữ đỏ chú thích (ngoài dòng QĐ)');
  const fn=paras.reduce((a,p)=>a+p.footnote,0)+tables.reduce((a,t)=>a+t.footnote,0); if(fn) add(G5,'fail',`Còn ${fn} chú thích chân trang của mẫu`); else add(G5,'pass','Không còn chú thích chân trang');
  const ph=[]; paras.forEach(p=>{ if(C.ph.test(p.text)&&!C.phSkip.test(p.text)) ph.push(p.text.slice(0,70)); }); tables.forEach(t=>t.grid.forEach(r=>r.forEach(c=>{ if(C.ph.test(c)) ph.push(c.slice(0,70)); })));
  const uph=[...new Set(ph)]; if(uph.length) add(G5,'fail',`Còn ${uph.length} chỗ giữ chỗ của mẫu`,uph.slice(0,8).map(s=>'"'+s+'"').join('\n')); else add(G5,'pass','Không còn chỗ giữ chỗ của mẫu');
  const dr=paras.reduce((a,p)=>a+p.drawing,0); if(dr) add(G5,'warn',`Còn ${dr} ảnh trong văn bản`,'Thường là ảnh tiêu đề thư ở đầu; mẫu thống nhất không dùng.',BM); else add(G5,'pass','Không có ảnh tiêu đề thư',null,BM);
  const pb=paras.reduce((a,p)=>a+p.pageBreak,0); if(pb) add(G5,'warn',`Còn ${pb} ngắt trang thủ công`,'Bỏ để khối ký không bị đẩy sang trang riêng.',BM); else add(G5,'pass','Không có ngắt trang thủ công',null,BM);
  let run=0,maxRun=0; paras.forEach(p=>{ if(!p.text){ run++; maxRun=Math.max(maxRun,run);} else run=0; }); if(maxRun>=3) add(G5,'warn',`Có chỗ ${maxRun} đoạn trống liên tiếp`,'Gộp lại cho gọn.',BM); else add(G5,'pass','Không có chuỗi đoạn trống dài',BM?null:null,BM);
  const left=(vn!==en)?paras.filter(p=>C.leftover.test(p.text)).length:0; if(left) add(G5,'warn',`Còn ${left} dòng ${C.otherName} sót lại từ nửa song ngữ`);

  // đối chiếu CTĐT
  if(opts.ctdt) compareCtdt(opts.ctdt,meta,add,G6);

  if(!bomon){ for(const r of R) if(r.src==='bomon'&&r.status!=='pass') r.status='info'; }
  return {findings:R,meta};
}

/* ---------- Bản mô tả CTĐT ---------- */
function parseCtdt(blocks){
  const paras=blocks.filter(b=>b.type==='p'); const tables=blocks.filter(b=>b.type==='t');
  const out={matrix:{},hours:{},desc:{},ploCount:0,found:[]};
  // ma trận: cột đầu Mã học phần, header PLO
  for(const t of tables){ const g=t.grid; const hi=g.findIndex(r=>r.filter(c=>/PLO\s*\d/i.test(c)).length>=3); if(hi<0) continue; const hdr=g[hi]; const cols=[]; hdr.forEach((c,i)=>{ const m=c.match(/PLO\s*(\d+)/i); if(m) cols.push([i,'PLO'+m[1]]); });
    if(!/mã/i.test(g[0][0]||'')&&!/mã/i.test(hdr[0]||'')) { if(!g.slice(hi+1).some(r=>/^[A-Z]{2,4}\d{3}/.test((r[0]||'').trim()))) continue; }
    let n=0; g.slice(hi+1).forEach(r=>{ const code=(r.find(c=>/^[A-Z]{2,4}\d{3}/.test((c||'').trim()))||'').trim().match(/[A-Z]{2,4}\d{3}/); if(!code) return; const row={}; cols.forEach(([i,p])=>row[p]=(r[i]||'').trim()); out.matrix[code[0]]=row; n++; });
    if(n){ out.ploCount=Math.max(out.ploCount,new Set(cols.map(c=>c[1])).size); out.found.push('ma trận ('+n+' học phần)'); break; } }
  // khung: Mã học phần | Tên | Số tín chỉ | giờ (LT, TH, TT, tự học)
  for(const t of tables){ const g=t.grid; const hi=g.findIndex(r=>r.some(c=>/số tín chỉ|số tc/i.test(c))&&r.some(c=>/lý thuyết|số giờ/i.test(c))); if(hi<0) continue;
    const hdrs=g.slice(0,hi+2); const ncol=Math.max(...g.map(r=>r.length)); const ci={};
    const fc=kw=>{ for(let c=0;c<ncol;c++){ for(const h of hdrs){ const tt=lower(h[c]); if(kw.some(k=>tt.includes(k))) return c; } } return -1; };
    ci.tc=fc(['số tín chỉ','số tc']); ci.name=fc(['tên học phần']);
    // 4 nhóm giờ: cột đầu tiên của từng nhóm (ô gộp ngang lặp lại)
    const groups=[['x',['lý thuyết']],['y',['thực hành']],['z',['thực tập','tiểu luận','bài tập']],['e',['tự học']]];
    groups.forEach(([k,kw])=>{ ci[k]=fc(kw); });
    if(ci.tc<0||ci.x<0) continue;
    let n=0; g.slice(hi+1).forEach(r=>{ const code=(r.find(c=>/^[A-Z]{2,4}\d{3}$/.test((c||'').trim()))||'').trim(); if(!code) return; const h={tc:num(r[ci.tc]),x:num(r[ci.x]),y:num(r[ci.y]),z:num(r[ci.z]),e:num(r[ci.e]),name:(r[ci.name]||'').trim()}; if(isNaN(h.x)) return; out.hours[code]=h; n++; });
    if(n){ out.found.push('khung giờ ('+n+' học phần)'); break; } }
  // tóm tắt: "(n) Tên (English) – k tín chỉ" rồi mô tả
  const hi=paras.findIndex(p=>/tóm tắt nội dung.*học phần|mô tả (tóm tắt )?(các )?học phần/i.test(p.text)); 
  if(hi>=0){ let cur=null; let n=0; for(let i=hi+1;i<paras.length;i++){ const t=paras[i].text; if(!t) continue; if(/^(PHẦN|CHƯƠNG|[IVX]+\.)\s/.test(t)&&cur) break; const m=t.match(/^\(?\d+[\).]\s*(.+?)(?:\s*[–\-]\s*\d+\s*tín chỉ)?\s*$/); if(m&&t.length<160){ cur=m[1].trim(); out.desc[normTitle(cur)]={title:cur,text:''}; n++; continue; } if(cur){ const d=out.desc[normTitle(cur)]; d.text+=(d.text?' ':'')+t; } } if(n) out.found.push('tóm tắt học phần ('+n+' mục)'); }
  return out;
}
function normTitle(s){ return lower(s).replace(/\(.*?\)/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').trim(); }
function normText(s){ return String(s||'').normalize('NFC').replace(/\s+/g,' ').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").trim(); }
function compareCtdt(ct,meta,add,G6){
  const code=(meta.code||'').match(/[A-Z]{2,4}\d{3}/); const c=code?code[0]:null;
  add(G6,'pass','Đã nạp Bản mô tả CTĐT: '+(ct.found.join(', ')||'không nhận ra bảng nào'));
  if(!c){ add(G6,'warn','Không đọc được mã học phần trong đề cương để tra CTĐT'); return; }
  // giờ
  if(ct.hours[c]){ const h=ct.hours[c]; if(!isNaN(meta.tc)&&!isNaN(h.tc)&&Math.abs(h.tc-meta.tc)>1e-9) add(G6,'fail',`Số tín chỉ ${fmt(meta.tc)} khác CTĐT (${fmt(h.tc)})`); else add(G6,'pass',`Số tín chỉ khớp CTĐT (${fmt(h.tc)})`);
    if(meta.tot51){ const s=meta.tot51; const d=['x','y','z','e'].filter(k=>!isNaN(h[k])&&Math.abs(h[k]-s[k])>1e-9); if(d.length) add(G6,'fail','Phân bổ giờ 5.1 lệch khung CTĐT',`CTĐT: ${['x','y','z','e'].map(k=>isNaN(h[k])?'–':fmt(h[k])).join(' / ')}; bảng 5.1: ${fmt(s.x)} / ${fmt(s.y)} / ${fmt(s.z)} / ${fmt(s.e)}.`); else add(G6,'pass','Phân bổ giờ 5.1 khớp khung CTĐT ('+['x','y','z','e'].map(k=>fmt(h[k])).join(' / ')+')'); } }
  else if(Object.keys(ct.hours).length) add(G6,'warn',`Khung CTĐT không có mã ${c}`);
  // ma trận
  if(ct.matrix[c]){ const row=ct.matrix[c]; if(!meta.mat||!meta.mat.course) add(G6,'warn','Đề cương chưa có dòng tổng học phần trong ma trận 3.2 để so với CTĐT'); else { const plos=Object.keys(row); const mine=meta.mat.ploHeader; const map={}; mine.forEach((p,i)=>{ const m=p.match(/PLO\s*(\d+)/i); if(m) map['PLO'+m[1]]=meta.mat.course[i]||''; }); const diff=plos.filter(p=>normText(map[p]||'').toUpperCase()!==normText(row[p]||'').toUpperCase()); if(diff.length) add(G6,'fail','Dòng học phần trong ma trận 3.2 lệch CTĐT',diff.map(p=>`${p}: đề cương "${map[p]||''}" vs CTĐT "${row[p]||''}"`).join('; ')); else add(G6,'pass','Dòng học phần trong ma trận 3.2 khớp CTĐT'); if(meta.mat.nPLO&&ct.ploCount&&meta.mat.nPLO!==ct.ploCount) add(G6,'fail',`Ma trận 3.2 có ${meta.mat.nPLO} PLO, CTĐT có ${ct.ploCount}`); } }
  else if(Object.keys(ct.matrix).length) add(G6,'warn',`Ma trận CTĐT không có mã ${c}`);
  // mô tả
  const keys=Object.keys(ct.desc); if(keys.length){ const t=normTitle(meta.title||''); const tVN=normTitle((meta.title||'').split('(')[0]); let hit=keys.find(k=>k===tVN||k===t)||keys.find(k=>tVN&&(k.includes(tVN)||tVN.includes(k)));
    if(!hit&&ct.hours[c]&&ct.hours[c].name){ const n=normTitle(ct.hours[c].name); hit=keys.find(k=>k===n||k.includes(n)||n.includes(k)); }
    if(!hit) add(G6,'warn','Không tìm thấy học phần trong phần tóm tắt CTĐT theo tên','Tên trong CTĐT phải khớp tên đề cương.');
    else { const a=normText(meta.desc||''), b=normText(ct.desc[hit].text); if(!b) add(G6,'warn','CTĐT có tên học phần nhưng không có đoạn mô tả'); else if(a===b) add(G6,'pass','Mô tả học phần khớp nguyên văn CTĐT'); else if(a.startsWith(b)) add(G6,'pass','Mô tả học phần chứa nguyên văn CTĐT ở đầu, có thêm phần mục tiêu phía sau'); else { let i=0; while(i<a.length&&i<b.length&&a[i]===b[i]) i++; const sim=similarity(a,b); add(G6,sim>0.9?'warn':'fail',`Mô tả học phần ${sim>0.9?'gần':'không'} khớp nguyên văn CTĐT (giống ${Math.round(sim*100)}%)`,`Khác nhau từ vị trí ${i}:\nĐề cương: "…${a.slice(Math.max(0,i-30),i+80)}…"\nCTĐT: "…${b.slice(Math.max(0,i-30),i+80)}…"`); } } }
}
function similarity(a,b){ const A=new Set(a.split(' ')), B=new Set(b.split(' ')); let inter=0; A.forEach(w=>{ if(B.has(w)) inter++; }); return inter/Math.max(1,Math.max(A.size,B.size)); }

/* ---------- trích 5.1 / 5.2 để nạp vào phần dựng bảng ---------- */
function extractTables(blocks){
  const paras=blocks.filter(b=>b.type==='p'); const tables=blocks.filter(b=>b.type==='t'); const C=CFG[detectLang(paras).lang];
  const out={tc:NaN,rows:[]};
  const tcP=paras.find(p=>/^(số tín chỉ|credit hours)\s*:/i.test(p.text)); if(tcP) out.tc=num((tcP.text.match(/\d+([.,]\d+)?/)||[''])[0]);
  const t51=findTable(tables,g=>new RegExp('^'+C.buoi.source,'i').test(g[0][0]||'')&&C.tbl.t51.test(g.slice(0,3).map(r=>r.join(' ')).join(' ')));
  if(!t51) return out;
  const g=t51.grid; const hdr=headerRows(g,C); const ncol=Math.max(...g.map(r=>r.length));
  const ci={ht:colIndex(hdr,ncol,C.cols51.ht),x:colIndex(hdr,ncol,C.cols51.x),y:colIndex(hdr,ncol,C.cols51.y),z:colIndex(hdr,ncol,C.cols51.z),e:colIndex(hdr,ncol,C.cols51.e),clo:colIndex(hdr,ncol,C.cols51.clo),nd:1};
  if(ci.x<0||ci.y<0){ const gd=[]; for(let c=0;c<ncol;c++){ if(hdr.some(r=>lower(r[c]).includes(C.cols51.onclass))) gd.push(c); } if(gd.length>=2){ ci.x=gd[0]; ci.y=gd[1]; } }
  const body=g.slice(hdr.length).filter(r=>{ const c=(r[0]||'').trim(); return (/^\d+/.test(c)||new RegExp('^'+C.buoi.source+'\\s*\\d+','i').test(c))&&!C.totalRow.test(c); });
  out.rows=body.map(r=>({n:r[0].replace(C.buoi,'').replace(/\s+/g,'').trim(),nd:(r[ci.nd]||'').trim(),ht:ci.ht>=0?(r[ci.ht]||'').trim():'',x:num(r[ci.x])||0,y:num(r[ci.y])||0,z:num(r[ci.z])||0,e:num(r[ci.e])||0,clo:ci.clo>=0?(r[ci.clo]||'').trim():'',c52:{lt:'',th:'',tl:'',tu:'',kt:''},kth:0}));
  const t52=findTable(tables,g=>C.tbl.t52.test(g[0].join(' ')));
  if(t52){ let cur=null; t52.grid.slice(1).forEach(r=>{ const b=(r[0]||'').replace(C.buoi,'').replace(/\s+/g,'').trim(); if(b) cur=b; const row=out.rows.find(x=>x.n===cur); if(!row) return; const act=lower(r[1]); const k=(C.acts.find(a=>a[2].test(act))||[null])[0]; if(!k) return; const nd=(r[3]||'').trim(); if(k==='kt'){ row.kth=num(r[2])||0; row.c52.kt=nd; } else if(!row.c52[k]) row.c52[k]=nd; }); }
  return out;
}

async function readDocx(file){ if(!global.JSZip) throw new Error('Không tải được thư viện đọc file. Kiểm tra kết nối mạng rồi tải lại trang.'); const zip=await JSZip.loadAsync(file); const f=zip.file('word/document.xml'); if(!f) throw new Error('Không phải file .docx hợp lệ (thiếu word/document.xml).'); return parseDocx(await f.async('string')); }
async function checkFile(file,opts){ const blocks=await readDocx(file); const r=check(blocks,opts); return {name:file.name,lang:r.meta.lang,findings:r.findings,meta:r.meta}; }
async function loadCtdt(file){ return parseCtdt(await readDocx(file)); }

global.NghiemThu={VERSION,parseDocx,check,checkFile,readDocx,parseCtdt,loadCtdt,extractTables,num,fmt,CFG};
})(window);
