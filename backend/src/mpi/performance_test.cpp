// performance_test.cpp - Scale testing
#include <mpi.h>
#include <stdio.h>
#include <stdlib.h>
#include <vector>
#include <string>

extern "C" int scanFile(const char* filename, int rank);

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);
    
    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    
    // Generate test files
    std::vector<std::string> test_files;
    if (rank == 0) {
        printf("=== Performance Scaling Test ===\n");
        printf("Testing with %d processes\n", size);
        
        // Create dummy test files with patterns
        for (int i = 0; i < 100; i++) {
            char filename[50];
            sprintf(filename, "test_file_%d.bin", i);
            
            FILE* f = fopen(filename, "wb");
            if (f) {
                // Write some data with occasional patterns
                for (int j = 0; j < 10000; j++) {
                    if (j % 1000 == 0) {
                        fwrite("MALWARE_SIG_001", 15, 1, f);
                    }
                    fputc(rand() % 256, f);
                }
                fclose(f);
                test_files.push_back(filename);
            }
        }
        printf("Created %zu test files\n", test_files.size());
    }
    
    // Broadcast file count
    int num_files = test_files.size();
    MPI_Bcast(&num_files, 1, MPI_INT, 0, MPI_COMM_WORLD);
    
    // Distribute files evenly
    int files_per_proc = num_files / size;
    int start = rank * files_per_proc;
    int end = (rank == size - 1) ? num_files : start + files_per_proc;
    
    double start_time = MPI_Wtime();
    int total_detections = 0;
    
    for (int i = start; i < end; i++) {
        char filename[50];
        if (rank == 0) {
            strcpy(filename, test_files[i].c_str());
        }
        MPI_Bcast(filename, 50, MPI_CHAR, 0, MPI_COMM_WORLD);
        
        if (i >= start && i < end) {
            total_detections += scanFile(filename, rank);
        }
    }
    
    double end_time = MPI_Wtime();
    double local_time = end_time - start_time;
    
    // Gather performance data
    double max_time, min_time, avg_time;
    MPI_Reduce(&local_time, &max_time, 1, MPI_DOUBLE, MPI_MAX, 0, MPI_COMM_WORLD);
    MPI_Reduce(&local_time, &min_time, 1, MPI_DOUBLE, MPI_MIN, 0, MPI_COMM_WORLD);
    MPI_Reduce(&local_time, &avg_time, 1, MPI_DOUBLE, MPI_SUM, 0, MPI_COMM_WORLD);
    
    int global_detections;
    MPI_Reduce(&total_detections, &global_detections, 1, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);
    
    if (rank == 0) {
        avg_time /= size;
        printf("\n=== Performance Results ===\n");
        printf("Processes: %d\n", size);
        printf("Files per process: %d\n", files_per_proc);
        printf("Total detections: %d\n", global_detections);
        printf("Min time: %.3f sec\n", min_time);
        printf("Max time: %.3f sec\n", max_time);
        printf("Avg time: %.3f sec\n", avg_time);
        printf("Load imbalance: %.1f%%\n", (max_time - min_time) / avg_time * 100);
        
        // Write to CSV for graphing
        FILE* csv = fopen("scaling_results.csv", "a");
        if (csv) {
            fprintf(csv, "%d,%.3f,%.3f,%.3f,%.1f\n", 
                    size, min_time, max_time, avg_time, 
                    (max_time - min_time) / avg_time * 100);
            fclose(csv);
        }
    }
    
    MPI_Finalize();
    
    // Cleanup test files
    if (rank == 0) {
        for (const auto& file : test_files) {
            remove(file.c_str());
        }
    }
    
    return 0;
}