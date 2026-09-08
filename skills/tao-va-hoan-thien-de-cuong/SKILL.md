---
name: tao-va-hoan-thien-de-cuong
description: >
  TẠO và HOÀN THIỆN ĐỀ CƯƠNG CHI TIẾT HỌC PHẦN (syllabus) của Trường Đại học Ngoại
  thương (ĐH, ThS, TS). Chế độ TẠO: soạn mới/cập nhật theo ĐÚNG mẫu chuẩn 2025 bằng
  cách ĐIỀN vào file template gốc (không vẽ lại), lấy mô tả/PLO/ma trận từ Bản mô tả
  CTĐT, đối chiếu giáo trình tới cấp tiểu mục, học liệu đúng ngôn ngữ giảng dạy, tách
  bản Việt/Anh, xuất .docx. Chế độ HOÀN THIỆN: rà CHẤT LƯỢNG một đề cương có sẵn theo
  Hướng dẫn xây dựng CĐR của FTU: đóng góp CLO→PLO ở ma trận 3.2 có thực sự phù hợp
  (nội dung, mức I/R/M, khớp CTĐT), phương pháp giảng dạy (5.1/5.2) và phương pháp
  kiểm tra đánh giá (mục 7) có đủ để đạt CLO không, tài liệu tham khảo có tồn tại và
  còn cập nhật không (web-verify). Dùng khi user nói: "soạn đề cương", "làm đề cương
  học phần", "cập nhật đề cương", "syllabus", "đề cương chi tiết", "điền mẫu đề cương
  2025", "rà đề cương", "hoàn thiện đề cương", "kiểm tra ma trận CLO PLO", "phương pháp
  đánh giá có phù hợp không", "kiểm tài liệu tham khảo", hoặc đưa file đề cương/học
  phần + giáo trình.
---

# Tạo và hoàn thiện đề cương học phần FTU (mẫu 2025)

Hai chế độ, chọn theo yêu cầu:
- **TẠO** (soạn mới / cập nhật / điền mẫu): ra đề cương **đúng format chuẩn 2025** + **đúng nội dung** (lấy từ CTĐT, đối chiếu giáo trình), không tự chế layout. Các mục "Nguyên tắc cứng" và "Quy trình" bên dưới.
- **HOÀN THIỆN** (rà chất lượng một đề cương có sẵn): đọc hiểu nội dung, kết luận ma trận 3.2 / phương pháp dạy / phương pháp đánh giá / học liệu có đạt không, ra báo cáo đề xuất sửa. Mục "Chế độ HOÀN THIỆN" bên dưới. Khi sếp đưa file đề cương và hỏi "được chưa", "rà", "hoàn thiện", "có phù hợp không" thì vào chế độ này; kết thúc bằng sửa file theo chế độ TẠO sau khi sếp chốt.

