---
name: tao-de-cuong
description: >
  Soạn mới hoặc cập nhật ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN (syllabus) của Trường Đại học
  Ngoại thương (ĐH, ThS, TS) theo ĐÚNG mẫu chuẩn 2025, bằng cách ĐIỀN nội dung vào
  file template gốc (không vẽ lại/thiết kế lại). Dùng khi user nói: "soạn đề cương",
  "làm đề cương học phần", "cập nhật đề cương", "syllabus", "đề cương chi tiết",
  "điền mẫu đề cương 2025", hoặc đưa một học phần + giáo trình để dựng đề cương.
  Bao gồm: lấy mô tả/PLO/ma trận từ Bản mô tả CTĐT, đối chiếu giáo trình tới cấp
  tiểu mục, chuẩn hóa học liệu theo ngôn ngữ giảng dạy (tìm bản dịch nếu cần), tách
  bản tiếng Việt/tiếng Anh, và xuất .docx đúng định dạng.
---

# Tạo / cập nhật đề cương học phần FTU (mẫu 2025)

Mục tiêu: ra đề cương **đúng format chuẩn 2025** + **đúng nội dung** (lấy từ CTĐT,
đối chiếu giáo trình), không tự chế layout.

## Nguyên tắc cứng (đã rút từ thực chiến - đừng vi phạm)
1. **ĐIỀN vào template gốc, KHÔNG vẽ lại.** Luôn bắt đầu từ file mẫu chính thức; không tự dựng bảng bằng markdown/pandoc rồi build.
2. **Mẫu chuẩn:** dùng bản đóng gói `assets/Mau_de_cuong_2025.docx` (hoặc bản mới hơn do Phòng Quản lý đào tạo ban hành, nếu có). Nếu FTU ra mẫu mới hơn → cập nhật lại file trong `assets/`.
3. **Mô tả học phần, PLO, ma trận học phần→PLO** phải lấy từ **Bản mô tả CTĐT** (xem `references/don_vi_glossary.md`), không bịa. **Mô tả học phần điền NGUYÊN VĂN** đoạn mô tả trong CTĐT — KHÔNG paraphrase, KHÔNG bỏ/rút gọn câu, KHÔNG đổi cách diễn đạt (kể cả "sửa cho mượt"). Khối "Mục tiêu đào tạo (1)(2)(3)" bên dưới được phép tự soạn nhưng phải bám ý mô tả. Nếu CTĐT KHÔNG có mô tả cho học phần → rút **trung thực** từ đề cương/bản nháp của tác giả (ghi rõ nguồn), vẫn không bịa. Nghiệm thu: so chuỗi mô tả với CTĐT (đầu + cuối + không thiếu câu).
4. **Học liệu theo ngôn ngữ giảng dạy:** giáo trình + tài liệu tham khảo **bắt buộc** phải cùng ngôn ngữ với đề cương. Tài liệu khác ngôn ngữ → đẩy xuống **tự chọn**. Nếu chưa có tài liệu bắt buộc đúng tiếng → **web-search tìm bản dịch/giáo trình tiếng Việt**; có thì điền (ghi đúng NXB/dịch giả/năm/ấn bản THẬT, không bịa năm), KHÔNG có thì giáo trình = **"Tập bài giảng do giảng viên biên soạn (trên cơ sở [nguồn])"**. **Học phần chưa có giáo trình thì BỎ mục 4.1 Giáo trình và đánh số lại: 4.1 Tài liệu tham khảo bắt buộc, 4.2 Tài liệu tham khảo tự chọn, 4.3 Website** (không để mục Giáo trình trống). Ngôn ngữ của giáo trình và tài liệu bắt buộc phải tương đồng ngôn ngữ giảng dạy. **CẤM viện cớ "học phần khác cùng chương trình dùng tài liệu tiếng Anh"** để nhét giáo trình/bắt buộc tiếng Anh vào đề cương tiếng Việt — chương trình tiếng Việt thì bắt buộc phải là tiếng Việt.
5. **5.1 vs 5.2:** mục 5.1 ghi **tên chương/buổi + cột "Hình thức" (Trực tiếp/Trực tuyến/khác, mặc định "Trực tiếp") ngay sau cột Nội dung + phân bổ giờ + CLO**; mục 5.2 ghi **chi tiết tiểu mục**, mỗi buổi đủ **5 dòng hoạt động** (Lý thuyết / Thực hành-thảo luận / Tiểu luận-BT-thực tế / Tự học có HD / Kiểm tra-đánh giá) với số giờ khớp 5.1. **Trong 5.2 CHỈ gộp dọc ô Buổi và CLO; ô "Nội dung chính" KHÔNG gộp — mỗi dòng hoạt động có nội dung riêng tương ứng** (dòng Lý thuyết = nội dung lý thuyết; dòng Thảo luận = nội dung thảo luận; dòng Tiểu luận = bài tập/thực tế; dòng Tự học = tài liệu đọc).
6. **Nội dung 5.2 xuống dòng từng ý:** tên chương → xuống dòng → mục lớn → xuống dòng → mục nhỏ (gạch đầu dòng) → … cho dễ đọc.
7. **Ma trận 3.2** gồm các dòng CLO→PLO **và dòng cuối "Học phần"** = ánh xạ tổng của học phần tới từng PLO (đúng dòng trong ma trận CTĐT).
8. **Xóa chú thích đỏ + footnote hướng dẫn** của template ở bản chính thức, NHƯNG **GIỮ dòng "Kèm theo QĐ số …/QĐ-ĐHNT…"** (đây là cấu phần chính thức, không phải chú thích). **Dọn layout trước khi lưu:** bỏ **ảnh letterhead** ở đầu tài liệu, bỏ **mọi ngắt trang thủ công** còn sót sau khi tách song ngữ, và **gộp các đoạn trống liên tiếp** — để đề cương gọn và **khối ký không bị đẩy sang trang riêng** (mẫu thống nhất không dùng letterhead).
9. **Nghiệm thu bằng đọc lại file .docx thật** (python-docx), không tin markdown.
10. **Số tín chỉ ghi gọn:** mặc định chỉ ghi số (vd `Số tín chỉ: 03`), KHÔNG kèm đoạn ngoặc phân bổ giờ (phân bổ giờ đã có ở bảng 5.1) — trừ khi tác giả yêu cầu khác.
11. **Cấu trúc buổi (5.1/5.2) theo LOGIC của môn**, KHÔNG map máy móc Buổi = Chương giáo trình (thứ tự chương sách thường không tối ưu sư phạm); giáo trình chỉ là chỗ dựa cho phần lõi. Tổng giờ các buổi phải khớp **chính xác** phân bổ CTĐT (vd 24/6/60/60). Chưa có dòng phân bổ thì tính bằng skill `phan-bo-gio-tin-chi` (script `phan_bo_gio.py --tc N --lt x --th y`). Nếu môn phủ 2 mảng (vd "nền tảng và thị trường số") thì một giáo trình thường không đủ — ghép nguồn cho mảng còn lại.
12. **Cuối mục 5.2 thêm 1 dòng lưu ý NGOÀI bảng (in nghiêng):** "Lưu ý: Các hoạt động kết nối thực tiễn và phương pháp kiểm tra đánh giá có thể linh hoạt theo điều kiện thực tế và quyết định của Bộ môn."
13. **Đánh giá:** chuyên cần 10% + cuối kỳ ≥50%. Nhiều bộ môn ưu tiên **thi viết / vấn đáp** và HẠN CHẾ tiểu luận/paper (vd 10% chuyên cần + 30% giữa kỳ + 60% cuối kỳ) — theo yêu cầu tác giả/bộ môn. **Giữa kỳ:** cho phép chọn **thi viết HOẶC bài tập nhóm kèm báo cáo**. **Cuối kỳ:** thi viết hoặc vấn đáp.
14. **Khối ký cuối đề cương:** hai ô **TRƯỞNG BỘ MÔN** (trái) và **VIỆN TRƯỞNG VIỆN KINH TẾ VÀ KINH DOANH QUỐC TẾ** (phải) — KHÔNG ghi "Giảng viên biên soạn" (trừ khi tác giả yêu cầu khác cho đơn vị khác).

