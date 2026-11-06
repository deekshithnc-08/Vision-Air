from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
root=Path(__file__).parent/'dist'
errors=[]
class Check(HTMLParser):
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  for key in ['src','href','poster']:
   value=attrs.get(key,'')
   if value.startswith('/') and not value.startswith('//'):
    path=root/unquote(urlsplit(value).path).lstrip('/')
    if path.is_dir(): path=path/'index.html'
    if not path.is_file(): errors.append(str(path))
for p in root.rglob('*.html'): Check().feed(p.read_text())
assert not errors,errors
print('PASS: all local page and asset references resolve.')
