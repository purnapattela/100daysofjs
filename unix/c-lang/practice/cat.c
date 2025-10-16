#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        perror("SYNTAX ERROR : Usage :\ncat filename.ext\n");
        return EXIT_FAILURE;
    }

    char *fileName = malloc(strlen(argv[1]) + 1);
    if (fileName == NULL)
    {
        perror("Unable to allocate memory for filename");
        return EXIT_FAILURE;
    }
    strcpy(fileName, argv[1]);

    FILE *file = fopen(fileName, "r");
    if (file == NULL)
    {
        perror("No such file exists\n");
        return EXIT_FAILURE;
    }

    size_t buffer_size = 16 * 1024;
    char *buffer = malloc(buffer_size);
    if (buffer == NULL)
    {
        perror("Unable to allocate buffer\n");
        fclose(file);
        return EXIT_FAILURE;
    }

    size_t bytes_read;
    while ((bytes_read = fread(buffer, 1, buffer_size, file)) > 0)
    {
        fwrite(buffer, 1, bytes_read, stdout);
    }
    free(buffer);
    fclose(file);

    return EXIT_SUCCESS;
}

/**
 * BASIC 'cat' implementation in 'c' by @PurnaPattela
 *
 * ex : cat filename.extension -> prints the content in the stdout
 */