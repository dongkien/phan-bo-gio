#!/usr/bin/env python3
"""Chạy bộ nghiệm thu (de-cuong/nghiem-thu.js) trên tests/fixtures/*.docx và so với tests/expect.json.
Cần: pip install playwright && playwright install chromium. Dùng: python3 tests/run_tests.py"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE)
PAGE="file://"+os.path.join(ROOT,"de-cuong","index.html")+"#nghiem-thu"
EXPECT=json.load(open(os.path.join(HERE,"expect.json"),encoding="utf-8"))
def path(name): return os.path.join(ROOT,"de-cuong",name) if name.startswith("Mau_") else os.path.join(HERE,"fixtures",name)
async def main():
    fails=[]
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_function("window.JSZip && window.NghiemThu",timeout=60000)
        for name,exp in EXPECT.items():
            f=path(name)
            if not os.path.exists(f): fails.append(f"{name}: thiếu file"); continue
            await pg.set_input_files("#file",f); await pg.wait_for_timeout(800)
            for _ in range(20):
                rep=await pg.evaluate("window.__report||''")
                if name in rep: break
                await pg.wait_for_timeout(300)
            lines=rep.split("\n"); nf=sum(1 for l in lines if l.startswith("[LỖI]")); nw=sum(1 for l in lines if l.startswith("[XEM LẠI]"))
            ok=True; msg=[]
            if "fail" in exp and nf!=exp["fail"]: ok=False; msg.append(f"lỗi {nf} ≠ {exp['fail']}")
            if "warn" in exp and nw!=exp["warn"]: ok=False; msg.append(f"cảnh báo {nw} ≠ {exp['warn']}")
            if "fail_min" in exp and nf<exp["fail_min"]: ok=False; msg.append(f"lỗi {nf} < {exp['fail_min']}")
            for m in exp.get("must",[]):
                if m not in rep: ok=False; msg.append(f'thiếu "{m}"')
            print(("PASS" if ok else "FAIL"),name,f"({nf} lỗi, {nw} cảnh báo)",("; ".join(msg) if msg else ""))
            if not ok:
                fails.append(name); print("\n".join("      "+l for l in lines if l.startswith(("[LỖI]","[XEM LẠI]"))))
        if errs: fails.append("JS errors: "+"; ".join(errs[:3]))
        await b.close()
    print("====",("TẤT CẢ ĐẠT" if not fails else f"{len(fails)} THẤT BẠI: "+", ".join(fails)))
    sys.exit(1 if fails else 0)
asyncio.run(main())
