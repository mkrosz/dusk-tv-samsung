#!/usr/bin/env python3
"""Gera o Dusk TV para TVs Samsung (Tizen): DuskTV.wgt, o pacote que a TV instala.

    python tizen/build.py                  # DuskTV.wgt, ainda sem assinatura
    python tizen/build.py --sign PERFIL    # assinado com um perfil de certificado do Tizen Studio

A TV só instala pacotes assinados. Para TVs de 2015 a 2022 (a sua UN60AU8000 é de 2021) serve um certificado
Tizen comum, criado no Certificate Manager do Tizen Studio. Veja LEIA-ME.md.
Baseado no tizen/build.py do Free My TV (MIT).
"""
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB = os.path.join(ROOT, 'web')
WGT = os.path.join(ROOT, 'DuskTV.wgt')


def tizen_cli():
    """O comando `tizen` do Tizen Studio, ou None."""
    name = 'tizen.bat' if os.name == 'nt' else 'tizen'
    home = os.path.expanduser('~')
    for base in (os.environ.get('TIZEN_STUDIO', ''), os.path.join(home, 'tizen-studio'), 'C:\\tizen-studio',
                 os.path.join(home, 'tizen-sdk'), 'C:\\tizen-sdk'):
        path = os.path.join(base, 'tools', 'ide', 'bin', name)
        if base and os.path.exists(path):
            return path
    return shutil.which('tizen')


def sign(profile):
    cli = tizen_cli()
    if not cli:
        sys.exit('Para assinar é preciso o Tizen SDK (antigo Tizen Studio). Não achei: instale-o em C:\\tizen-studio '
                 '(https://samsungtizenos.com/tools-download/) ou defina TIZEN_STUDIO com a pasta onde ele está.')
    out = tempfile.mkdtemp()
    try:
        run = subprocess.run([cli, 'package', '-t', 'wgt', '-s', profile, '-o', out, '--', WGT],
                             capture_output=True, text=True, shell=os.name == 'nt')
        made = [n for n in os.listdir(out) if n.endswith('.wgt')]
        if run.returncode != 0 or not made:
            sys.exit('O `tizen package` não assinou:\n' + (run.stdout + run.stderr).strip())
        shutil.move(os.path.join(out, made[0]), WGT)
    finally:
        shutil.rmtree(out, ignore_errors=True)
    with zipfile.ZipFile(WGT) as z:
        names = z.namelist()
    if 'author-signature.xml' not in names or 'signature1.xml' not in names:
        sys.exit('O pacote voltou sem as assinaturas.')


def build(profile):
    with open(os.path.join(ROOT, 'tizen', 'config.xml'), encoding='utf-8') as f:
        manifest = f.read()
    version = re.search(r'<widget [^>]*version="([^"]+)"', manifest).group(1)
    with zipfile.ZipFile(WGT, 'w', zipfile.ZIP_DEFLATED) as z:
        for folder, _, names in os.walk(WEB):
            for name in sorted(names):
                path = os.path.join(folder, name)
                z.write(path, os.path.relpath(path, WEB).replace(os.sep, '/'))
        z.write(os.path.join(ROOT, 'tizen', 'config.xml'), 'config.xml')
        z.write(os.path.join(ROOT, 'tizen', 'icon.png'), 'icon.png')
    if profile:
        sign(profile)
    print('Pronto: %s (versão %s, %d KB, %s)' % (os.path.basename(WGT), version, os.path.getsize(WGT) // 1024,
                                               'assinado com "%s"' % profile if profile else 'SEM assinatura'))


if __name__ == '__main__':
    args = sys.argv[1:]
    build(args[args.index('--sign') + 1] if '--sign' in args else None)
