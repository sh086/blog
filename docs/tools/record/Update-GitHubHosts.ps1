# 检查是否以管理员身份运行
if (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Output "The script requires administrator privileges. Requesting administrator privileges..."
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# 定义GitHub提供的Hosts文件URL
$hostsUrl = "https://raw.githubusercontent.com/521xueweihan/GitHub520/main/hosts"

# 定义本地Hosts文件路径
$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"

# 下载GitHub提供的Hosts文件内容
$githubHostsContent = Invoke-WebRequest -Uri $hostsUrl -UseBasicParsing

# 读取本地Hosts文件内容
$localHostsContent = Get-Content -Path $hostsPath -Raw

# 检查本地Hosts文件是否已经包含GitHub提供的Hosts内容
if (-not ($localHostsContent -match $githubHostsContent.Content)) {
    # 如果不包含，则将GitHub提供的Hosts内容追加到本地Hosts文件
    Add-Content -Path $hostsPath -Value "`n# GitHub Hosts Start`n$($githubHostsContent.Content)`n# GitHub Hosts End"
    Write-Output "GitHub Hosts have been successfully updated to the local Hosts file."
} else {
    Write-Output "The local Hosts file already contains the latest GitHub Hosts content."
}

# 刷新DNS缓存
ipconfig /flushdns
Write-Output "DNS cache has been refreshed."

# 暂停并提示用户输入任意键继续
Write-Output "Press any key to continue..."
[void][System.Console]::ReadKey($true)