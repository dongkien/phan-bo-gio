#!/usr/bin/env python3
"""Tính phân bổ giờ học phần theo số tín chỉ (chuẩn FTU, file "Phan bo gio cho TC_final.xlsx").

Quy ước (1 tín chỉ = 50 giờ học tập của người học):
    1 TC = 15 giờ lý thuyết = 30 giờ thực hành/thảo luận
         = 50 giờ thực tế/thực tập/bài tập lớn = 50 giờ tự học có hướng dẫn

Đầu vào: TC (mặc định 3), x = giờ giảng lý thuyết trên lớp, y = giờ thực hành/thảo luận trên lớp.
Đầu ra:
    H = x/15 + y/30                 tín chỉ đã dùng trên lớp
    z = 50*(TC - H)                 giờ thực tế, thực tập, bài tập lớn
    E = 50*TC - (x + y + z)         giờ tự học có hướng dẫn  (= 7x/3 + 2y/3, không phụ thuộc TC)
    F = x + y                       tổng giờ trên lớp (thanh toán)
    G = round(F/3, 1)               số buổi 3 tiếng phải bố trí
    OK khi z > 0 (còn dư tín chỉ cho thực tế/BTL); z = 0 là dùng hết tín chỉ trên lớp; z < 0 là vượt.

Dùng:
    phan_bo_gio.py --lt 24 --th 6            # TC mặc định 3
    phan_bo_gio.py --tc 2 --lt 21 --th 3
    phan_bo_gio.py --lt 24 --th 6 --json
    phan_bo_gio.py --tc 3 --bang              # liệt kê mọi cặp (x, y) nguyên cho z, E nguyên
"""
import argparse
import json
import sys

GIO_MOT_TC = 50
LT_MOT_TC = 15
TH_MOT_TC = 30


def tinh(tc: float, lt: float, th: float) -> dict:
    h = lt / LT_MOT_TC + th / TH_MOT_TC
    z = GIO_MOT_TC * (tc - h)
    e = GIO_MOT_TC * tc - (lt + th + z)
    f = lt + th
    g = round(f / 3, 1)
    tong = lt + th + z + e
    return {
        "tin_chi": tc,
        "ly_thuyet": lt,
        "thuc_hanh_thao_luan": th,
        "thuc_te_bai_tap_lon": z,
        "tu_hoc_co_huong_dan": e,
        "tong_gio_tren_lop": f,
        "so_buoi_3_tieng": g,
        "tin_chi_tren_lop": h,
        "tong_gio": tong,
        "ok": z > 0,
        "canh_bao": canh_bao(tc, lt, th, z, e, f),
    }


def canh_bao(tc, lt, th, z, e, f) -> list:
    cb = []
    if z < 0:
        cb.append(f"Giờ trên lớp vượt {tc:g} tín chỉ (z = {z:g} < 0): giảm x hoặc y.")
    elif z == 0:
        cb.append("Dùng hết tín chỉ trên lớp, không còn giờ thực tế/bài tập lớn (z = 0).")
    if abs(z - round(z)) > 1e-9 or abs(e - round(e)) > 1e-9:
        cb.append("z hoặc E không nguyên: chọn x và y có cùng số dư khi chia 3 (x - y chia hết cho 3) thì z, E nguyên.")
    if abs(f / 3 - round(f / 3)) > 1e-9:
        cb.append(f"Tổng giờ trên lớp {f:g} không chia hết cho 3: số buổi 3 tiếng lẻ.")
    return cb


def fmt(v):
    return f"{v:g}" if abs(v - round(v)) < 1e-9 else f"{v:.2f}"


