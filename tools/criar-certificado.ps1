# Cria o certificado Tizen "dusk" (TVs Samsung de 2015 a 2022) e o perfil de assinatura com o mesmo nome,
# sem abrir o Certificate Manager. A senha é digitada aqui e não fica salva em lugar nenhum além do certificado.
#
#   powershell -ExecutionPolicy Bypass -File tools\criar-certificado.ps1

$ErrorActionPreference = 'Stop'
$sdk = if ($env:TIZEN_STUDIO) { $env:TIZEN_STUDIO } else { 'C:\tizen-studio' }
$tizen = Join-Path $sdk 'tools\ide\bin\tizen.bat'
if (-not (Test-Path $tizen)) { throw "Não achei o Tizen SDK em $sdk. Instale-o ou defina TIZEN_STUDIO." }

# A pasta de dados do SDK vem do sdk.info (TIZEN_SDK_DATA_PATH).
$data = 'C:\tizen-studio-data'
$info = Join-Path $sdk 'sdk.info'
if (Test-Path $info) {
    $line = Select-String -Path $info -Pattern '^TIZEN_SDK_DATA_PATH=(.+)$' | Select-Object -First 1
    if ($line) { $data = $line.Matches[0].Groups[1].Value.Trim() }
}

function Plain($secure) {
    [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}

Write-Host ''
Write-Host 'Certificado do Dusk TV' -ForegroundColor Cyan
Write-Host 'Crie uma senha (8 caracteres ou mais). Guarde-a: as próximas versões do app usam a mesma.'
do {
    $a = Plain (Read-Host 'Senha' -AsSecureString)
    $b = Plain (Read-Host 'Repita a senha' -AsSecureString)
    if ($a.Length -lt 8) { Write-Host 'Use pelo menos 8 caracteres.' -ForegroundColor Yellow; continue }
    if ($a -ne $b) { Write-Host 'As senhas não batem. Tente de novo.' -ForegroundColor Yellow; continue }
    break
} while ($true)

$p12 = Join-Path $data 'keystore\author\dusk.p12'
if (Test-Path $p12) {
    Write-Host "Já existe um certificado em $p12; ele será usado." -ForegroundColor Yellow
} else {
    & $tizen certificate -a dusk -p $a -f dusk
}
& $tizen security-profiles add -n dusk -a $p12 -p $a
& $tizen cli-config "profiles.path=$(Join-Path $data 'profile\profiles.xml')"
$a = $null; $b = $null

Write-Host ''
& $tizen security-profiles list
Write-Host ''
Write-Host 'Pronto! Agora gere o app com: python tizen\build.py --sign dusk' -ForegroundColor Green
