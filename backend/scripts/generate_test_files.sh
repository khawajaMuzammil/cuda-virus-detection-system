#!/bin/bash
# Generate test files with virus patterns

DATA_DIR="data/test_data"
mkdir -p $DATA_DIR

echo "Generating test files in $DATA_DIR/..."

# Create 100 test files with various patterns
for i in {1..100}; do
    filename="$DATA_DIR/file_$i.dat"
    
    # Random file size between 10KB and 1MB
    size=$(( (RANDOM % 1000 + 10) * 1024 ))
    
    # Create file with random data
    head -c $size /dev/urandom > $filename
    
    # Inject virus patterns at random positions
    patterns=("MALWARE_SIG_001" "TROJAN_PATTERN" "VIRUS_HEADER_X" "EXPLOIT_CODE" "BACKDOOR_KEY")
    
    for pattern in "${patterns[@]}"; do
        if (( RANDOM % 3 == 0 )); then  # 33% chance to inject each pattern
            # Random position in file
            filesize=$(stat -c%s "$filename")
            pos=$(( RANDOM % (filesize - ${#pattern} - 100) + 50 ))
            
            # Use sed to inject pattern
            echo -n "$pattern" | dd of="$filename" bs=1 seek=$pos conv=notrunc 2>/dev/null
        fi
    done
    
    echo "Created $filename ($(stat -c%s "$filename") bytes)"
done

echo "Generated 100 test files in $DATA_DIR/"