This is a multi-threaded pandemic simulator created using mpi. This simulation plots out a certain number of days in which "people"
can spread a disease while in close proximity to eachother.

For a detailed description on how this simulator works read the PDF named PARallelProgrammingProjectReport.

In order to run this simulator you will need to have installed OpenMPI, this can be done on Linux using the following comand:

sudo apt install openmpi-bin


Next, to compile the code rune the command:

mpic++ main.cpp


To run the code use the command:

mpirun -np [number_of_threads_you_want_to_use] -oversubscribe ./a.out

This command will run the simulation using the number of threads specified. An error may occur if the user's computer cannot
or will not allow too many or too few threads to run.

The results of each day during the simulation will be output to the file Results.txt