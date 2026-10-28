// main_cpu.cpp - Serial CPU reference implementation
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <vector>
#include <string>
#include <filesystem>
#include <chrono>

extern "C" int scanFileCPU(const char* filename, int rank);

int main(int argc, char** argv) {
    const char* scan_dir = (argc > 1) ? argv[1] : "./uploads";
    
    printf("=== Serial CPU Virus Scanner ===\n");
    printf("Scanning directory: %s\n", scan_dir);
    
    std::vector<std::string> files;
    try {
        for (const auto &entry : std::filesystem::directory_iterator(scan_dir)) {
            if (entry.is_regular_file()) {
                files.push_back(entry.path().string());
            }
        }
    } catch (const std::exception &e) {
        printf("Error reading directory: %s\n", e.what());
        return 1;
    }
    
    printf("Found %zu files\n\n", files.size());
    
    auto start = std::chrono::high_resolution_clock::now();
    int total_detections = 0;
    
    for (const auto& file : files) {
        int detections = scanFileCPU(file.c_str(), 0);
        total_detections += detections;
        printf("Scanned %s: %d threats\n", file.c_str(), detections);
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> elapsed = end - start;
    
    printf("\n=== Scan Complete ===\n");
    printf("Total files: %zu\n", files.size());
    printf("Total threats: %d\n", total_detections);
    printf("Total time: %.3f seconds\n", elapsed.count());
    
    return 0;
}