## Nguyên tắc cứng (đã rút từ thực chiến - đừng vi phạm)
1. **ĐIỀN vào template gốc, KHÔNG vẽ lại.** Luôn bắt đầu từ file mẫu chính thức; không tự dựng bảng bằng markdown/pandoc rồi build.
2. **Mẫu chuẩn:** dùng bản đóng gói `assets/Mau_de_cuong_2025.docx` (hoặc bản mới hơn do Phòng Quản lý đào tạo ban hành, nếu có). Nếu FTU ra mẫu mới hơn → cập nhật lại file trong `assets/`.
3. **Mô tả học phần, PLO, ma trận học phần→PLO** phải lấy từ **Bản mô tả CTĐT** (xem `references/don_vi_glossary.md`), không bịa. **Mô tả học phần điền NGUYÊN VĂN** đoạn mô tả trong CTĐT — KHÔNG paraphrase, KHÔNG bỏ/rút gọn câu, KHÔNG đổi cách diễn đạt (kể cả "sửa cho mượt"). Khối "Mục tiêu đào tạo (1)(2)(3)" bên dưới được phép tự soạn nhưng phải bám ý mô tả. Nếu CTĐT KHÔNG có mô tả cho học phần → rút **trung thực** từ đề cương/bản nháp của tác giả (ghi rõ nguồn), vẫn không bịa. Nghiệm thu: so chuỗi mô tả với CTĐT (đầu + cuối + không thiếu câu).
4. **Học liệu theo ngôn ngữ giảng dạy:** giáo trình + tài liệu tham khảo **bắt buộc** phải cùng ngôn ngữ với đề cương. Tài liệu khác ngôn ngữ → đẩy xuống **tự chọn**. Nếu chưa có tài liệu bắt buộc đúng tiếng → **web-search tìm bản dịch/giáo trình tiếng Việt**; có thì điền (ghi đúng NXB/dịch giả/năm/ấn bản THẬT, không bịa năm), KHÔNG có thì giáo trình = **"Tập bài giảng do giảng viên biên soạn (trên cơ sở [nguồn])"**. **Học phần chưa có giáo trình thì BỎ mục 4.1 Giáo trình và đánh số lại: 4.1 Tài liệu tham khảo bắt buộc, 4.2 Tài liệu tham khảo tự chọn, 4.3 Website** (không để mục Giáo trình trống). Ngôn ngữ của giáo trình và tài liệu bắt buộc phải tương đồng ngôn ngữ giảng dạy. **CẤM viện cớ "học phần khác cùng chương trình dùng tài liệu tiếng Anh"** để nhét giáo trình/bắt buộc tiếng Anh vào đề cương tiếng Việt — chương trình tiếng Việt thì bắt buộc phải là tiếng Việt.
5. **5.1 vs 5.2:** mục 5.1 ghi **tên chương/buổi + cột "Hình thức" (Trực tiếp/Trực tuyến/khác, mặc định "Trực tiếp") ngay sau cột Nội dung + phân bổ giờ + CLO**; mục 5.2 ghi **chi tiết tiểu mục**, mỗi buổi đủ **5 dòng hoạt động** (Lý thuyết / Thực hành-thảo luận / Tiểu luận-BT-thực tế / Tự học có HD / Kiểm tra-đánh giá) với số giờ khớp 5.1. **Trong 5.2 CHỈ gộp dọc ô Buổi và CLO; ô "Nội dung chính" KHÔNG gộp — mỗi dòng hoạt động có nội dung riêng tương ứng** (dòng Lý thuyết = nội dung lý thuyết; dòng Thảo luận = nội dung thảo luận; dòng Tiểu luận = bài tập/thực tế; dòng Tự học = tài liệu đọc; **dòng Kiểm tra, đánh giá KHÔNG ghi giờ**, ô nội dung chỉ ghi tên hình thức đánh giá sẽ dùng nội dung buổi đó: "Chuyên cần, Giữa kỳ, Cuối kỳ", KHÔNG ghi câu hỏi/nội dung ôn tập — sếp nhắc 8/9/2026).
6. **Nội dung 5.2 xuống dòng từng ý:** tên chương → xuống dòng → mục lớn → xuống dòng → mục nhỏ (gạch đầu dòng) → … cho dễ đọc.
6b. **Viết CLO theo Hướng dẫn xây dựng CĐR của Trường (TB 424, tóm tắt ở `references/huong_dan_cdr_clo_plo.md`):** mỗi CLO mở đầu bằng MỘT động từ hành động đo được lấy từ bảng gợi ý ba lĩnh vực (kiến thức: nhận diện, giải thích, vận dụng, phân tích, đánh giá, thiết kế…; kỹ năng: thực hiện, phối hợp, làm chủ…; thái độ: tuân thủ, tham gia, tôn trọng, cam kết…). KHÔNG ghi chủ ngữ "Sinh viên/Người học", KHÔNG mở đầu bằng "Kiến thức về", "Có khả năng", KHÔNG dùng "hiểu", "biết", "nắm được" (không đo được). Số CLO thường **3-6** (hơn 6 chỉ khi thật cần); mỗi CLO chỉ nên đáp ứng **một PLO** (học phần đóng góp nhiều PLO thì tách CLO theo PLO); PLO nào học phần đóng góp thì phải có CLO ghi mức, mức cao nhất của CLO bằng mức của học phần. Bộ nghiệm thu web (v3.3) báo XEM LẠI cả ba điểm này.
7. **Ma trận 3.2** gồm các dòng CLO→PLO **và dòng cuối "Học phần"** (đúng tên, không "Tổng phân nhiệm") = ánh xạ tổng của học phần tới từng PLO (đúng dòng trong ma trận CTĐT). **Ô giao CLO×PLO CHỈ ghi mức 1 (I, giới thiệu), 2 (R, nâng cao) hoặc 3 (M, thành thạo); dòng "Học phần" ghi 1, 2, 3 hoặc "3,A" nếu học phần được dùng để đánh giá PLO đó. KHÔNG đánh "X", KHÔNG ghi ",A" ở dòng CLO** (sếp chốt 8/9/2026).
8. **Xóa chú thích đỏ + footnote hướng dẫn** của template ở bản chính thức, NHƯNG **GIỮ dòng "Kèm theo QĐ số …/QĐ-ĐHNT…"** (đây là cấu phần chính thức, không phải chú thích). **Dọn layout trước khi lưu:** bỏ **ảnh letterhead** ở đầu tài liệu, bỏ **mọi ngắt trang thủ công** còn sót sau khi tách song ngữ, và **gộp các đoạn trống liên tiếp** — để đề cương gọn và **khối ký không bị đẩy sang trang riêng** (mẫu thống nhất không dùng letterhead).
9. **Nghiệm thu bằng đọc lại file .docx thật** (python-docx), không tin markdown.
10. **Số tín chỉ ghi gọn:** mặc định chỉ ghi số (vd `Số tín chỉ: 03`), KHÔNG kèm đoạn ngoặc phân bổ giờ (phân bổ giờ đã có ở bảng 5.1) — trừ khi tác giả yêu cầu khác.
11. **Cấu trúc buổi (5.1/5.2) theo LOGIC của môn**, KHÔNG map máy móc Buổi = Chương giáo trình (thứ tự chương sách thường không tối ưu sư phạm); giáo trình chỉ là chỗ dựa cho phần lõi. Tổng giờ các buổi phải khớp **chính xác** phân bổ CTĐT (vd 24/6/60/60). Chưa có dòng phân bổ thì tính bằng skill `phan-bo-gio-tin-chi` (script `phan_bo_gio.py --tc N --lt x --th y`). Nếu môn phủ 2 mảng (vd "nền tảng và thị trường số") thì một giáo trình thường không đủ — ghép nguồn cho mảng còn lại.
12. **Cuối mục 5.2 thêm 1 dòng lưu ý NGOÀI bảng (in nghiêng):** "Lưu ý: Các hoạt động kết nối thực tiễn và phương pháp kiểm tra đánh giá có thể linh hoạt theo điều kiện thực tế và quyết định của Bộ môn."
13. **Đánh giá:** chuyên cần 10% + cuối kỳ ≥50%. Nhiều bộ môn ưu tiên **thi viết / vấn đáp** và HẠN CHẾ tiểu luận/paper (vd 10% chuyên cần + 30% giữa kỳ + 60% cuối kỳ) — theo yêu cầu tác giả/bộ môn. **Giữa kỳ:** cho phép chọn **thi viết HOẶC bài tập nhóm kèm báo cáo**. **Cuối kỳ:** thi viết hoặc vấn đáp.
14. **Khối ký cuối đề cương (từ 9/2026, Trường đã bỏ cấp Bộ môn):** hai ô **TRƯỞNG KHOA** (trái) và **HIỆU TRƯỞNG** (phải) — KHÔNG ghi "Giảng viên biên soạn", KHÔNG còn Trưởng Bộ môn / Viện trưởng.
15. **Tên đơn vị theo cơ cấu mới:** dòng "Bộ môn phụ trách:" → **"Khoa phụ trách:"** (ghi tên Khoa, vd Khoa Kinh tế liên ngành); dòng "Viện/Khoa:" → **"Trường/Khoa:"**, ghi "Trường:" hoặc "Khoa:" theo đơn vị quản lý học phần (vd Trường Kinh tế và Quản lý công). Mọi chữ "Bộ môn" trong đề cương (kể cả dòng lưu ý cuối 5.2: "…quyết định của Khoa") đổi thành "Khoa". **Bản tiếng Anh giữ nhãn mẫu gốc**: "Department:" = Khoa chuyên môn, "Faculty/College:" = trường thuộc (College) hoặc khoa độc lập (Faculty); khối ký **HEAD OF DEPARTMENT | DEAN** (Hiệu trưởng trường thuộc và Trưởng khoa độc lập đều là Dean). **Đề cương đặc thù** (khóa luận tốt nghiệp, đề án tốt nghiệp, luận văn thạc sĩ) chỉ MỘT chữ ký HIỆU TRƯỞNG / DEAN và được phép KHÔNG có bảng giảng viên, bảng đánh giá, dòng lưu ý cuối 5.2; không cần theo công thức quy đổi giờ. Cơ cấu FTU 9/2026: 4 trường thuộc (Kinh tế và Quản lý công; Kinh doanh; Kinh doanh và Sáng tạo Việt Nhật; Luật và Khoa học Chính trị) gồm các Khoa; các Khoa chưa thuộc trường (Kế toán - Kiểm toán, Tài chính Ngân hàng, Tiếng Anh thương mại, Tiếng Anh chuyên ngành, Tiếng Nhật, Tiếng Trung, Tiếng Pháp) gom thành trường thuộc từ 2027. Tên mục 4 giữ ĐỦ chữ "Tài liệu tham khảo bắt buộc" / "Tài liệu tham khảo tự chọn".

