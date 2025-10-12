#include "stdio.h"
#include "stdlib.h"
#include "string.h"

int main()
{

    // FILE *fp = fopen("path/to/file", 'w');
    FILE *fp = fopen("../test.txt", "r");
    /**
     * r -> read. if no file gives null
     * w -> write. if file not present then it creates a new file. if there is a content it also remove it.
     * a -> append. if file not present then it creates a new file. if ther is some data it add to the existing data
     *
     * r+ -> used for both reading and writing. file contents will be preserved. if file not present then it retuns NULL pointer
     * w+ -> used for both reading and writing. file contents will be removed if file already exists. if file not present it create new file
     * a+ -> used for both reading and writing. file contents will be present and we can append to it. if file not present it create new file.
     *
     * rb, wb, ab , rb+ , wb+, ab+ -> we have to use these if we work with binary files
     *
     */
    if (fp == NULL)
    {
        printf("file is not present\n");
        return EXIT_FAILURE;
    }
    printf("file is present\n");

    // getc
    // int ch;
    // while ((ch = fgetc(fp)) != EOF)
    // {
    //     putchar(ch); // print character
    // }

    // fgets
    // char buffer[100];
    // while (fgets(buffer, sizeof(buffer), fp) != NULL)
    // {
    //     printf("%s", buffer);
    // }
    // fclose(fp);

    
    return EXIT_SUCCESS;
}
