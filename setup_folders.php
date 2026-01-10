<?php
// setup_folders.php
// Sube este archivo a /public o a la raíz y ejecútalo.

$folders = [
    'storage/app',
    'storage/app/public',
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/cache/data',
    'storage/framework/sessions',
    'storage/framework/testing',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache',
];

echo "<h1>Creando Carpetas de Caché...</h1>";

foreach ($folders as $folder) {
    $path = __DIR__ . '/' . $folder;

    // Si el script está en public/, necesitamos subir un nivel
    if (basename(__DIR__) === 'public') {
        $path = dirname(__DIR__) . '/' . $folder;
    }

    if (!file_exists($path)) {
        if (mkdir($path, 0755, true)) {
            echo "<p style='color:green'>✅ Creada: $path</p>";
        } else {
            echo "<p style='color:red'>❌ Error creando: $path (Revisar Permisos)</p>";
        }
    } else {
        echo "<p style='color:blue'>ℹ️ Ya existe: $path</p>";
    }
}

echo "<h3>Listo. Ahora borra este archivo y prueba el sitio.</h3>";
?>