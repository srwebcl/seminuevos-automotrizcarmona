<?php
// debug_images.php
// Sube esto a /public y visítalo.

function scan_dir_recursive($dir)
{
    if (!is_dir($dir))
        return "❌ No es un directorio: $dir<br>";

    $files = scandir($dir);
    echo "<h3>📂 Contenido de: $dir</h3><ul>";

    foreach ($files as $file) {
        if ($file == '.' || $file == '..')
            continue;
        $path = $dir . '/' . $file;
        $type = is_dir($path) ? "[DIR]" : "[FILE]";
        $size = is_file($path) ? round(filesize($path) / 1024, 2) . " KB" : "";
        echo "<li>$type <strong>$file</strong> ($size)</li>";
    }
    echo "</ul>";
}

echo "<h1>🕵️‍♂️ CSI: División Archivos Perdidos</h1>";

$storage_app_public = __DIR__ . '/../storage/app/public';
$public_storage = __DIR__ . '/storage';

echo "<h2>1. Verificando Bóveda Real (storage/app/public)</h2>";
if (file_exists($storage_app_public)) {
    scan_dir_recursive($storage_app_public);
} else {
    echo "<p style='color:red'>❌ ¡ERROR FATAL! La carpeta 'storage/app/public' NO EXISTE.</p>";
}

echo "<hr>";

echo "<h2>2. Verificando Enlace Público (public/storage)</h2>";
if (file_exists($public_storage)) {
    if (is_link($public_storage)) {
        echo "<p style='color:green'>✅ Es un enlace simbólico.</p>";
        echo "Apuna a: " . readlink($public_storage);
    } else {
        echo "<p style='color:red'>⚠️ Es una CARPETA REAL (Esto está mal si debería ser enlace).</p>";
    }
    scan_dir_recursive($public_storage);
} else {
    echo "<p style='color:red'>❌ El enlace 'public/storage' NO EXISTE.</p>";
}
?>