16. **Phân loại quy định (sếp chốt 8/9/2026):** quy định CHUNG của FTU gồm: cột Hình thức ở 5.1; số tín chỉ chỉ ghi số; tiêu đề 3.2/4.1/4.2 không giữ câu hướng dẫn của mẫu; nhãn "* Sách…" trống thì xóa; không ngắt trang thủ công/chuỗi đoạn trống; ma trận 3.2 dòng cuối tên đúng "Học phần"; chuyên cần đúng 10%; khối ký không "Giảng viên biên soạn". Quy ước RIÊNG của Khoa Kinh tế liên ngành chỉ còn dòng lưu ý linh hoạt cuối 5.2. Không có quy tắc về dòng "(Bao gồm mục tiêu…)" hay ảnh tiêu đề thư.

17. **Mã học phần và ngôn ngữ (sếp chốt 8/9/2026):** mã = 3 chữ cái lĩnh vực + (3 chữ số: chương trình tiêu chuẩn, tiếng Việt | H+3 số: CLC/ĐHNNQT/ĐHPTQT nhưng học phần này dạy tiếng Việt | E+3 số: CLC/ĐHNNQT/ĐHPTQT dạy tiếng Anh | 3 số+E: chương trình tiên tiến, tiếng Anh). Chữ số đầu trong 3 chữ số cho biết BẬC: <6 cử nhân, 6 thạc sĩ, 7 tiến sĩ (số PLO tối đa theo bậc: 12/10/8). Mã PHẢI nhất quán với CTĐT và ngôn ngữ đề cương: BẢN TIẾNG ANH của học phần mang mã 3 chữ cái + E + 3 chữ số (QLY801 → QLYE801); ddd/Hddd = bản tiếng Việt.
18. **Mặc định Khoa Kinh tế liên ngành** (đề cương thông thường): Trường/College = Trường Kinh tế và Quản lý công / College of Economics and Public Management; Khoa/Department = Khoa Kinh tế liên ngành / Department of Economics and Interdisciplinary Management; ký trái TRƯỞNG KHOA / HEAD OF DEPARTMENT = TS. Đỗ Ngọc Kiên / Dr. Do Ngoc Kien; ký phải HIỆU TRƯỞNG / DEAN OF COLLEGE = PGS. TS. Bùi Thị Lý / Assoc. Prof. Dr. Bui Thi Ly (tên ghi dưới chức danh trong khối ký).

