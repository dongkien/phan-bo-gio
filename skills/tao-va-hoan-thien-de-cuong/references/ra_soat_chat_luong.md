# Rubric rà chất lượng đề cương (chế độ HOÀN THIỆN)

Áp dụng sau khi đề cương đã đúng mẫu (bộ nghiệm thu web 0 lỗi). Bộ nghiệm thu web chỉ kiểm hình thức và
tương ứng cơ học; phần này là **đọc hiểu nội dung**: ma trận 3.2 có hợp lý không, cách dạy và cách đánh giá
có đưa người học tới CLO không, học liệu có thật và còn mới không. Căn cứ: Hướng dẫn xây dựng CĐR của FTU
(TB 424, tóm tắt ở `huong_dan_cdr_clo_plo.md`), nguyên tắc tương thích kiến tạo (Biggs) và Bloom.

Đầu vào: bản trích từ `scripts/trich_de_cuong.py <file.docx>` (CLO kèm mức đoán, ma trận, 5.1/5.2, bảng
đánh giá, học liệu, bảng đối chiếu) + Bản mô tả CTĐT (nội dung từng PLO, dòng phân nhiệm học phần).
Đầu ra: file `RaSoat_<MÃ>.md` trong thư mục dự án (không để trôi chat), mỗi mục có mức **LỖI / XEM LẠI /
GỢI Ý** và dòng `> QUYẾT:` cho điểm cần tác giả chốt. Không sửa file đề cương khi chưa được chốt.

## A. Ma trận 3.2: đóng góp CLO → PLO có thực sự phù hợp?

Làm với TỪNG ô có giá trị. Cần đọc **nội dung PLO** trong CTĐT, không suy từ số hiệu.

| Kiểm | Cách làm | Kết luận |
|---|---|---|
| A1 Khớp nội dung | CLO nói về cái gì (miền K/S/A, chủ đề) so với PLO nói về cái gì. CLO kiến thức chuyên môn gắn vào PLO kỹ năng mềm, hay CLO "làm việc nhóm" gắn vào PLO kiến thức ngành = sai chỗ. | Sai chỗ = **LỖI**; liên quan mờ (chỉ dính một từ khóa) = XEM LẠI |
| A2 Khớp mức | Mức ô (1=I, 2=R, 3=M) so với động từ mở đầu CLO. I tương ứng Nhớ/Hiểu (K1-K2, S1-S2, A1-A2); R tương ứng Áp dụng/Phân tích (K3-K4, S3, A3); M tương ứng Đánh giá/Sáng tạo hoặc thành thạo (K5-K6, S4-S5, A4-A5). Lệch một bậc chấp nhận được nếu có lý do (học phần đầu ngành). CLO "nhận diện, mô tả" mà ghi 3, hay CLO "thiết kế, đánh giá" mà ghi 1 = lệch. | Lệch ≥2 bậc = **LỖI**; lệch 1 bậc = XEM LẠI |
| A3 Khớp CTĐT | Dòng "Học phần" phải đúng dòng phân nhiệm của học phần trong CTĐT (mức và dấu A). PLO nào CTĐT phân nhiệm cho học phần thì phải có CLO đỡ; PLO nào CTĐT không phân nhiệm thì CLO không được ghi. Mức cao nhất trong cột = mức dòng Học phần. | Lệch CTĐT = **LỖI** |
| A4 Một CLO một PLO | Hướng dẫn: mỗi CLO chỉ nên đáp ứng một PLO/PI. CLO gắn 2-3 PLO thường là CLO viết quá rộng: đề nghị tách hoặc chọn PLO chính. | XEM LẠI, kèm đề xuất tách cụ thể |
| A5 Học phần cốt lõi (A) | Cột có "3,A" ở dòng Học phần: CLO đỡ cột đó phải ở mức 3, phải được **đo trực tiếp** bằng ít nhất một hình thức đánh giá có công cụ rõ (rubric, đáp án), trọng số đủ lớn (thường ≥30% cộng dồn). Nếu CTĐT có PI thì ghi theo PI. | Không đo trực tiếp = **LỖI** |
| A6 Bậc đào tạo | ĐH: PLO chuyên môn mức tối thiểu 3; ThS 4; TS 5. Học phần ThS/TS mà toàn CLO K1-K2 = chưa đạt tầm bậc. | XEM LẠI |
| A7 Tối thiểu 1 CLO kiến thức | Học phần không phải dự án/thực hành phải có ít nhất một CLO miền K. | Không có = **LỖI** |

Viết kết luận A dưới dạng bảng CLO × PLO, mỗi ô: giữ / đổi mức / bỏ / chuyển sang PLO khác, và lý do một câu.

