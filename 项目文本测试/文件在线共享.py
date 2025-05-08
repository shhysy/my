from flask import Flask, send_file, send_from_directory
import os
import zipfile
import tempfile
import shutil

app = Flask(__name__)

print("请输入要共享的文件路径（例如：C:\\Users\\Administrator\\Desktop\\监控\\1号机.zip）")
FILE_PATH = input("文件路径: ").strip()

FILE_PATH = FILE_PATH.strip('"').strip("'")

def create_zip_file(source_path, zip_path):
    """将文件夹压缩成zip文件"""
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_path):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_path)
                zipf.write(file_path, arcname)

@app.route('/')
def download_file():
    try:
        return send_file(
            FILE_PATH,
            as_attachment=True,
            download_name=os.path.basename(FILE_PATH)
        )
    except Exception as e:
        return f"文件下载出错: {str(e)}", 500

if __name__ == '__main__':
    if not os.path.exists(FILE_PATH):
        print(f"错误：文件不存在: {FILE_PATH}")
        exit(1)
        
    print(f"服务器启动中... 文件大小: {os.path.getsize(FILE_PATH) / (1024*1024):.2f} MB")
    print(f"访问地址: http://slowdao.natapp1.cc")
    print("服务器已启动，按 Ctrl+C 可以停止服务器")
    # 启动服务器，监听所有网络接口，端口改为80，关闭调试模式
    app.run(host='0.0.0.0', port=80, debug=False)
