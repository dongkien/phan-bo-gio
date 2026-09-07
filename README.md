# Phân bổ giờ tín chỉ

Trang tính phân bổ giờ học phần theo số tín chỉ (Trường Đại học Ngoại thương):
nhập số tín chỉ, giờ giảng lý thuyết và giờ thực hành/thảo luận trên lớp, trang
tự tính giờ thực tế/thực tập/bài tập lớn và giờ tự học có hướng dẫn.

**Dùng ngay:** https://dongkien.github.io/phan-bo-gio/

## Quy ước (1 tín chỉ = 50 giờ học tập)

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

## Skill cho Claude

Thư mục `skill/` là skill `phan-bo-gio-tin-chi` dùng với Claude Code hoặc claude.ai.

- **Claude Code:** chép thư mục `skill/` vào `~/.claude/skills/phan-bo-gio-tin-chi/`
  (Windows: `C:\Users\<tên>\.claude\skills\phan-bo-gio-tin-chi\`), mở lại Claude Code.
- **claude.ai:** nén thư mục `skill/` thành zip (đổi tên thư mục thành `phan-bo-gio-tin-chi`),
  vào Settings → Capabilities → Skills → Upload skill.
- **Không dùng Claude:** chạy `python3 skill/scripts/phan_bo_gio.py --tc 3 --lt 24 --th 6`.

Tác giả: Đỗ Ngọc Kiên. Công thức theo bảng tính phân bổ giờ cho tín chỉ của Trường.
