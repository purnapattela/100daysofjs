#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void change_arr(char *arr);
int main()
{
    char arr[] = "Hello World";
    printf("%s\n", arr);
    change_arr(arr);
    printf("%s\n", arr);
    return EXIT_SUCCESS;
}

void change_arr(char *arr)
{
    printf("Value of string : %s :: %c\n", arr, arr[0]);
}