cmake_minimum_required(VERSION 3.15)
project(cuda_virus_scanner LANGUAGES CXX CUDA)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Windows specific settings
if(WIN32)
    # Disable some warnings
    add_definitions(-D_CRT_SECURE_NO_WARNINGS -D_SCL_SECURE_NO_WARNINGS)
    
    # Set MS-MPI paths (adjust if needed)
    set(MPI_INCLUDE_PATH "C:/Program Files/Microsoft MPI/Inc")
    set(MPI_LIBRARY_PATH "C:/Program Files/Microsoft MPI/Lib/x64")
    
    # Find MPI libraries
    find_library(MPI_LIBRARY msmpi PATHS ${MPI_LIBRARY_PATH})
    find_library(MPI_LIBRARY2 msmpifec PATHS ${MPI_LIBRARY_PATH})
    
    if(NOT MPI_LIBRARY)
        message(FATAL_ERROR "MS-MPI library not found. Please install Microsoft MPI.")
    endif()
    
    # Set MPI variables for target_link_libraries
    set(MPI_LIBRARIES ${MPI_LIBRARY} ${MPI_LIBRARY2})
    
    # Find CUDA
    find_package(CUDA REQUIRED)
    include_directories(${CUDA_INCLUDE_DIRS})
    
else()
    # Linux settings
    find_package(MPI REQUIRED)
    find_package(CUDA REQUIRED)
endif()

# Include directories
include_directories(
    ${CMAKE_SOURCE_DIR}/include
    ${MPI_INCLUDE_PATH}
    ${MPI_INCLUDE_PATH}  # Add twice to ensure it's found
)

# Main executable
add_executable(virus_scanner 
    src/mpi/main.cpp
    src/cuda/virus_detector.cu
)

# Link libraries
target_link_libraries(virus_scanner 
    ${MPI_LIBRARIES}
    ${CUDA_LIBRARIES}
)

# Set output directory
set_target_properties(virus_scanner PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
    CUDA_SEPARABLE_COMPILATION ON
)

# Optional: CPU version
add_executable(virus_scanner_cpu 
    src/mpi/main_cpu.cpp
    src/cpu/scan_stub.cpp
)

# Optional: Performance test
add_executable(performance_test 
    src/mpi/performance_test.cpp
    src/cuda/virus_detector.cu
)

target_link_libraries(performance_test 
    ${MPI_LIBRARIES}
    ${CUDA_LIBRARIES}
)

# Copy DLLs to output directory (Windows only)
if(WIN32)
    add_custom_command(TARGET virus_scanner POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
            "${MPI_LIBRARY_PATH}/msmpi.dll"
            "${CMAKE_BINARY_DIR}/bin/"
    )
endif()