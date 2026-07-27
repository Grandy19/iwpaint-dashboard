<?php
$inputFile = 'c:\\Users\\Administrator\\Downloads\\localhost (4).sql';
$outputFile = 'E:\\laragon\\www\\Project IWPAINT\\iwpaint-dashboard\\iwpaint_structure.sql';

$content = file_get_contents($inputFile);

if ($content === false) {
    die("Error reading input file.");
}

// Hapus bagian INSERT INTO
$content = preg_replace('/^INSERT INTO.*?;/ms', '', $content);

// Replace charset dan collation yang bermacam-macam menjadi utf8 dan utf8_general_ci
$content = str_replace(
    ['utf8mb4_0900_ai_ci', 'utf8mb4_general_ci', 'utf8mb4_unicode_ci', 'utf8mb3_general_ci', 'utf8mb4', 'utf8mb3'],
    ['utf8_general_ci', 'utf8_general_ci', 'utf8_general_ci', 'utf8_general_ci', 'utf8', 'utf8'],
    $content
);

// Tambahkan SET FOREIGN_KEY_CHECKS untuk menghindari masalah relasi
$content = "SET FOREIGN_KEY_CHECKS = 0;\n" . $content . "\nSET FOREIGN_KEY_CHECKS = 1;\n";

file_put_contents($outputFile, $content);
echo "Berhasil membuat iwpaint_structure.sql";
