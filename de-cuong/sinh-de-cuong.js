/* Sinh file đề cương .docx từ biểu mẫu, điền vào đúng mẫu 2025 (Mau_de_cuong_2025.docx).
   API: SinhDeCuong.build(data, templateArrayBuffer) -> Blob (.docx)
   data: {lang:'vn'|'en', ten, tenEn, ma, bomon, vkLabel:'Viện'|'Khoa', vk, tc, tienquyet, gv:[{ten,email,dt,truso}], mota:[đoạn], muctieu:[dòng],
          clo:[chuỗi], nPLO, cloPlo:[[số PLO...]], hocphanRow:[giá trị theo PLO], giaotrinh:[], batbuoc:[], tuchon:[], web:[],
          rows:[{nd,ht,x,y,z,e,clo,c52:{lt,th,tl,tu,kt},kth}], quydinh61:[], quydinh62:[], danhgia:[{nhom,hinhthuc,noidung,congcu,clo,trongso}], kyTrai, kyPhai} */
(function(global){
'use strict';
const W='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fmt=v=>{ v=Number(v)||0; return Math.abs(v-Math.round(v))<1e-9?String(Math.round(v)):String(v).replace('.',','); };
const T={
  vn:{ title:'ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN', split:'SYLLABUS', tenLabel:'Tên học phần:', maLabel:'Mã học phần:', bmLabel:'Khoa phụ trách:', vkLabel:'Trường/Khoa:', tcLabel:'Số tín chỉ:', tqLabel:'Điều kiện tiên quyết:',
    h2:'2. MÔ TẢ HỌC PHẦN', descGuide:/^\(Bao gồm mục tiêu/, muctieu:'Mục tiêu đào tạo:', h31:'3.1.', cloPrefix:'CLO', dots:/^…$/, h32:'3.2.', h32Text:'3.2. Ma trận đóng góp của chuẩn đầu ra học phần tới chuẩn đầu ra của Chương trình đào tạo',
    h4:{gt:['4.1.','Giáo trình'],bb:['4.2.','Tài liệu tham khảo bắt buộc'],tc:['4.3.','Tài liệu tham khảo tự chọn'],web:['4.4.','Website']}, star:/^\*\s/,
    h51:'5.1.', h52:'5.2.', h6:'6.', h61:'6.1.', h62:'6.2.', h7:'7.', moTaKT:/^-\s*Mô tả kiểm tra/, chiTiet:/\(mô tả chi tiết\)/,
    note52:'Lưu ý: Các hoạt động kết nối thực tiễn và phương pháp kiểm tra đánh giá có thể linh hoạt theo điều kiện thực tế và quyết định của Khoa.',
    gvHead:['Stt','Họ và tên giảng viên','Email FTU','Điện thoại','Trụ sở chính HN/CSII/CSQN'], matHead:'CĐR học phần', matCourse:'Học phần',
    t51:{buoi:'Buổi',nd:'Nội dung (có thể cụ thể đến mục)',ht:'Hình thức',pb:'Phân bổ thời gian',onclass:'Giảng dạy trên lớp',lt:'Lý thuyết (thuyết giảng) (1)',th:'Thực hành, thảo luận (2)',tl:'Tiểu luận, bài tập lớn, thực tế (3)',tu:'Tự học, chuẩn bị có hướng dẫn (4)',clo:'Đóng góp vào CLOs',total:'Tổng cộng (giờ)'},
    t52:{head:['Buổi','Hoạt động dạy và học','Số giờ','Nội dung chính','Đóng góp vào CLOs'],acts:['Lý thuyết','Thực hành, thảo luận','Tiểu luận, bài tập lớn, thực tế','Tự học, chuẩn bị có hướng dẫn','Kiểm tra, đánh giá']},
    dg:{head:['Hình thức','Hình thức','Nội dung kiểm tra, đánh giá','Công cụ và tiêu chí kiểm tra, đánh giá','Kiểm tra, đánh giá mức độ đạt CLOs','Trọng số'],total:'Tổng'},
    kyTrai:'TRƯỞNG KHOA', kyPhai:'HIỆU TRƯỞNG', qdKeep:/Kèm theo|QĐ-ĐHNT|Hiệu trưởng/ },
  en:{ title:'SYLLABUS', split:'ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN', tenLabel:'Course title:', maLabel:'Course code:', bmLabel:'Department:', vkLabel:'Faculty/College:', tcLabel:'Credit hours:', tqLabel:'Prerequisite(s):',
    h2:'2. COURSE DESCRIPTION', descGuide:/^\(Include Course Objectives/, muctieu:'Course objectives:', h31:'3.1.', cloPrefix:'CLO', dots:/^…$/, h32:'3.2.', h32Text:'3.2. Matrix of the contribution of Course learning outcomes to Program learning outcomes',
    h4:{gt:['4.1.','Textbook(s)'],bb:['4.2.','Compulsory reading(s)'],tc:['4.3.','Optional reading(s)'],web:['4.4.','Websites']}, star:/^\*\s/,
    h51:'5.1.', h52:'5.2.', h6:'6.', h61:'6.1.', h62:'6.2.', h7:'7.', moTaKT:/^-\s*Description of assessment/, chiTiet:/\(describe the details\)/,
    note52:'Note: Practical activities and assessment methods may be adjusted according to actual conditions and the decision of the Department.',
    gvHead:['No.','Full name','Email FTU','Phone number','Office'], matHead:'CLO', matCourse:'Course',
    t51:{buoi:'No.',nd:'Contents (can be specified down to sections)',ht:'Mode',pb:'Time Allocation',onclass:'Hour(s) on the class',lt:'Lecture (1)',th:'Practice, Seminar (2)',tl:'Essays, exercise, Assignments (3)',tu:"Self-study with teacher's tutorials (4)",clo:'Contribution to CLOs',total:'Total (hours)'},
    t52:{head:['No.','Teaching and learning activities','Hour(s)','Content','Contribution to CLOs'],acts:['Lecture','Practice, Seminar','Essays, exercise, Assignments','Self-study with teacher\'s tutorials','Assessment']},
    dg:{head:['Form','Form','Assessed content','Assessment methods and criteria','Assessment for course learning outcomes','Proportion'],total:'Total'},
    kyTrai:'HEAD OF DEPARTMENT', kyPhai:'DEAN', qdKeep:/Attached to|QD-ĐHNT|President/ }
};

function pText(p){ let s=''; const walk=n=>{ for(const c of n.childNodes){ if(c.nodeType!==1) continue; if(c.localName==='t') s+=c.textContent; else if(c.localName==='tab') s+='\t'; else if(c.localName!=='footnoteReference'&&c.localName!=='drawing') walk(c); } }; walk(p); return s.normalize('NFC').trim(); }
function frag(doc,str){ const d=new DOMParser().parseFromString('<w:root xmlns:w="'+W+'" xmlns:xml="http://www.w3.org/XML/1998/namespace">'+str+'</w:root>','application/xml'); const err=d.getElementsByTagName('parsererror')[0]; if(err) throw new Error('XML: '+err.textContent.slice(0,200)); return [...d.documentElement.childNodes].filter(n=>n.nodeType===1).map(n=>doc.importNode(n,true)); }
const run=(t,o={})=>`<w:r><w:rPr>${o.b?'<w:b/><w:bCs/>':''}${o.i?'<w:i/><w:iCs/>':''}<w:sz w:val="${o.sz||26}"/><w:szCs w:val="${o.sz||26}"/></w:rPr><w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
const para=(runs,o={})=>`<w:p><w:pPr><w:spacing w:before="${o.before||0}" w:after="${o.after==null?120:o.after}" w:line="${o.line||276}" w:lineRule="auto"/>${o.ind?`<w:ind w:left="${o.ind}"/>`:''}<w:jc w:val="${o.jc||'both'}"/></w:pPr>${runs}</w:p>`;
const P=(t,o={})=>para(run(t,o),o);

function mkTable(widths,rows,o={}){
  const total=widths.reduce((a,b)=>a+b,0); const border=o.noBorder?'nil':'single';
  const b=`<w:tblBorders>${['top','left','bottom','right','insideH','insideV'].map(k=>`<w:${k} w:val="${border}" w:sz="4" w:space="0" w:color="000000"/>`).join('')}</w:tblBorders>`;
  let x=`<w:tbl><w:tblPr><w:tblW w:w="${total}" w:type="dxa"/><w:jc w:val="left"/>${b}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`;
  for(const r of rows){ x+=`<w:tr>${r.h?'<w:trPr><w:tblHeader/></w:trPr>':''}`; let ci=0;
    for(const c of r.cells){ const span=c.span||1; const w=widths.slice(ci,ci+span).reduce((a,b)=>a+b,0); ci+=span;
      const lines=c.lines||String(c.t??'').split('\n'); const jc=c.jc||(r.h?'center':'left'); const sz=c.sz||24;
      x+=`<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${span>1?`<w:gridSpan w:val="${span}"/>`:''}${c.vm==='restart'?'<w:vMerge w:val="restart"/>':c.vm==='cont'?'<w:vMerge/>':''}<w:vAlign w:val="${c.va||(r.h?'center':'top')}"/></w:tcPr>`;
      x+=lines.map(l=>`<w:p><w:pPr><w:spacing w:before="0" w:after="40" w:line="240" w:lineRule="auto"/><w:jc w:val="${jc}"/></w:pPr>${run(l,{b:c.b||r.h,i:c.i,sz})}</w:p>`).join('');
      x+='</w:tc>'; }
    x+='</w:tr>'; }
  return x+'</w:tbl>';
}

async function build(data,tplBuf){
  const L=data.lang==='en'?'en':'vn'; const S=T[L];
  const zip=await JSZip.loadAsync(tplBuf); const xml=await zip.file('word/document.xml').async('string');
  const doc=new DOMParser().parseFromString(xml,'application/xml'); const body=doc.getElementsByTagNameNS(W,'body')[0];
  const kids=()=>[...body.childNodes].filter(n=>n.nodeType===1);
  const paras=()=>kids().filter(n=>n.localName==='p');
  const findP=(pred,from)=>paras().find(p=>(from==null||true)&&pred(pText(p)));
  const rm=n=>n&&n.parentNode&&n.parentNode.removeChild(n);
  const insAfter=(ref,nodes)=>{ let cur=ref; for(const n of nodes){ cur.parentNode.insertBefore(n,cur.nextSibling); cur=n; } return cur; };
  const insBefore=(ref,nodes)=>{ for(const n of nodes) ref.parentNode.insertBefore(n,ref); };
  const setP=(p,runsXml)=>{ [...p.childNodes].filter(n=>n.nodeType===1&&n.localName!=='pPr').forEach(rm); frag(doc,runsXml).forEach(n=>p.appendChild(n)); return p; };
  const baseSz=p=>{ const sz=p.getElementsByTagNameNS(W,'sz')[0]; return sz?sz.getAttributeNS(W,'val'):'26'; };
  const setLabel=(p,label,value,bold=true)=>setP(p,run(label,{b:bold,sz:baseSz(p)})+run(' '+value,{sz:baseSz(p)}));
  const setText=(p,text,o={})=>setP(p,run(text,{b:o.b,i:o.i,sz:o.sz||baseSz(p)}));

  // 1. cắt nửa ngôn ngữ kia
  const all=kids(); const sect=all.find(n=>n.localName==='sectPr');
  const iEN=all.findIndex(n=>n.localName==='p'&&pText(n)==='SYLLABUS');
  const iVN=all.findIndex(n=>n.localName==='p'&&pText(n)==='ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN');
  if(iEN<0||iVN<0) throw new Error('Không tìm thấy mốc song ngữ trong mẫu.');
  // nửa tiếng Việt: từ đầu tới trước "SYLLABUS"; nửa tiếng Anh: từ "SYLLABUS" tới hết (trừ sectPr)
  if(L==='vn'){ all.slice(iEN).forEach(n=>{ if(n!==sect) rm(n); }); }
  else { all.slice(0,iEN).forEach(n=>rm(n)); }
  // 2. bỏ ảnh tiêu đề thư, ngắt trang, chú thích chân trang, chữ đỏ (trừ dòng QĐ)
  for(const p of paras()){ [...p.getElementsByTagNameNS(W,'drawing')].forEach(d=>rm(d.parentNode.localName==='r'?d.parentNode:d)); [...p.getElementsByTagNameNS(W,'pict')].forEach(d=>rm(d.parentNode.localName==='r'?d.parentNode:d)); }
  for(const p of paras()){ [...p.getElementsByTagNameNS(W,'br')].filter(b=>b.getAttributeNS(W,'type')==='page').forEach(b=>rm(b)); const pb=p.getElementsByTagNameNS(W,'pageBreakBefore')[0]; if(pb) rm(pb); }
  for(const r of [...body.getElementsByTagNameNS(W,'footnoteReference')]) rm(r.parentNode.localName==='r'?r.parentNode:r);
  for(const p of [...body.getElementsByTagNameNS(W,'p')]){ if(S.qdKeep.test(pText(p))) continue; for(const r of [...p.getElementsByTagNameNS(W,'r')]){ const c=r.getElementsByTagNameNS(W,'color')[0]; if(c&&/^(FF0000|C00000)$/i.test(c.getAttributeNS(W,'val'))) rm(r); } }
  // bỏ đoạn đầu trống (sau khi bỏ ảnh) cho tới tiêu đề
  for(const n of kids()){ if(n.localName==='p'&&pText(n)===S.title) break; if(n.localName==='p'&&!pText(n)) rm(n); }
  // 3. đầu đề
  const pTitle2=paras().find(p=>{ const t=pText(p); return t===(L==='vn'?'TÊN HỌC PHẦN':'COURSE TITLE'); }); if(pTitle2) setText(pTitle2,(L==='vn'?data.ten:(data.tenEn||data.ten)).toUpperCase(),{b:true});
  const lbl=(label,value)=>{ const p=findP(t=>t.toLowerCase().startsWith(label.toLowerCase().replace(/:$/,'').split('/')[0])&&/:/.test(t)); if(p) setLabel(p,label,value); };
  lbl(S.tenLabel,L==='vn'?`${data.ten}${data.tenEn?' ('+data.tenEn+')':''}`:`${data.tenEn||data.ten}${data.ten&&data.tenEn?' ('+data.ten+')':''}`);
  lbl(S.maLabel,data.ma);
  { const p=findP(t=>/^(bộ môn phụ trách|department)\s*:/i.test(t)); if(p) setLabel(p,S.bmLabel,data.bomon); }
  { const p=findP(t=>/^(viện\/khoa|faculty\/school)\s*:/i.test(t)); if(p) setLabel(p,(data.vkLabel||(L==='vn'?'Trường/Khoa':'Faculty/College'))+':',data.vk); }
  lbl(S.tcLabel,String(data.tc).padStart(2,'0')); lbl(S.tqLabel,data.tienquyet||(L==='vn'?'Không':'None'));
  // 4. giảng viên
  { const tbl=kids().find(n=>n.localName==='tbl'); const rows=[{h:true,cells:S.gvHead.map(t=>({t}))}]; (data.gv.length?data.gv:[{ten:'',email:'',dt:'',truso:''}]).forEach((g,i)=>rows.push({cells:[{t:String(i+1),jc:'center'},{t:g.ten},{t:g.email},{t:g.dt},{t:g.truso,jc:'center'}]}));
    const nt=frag(doc,mkTable([600,3100,2600,1500,1715],rows))[0]; tbl.parentNode.replaceChild(nt,tbl);
    const note=findP(t=>/^Note: Please list/.test(t)); if(note) rm(note); }
  // 5. mô tả + mục tiêu
  { const h=findP(t=>t.startsWith(S.h2)); const g=findP(t=>S.descGuide.test(t)); if(g) rm(g);
    const nodes=[]; data.mota.forEach(t=>nodes.push(...frag(doc,P(t)))); if(data.muctieu.length){ nodes.push(...frag(doc,P(S.muctieu,{b:true,after:60}))); data.muctieu.forEach((t,i)=>nodes.push(...frag(doc,P(`(${i+1}) ${t}`,{ind:360})))); }
    insAfter(h,nodes); }
  // 6. CLO
  { const h=findP(t=>t.startsWith(S.h31)); const h32=findP(t=>t.startsWith(S.h32)); const between=[]; let n=h.nextSibling; while(n&&n!==h32){ const nx=n.nextSibling; if(n.nodeType===1) between.push(n); n=nx; } between.forEach(rm);
    insAfter(h,data.clo.flatMap((c,i)=>frag(doc,P(`- CLO${i+1}: ${c}`,{after:60}))));
    setText(h32,S.h32Text,{b:true}); }
  // 7. ma trận 3.2
  { const h32=findP(t=>t.startsWith(S.h32)); const n=data.nPLO; const wPLO=Math.floor((9515-1600)/n); const widths=[1600,...Array(n).fill(wPLO)];
    const rows=[{h:true,cells:[{t:S.matHead},...Array.from({length:n},(_,i)=>({t:'PLO'+(i+1)}))]}];
    data.clo.forEach((c,i)=>{ const vals=data.cloPlo[i]||[]; rows.push({cells:[{t:'CLO'+(i+1),b:true},...Array.from({length:n},(_,j)=>({t:String(vals[j]||''),jc:'center'}))]}); });
    rows.push({cells:[{t:S.matCourse,b:true},...Array.from({length:n},(_,j)=>({t:(data.hocphanRow[j]||'').toString(),jc:'center',b:true}))]});
    insAfter(h32,frag(doc,mkTable(widths,rows)).concat(frag(doc,P('',{after:0})))); }
  // 8. học liệu
  { const hGT=findP(t=>t.startsWith('4.1')); const hBB=findP(t=>t.startsWith('4.2')); const hTC=findP(t=>t.startsWith('4.3')); const hWEB=findP(t=>t.startsWith('4.4')); const h5=findP(t=>/^5\.\s/.test(t));
    const clearBetween=(a,b)=>{ let n=a.nextSibling; while(n&&n!==b){ const nx=n.nextSibling; if(n.nodeType===1) rm(n); n=nx; } };
    clearBetween(hGT,hBB); clearBetween(hBB,hTC); clearBetween(hTC,hWEB); clearBetween(hWEB,h5);
    const fill=(h,items,o={})=>insAfter(h,items.flatMap((t,i)=>frag(doc,P(o.num?`[${o.start+i}] ${t}`:t,{after:60}))));
    let k=1; const hasGT=data.giaotrinh.length>0;
    if(hasGT){ setText(hGT,`4.1. ${S.h4.gt[1]}`,{b:true}); fill(hGT,data.giaotrinh,{num:true,start:k}); k+=data.giaotrinh.length; } else rm(hGT);
    const n2=hasGT?2:1; setText(hBB,`4.${n2}. ${S.h4.bb[1]}`,{b:true}); fill(hBB,data.batbuoc,{num:true,start:k}); k+=data.batbuoc.length;
    setText(hTC,`4.${n2+1}. ${S.h4.tc[1]}`,{b:true}); fill(hTC,data.tuchon,{num:true,start:k}); k+=data.tuchon.length;
    if(data.web.length){ setText(hWEB,`4.${n2+2}. ${S.h4.web[1]}`,{b:true}); fill(hWEB,data.web); } else rm(hWEB); }
  // 9. bảng 5.1 và 5.2
  { const tbls=kids().filter(n=>n.localName==='tbl'); const h51=findP(t=>t.startsWith(S.h51)); const h52=findP(t=>t.startsWith(S.h52));
    const t51=(()=>{ let n=h51.nextSibling; while(n&&n.localName!=='tbl') n=n.nextSibling; return n; })(); const t52=(()=>{ let n=h52.nextSibling; while(n&&n.localName!=='tbl') n=n.nextSibling; return n; })();
    const c=S.t51; const rows=[
      {h:true,cells:[{t:c.buoi,vm:'restart'},{t:c.nd,vm:'restart'},{t:c.ht,vm:'restart'},{t:c.pb,span:4},{t:c.clo,vm:'restart'}]},
      {h:true,cells:[{t:'',vm:'cont'},{t:'',vm:'cont'},{t:'',vm:'cont'},{t:c.onclass,span:2},{t:c.tl,vm:'restart'},{t:c.tu,vm:'restart'},{t:'',vm:'cont'}]},
      {h:true,cells:[{t:'',vm:'cont'},{t:'',vm:'cont'},{t:'',vm:'cont'},{t:c.lt},{t:c.th},{t:'',vm:'cont'},{t:'',vm:'cont'},{t:'',vm:'cont'}]}];
    const s={x:0,y:0,z:0,e:0};
    data.rows.forEach((r,i)=>{ ['x','y','z','e'].forEach(k=>s[k]+=Number(r[k])||0); rows.push({cells:[{t:String(i+1),jc:'center'},{t:r.nd},{t:r.ht||(L==='vn'?'Trực tiếp':'In person'),jc:'center'},{t:fmt(r.x),jc:'center'},{t:fmt(r.y),jc:'center'},{t:fmt(r.z),jc:'center'},{t:fmt(r.e),jc:'center'},{t:r.clo,jc:'center'}]}); });
    rows.push({cells:[{t:c.total,span:3,b:true},{t:fmt(s.x),jc:'center',b:true},{t:fmt(s.y),jc:'center',b:true},{t:fmt(s.z),jc:'center',b:true},{t:fmt(s.e),jc:'center',b:true},{t:''}]});
    t51.parentNode.replaceChild(frag(doc,mkTable([720,2480,1100,1000,1000,1100,1100,1015],rows))[0],t51);
    const c2=S.t52; const rows2=[{h:true,cells:c2.head.map(t=>({t}))}];
    const ktMap={'Chuyên cần':'Attendance','Giữa kỳ':'Mid-term','Cuối kỳ':'Final exam'}; const ktText=t=>L==='en'?String(t||'').split(/\s*,\s*/).map(x=>ktMap[x]||x).filter(Boolean).join(', '):(t||'');
    data.rows.forEach((r,i)=>{ const acts=[['lt',r.x],['th',r.y],['tl',r.z],['tu',r.e],['kt',null]]; acts.forEach(([k,h],j)=>rows2.push({cells:[{t:j===0?String(i+1):'',vm:j===0?'restart':'cont',jc:'center'},{t:c2.acts[j]},{t:k==='kt'?'':fmt(h),jc:'center'},{t:k==='kt'?ktText(r.c52&&r.c52.kt):((r.c52&&r.c52[k])||'')},{t:j===0?r.clo:'',vm:j===0?'restart':'cont',jc:'center'}]})); });
    const nt52=frag(doc,mkTable([700,2300,800,4515,1200],rows2))[0]; t52.parentNode.replaceChild(nt52,t52);
    insAfter(nt52,frag(doc,P(S.note52,{i:true,before:120}))); }
  // 10. quy định 6.1 / 6.2
  { const h61=findP(t=>t.startsWith(S.h61)); const h62=findP(t=>t.startsWith(S.h62)); const h7=findP(t=>t.startsWith(S.h7));
    const fix=(h,end,extra)=>{ let n=h.nextSibling; while(n&&n!==end){ const nx=n.nextSibling; if(n.nodeType===1&&n.localName==='p'&&S.chiTiet.test(pText(n))){ if(extra.length){ const base=pText(n).replace(S.chiTiet,'').trim(); setText(n,base,{}); insAfter(n,extra.flatMap(t=>frag(doc,P('- '+t,{after:60})))); } else rm(n); } n=nx; } };
    fix(h61,h62,data.quydinh61||[]); fix(h62,h7,data.quydinh62||[]); }
  // 11. đánh giá
  { const h7=findP(t=>t.startsWith(S.h7)); let tbl=h7.nextSibling; while(tbl&&tbl.localName!=='tbl') tbl=tbl.nextSibling; if(!tbl) throw new Error('Không tìm thấy bảng đánh giá trong mẫu.'); const c=S.dg; const rows=[{h:true,cells:[{t:c.head[0],span:2},{t:c.head[2]},{t:c.head[3]},{t:c.head[4]},{t:c.head[5]}]}];
    const groups=[]; data.danhgia.forEach(d=>{ const g=groups[groups.length-1]; if(g&&g.nhom===d.nhom) g.items.push(d); else groups.push({nhom:d.nhom,items:[d]}); });
    let tot=0; groups.forEach(g=>g.items.forEach((d,j)=>{ tot+=parseFloat(String(d.trongso).replace('%',''))||0; rows.push({cells:[{t:j===0?g.nhom:'',vm:j===0?'restart':'cont',b:true},{t:d.hinhthuc},{t:d.noidung},{t:d.congcu},{t:d.clo,jc:'center'},{t:String(d.trongso).includes('%')?d.trongso:d.trongso+'%',jc:'center'}]}); }));
    rows.push({cells:[{t:c.total,span:5,b:true,jc:'right'},{t:fmt(tot)+'%',b:true,jc:'center'}]});
    tbl.parentNode.replaceChild(frag(doc,mkTable([1300,1500,2200,2200,1315,1000],rows))[0],tbl); }
  // 12. khối ký (bỏ bảng ký sẵn của mẫu nếu còn, rồi dựng lại)
  { kids().filter(n=>n.localName==='tbl').filter(t=>/DEAN OF|HEAD OF DEPARTMENT|PRESIDENT|TRƯỞNG/i.test(t.textContent)).forEach(rm); const cell=(title,name)=>({lines:[title,'','','',name||''],b:true,jc:'center'}); const empty={lines:['','','','',''],b:true,jc:'center'};
    const sig=mkTable([4757,4758],[{cells:[data.dacThu?empty:cell(data.kyTrai||S.kyTrai,data.kyTraiTen),cell(data.kyPhai||S.kyPhai,data.kyPhaiTen)]}],{noBorder:true});
    insBefore(sect,frag(doc,P('',{after:0})).concat(frag(doc,sig))); }
  // 13. gộp đoạn trống liên tiếp
  { let prevEmpty=false; for(const n of kids()){ if(n.localName!=='p'){ prevEmpty=false; continue; } const e=!pText(n); if(e&&prevEmpty) rm(n); prevEmpty=e; } }
  const out=new XMLSerializer().serializeToString(doc);
  zip.file('word/document.xml',out);
  return zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
}
global.SinhDeCuong={build,T};
})(window);
