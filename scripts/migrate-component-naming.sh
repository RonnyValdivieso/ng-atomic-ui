#!/bin/bash

# 🔄 Script de Migración de Nomenclatura Angular
# Convierte archivos de componentes de *.component.* a la nueva nomenclatura Angular Style Guide

set -e

echo "🚀 Iniciando migración de nomenclatura de componentes Angular..."

# Función para procesar un directorio de componente
migrate_component() {
    local component_dir="$1"
    local component_name=$(basename "$component_dir")
    
    echo "📝 Procesando: $component_name"
    
    # Verificar que sea un directorio de componente válido
    if [[ ! -f "$component_dir/$component_name.component.ts" ]]; then
        echo "⚠️  No se encontró $component_name.component.ts, saltando..."
        return
    fi
    
    cd "$component_dir"
    
    # 1. Renombrar archivos
    echo "  🔄 Renombrando archivos..."
    
    if [[ -f "$component_name.component.ts" ]]; then
        mv "$component_name.component.ts" "$component_name.ts"
        echo "  ✅ $component_name.component.ts → $component_name.ts"
    fi
    
    if [[ -f "$component_name.component.html" ]]; then
        mv "$component_name.component.html" "$component_name.html"
        echo "  ✅ $component_name.component.html → $component_name.html"
    fi
    
    if [[ -f "$component_name.component.css" ]]; then
        mv "$component_name.component.css" "$component_name.css"
        echo "  ✅ $component_name.component.css → $component_name.css"
    fi
    
    if [[ -f "$component_name.component.scss" ]]; then
        mv "$component_name.component.scss" "$component_name.scss"
        echo "  ✅ $component_name.component.scss → $component_name.scss"
    fi
    
    if [[ -f "$component_name.component.spec.ts" ]]; then
        mv "$component_name.component.spec.ts" "$component_name.spec.ts"
        echo "  ✅ $component_name.component.spec.ts → $component_name.spec.ts"
    fi
    
    # 2. Actualizar referencias en el archivo TypeScript
    echo "  🔧 Actualizando referencias en $component_name.ts..."
    
    if [[ -f "$component_name.ts" ]]; then
        # Actualizar templateUrl
        sed -i.bak "s|templateUrl: '\.\/$component_name\.component\.html'|templateUrl: '\.\/$component_name\.html'|g" "$component_name.ts"
        sed -i.bak "s|templateUrl: \"\.\/$component_name\.component\.html\"|templateUrl: \"\.\/$component_name\.html\"|g" "$component_name.ts"
        
        # Actualizar styleUrls
        sed -i.bak "s|styleUrls: \['\.\/$component_name\.component\.css'\]|styleUrls: ['./$component_name.css']|g" "$component_name.ts"
        sed -i.bak "s|styleUrls: \[\"\.\/$component_name\.component\.css\"\]|styleUrls: [\"./$component_name.css\"]|g" "$component_name.ts"
        sed -i.bak "s|styleUrls: \['\.\/$component_name\.component\.scss'\]|styleUrls: ['./$component_name.scss']|g" "$component_name.ts"
        sed -i.bak "s|styleUrls: \[\"\.\/$component_name\.component\.scss\"\]|styleUrls: [\"./$component_name.scss\"]|g" "$component_name.ts"
        
        # Limpiar archivo backup
        rm -f "$component_name.ts.bak"
    fi
    
    # 3. Actualizar referencias en archivo de tests
    echo "  🧪 Actualizando referencias en $component_name.spec.ts..."
    
    if [[ -f "$component_name.spec.ts" ]]; then
        # Actualizar import del componente
        sed -i.bak "s|from '\.\/$component_name\.component'|from '\.\/$component_name'|g" "$component_name.spec.ts"
        sed -i.bak "s|from \"\.\/$component_name\.component\"|from \"\.\/$component_name\"|g" "$component_name.spec.ts"
        
        # Limpiar archivo backup
        rm -f "$component_name.spec.ts.bak"
    fi
    
    # 4. Actualizar index.ts si existe
    if [[ -f "index.ts" ]]; then
        echo "  📦 Actualizando index.ts..."
        sed -i.bak "s|from '\.\/$component_name\.component'|from '\.\/$component_name'|g" "index.ts"
        sed -i.bak "s|from \"\.\/$component_name\.component\"|from \"\.\/$component_name\"|g" "index.ts"
        rm -f "index.ts.bak"
    fi
    
    cd - > /dev/null
    echo "  ✅ Componente $component_name migrado correctamente"
}

# Función principal
main() {
    local src_dir="${1:-src/app/components}"
    
    if [[ ! -d "$src_dir" ]]; then
        echo "❌ Directorio no encontrado: $src_dir"
        echo "💡 Uso: $0 [directorio_componentes]"
        echo "💡 Ejemplo: $0 src/app/components"
        exit 1
    fi
    
    echo "📁 Buscando componentes en: $src_dir"
    
    # Buscar todos los directorios que contengan archivos *.component.ts
    find "$src_dir" -name "*.component.ts" -type f | while read -r component_file; do
        component_dir=$(dirname "$component_file")
        migrate_component "$component_dir"
    done
    
    echo ""
    echo "🎉 Migración completada!"
    echo ""
    echo "📋 Próximos pasos manuales:"
    echo "  1. Verificar que todos los imports se hayan actualizado correctamente"
    echo "  2. Buscar referencias globales con: grep -r '.component' src/"
    echo "  3. Actualizar imports en archivos de routing si es necesario"
    echo "  4. Ejecutar tests: npm test"
    echo "  5. Compilar aplicación: npm run build"
}

# Mostrar ayuda si se solicita
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "🔄 Script de Migración de Nomenclatura Angular"
    echo ""
    echo "Convierte la nomenclatura de archivos de componentes Angular:"
    echo "  ❌ component-name.component.ts → ✅ component-name.ts"
    echo "  ❌ component-name.component.html → ✅ component-name.html"
    echo "  ❌ component-name.component.css → ✅ component-name.css"
    echo ""
    echo "Uso:"
    echo "  $0 [directorio_componentes]"
    echo ""
    echo "Ejemplos:"
    echo "  $0                                    # Migra src/app/components"
    echo "  $0 src/app/components                # Migra directorio específico"
    echo "  $0 src/app/components/atoms         # Migra solo atoms"
    echo ""
    echo "⚠️  IMPORTANTE: Haz backup antes de ejecutar!"
    exit 0
fi

# Ejecutar migración
main "$@"