## B. Phương pháp giảng dạy (5.1, 5.2) có đưa tới CLO không?

Nguyên tắc: hoạt động dạy học phải cùng bậc với động từ của CLO. Nghe giảng chỉ đủ cho Nhớ/Hiểu.

| Mức CLO | Hoạt động tối thiểu phải có trong 5.2 của các buổi ghi CLO đó |
|---|---|
| K1-K2 Nhớ/Hiểu | Thuyết giảng + đọc có hướng dẫn + câu hỏi kiểm tra hiểu |
| K3 Áp dụng | Bài tập, tình huống, thực hành trên dữ liệu/phần mềm; giờ Thực hành-thảo luận hoặc Tiểu luận-bài tập > 0 và nội dung ghi rõ bài tập gì |
| K4 Phân tích | Phân tích tình huống, so sánh phương án, bài tập phân tích dữ liệu, thảo luận có cấu trúc |
| K5 Đánh giá | Phản biện, thẩm định phương án, tranh luận, chấm chéo, viết nhận định có tiêu chí |
| K6 Sáng tạo | Dự án, thiết kế, đề xuất giải pháp, bài tập lớn kéo dài nhiều buổi, có phản hồi giữa chừng |
| S Kỹ năng (nhóm, thuyết trình, phần mềm) | Buổi có hoạt động nhóm/thuyết trình/thực hành thật, không chỉ "thảo luận" chung chung |
| A Thái độ (tuân thủ, liêm chính, trách nhiệm) | Hoạt động nêu rõ quy tắc + tình huống đạo đức + tiêu chí quan sát; không thể chỉ nằm trong giờ lý thuyết |

Kiểm:
- B1 Mỗi CLO có ít nhất một buổi hướng tới (bộ web đã báo). Với từng CLO, đọc **nội dung** các dòng hoạt động của những buổi đó: có hoạt động đúng bậc không? Bảng đối chiếu của script cho tổng giờ theo loại hoạt động; giờ Thực hành-thảo luận = 0 và dòng Tiểu luận-bài tập trống mà CLO là K3 trở lên = **LỖI về phương pháp**.
- B2 CLO kỹ năng nhóm/thuyết trình: phải có buổi ghi rõ làm việc nhóm hoặc thuyết trình; ghi CLO ấy vào mọi buổi cho có = XEM LẠI.
- B3 Tỷ trọng: CLO mức 3 (M) mà chỉ 1 buổi trong 10-15 buổi hướng tới = mỏng, XEM LẠI. CLO ghi ở mọi buổi = không phân biệt, XEM LẠI.
- B4 Tuần tự: hoạt động tiến từ giới thiệu tới vận dụng tới tổng hợp qua các buổi; buổi cuối nên có tổng kết/ôn tập gắn CLO tổng hợp.
- B5 Dòng Tự học có hướng dẫn phải ghi tài liệu đọc cụ thể (chương, trang của học liệu mục 4), không để "đọc tài liệu".
- B6 Phần "phương pháp giảng dạy" (nếu đề cương có đoạn mô tả) phải khớp với 5.2: ghi "học theo dự án" mà 5.2 không có dự án = mâu thuẫn.

## C. Phương pháp kiểm tra đánh giá (mục 7) có đo được CLO không?

| Hình thức | Đo được | Không đo được |
|---|---|---|
| Chuyên cần, điểm danh | A (tham gia, tuân thủ) | Mọi CLO kiến thức, kỹ năng chuyên môn |
| Trắc nghiệm | K1-K2, một phần K3 | K4-K6, S, A |
| Tự luận, thi viết | K2-K5 | S nhóm/thuyết trình; K6 dạng sản phẩm |
| Vấn đáp | K2-K5, S giao tiếp | S nhóm; K6 sản phẩm |
| Bài tập cá nhân trên dữ liệu | K3-K4, S phần mềm | S nhóm |
| Bài tập nhóm + báo cáo + thuyết trình | K3-K6, S nhóm/thuyết trình, A trách nhiệm (cần rubric tách điểm cá nhân) | K1 thuần |
| Tiểu luận, dự án | K4-K6 | K1-K2 (nếu chỉ thế là quá nặng) |

