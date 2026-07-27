$content = Get-Content -Path 'c:\Users\Administrator\Downloads\localhost (4).sql' -Raw
$content = $content -replace '(?ms)^INSERT INTO.*?;', ''
$content = $content -replace 'utf8mb4_0900_ai_ci', 'utf8_general_ci'
$content = $content -replace 'utf8mb4_general_ci', 'utf8_general_ci'
$content = $content -replace 'utf8mb4_unicode_ci', 'utf8_general_ci'
$content = $content -replace 'utf8mb3_general_ci', 'utf8_general_ci'
$content = $content -replace 'utf8mb4', 'utf8'
$content = $content -replace 'utf8mb3', 'utf8'
$content = "SET FOREIGN_KEY_CHECKS = 0;`r`n" + $content + "`r`nSET FOREIGN_KEY_CHECKS = 1;`r`n"
Set-Content -Path 'E:\laragon\www\Project IWPAINT\iwpaint-dashboard\iwpaint_structure.sql' -Value $content -Encoding UTF8
