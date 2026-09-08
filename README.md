# Phân bổ giờ tín chỉ và Bộ công cụ đề cương FTU

Hai trang web chạy hoàn toàn trên trình duyệt, không cần cài đặt, không gửi dữ liệu đi đâu:

| Trang | Link | Làm gì |
|---|---|---|
| Phân bổ giờ tín chỉ | https://dongkien.github.io/phan-bo-gio/ | Nhập số tín chỉ, giờ lý thuyết, giờ thảo luận; ra giờ thực tế/bài tập lớn, giờ tự học, số buổi, dòng ghi đề cương |
| Bộ công cụ đề cương | https://dongkien.github.io/phan-bo-gio/de-cuong/ | Hướng dẫn và checklist theo mẫu 2025; sinh file đề cương .docx điền vào đúng mẫu 2025 (biểu mẫu gồm cả bảng 5.1, 5.2, nạp được từ file cũ); nghiệm thu file .docx (tiếng Việt và tiếng Anh, nhiều file một lúc, đối chiếu Bản mô tả CTĐT, xuất CSV) |

## Quy ước phân bổ giờ (1 tín chỉ = 50 giờ học tập)

| Hoạt động | 1 tín chỉ tương đương |
|---|---|
| Giờ giảng lý thuyết trên lớp (x) | 15 giờ |
| Giờ thực hành, thảo luận trên lớp (y) | 30 giờ |
| Giờ thực tế, thực tập, bài tập lớn (z) | 50 giờ |
| Giờ tự học có hướng dẫn (E) | 50 giờ |

```
z = 50 × (TC − x/15 − y/30)
E = 50 × TC − (x + y + z)
Hợp lệ khi z > 0
```

## Bộ nghiệm thu đề cương kiểm những gì

Đọc file .docx ngay trên máy và đối chiếu: đủ 7 mục và tiểu mục theo mẫu; các ô đầu đề đã điền; mô tả học phần; CLO (mở đầu bằng động từ hành động, số CLO 3 đến 6, mỗi CLO một PLO theo Hướng dẫn xây dựng CĐR của Trường); ma trận 3.2 có dòng "Học phần", ô ghi mức 1, 2, 3; bảng giảng viên; giáo trình và tài liệu bắt buộc cùng ngôn ngữ giảng dạy (không có giáo trình thì mục 4 đánh số lại từ 4.1); bảng 5.1 có cột Hình thức, dòng tổng, tổng bằng 50 × TC và khớp phân bổ CTĐT; bảng 5.2 mỗi buổi đủ 5 dòng hoạt động và giờ khớp 5.1; dòng lưu ý cuối 5.2; bảng đánh giá tổng 100%, chuyên cần 10%, cuối kỳ ít nhất 50%; khối ký; chữ đỏ, chú thích chân trang, chỗ giữ chỗ, ảnh, ngắt trang, đoạn trống còn sót của mẫu.

Mỗi tiêu chí nghiệm thu gắn nhãn **Trường** (mẫu 2025 và quy định chung của FTU) hoặc **Khoa** (quy ước riêng của Khoa Kinh tế liên ngành, hiện chỉ có dòng lưu ý linh hoạt cuối mục 5.2; tắt được bằng một ô chọn).

## Kiểm thử tự động

`tests/fixtures/` gồm hai file chuẩn do chính trang sinh ra (tiếng Việt, tiếng Anh) và các biến thể mỗi file một lỗi cố ý (sinh bằng `tests/make_fixtures.py`). `tests/run_tests.py` chạy bộ nghiệm thu trên từng file bằng Playwright và so với `tests/expect.json`; GitHub Actions chạy mỗi lần push.

```bash
pip install playwright && python -m playwright install chromium
python3 tests/run_tests.py
```

## Skill cho Claude (thư mục `skills/`)

- `skills/phan-bo-gio-tin-chi/`: tính phân bổ giờ.
- `skills/tao-va-hoan-thien-de-cuong/`: tạo (điền mẫu 2025) và hoàn thiện (rà ma trận 3.2, phương pháp dạy và đánh giá theo CLO, học liệu) đề cương FTU; kèm mẫu docx, script điền mẫu ví dụ, script trích đề cương để rà và rubric.

Cách cài:
- **Claude Code:** chép thư mục skill vào `~/.claude/skills/<tên-skill>/` (Windows: `C:\Users\<tên>\.claude\skills\<tên-skill>\`), mở lại Claude Code.
- **claude.ai:** nén thư mục skill thành zip (thư mục gốc trong zip là tên skill), vào Settings → Capabilities → Skills → Upload skill.
- **Chỉ chạy Python:** `python3 skills/phan-bo-gio-tin-chi/scripts/phan_bo_gio.py --tc 3 --lt 24 --th 6`.

Quy ước trong skill và trang đề cương rút từ thực tế của Bộ môn Kinh tế và Quản lý, Viện Kinh tế và Kinh doanh quốc tế. Đơn vị khác thay tên đơn vị, khối ký và tỷ lệ đánh giá theo quy định của mình.

Tác giả: Đỗ Ngọc Kiên.
