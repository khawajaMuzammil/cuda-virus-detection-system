#!/bin/bash
# Performance scaling experiments

echo "=== Running Performance Experiments ==="

# Clean previous results
rm -f performance_metrics.txt scaling_results.csv

# Build project
mkdir -p build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j4

# Run with different number of processes
echo "Running scalability tests..."
for procs in 1 2 4 8
do
    echo -e "\nTesting with $procs processes"
    mpirun -np $procs ./virus_scanner ../uploads --compare
    
    # Wait for cleanup
    sleep 2
done

# Generate performance graph (requires python)
echo -e "\nGenerating performance graphs..."
python3 << 'EOF'
import matplotlib.pyplot as plt
import pandas as pd
import csv

# Read scaling results
try:
    df = pd.read_csv('scaling_results.csv', 
                     names=['Processes', 'MinTime', 'MaxTime', 'AvgTime', 'Imbalance'])
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
    
    # Speedup plot
    serial_time = df[df['Processes'] == 1]['AvgTime'].values[0]
    df['Speedup'] = serial_time / df['AvgTime']
    df['Ideal'] = df['Processes']
    
    ax1.plot(df['Processes'], df['Speedup'], 'bo-', label='Actual', linewidth=2)
    ax1.plot(df['Processes'], df['Ideal'], 'r--', label='Ideal', linewidth=2)
    ax1.set_xlabel('Number of Processes')
    ax1.set_ylabel('Speedup')
    ax1.set_title('Strong Scaling Performance')
    ax1.legend()
    ax1.grid(True)
    
    # Load imbalance plot
    ax2.bar(df['Processes'], df['Imbalance'], color='orange')
    ax2.set_xlabel('Number of Processes')
    ax2.set_ylabel('Load Imbalance (%)')
    ax2.set_title('Load Imbalance Across Processes')
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('performance_graphs.png', dpi=150)
    plt.show()
    
    print("Performance graphs saved to performance_graphs.png")
    
except Exception as e:
    print(f"Error generating graphs: {e}")
EOF

echo -e "\n=== Experiments Complete ==="
echo "Check performance_metrics.txt and performance_graphs.png"