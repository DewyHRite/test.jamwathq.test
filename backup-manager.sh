#!/bin/bash

################################################################################
# Backup Manager Script
# Purpose: Manage backups with overwrite logic and automatic cleanup
# Features:
#   - Smart overwrite: overwrites existing backup for same file
#   - Cleanup: removes excess backups, keeps only most recent
#   - Version history integration
#   - Rollback support
################################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_EXTENSION=".backup"
VERSION_HISTORY="VERSION_HISTORY.md"

################################################################################
# Function: Print header
################################################################################
print_header() {
    echo "====================================="
    echo "$1"
    echo "====================================="
}

################################################################################
# Function: Create or overwrite backup
# Usage: create_backup <source_file>
# Returns: Path to backup file
################################################################################
create_backup() {
    local source_file="$1"

    if [ ! -f "$source_file" ]; then
        echo -e "${RED}Error: Source file '$source_file' does not exist${NC}"
        return 1
    fi

    # Extract directory and filename
    local dir=$(dirname "$source_file")
    local filename=$(basename "$source_file")
    local extension="${filename##*.}"
    local basename="${filename%.*}"

    # Handle files with no extension
    if [ "$basename" = "$filename" ]; then
        extension=""
        basename="$filename"
    fi

    # Create backup filename (consistent naming for overwrite)
    if [ -z "$extension" ]; then
        local backup_file="${dir}/${basename}${BACKUP_EXTENSION}"
    else
        local backup_file="${dir}/${basename}${BACKUP_EXTENSION}.${extension}"
    fi

    # Check if backup already exists
    if [ -f "$backup_file" ]; then
        echo -e "${YELLOW}⚠ Backup exists, overwriting: $backup_file${NC}"
        rm "$backup_file"
    else
        echo -e "${GREEN}✓ Creating new backup: $backup_file${NC}"
    fi

    # Create backup
    cp "$source_file" "$backup_file"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backup created successfully${NC}"
        echo "$backup_file"
        return 0
    else
        echo -e "${RED}✗ Failed to create backup${NC}"
        return 1
    fi
}