19. **Mốc 31/07/2026:** đề cương ban hành SAU ngày này dùng cơ cấu mới (quy tắc 14-15). Đề cương ban hành TRƯỚC mốc (hoặc cần tái tạo bản cũ) dùng tên cũ: "Bộ môn phụ trách: Bộ môn Kinh tế và Quản lý", "Viện/Khoa: Viện Kinh tế và Kinh doanh quốc tế", ký TRƯỞNG BỘ MÔN | VIỆN TRƯỞNG (EN: Department of Economics and Governance / School of Economics and International Business, HEAD OF DEPARTMENT | DEAN). Web: ô "Đề cương ban hành sau ngày 31/07/2026".

## Quy trình (các bước)
- **B0. Khảo sát:** tìm file mẫu chuẩn (mục 2 trên) + 1 bản đã điền làm ví dụ. Xác định đề cương thuộc CTĐT nào.
- **B1. Giải phẫu template:** python-docx liệt kê paragraph + bảng; xác định ranh giới song ngữ (đoạn "SYLLABUS"), ô nhãn cần điền, cấu trúc từng bảng, footnote/chữ đỏ.
- **B2. Gom nội dung:** từ đề cương cũ (CLOs, đánh giá, tín chỉ, mã); từ **CTĐT** (mô tả, PLO, ánh xạ học phần→PLO); nếu bám giáo trình → lấy **mục lục thật** (OCR nếu bản scan, dùng `ocrmypdf -l eng/vie`).
- **B3. Đối chiếu giáo trình ↔ nội dung (nếu có):** map tới cấp tiểu mục; bắt chỗ thiếu/gộp/đảo thứ tự, lỗi dịch thuật ngữ, lệch ấn bản.
- **B4. Chuẩn hóa học liệu** theo nguyên tắc 4.
- **B5. Điền vào template + tách file:** **tách nửa song ngữ TRƯỚC khi điền** (nếu không, hàm tìm-đoạn sẽ trúng nhầm nửa kia). Điền header → mô tả → CLOs → học liệu → bảng (5.1, 5.2, đánh giá, ma trận 3.2). Tách thành 2 file VN/EN nếu được yêu cầu.
- **B6. Dọn:** xóa chữ đỏ + footnote (giữ dòng QĐ); gọn bảng giảng viên; thêm khối ký nếu nửa bị tách mất.
- **B7. Nghiệm thu** + liệt kê điểm cần tác giả quyết (trọng số đánh giá, SĐT/đồng GV, lựa chọn sư phạm như thứ tự định tính/định lượng).

