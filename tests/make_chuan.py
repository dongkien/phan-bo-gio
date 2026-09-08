#!/usr/bin/env python3
"""Sinh hai file chuẩn tests/fixtures/chuan_vn.docx và chuan_en.docx bằng chính phần "Sinh file" của trang
(nạp ví dụ mẫu, bấm Sinh file), qua máy chủ tĩnh tạm vì fetch mẫu không chạy trên file://.
Bản tiếng Anh = ví dụ mẫu đổi ngôn ngữ + CLO, mô tả, giáo trình, tài liệu bắt buộc tiếng Anh.
Chạy: python3 tests/make_chuan.py  (rồi python3 tests/make_fixtures.py && python3 tests/run_tests.py)"""
import asyncio, os, socket, subprocess, sys, time
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE); FX=os.path.join(HERE,'fixtures')
EN={'g-clo':'Explain the nature, functions and principles of economic management.\nAnalyze the effects of macroeconomic management instruments on firms and households.\nApply a policy analysis framework to a current economic management issue in Vietnam.\nWork in teams and present analytical results persuasively.\nComply with professional ethics and academic integrity standards.',
    'g-mota':'This course introduces the basic principles of economic management at the national level: why the state intervenes in the economy, which instruments it uses, and how the results of intervention are assessed. The content has four blocks: the nature and functions of economic management; macroeconomic management instruments; management of markets and economic sectors; and evaluation of the effectiveness and efficiency of economic policy. Theory is combined with Vietnamese cases so that students can apply the analytical framework to current economic management issues.',
    'g-gt':'Stiglitz, J. E., & Rosengard, J. K. (2015). Economics of the Public Sector (4th ed.). New York: W. W. Norton.',
    'g-bb':'Mankiw, N. G. (2021). Principles of Economics (9th ed.). Boston: Cengage.',
    'g-gv':'Dr. Nguyen Van A | nguyenvana@ftu.edu.vn | 0900000000 | HN',
    'g-q61':'Read the assigned materials before each class and take part in discussions.\nSubmit group assignments on time.',
    'g-q62':'Students who miss more than 30% of the sessions are not allowed to sit the final examination.',
    'g-dg':'Formative assessment | Attendance | Attendance and participation in discussions | Attendance records and observation | 1, 2, 3, 4, 5 | 10%\nFormative assessment | Mid-term | Written test or group assignment with report | In-class written test or group report graded by rubric | 1, 2, 3 | 30%\nSummative assessment | Final examination | All course contents | Written or oral examination graded by rubric | 1, 2, 3, 4, 5 | 60%'}
def free_port():
    s=socket.socket(); s.bind(('127.0.0.1',0)); p=s.getsockname()[1]; s.close(); return p
async def main():
    port=free_port(); srv=subprocess.Popen([sys.executable,'-m','http.server',str(port),'--bind','127.0.0.1'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        time.sleep(1.0)
        async with async_playwright() as p:
            b=await p.chromium.launch(); pg=await b.new_page(accept_downloads=True); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(f'http://127.0.0.1:{port}/de-cuong/index.html#sinh-file'); await pg.wait_for_function('window.JSZip && window.NghiemThu && window.SinhDeCuong',timeout=60000)
            await pg.evaluate("localStorage.clear()"); await pg.reload(); await pg.wait_for_function('window.JSZip && window.NghiemThu && window.SinhDeCuong',timeout=60000)
            await pg.click('#g-sample'); await pg.wait_for_timeout(300)
            async def build(name):
                async with pg.expect_download() as dl: await pg.click('#g-build')
                d=await dl.value; out=os.path.join(FX,name); await d.save_as(out); await pg.wait_for_timeout(1200)
                st=await pg.eval_on_selector('#g-status','e=>e.textContent'); print('->',name,'|',st.strip())
            await build('chuan_vn.docx')
            await pg.select_option('#g-lang','en'); await pg.wait_for_timeout(200)
            for k,v in EN.items(): await pg.fill('#'+k,v)
            await pg.wait_for_timeout(300); await build('chuan_en.docx')
            if errs: print('JS ERRORS:',errs); sys.exit(1)
            await b.close()
    finally: srv.terminate()
asyncio.run(main())