## Quy trình (các bước)
- **B0. Khảo sát:** tìm file mẫu chuẩn (mục 2 trên) + 1 bản đã điền làm ví dụ. Xác định đề cương thuộc CTĐT nào.
- **B1. Giải phẫu template:** python-docx liệt kê paragraph + bảng; xác định ranh giới song ngữ (đoạn "SYLLABUS"), ô nhãn cần điền, cấu trúc từng bảng, footnote/chữ đỏ.
- **B2. Gom nội dung:** từ đề cương cũ (CLOs, đánh giá, tín chỉ, mã); từ **CTĐT** (mô tả, PLO, ánh xạ học phần→PLO); nếu bám giáo trình → lấy **mục lục thật** (OCR nếu bản scan, dùng `ocrmypdf -l eng/vie`).
- **B3. Đối chiếu giáo trình ↔ nội dung (nếu có):** map tới cấp tiểu mục; bắt chỗ thiếu/gộp/đảo thứ tự, lỗi dịch thuật ngữ, lệch ấn bản.
- **B4. Chuẩn hóa học liệu** theo nguyên tắc 4.
- **B5. Điền vào template + tách file:** **tách nửa song ngữ TRƯỚC khi điền** (nếu không, hàm tìm-đoạn sẽ trúng nhầm nửa kia). Điền header → mô tả → CLOs → học liệu → bảng (5.1, 5.2, đánh giá, ma trận 3.2). Tách thành 2 file VN/EN nếu được yêu cầu.
- **B6. Dọn:** xóa chữ đỏ + footnote (giữ dòng QĐ); gọn bảng giảng viên; thêm khối ký nếu nửa bị tách mất.
- **B7. Nghiệm thu** + liệt kê điểm cần tác giả quyết (trọng số đánh giá, SĐT/đồng GV, lựa chọn sư phạm như thứ tự định tính/định lượng).

## Tài nguyên kèm skill
- `assets/Mau_de_cuong_2025.docx` — mẫu chuẩn 2025 (đóng gói để di động).
- `assets/fill_de_cuong_example.py` — **script python-docx mẫu (worked example QLY801, 8 PLO, song ngữ)**: minh họa điền header/CLO/học liệu, dựng 5.1, dựng 5.2 đa-dòng gộp dọc, ma trận 3.2 + dòng học phần, tách song ngữ, strip chữ đỏ giữ dòng QĐ.
- `references/don_vi_glossary.md` — tên đơn vị VN-EN, nguồn lấy PLO từ CTĐT, bản dịch giáo trình đã xác minh.

## Định nghĩa "xong"
Đúng template gốc · đủ 7 mục + ma trận 3.2 (có dòng học phần khớp CTĐT) + **khối ký (Trưởng Bộ môn + Viện trưởng)** · giữ dòng QĐ · **mô tả NGUYÊN VĂN CTĐT** · số tín chỉ ghi gọn · **5.1 có cột Hình thức** / **5.2 nội dung tách theo từng hoạt động (chỉ gộp Buổi+CLO)** + xuống dòng từng ý + **dòng lưu ý cuối 5.2** · **tổng giờ khớp chính xác CTĐT** · học liệu đúng ngôn ngữ + ấn bản thật · 0 placeholder/0 chữ đỏ chú thích · đã liệt kê điểm chờ quyết.