## Chế độ HOÀN THIỆN (rà chất lượng đề cương có sẵn)
Rubric đầy đủ ở `references/ra_soat_chat_luong.md` (đọc trước khi rà). Quy trình:
- **H0. Hình thức trước:** chạy bộ nghiệm thu web (https://dongkien.github.io/phan-bo-gio/de-cuong/ phần 3, hoặc mô tả cho sếp) để đề cương đạt 0 lỗi mẫu; lỗi hình thức ghi riêng, không trộn vào phần nội dung.
- **H1. Trích:** `python3 scripts/trich_de_cuong.py <file.docx>` → bản Markdown gồm CLO (kèm mức Bloom đoán theo động từ), ma trận 3.2, 5.1, 5.2 theo hoạt động, bảng đánh giá, học liệu, **bảng đối chiếu CLO → PLO → hoạt động → đánh giá** và ghi chú cơ học. Lấy thêm Bản mô tả CTĐT: nội dung từng PLO + dòng phân nhiệm học phần (bắt buộc cho phần A).
- **H2. Ma trận 3.2 (rubric A):** từng ô: khớp nội dung PLO, khớp mức I/R/M với động từ CLO, khớp dòng phân nhiệm CTĐT, một CLO một PLO, cột "3,A" phải được đo trực tiếp, đủ CLO kiến thức, đúng tầm bậc. Ra bảng ma trận đề xuất.
- **H3. Phương pháp dạy (rubric B):** từng CLO: các buổi hướng tới có hoạt động đúng bậc không (Áp dụng trở lên cần bài tập/thực hành/tình huống có giờ và nội dung thật; kỹ năng nhóm cần buổi nhóm; thái độ cần hoạt động và tiêu chí quan sát); tỷ trọng buổi hợp lý; dòng tự học trích đúng chương học liệu.
- **H4. Phương pháp đánh giá (rubric C):** từng CLO có ít nhất một hình thức đo được đúng bậc; chuyên cần không đo CLO kiến thức; trắc nghiệm không đo Sáng tạo; CLO nhóm cần hình thức nhóm; cột nội dung và công cụ phải cụ thể; trọng số hợp bậc; giữ quy định 10% / ≥50% / 100%.
- **H5. Học liệu (rubric D):** WebSearch/WebFetch từng tài liệu: tồn tại đúng dữ kiện (tác giả, năm, NXB, ấn bản), có ấn bản mới hơn không, đúng ngôn ngữ, có bản dịch/bản mở, phủ được các buổi. Ghi URL nguồn kiểm; không tìm được thì ghi "chưa xác minh", không bịa.
- **H6. Báo cáo:** ghi `RaSoat_<MÃ>.md` trong thư mục dự án (tóm tắt, bảng A-B-C-D, danh mục sửa cụ thể kèm `> QUYẾT:`), chat chỉ chỉ đường. Sau khi sếp chốt: sửa file theo chế độ TẠO, chạy lại nghiệm thu web và bản trích.
Mức: **LỖI** (trái Hướng dẫn/CTĐT hoặc không đo được CLO) · **XEM LẠI** (lệch một bậc, mỏng, mơ hồ) · **GỢI Ý** (nâng chất). Không sửa đề cương khi chưa chốt; không suy PLO từ số hiệu mà phải đọc nội dung PLO trong CTĐT.

## Tài nguyên kèm skill
- `scripts/trich_de_cuong.py` — trích đề cương .docx (VN/EN, cả kiểu ma trận Mã HP | CLO | PLO/PI) thành Markdown/JSON để rà; có bảng đối chiếu và mức Bloom đoán theo động từ (bảng động từ Phụ lục 1-3 + Bloom). Chỉ trích và đối chiếu cơ học, không kết luận.
- `references/ra_soat_chat_luong.md` — rubric A (ma trận), B (phương pháp dạy), C (đánh giá), D (học liệu), E (mẫu báo cáo) cho chế độ HOÀN THIỆN.
- `assets/Mau_de_cuong_2025.docx` — mẫu chuẩn 2025 (đóng gói để di động).
- `assets/fill_de_cuong_example.py` — **script python-docx mẫu (worked example QLY801, 8 PLO, song ngữ)**: minh họa điền header/CLO/học liệu, dựng 5.1, dựng 5.2 đa-dòng gộp dọc, ma trận 3.2 + dòng học phần, tách song ngữ, strip chữ đỏ giữ dòng QĐ.
- `references/don_vi_glossary.md` — tên đơn vị VN-EN, nguồn lấy PLO từ CTĐT, bản dịch giáo trình đã xác minh.
- `references/huong_dan_cdr_clo_plo.md` — tóm tắt Hướng dẫn xây dựng CĐR CTĐT và học phần của FTU (PLO/PI/CLO, mức I-R-M + A, số lượng, quy tắc mỗi CLO một PLO); đọc khi viết/rà CLO và ma trận 3.2.

## Định nghĩa "xong" (chế độ TẠO)
Đúng template gốc · đủ 7 mục + ma trận 3.2 (có dòng học phần khớp CTĐT, ô 1/2/3, mỗi CLO một PLO) + **khối ký (TRƯỞNG KHOA + HIỆU TRƯỞNG, hoặc cơ cấu cũ nếu trước 31/07/2026)** · giữ dòng QĐ · **mô tả NGUYÊN VĂN CTĐT** · **CLO 3-6, mở đầu bằng động từ hành động đo được** · số tín chỉ ghi gọn · **5.1 có cột Hình thức** / **5.2 nội dung tách theo từng hoạt động (chỉ gộp Buổi+CLO)** + xuống dòng từng ý + **dòng lưu ý cuối 5.2** · **tổng giờ khớp chính xác CTĐT** · học liệu đúng ngôn ngữ + ấn bản thật · 0 placeholder/0 chữ đỏ chú thích · đã liệt kê điểm chờ quyết.

## Định nghĩa "xong" (chế độ HOÀN THIỆN)
Báo cáo `RaSoat_<MÃ>.md` có: kết quả nghiệm thu hình thức · bảng ma trận 3.2 đề xuất với lý do từng ô đối chiếu nội dung PLO trong CTĐT · bảng CLO → hoạt động dạy học (thiếu gì) · bảng CLO → hình thức đánh giá (thiếu gì) · bảng học liệu đã web-verify (dữ kiện đúng, ấn bản mới, URL nguồn) · danh mục sửa kèm `> QUYẾT:`. Sau khi chốt: file đề cương đã sửa, nghiệm thu web 0 lỗi, bản trích không còn ghi chú cơ học chưa giải thích.
