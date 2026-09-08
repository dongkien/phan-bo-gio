---
name: phan-bo-gio-tin-chi
description: >
  Tính PHÂN BỔ GIỜ học phần theo số tín chỉ (chuẩn FTU, từ file "Phan bo gio cho
  TC_final.xlsx"): người dùng cho số tín chỉ + giờ giảng lý thuyết trên lớp + giờ
  thực hành/thảo luận trên lớp, skill tự tính giờ thực tế/thực tập/bài tập lớn, giờ
  tự học có hướng dẫn, tổng giờ trên lớp thanh toán, số buổi 3 tiếng, và báo phân bổ
  có hợp lệ không. Không nói số tín chỉ thì mặc định 3. Dùng khi user nói: "phân bổ
  giờ", "tính giờ tự học", "giờ thực tế/bài tập lớn là bao nhiêu", "24/6 thì còn lại
  bao nhiêu", "dòng phân bổ giờ cho đề cương", "x/y/z tín chỉ", hoặc đang soạn đề cương
  (skill tao-va-hoan-thien-de-cuong) cần số giờ cho bảng 5.1/5.2.
---

# Phân bổ giờ học phần theo tín chỉ (chuẩn FTU)

Nguồn gốc: file `assets/PhanBoGioChoTC_final.xlsx` của Trường (bản tác giả nhận
được). Script `scripts/phan_bo_gio.py` tái lập đúng công thức của file này và đã
kiểm định khớp 16 dòng ví dụ trong đó.

## Quy ước tính

Một tín chỉ tương đương **50 giờ học tập** của người học, quy đổi theo loại hoạt động:

| Hoạt động | 1 tín chỉ tương đương |
|---|---|
| Giờ giảng lý thuyết trên lớp (x) | 15 giờ |
| Giờ thực hành, thảo luận trên lớp (y) | 30 giờ |
| Giờ thực tế, thực tập, bài tập lớn (z) | 50 giờ |
| Giờ tự học có hướng dẫn (E) | 50 giờ |

Cho trước TC, x, y:

```
H = x/15 + y/30              # tín chỉ đã dùng trên lớp
z = 50 × (TC − H)            # giờ thực tế, thực tập, bài tập lớn
E = 50 × TC − (x + y + z)    # giờ tự học có hướng dẫn  (rút gọn: E = 7x/3 + 2y/3)
F = x + y                    # tổng giờ trên lớp (thanh toán)
G = round(F/3, 1)            # số buổi 3 tiếng phải bố trí
x + y + z + E = 50 × TC      # luôn đúng
```

Hợp lệ ("OK") khi **z > 0**. z = 0 nghĩa là giờ trên lớp đã dùng hết tín chỉ, không
còn giờ thực tế/bài tập lớn; z < 0 nghĩa là giờ trên lớp vượt số tín chỉ, phải giảm x hoặc y.

## Mặc định
- Không nói số tín chỉ → **TC = 3**.
- Không nói giờ thực hành/thảo luận → **y = 0**.
- Người dùng có thể nói "24/6" hoặc "24 lý thuyết, 6 thảo luận": số đầu là x, số sau là y.

## Cách chạy

```bash
python3 ~/.claude/skills/phan-bo-gio-tin-chi/scripts/phan_bo_gio.py --lt 24 --th 6          # TC = 3
python3 ~/.claude/skills/phan-bo-gio-tin-chi/scripts/phan_bo_gio.py --tc 2 --lt 21 --th 3
python3 ~/.claude/skills/phan-bo-gio-tin-chi/scripts/phan_bo_gio.py --lt 24 --th 6 --json
python3 ~/.claude/skills/phan-bo-gio-tin-chi/scripts/phan_bo_gio.py --tc 3 --bang           # liệt kê phương án x/y hợp lệ, 8-15 buổi
```

Exit code 0 = OK, 1 = phân bổ không hợp lệ (z ≤ 0). Không cần thư viện ngoài.

## Cách trả lời người dùng
1. Chạy script, trả bảng đủ 4 dòng giờ + tổng giờ trên lớp + số buổi + kết luận OK/không.
2. Luôn kèm **dòng ghi đề cương** dạng `x/y/z/E` (ví dụ `24/6/60/60`), đúng thứ tự
   LT / TH-TL / thực tế-BTL / tự học như bảng 5.1 của mẫu đề cương FTU 2025.
3. Nếu z hoặc E lẻ (ví dụ x = 25, y = 20 cho z = 33,33): báo rõ, gợi ý chọn x và y có
   **cùng số dư khi chia 3** (x − y chia hết cho 3, ví dụ 24/6, 23/5, 28/4) để z, E nguyên;
   x + y chia hết cho 3 thì số buổi tròn. Chạy `--bang` để đưa 2-3 phương án gần nhất.
4. Nếu z ≤ 0: nói thẳng giờ trên lớp vượt tín chỉ và đề xuất cặp x/y gần nhất còn hợp lệ.
5. Không tự đổi số tín chỉ hay số giờ người dùng đưa; chỉ tính và cảnh báo.

## Ví dụ đã kiểm định (khớp Excel)

| TC | x | y | z | Tự học | x+y | Buổi | OK |
|---|---|---|---|---|---|---|---|
| 3 | 24 | 6 | 60 | 60 | 30 | 10 | OK |
| 3 | 30 | 0 | 50 | 70 | 30 | 10 | OK |
| 3 | 23 | 5 | 65 | 57 | 28 | 9,3 | OK |
| 3 | 30 | 15 | 25 | 80 | 45 | 15 | OK |
| 3 | 45 | 0 | 0 | 105 | 45 | 15 | không (z = 0) |
| 2 | 21 | 3 | 25 | 51 | 24 | 8 | OK |
| 2 | 30 | 15 | −25 | 80 | 45 | 15 | không (vượt) |

## Liên hệ skill khác
- `tao-va-hoan-thien-de-cuong`: bảng 5.1/5.2 của đề cương phải khớp chính xác dòng x/y/z/E tính ở đây
  (hoặc dòng phân bổ đã ghi trong Bản mô tả CTĐT nếu CTĐT đã quy định).
