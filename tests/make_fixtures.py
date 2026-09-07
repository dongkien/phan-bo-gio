#!/usr/bin/env python3
"""Sinh bộ file thử từ file chuẩn (tests/fixtures/chuan_vn.docx, chuan_en.docx do phần 4 của trang sinh ra).
Mỗi biến thể = sửa XML có chủ đích để tạo đúng một lỗi. Chạy: python3 tests/make_fixtures.py"""
import zipfile, os, re
HERE=os.path.dirname(os.path.abspath(__file__)); FX=os.path.join(HERE,'fixtures')
def mutate(src,dst,fn):
    zin=zipfile.ZipFile(src); zout=zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED)
    for it in zin.infolist():
        d=zin.read(it.filename)
        if it.filename=='word/document.xml': d=fn(d.decode('utf-8')).encode('utf-8')
        zout.writestr(it,d)
    zout.close(); print('->',os.path.basename(dst))
def first_t(x,old,new): 
    assert old in x, old; return x.replace(old,new,1)
V=os.path.join(FX,'chuan_vn.docx'); E=os.path.join(FX,'chuan_en.docx')
mutate(V,os.path.join(FX,'loi_thieu_khoi_ky.docx'),lambda x: x.replace('TRƯỞNG BỘ MÔN','GIẢNG VIÊN BIÊN SOẠN'))
mutate(V,os.path.join(FX,'loi_tai_lieu_thieu_tham_khao.docx'),lambda x: x.replace('Tài liệu tham khảo bắt buộc','Tài liệu bắt buộc'))
mutate(V,os.path.join(FX,'loi_khoa_thay_vien.docx'),lambda x: first_t(x,'>Viện:<','>Khoa:<'))   # KHÔNG phải lỗi: phải vẫn đạt
mutate(V,os.path.join(FX,'loi_tong_gio.docx'),lambda x: first_t(x,'>Tổng cộng (giờ)<','>Tổng cộng (tiết)<'))
mutate(V,os.path.join(FX,'loi_tai_lieu_tieng_anh.docx'),lambda x: first_t(x,'[2] Nguyễn Văn B (2020). Quản lý nhà nước về kinh tế. Hà Nội: Nhà xuất bản Kinh tế quốc dân.','[2] Mankiw, N. G. (2019). Macroeconomics, 10th edition. New York: Worth Publishers.'))
def zero_with_content(x):
    # buổi 1, dòng Thực hành, thảo luận: giờ "1" -> "0" nhưng giữ nội dung
    i=x.index('Thảo luận tình huống'); j=x.rfind('<w:t xml:space="preserve">1</w:t>',0,i); assert j>0; return x[:j]+'<w:t xml:space="preserve">0</w:t>'+x[j+len('<w:t xml:space="preserve">1</w:t>'):]
mutate(V,os.path.join(FX,'loi_52_khong_gio_co_noi_dung.docx'),zero_with_content)
mutate(V,os.path.join(FX,'loi_cuoi_ky_40.docx'),lambda x: first_t(first_t(x,'>30%<','>50%<'),'>60%<','>40%<'))
mutate(E,os.path.join(FX,'loi_en_tai_lieu_tieng_viet.docx'),lambda x: first_t(x,'[2] Mankiw, N. G. (2021). Principles of Economics (9th ed.). Boston: Cengage.','[2] Nguyễn Văn B (2020). Quản lý nhà nước về kinh tế. Hà Nội: Nhà xuất bản Kinh tế quốc dân.'))
print('xong')
