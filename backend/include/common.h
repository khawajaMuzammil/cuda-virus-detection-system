// common.h - Common definitions and utilities
#ifndef COMMON_H
#define COMMON_H

// Virus signature patterns (shared between CPU and GPU)
#define NUM_PATTERNS 5
#define MAX_PATTERN_LENGTH 64

extern const char* VIRUS_PATTERNS[NUM_PATTERNS];

// Function declarations
#ifdef __cplusplus
extern "C" {
#endif

int scanFile(const char* filename, int rank);
int scanFileCPU(const char* filename, int rank);
void getGPUInfo(int rank);

#ifdef __cplusplus
}
#endif

#endif // COMMON_H