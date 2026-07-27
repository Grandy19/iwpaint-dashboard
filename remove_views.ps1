$lines = Get-Content -Path 'E:\laragon\www\Project IWPAINT\iwpaint-dashboard\iwpaint_structure.sql'
$startIdx = -1
$endIdx = -1

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '-- Stand-in structure for view') {
        if ($startIdx -eq -1) {
            $startIdx = $i
        }
    }
    if ($lines[$i] -match '-- Indexes for dumped tables') {
        $endIdx = $i
        break
    }
}

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    # Include up to startIdx-1, and from endIdx to the end
    $newLines = $lines[0..($startIdx-1)] + $lines[$endIdx..($lines.Length-1)]
    Set-Content -Path 'E:\laragon\www\Project IWPAINT\iwpaint-dashboard\iwpaint_structure.sql' -Value $newLines -Encoding UTF8
    Write-Output "Removed lines from $startIdx to $endIdx"
} else {
    Write-Output "Could not find start or end index."
}