################################################################################
# Function: Cleanup excess backups
# Keeps only the most recent backup for each file
################################################################################
cleanup_excess_backups() {
    local search_dir="${1:-.}"
    local deleted_count=0

    print_header "Cleaning Up Excess Backups"

    echo "Searching in: $search_dir"
    echo ""

    # Find all backup files grouped by original filename
    local processed_files=()

    # Find all backup files
    while IFS= read -r backup_file; do
        # Skip if already processed
        if [[ " ${processed_files[@]} " =~ " ${backup_file} " ]]; then
            continue
        fi

        # Extract base filename (without backup suffix and timestamp)
        local dir=$(dirname "$backup_file")
        local filename=$(basename "$backup_file")

        # Try to identify the original filename pattern
        # Pattern 1: filename.backup.ext
        # Pattern 2: filename.backup.timestamp.ext
        local base_pattern=""

        if [[ $filename =~ ^(.+)\.backup(\.[0-9-]+)?\.([^.]+)$ ]]; then
            base_pattern="${dir}/${BASH_REMATCH[1]}.backup*${BASH_REMATCH[3]}"
        elif [[ $filename =~ ^(.+)\.backup(\.[0-9-]+)?$ ]]; then
            base_pattern="${dir}/${BASH_REMATCH[1]}.backup*"
        else
            continue
        fi

        # Find all backups matching this pattern
        local matching_backups=()
        while IFS= read -r match; do
            matching_backups+=("$match")
        done < <(find "$dir" -maxdepth 1 -name "$(basename "$base_pattern")" -type f)

        # If more than one backup exists, keep only the newest
        if [ ${#matching_backups[@]} -gt 1 ]; then
            echo -e "${YELLOW}Found ${#matching_backups[@]} backups for pattern: $base_pattern${NC}"

            # Sort by modification time, newest first
            local newest=$(ls -t "${matching_backups[@]}" | head -1)

            echo -e "${GREEN}  Keeping newest: $newest${NC}"

            # Delete all others
            for backup in "${matching_backups[@]}"; do
                if [ "$backup" != "$newest" ]; then
                    echo -e "${RED}  Deleting old: $backup${NC}"
                    rm "$backup"
                    ((deleted_count++))
                fi
                processed_files+=("$backup")
            done
            echo ""
        fi
    done < <(find "$search_dir" -name "*${BACKUP_EXTENSION}*" -type f)

    echo ""
    echo -e "${GREEN}✓ Cleanup complete${NC}"
    echo -e "${BLUE}Total excess backups deleted: $deleted_count${NC}"
    return $deleted_count
}

################################################################################
# Function: List all current backups
################################################################################
list_backups() {
    local search_dir="${1:-.}"

    print_header "Current Backup Files"

    local backup_count=0
    while IFS= read -r backup_file; do
        local size=$(du -h "$backup_file" | cut -f1)
        local modified=$(date -r "$backup_file" "+%Y-%m-%d %H:%M:%S")
        echo -e "${BLUE}$backup_file${NC}"
        echo "  Size: $size | Modified: $modified"
        ((backup_count++))
    done < <(find "$search_dir" -name "*${BACKUP_EXTENSION}*" -type f | sort)

    echo ""
    echo -e "${GREEN}Total backups: $backup_count${NC}"
}

################################################################################
# Function: Restore from backup
# Usage: restore_backup <backup_file>
################################################################################
restore_backup() {
    local backup_file="$1"

    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}Error: Backup file '$backup_file' does not exist${NC}"
        return 1
    fi

    # Determine original filename by removing .backup suffix
    local original_file=""
    local filename=$(basename "$backup_file")

    if [[ $filename =~ ^(.+)\.backup(\.[0-9-]+)?\.([^.]+)$ ]]; then
        original_file="$(dirname "$backup_file")/${BASH_REMATCH[1]}.${BASH_REMATCH[3]}"
    elif [[ $filename =~ ^(.+)\.backup(\.[0-9-]+)?$ ]]; then
        original_file="$(dirname "$backup_file")/${BASH_REMATCH[1]}"
    else
        echo -e "${RED}Error: Cannot determine original filename from backup${NC}"
        return 1
    fi

    echo -e "${YELLOW}Restoring: $original_file${NC}"
    echo -e "${YELLOW}From backup: $backup_file${NC}"
    echo ""
    read -p "Are you sure? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp "$backup_file" "$original_file"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ File restored successfully${NC}"
            return 0
        else
            echo -e "${RED}✗ Failed to restore file${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}Restore cancelled${NC}"
        return 1
    fi
}

################################################################################
# Function: Update version history
# Usage: update_version_history <summary> <files_changed>
################################################################################
update_version_history() {
    local summary="$1"
    local files_changed="$2"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")

    if [ ! -f "$VERSION_HISTORY" ]; then
        echo "# Version History Log" > "$VERSION_HISTORY"
        echo "" >> "$VERSION_HISTORY"
    fi

    # Create temporary file with new entry
    local temp_file=$(mktemp)

    # Read existing content (skip first line header)
    tail -n +2 "$VERSION_HISTORY" > "$temp_file"

    # Write new version history
    echo "# Version History Log" > "$VERSION_HISTORY"
    echo "" >> "$VERSION_HISTORY"
    echo "## $timestamp - $summary" >> "$VERSION_HISTORY"
    echo "" >> "$VERSION_HISTORY"
    echo "### Files Changed" >> "$VERSION_HISTORY"
    echo "$files_changed" >> "$VERSION_HISTORY"
    echo "" >> "$VERSION_HISTORY"
    echo "### Backup Information" >> "$VERSION_HISTORY"
    echo "- Backup system: Overwrite mode (single backup per file)" >> "$VERSION_HISTORY"
    echo "- Timestamp: $timestamp" >> "$VERSION_HISTORY"
    echo "" >> "$VERSION_HISTORY"
    echo "---" >> "$VERSION_HISTORY"
    echo "" >> "$VERSION_HISTORY"

    # Append old content
    cat "$temp_file" >> "$VERSION_HISTORY"
    rm "$temp_file"

    echo -e "${GREEN}✓ Version history updated${NC}"
}

################################################################################
# Main script logic
################################################################################
main() {
    case "${1:-help}" in
        create)
            shift
            if [ $# -eq 0 ]; then
                echo -e "${RED}Error: No file specified${NC}"
                echo "Usage: $0 create <file1> [file2] [file3] ..."
                exit 1
            fi

            print_header "Creating Backups"
            for file in "$@"; do
                create_backup "$file"
                echo ""
            done
            ;;

        cleanup)
            cleanup_excess_backups "${2:-.}"
            ;;

        list)
            list_backups "${2:-.}"
            ;;

        restore)
            if [ -z "$2" ]; then
                echo -e "${RED}Error: No backup file specified${NC}"
                echo "Usage: $0 restore <backup_file>"
                exit 1
            fi
            restore_backup "$2"
            ;;

        help|*)
            print_header "Backup Manager - Help"
            echo "Usage: $0 <command> [options]"
            echo ""
            echo "Commands:"
            echo "  create <file>...    Create or overwrite backup for file(s)"
            echo "  cleanup [dir]       Remove excess backups (keep newest only)"
            echo "  list [dir]          List all backup files in directory"
            echo "  restore <backup>    Restore file from backup"
            echo "  help                Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 create frontend/index.html"
            echo "  $0 cleanup frontend"
            echo "  $0 list ."
            echo "  $0 restore frontend/index.backup.html"
            echo ""
            ;;
    esac
}

# Run main function
main "$@"
