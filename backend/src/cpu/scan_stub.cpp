// scan_stub.cpp - CPU implementation
#include <cstdio>
#include <cstring>
#include <string>
#include <fstream>
#include "../../include/common.h"

// Define patterns
const char* VIRUS_PATTERNS[NUM_PATTERNS] = {
    "MALWARE_SIG_001",
    "TROJAN_PATTERN",
    "VIRUS_HEADER_X",
    "EXPLOIT_CODE",
    "BACKDOOR_KEY"
};

int scanFileCPU(const char* filename, int rank) {
    std::ifstream in(filename, std::ios::binary);
    if (!in) {
        printf("[CPU Rank %d] Error opening %s\n", rank, filename);
        return 0;
    }

    std::string content((std::istreambuf_iterator<char>(in)), 
                        std::istreambuf_iterator<char>());

    int detections = 0;
    for (int i = 0; i < NUM_PATTERNS; i++) {
        size_t pos = content.find(VIRUS_PATTERNS[i]);
        while (pos != std::string::npos) {
            detections++;
            pos = content.find(VIRUS_PATTERNS[i], pos + 1);
        }
    }

    printf("[CPU Rank %d] %s: %d threats\n", rank, filename, detections);
    return detections;
}

// Alias for compatibility
extern "C" int scanFile(const char* filename, int rank) {
    return scanFileCPU(filename, rank);
}

// Dummy implementation for GPU info
void getGPUInfo(int rank) {
    printf("[Rank %d] Running in CPU-only mode\n", rank);
}