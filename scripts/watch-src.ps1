# Watch for any file changes in frontend/src and print events
$path = "frontend/src"
$filter = "*.*"

$fsw = New-Object System.IO.FileSystemWatcher $path, $filter
$fsw.IncludeSubdirectories = $true
$fsw.EnableRaisingEvents = $true

Register-ObjectEvent $fsw Changed -SourceIdentifier FileChanged -Action { Write-Host "[CHANGED] $($Event.SourceEventArgs.FullPath) ($($Event.SourceEventArgs.ChangeType)) at $(Get-Date)" }
Register-ObjectEvent $fsw Created -SourceIdentifier FileCreated -Action { Write-Host "[CREATED] $($Event.SourceEventArgs.FullPath) ($($Event.SourceEventArgs.ChangeType)) at $(Get-Date)" }
Register-ObjectEvent $fsw Renamed -SourceIdentifier FileRenamed -Action { Write-Host "[RENAMED] $($Event.SourceEventArgs.FullPath) ($($Event.SourceEventArgs.ChangeType)) at $(Get-Date)" }
Register-ObjectEvent $fsw Deleted -SourceIdentifier FileDeleted -Action { Write-Host "[DELETED] $($Event.SourceEventArgs.FullPath) ($($Event.SourceEventArgs.ChangeType)) at $(Get-Date)" }

Write-Host "Watching $path for file changes. Press Enter to exit..."
[Console]::ReadLine()
