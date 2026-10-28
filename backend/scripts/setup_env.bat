@echo off
echo Setting up CUDA+MPI environment...

:: 1. Set MPI paths
set MPI_HOME=C:\Program Files\Microsoft MPI
set MSMPI_INC=%MPI_HOME%\Inc
set MSMPI_LIB64=%MPI_HOME%\Lib\x64

:: 2. Set CUDA path (adjust based on your version)
set CUDA_PATH=C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.0
if not exist "%CUDA_PATH%" set CUDA_PATH=C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.8
if not exist "%CUDA_PATH%" set CUDA_PATH=C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.0

:: 3. Add to PATH
set PATH=%CUDA_PATH%\bin;%MSMPI_LIB64%;%MPI_HOME%\Bin;%PATH%

:: 4. Set for Visual Studio (adjust version as needed)
set VS_PATH=C:\Program Files\Microsoft Visual Studio\2022\Community
if exist "%VS_PATH%" (
    call "%VS_PATH%\VC\Auxiliary\Build\vcvars64.bat"
)

echo.
echo Environment variables set:
echo MPI_HOME: %MPI_HOME%
echo MSMPI_INC: %MSMPI_INC%
echo MSMPI_LIB64: %MSMPI_LIB64%
echo CUDA_PATH: %CUDA_PATH%
echo.
echo Run 'where nvcc' and 'where mpiexec' to verify
pause