<?php
// link_storage.php
// Sube esto a /public (o la carpeta raíz donde está index.php) y visítalo.

$target = __DIR__ . '/../storage/app/public';
$shortcut = __DIR__ . '/storage';

echo "<h1>Reparando Enlace de Imágenes...</h1>";

if (file_exists($shortcut)) {
    if (is_link($shortcut)) {
        echo "<p style='color:orange'>ℹ️ El enlace ya existe. Refrescando...</p>";
        unlink($shortcut);
    } elseif (is_dir($shortcut)) {
        echo "<p style='color:orange'>⚠️ Se encontró una carpeta 'storage'. Intentando renombrarla a 'storage_backup'...</p>";
        if (rename($shortcut, $shortcut . '_backup_' . time())) {
            echo "<p style='color:green'>✅ Carpeta renombrada exitosamente.</p>";
        } else {
            echo "<p style='color:red'>❌ No se pudo renombrar la carpeta. Por favor bórrala manualmente desde cPanel (public/storage).</p>";
            exit;
        }
    }
}

if (symlink($target, $shortcut)) {
    echo "<p style='color:green; font-size:20px'>✅ ¡ÉXITO! Enlace de imágenes reparado.</p>";
    echo "<p>Ahora las imágenes deberían ser visibles.</p>";
} else {
    echo "<p style='color:red'>❌ Error al crear enlace simbólico. Verifica permisos.</p>";
}
?>