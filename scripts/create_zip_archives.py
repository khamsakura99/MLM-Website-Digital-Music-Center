import os
import zipfile

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEPLOY_DIR = os.path.join(ROOT_DIR, 'deployment_package')
DIST_DIR = os.path.join(ROOT_DIR, 'dist')
DOWNLOADS_DIR = os.path.join(ROOT_DIR, 'public', 'downloads')

os.makedirs(DOWNLOADS_DIR, exist_ok=True)

print(f"Creating ZIP archives from {ROOT_DIR}...")

# 1. Create omc_mlm_ftp_dist.zip (Production dist files + .htaccess + sql + pdf)
dist_zip_path = os.path.join(DOWNLOADS_DIR, 'omc_mlm_ftp_dist.zip')
with zipfile.ZipFile(dist_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    # Add files from dist
    if os.path.exists(DIST_DIR):
        for root, dirs, files in os.walk(DIST_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, DIST_DIR)
                # Don't re-include zip files if they were in dist
                if not file.endswith('.zip'):
                    zf.write(file_path, rel_path)
    
    # Also ensure .htaccess is at the root of the zip
    htaccess_path = os.path.join(DEPLOY_DIR, '.htaccess')
    if os.path.exists(htaccess_path):
        zf.write(htaccess_path, '.htaccess')
        
    # Also include database and pdf in a "database_and_guide" subfolder in the ftp package
    sql_path = os.path.join(DEPLOY_DIR, 'omc_mlm_database.sql')
    if os.path.exists(sql_path):
        zf.write(sql_path, 'database/omc_mlm_database.sql')
        
    pdf_path = os.path.join(DEPLOY_DIR, 'STEP_BY_STEP_SETUP_GUIDE.pdf')
    if os.path.exists(pdf_path):
        zf.write(pdf_path, 'STEP_BY_STEP_SETUP_GUIDE.pdf')

    html_path = os.path.join(DEPLOY_DIR, 'STEP_BY_STEP_SETUP_GUIDE.html')
    if os.path.exists(html_path):
        zf.write(html_path, 'STEP_BY_STEP_SETUP_GUIDE.html')

    php_path = os.path.join(DEPLOY_DIR, 'db_connect.php')
    if os.path.exists(php_path):
        zf.write(php_path, 'db_connect.php')

print(f"✅ Created {dist_zip_path} (Size: {os.path.getsize(dist_zip_path):,} bytes)")

# 2. Create omc_mlm_database_and_sql.zip
db_zip_path = os.path.join(DOWNLOADS_DIR, 'omc_mlm_database_and_sql.zip')
with zipfile.ZipFile(db_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in ['omc_mlm_database.sql', 'database_export.json', 'db_connect.php', 'README.md', 'STEP_BY_STEP_SETUP_GUIDE.pdf']:
        fp = os.path.join(DEPLOY_DIR, f)
        if os.path.exists(fp):
            zf.write(fp, f)
print(f"✅ Created {db_zip_path} (Size: {os.path.getsize(db_zip_path):,} bytes)")

# 3. Create omc_mlm_complete_source_with_db.zip
src_zip_path = os.path.join(DOWNLOADS_DIR, 'omc_mlm_complete_source_with_db.zip')
exclude_dirs = {'node_modules', '.git', 'dist', '.cache', '__pycache__'}
exclude_exts = {'.zip', '.tar', '.gz'}

with zipfile.ZipFile(src_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            _, ext = os.path.splitext(file)
            if ext in exclude_exts:
                continue
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, ROOT_DIR)
            zf.write(file_path, rel_path)

print(f"✅ Created {src_zip_path} (Size: {os.path.getsize(src_zip_path):,} bytes)")

# Also copy zips to deployment_package for convenience
for f in os.listdir(DOWNLOADS_DIR):
    src = os.path.join(DOWNLOADS_DIR, f)
    dst = os.path.join(DEPLOY_DIR, f)
    if os.path.isfile(src):
        import shutil
        shutil.copy2(src, dst)

print("🎉 All ZIP packages created successfully!")