Kiểm:
- C1 Mỗi CLO được ít nhất một hình thức **đo được đúng bậc**. CLO chỉ được "Chuyên cần" đo = **LỖI** (bộ web chưa bắt). Cột CLO của dòng Chuyên cần ghi mọi CLO là thông lệ nhưng thiếu chặt: đề xuất chỉ ghi CLO thái độ/tham gia, để tác giả quyết.
- C2 Hình thức và CLO khớp bậc theo bảng trên: CLO "thiết kế/đề xuất" mà chỉ thi trắc nghiệm = **LỖI**; CLO "làm việc nhóm" mà không có hình thức nhóm = **LỖI**.
- C3 Cột "Nội dung kiểm tra, đánh giá" phải nói đo cái gì (khớp CLO), không "các nội dung đã học". Cột "Công cụ và tiêu chí" phải nêu công cụ (đề thi, rubric, đáp án, checklist) và tiêu chí; trống hoặc chỉ ghi thời lượng = XEM LẠI.
- C4 Trọng số hợp với bậc: CLO mức M (nhất là cột 3,A) nên nằm trong hình thức chiếm trọng số lớn (cuối kỳ hoặc dự án). Quy định chung vẫn giữ: chuyên cần 10%, cuối kỳ ≥50%, tổng 100%.
- C5 "Hoặc": nhiều đề cương ghi "thi viết hoặc vấn đáp hoặc tiểu luận". Cho phép, nhưng mọi phương án phải đo được cùng tập CLO; nếu một phương án không đo được CLO đã ghi thì XEM LẠI.
- C6 Đề cương ThS/TS: nên có sản phẩm nghiên cứu (đề xuất, bài viết) chứ không chỉ thi viết.

## D. Tài liệu tham khảo: tồn tại và cập nhật

Làm với TỪNG mục ở 4.1-4.4, dùng WebSearch/WebFetch. Không kết luận khi chưa tìm; không bịa ấn bản.
Nguồn kiểm theo thứ tự: trang nhà xuất bản → WorldCat / Google Books / Amazon (ấn bản, năm, ISBN) → thư viện
FTU hoặc thư viện quốc gia (bản tiếng Việt) → Google Scholar (bài báo: tạp chí, tập, số, DOI). Với web: mở
được không, còn đúng nội dung không.

| Kiểm | Kết luận |
|---|---|
| D1 Tồn tại: đúng tác giả, tên, năm, NXB, ấn bản, nơi xuất bản | Không tìm được hoặc sai dữ kiện = **LỖI** (ghi dữ kiện đúng tìm được) |
| D2 Cập nhật: có ấn bản mới hơn không; giáo trình/TLTK bắt buộc quá 10 năm mà đã có ấn bản mới hoặc sách thay thế phổ biến hơn | Có bản mới hơn = XEM LẠI, ghi rõ ấn bản/năm mới; sách kinh điển (Angrist-Pischke 2009, Kahneman 2011…) không cần thay nhưng nên thêm tài liệu mới |
| D3 Ngôn ngữ: đề cương tiếng Việt thì giáo trình + bắt buộc tiếng Việt (tìm bản dịch chính thức, ghi đúng dịch giả/NXB/năm); ngược lại với tiếng Anh | Sai = **LỖI** (bộ web đã bắt); có bản dịch mà chưa dùng = GỢI Ý |
| D4 Tiếp cận: bản mở miễn phí (tác giả công bố), thư viện có, hay phải mua; ghi URL hợp pháp nếu có | GỢI Ý |
| D5 Phủ nội dung: tài liệu bắt buộc phải phủ được các buổi 5.1 (đối chiếu mục lục thật); dòng Tự học 5.2 trích đúng chương | Không phủ = XEM LẠI |
| D6 Số lượng và cân đối: bắt buộc 1-3 cuốn, tự chọn 3-7; thiếu bài báo/nguồn Việt Nam khi học phần bàn về Việt Nam = GỢI Ý | GỢI Ý |
| D7 Định dạng trích dẫn nhất quán (APA 7 hoặc kiểu Trường), số thứ tự [1], [2] liên tục qua các mục | XEM LẠI |

Ghi kết quả D thành bảng: Tài liệu | Kết quả kiểm (✅/⚠️/❌) | Dữ kiện đúng hoặc ấn bản mới | Nguồn kiểm (URL).

## E. Trình bày báo cáo `RaSoat_<MÃ>.md`

1. Tóm tắt 5 dòng: đúng mẫu chưa, số LỖI / XEM LẠI / GỢI Ý theo A-B-C-D.
2. Bảng A (ma trận đề xuất) · Bảng B (CLO → hoạt động, thiếu gì) · Bảng C (CLO → hình thức, thiếu gì) · Bảng D (học liệu).
3. Danh mục sửa cụ thể, mỗi dòng: vị trí (mục, buổi, ô) → sửa thành gì → lý do, kèm `> QUYẾT:`.
4. Điểm cần tác giả quyết (lựa chọn sư phạm, trọng số, thay học liệu).
Sau khi sếp chốt: sửa vào file đề cương theo chế độ TẠO (điền vào mẫu), chạy lại bộ nghiệm thu web, đối chiếu lại bản trích.
