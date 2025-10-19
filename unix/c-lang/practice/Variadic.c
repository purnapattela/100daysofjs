#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
/**
 * stdarg - standard header to handle arguments
 */

void print(int n, ...)
{
    va_list args;
    va_start(args, n);
    for (int i = 0; i < n; i++)
    {
        printf("%d\n", va_arg(args, int));
    }
    va_end(args);
}

int sum(int count, ...)
{
    int sum = 0;
    va_list args;
    va_start(args, count);
    for (int i = 0; i < count; i++)
    {
        sum += va_arg(args, int);
    }

    return sum;
}

int main()
{
    // print(5, 1, 2, 3, 4, 5);
    int sum_value = sum(5, 1, 2, 3, 4, 5);
    printf("%d is the sum of the 1..5\n", sum_value);
    printf("Program run successfully\n");
    // exit(1); // throw the exit status
    return EXIT_SUCCESS;
}