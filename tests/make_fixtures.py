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
mutate(V,os.path.join(FX,'loi_thieu_khoi_ky.docx'),lambda x: x.replace('TRƯỞNG KHOA','GIẢNG VIÊN BIÊN SOẠN'))
mutate(V,os.path.join(FX,'loi_khoi_ky_cu.docx'),lambda x: x.replace('TRƯỞNG KHOA','TRƯỞNG BỘ MÔN').replace('HIỆU TRƯỞNG','VIỆN TRƯỞNG VIỆN KINH TẾ VÀ KINH DOANH QUỐC TẾ'))
mutate(V,os.path.join(FX,'loi_nhan_cu_bo_mon.docx'),lambda x: first_t(x,'>Khoa phụ trách:<','>Bộ môn phụ trách:<'))
mutate(V,os.path.join(FX,'loi_tai_lieu_thieu_tham_khao.docx'),lambda x: x.replace('Tài liệu tham khảo bắt buộc','Tài liệu bắt buộc'))
mutate(V,os.path.join(FX,'loi_khoa_thay_vien.docx'),lambda x: first_t(x,'>Trường:<','>Khoa:<'))   # KHÔNG phải lỗi: phải vẫn đạt
mutate(V,os.path.join(FX,'loi_tong_gio.docx'),lambda x: first_t(x,'>Tổng cộng (giờ)<','>Tổng cộng (tiết)<'))
mutate(V,os.path.join(FX,'loi_tai_lieu_tieng_anh.docx'),lambda x: first_t(x,'[2] Nguyễn Văn B (2020). Quản lý nhà nước về kinh tế. Hà Nội: Nhà xuất bản Kinh tế quốc dân.','[2] Mankiw, N. G. (2019). Macroeconomics, 10th edition. New York: Worth Publishers.'))
def zero_with_content(x):
    # buổi 1, dòng Thực hành, thảo luận: giờ "1" -> "0" nhưng giữ nội dung
    i=x.index('Thảo luận tình huống'); j=x.rfind('<w:t xml:space="preserve">1</w:t>',0,i); assert j>0; return x[:j]+'<w:t xml:space="preserve">0</w:t>'+x[j+len('<w:t xml:space="preserve">1</w:t>'):]
mutate(V,os.path.join(FX,'loi_52_khong_gio_co_noi_dung.docx'),zero_with_content)
mutate(V,os.path.join(FX,'loi_cuoi_ky_40.docx'),lambda x: first_t(first_t(x,'>30%<','>50%<'),'>60%<','>40%<'))
mutate(E,os.path.join(FX,'loi_en_tai_lieu_tieng_viet.docx'),lambda x: first_t(x,'[2] Mankiw, N. G. (2021). Principles of Economics (9th ed.). Boston: Cengage.','[2] Nguyễn Văn B (2020). Quản lý nhà nước về kinh tế. Hà Nội: Nhà xuất bản Kinh tế quốc dân.'))
def dac_thu(x):
    x=x.replace('Nguyên lý quản lý kinh tế','Luận văn thạc sĩ').replace('NGUYÊN LÝ QUẢN LÝ KINH TẾ','LUẬN VĂN THẠC SĨ')
    return x.replace('<w:t xml:space="preserve">TRƯỞNG KHOA</w:t>','<w:t xml:space="preserve"></w:t>')
mutate(V,os.path.join(FX,'dac_thu_luan_van.docx'),dac_thu)   # đặc thù, chỉ Hiệu trưởng: phải đạt
mutate(V,os.path.join(FX,'loi_dac_thu_hai_chu_ky.docx'),lambda x: x.replace('Nguyên lý quản lý kinh tế','Khóa luận tốt nghiệp').replace('NGUYÊN LÝ QUẢN LÝ KINH TẾ','KHÓA LUẬN TỐT NGHIỆP'))
mutate(E,os.path.join(FX,'loi_en_nhan_cu_school.docx'),lambda x: first_t(x,'>College:<','>Faculty/School:<'))
def clo9(x):
    i=x.index('Chương 5'); j=x.index('<w:t xml:space="preserve">5</w:t>',i)   # ô CLO của buổi 5 trong bảng 5.1
    return x[:j]+'<w:t xml:space="preserve">9</w:t>'+x[j+len('<w:t xml:space="preserve">5</w:t>'):]
mutate(V,os.path.join(FX,'loi_clo_khong_ton_tai.docx'),clo9)
mutate(V,os.path.join(FX,'loi_ma_tran_danh_X.docx'),lambda x: first_t(x,'<w:t xml:space="preserve">3,A</w:t>','<w:t xml:space="preserve">X</w:t>'))
print('xong')
