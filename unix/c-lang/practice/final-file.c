/**
 * Author : @PurnaPattela
 * Language : C
 * Description : All the functionality of the c-file i will test it here
 */

#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#define CHUNK_SIZE 16 * 1024

/**
 * Here change the #define to test the pieces of the code
 * create a file - create_file
 * read a big=file - read_file
 */
#define read_file main // used to test the file creation

// create a file
int create_file()
{
    fopen("./new-file.txt", "w");
    /**
     * New file will be created if not exists
     */
    printf("File created\n");
    return EXIT_SUCCESS;
}

int read_file()
{
    size_t bytesRead;
    char buffer[CHUNK_SIZE];
    FILE *file;

    file = fopen("new-file.txt", "rb");
    if (file == NULL)
    {
        perror("Error opening file");
        return EXIT_FAILURE;
    }

    // Reading file with streams
    while ((bytesRead = fread(buffer, 1, CHUNK_SIZE, file)))
    {
        size_t bytesWritten = fwrite(buffer, 1, bytesRead, stdout);

        if (bytesWritten < bytesRead)
        {
            perror("Error writing to stdout");
            fclose(file);
            return 1;
        }
    }
    fclose(file); // closing the file
    return EXIT_SUCCESS;
}

/**
 * Error handling files :

    [
        { "errno": 1, "error": "Operation not permitted" },
        { "errno": 2, "error": "No such file or directory" },
        { "errno": 3, "error": "No such process" },
        { "errno": 4, "error": "Interrupted system call" },
        { "errno": 5, "error": "I/O error" },
        { "errno": 6, "error": "No such device or address" },
        { "errno": 7, "error": "The argument list is too long" },
        { "errno": 8, "error": "Exec format error" },
        { "errno": 9, "error": "Bad file number" },
        { "errno": 10, "error": "No child processes" },
        { "errno": 11, "error": "Try again" },
        { "errno": 12, "error": "Out of memory" },
        { "errno": 13, "error": "Permission denied" }
    ]
 */