def in_bang(r: dict):
    rows = [
        ("Số tín chỉ", r["tin_chi"]),
        ("Giờ giảng lý thuyết (x)", r["ly_thuyet"]),
        ("Giờ thực hành, thảo luận (y)", r["thuc_hanh_thao_luan"]),
        ("Giờ thực tế, thực tập, bài tập lớn (z)", r["thuc_te_bai_tap_lon"]),
        ("Giờ tự học có hướng dẫn", r["tu_hoc_co_huong_dan"]),
        ("Tổng giờ (= 50 x TC)", r["tong_gio"]),
        ("Tổng giờ trên lớp thanh toán (x+y)", r["tong_gio_tren_lop"]),
        ("Số buổi 3 tiếng", r["so_buoi_3_tieng"]),
        ("Tín chỉ đã dùng trên lớp (x/15+y/30)", r["tin_chi_tren_lop"]),
        ("Phân bổ", "OK" if r["ok"] else "KHÔNG OK"),
    ]
    w = max(len(k) for k, _ in rows)
    for k, v in rows:
        print(f"{k:<{w}}  {fmt(v) if isinstance(v, (int, float)) else v}")
    print(f"\nDòng ghi đề cương: {fmt(r['ly_thuyet'])}/{fmt(r['thuc_hanh_thao_luan'])}/"
          f"{fmt(r['thuc_te_bai_tap_lon'])}/{fmt(r['tu_hoc_co_huong_dan'])} "
          f"(LT/TH-TL/thực tế-BTL/tự học)")
    for c in r["canh_bao"]:
        print("CẢNH BÁO:", c)


def bang_kha_thi(tc: float, min_buoi: int = 8, max_buoi: int = 15):
    """Các cặp (x, y) nguyên có x - y chia hết cho 3 (để z, E nguyên), z > 0, x + y chia hết cho 3 (buổi tròn), số buổi trong [min_buoi, max_buoi]."""
    print(f"TC = {tc:g}: các cặp x (LT) / y (TH-TL) cho z, E nguyên, z > 0, {min_buoi}-{max_buoi} buổi")
    print(f"{'x':>4} {'y':>4} {'z':>5} {'tự học':>7} {'x+y':>5} {'buổi':>5}")
    for lt in range(0, int(LT_MOT_TC * tc) + 1):
        for th in range(0, int(TH_MOT_TC * tc) + 1):
            if (lt - th) % 3 or (lt + th) % 3:
                continue
            r = tinh(tc, lt, th)
            z, e = r["thuc_te_bai_tap_lon"], r["tu_hoc_co_huong_dan"]
            buoi = (lt + th) / 3
            if not (min_buoi <= buoi <= max_buoi):
                continue
            if z > 0 and abs(z - round(z)) < 1e-9 and abs(e - round(e)) < 1e-9:
                print(f"{lt:>4} {th:>4} {z:>5g} {e:>7g} {lt+th:>5} {r['so_buoi_3_tieng']:>5g}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--tc", type=float, default=3, help="số tín chỉ (mặc định 3)")
    p.add_argument("--lt", type=float, help="giờ giảng lý thuyết trên lớp (x)")
    p.add_argument("--th", type=float, default=0, help="giờ thực hành/thảo luận trên lớp (y), mặc định 0")
    p.add_argument("--json", action="store_true", help="in JSON")
    p.add_argument("--bang", action="store_true", help="liệt kê các cặp x/y khả thi cho TC")
    p.add_argument("--min-buoi", type=int, default=8, help="(--bang) số buổi tối thiểu, mặc định 8")
    p.add_argument("--max-buoi", type=int, default=15, help="(--bang) số buổi tối đa, mặc định 15")
    a = p.parse_args()
    if a.bang:
        bang_kha_thi(a.tc, a.min_buoi, a.max_buoi)
        return
    if a.lt is None:
        p.error("cần --lt (giờ lý thuyết); hoặc dùng --bang để xem các phương án")
    r = tinh(a.tc, a.lt, a.th)
    if a.json:
        print(json.dumps(r, ensure_ascii=False, indent=2))
    else:
        in_bang(r)
    sys.exit(0 if r["ok"] else 1)


if __name__ == "__main__":
    main()
