#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main()
{
    /**
     * %zu is used to represent the size_t type
     * %ld -> unsigned long
     * %lu -> unsigned long
     * %lld -> signed long long
     * %llu -> unsigned long long
     */
    printf("%zu is the size of int\n", sizeof(int));

    char *str = "Hello World";
    printf("%zu is the size of string %s\n", strlen(str), str);

    // copy the string without strcpy method
    char *cpystr = malloc(strlen(str) + 1);
    if (cpystr == NULL)
    {
        printf("Memmory allocation failed");
    }
    // int i = 0;
    // while (str[i] != '\0')
    // {
    //     cpystr[i] = str[i];
    //     i++;
    // }
    // cpystr[i] = '\0';
    strcpy(cpystr, str);
    printf("Coppied string is : %s\n", cpystr);
    /**
     * Or simple use
     * strcpy(cpystr,str);
     */

    return EXIT_SUCCESS;
}