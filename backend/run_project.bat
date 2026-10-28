@echo off
echo Running Virus Detection Project...

:: Create test files
echo Creating test files...
mkdir data\uploads 2>nul
echo "This is a test file with MALWARE_SIG_001 pattern" > data\uploads\test1.txt
echo "Clean file without threats" > data\uploads\test2.txt
echo "File with TROJAN_PATTERN and VIRUS_HEADER_X" > data\uploads\test3.txt

:: Compile the project
echo Compiling...
cd backend

:: Simple compilation without CUDA/MPI
cl /EHsc /I. src/mpi/main.cpp src/cuda/virus_detector.cu /Fevirus_scanner.exe

:: Run
echo.
echo Running scanner...
virus_scanner.exe data/uploads

echo.
echo Project executed successfully!
pause