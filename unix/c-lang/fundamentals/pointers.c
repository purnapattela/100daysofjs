#include "stdio.h"
#include "stdlib.h"
#include "string.h"

#define length(x) (sizeof(x) / sizeof(x[0]))

int main(){
    char *greet = "Hello World";
    char *arr[] = {"a","b" ,"c"};
    puts(greet);
    printf("%lu\n",length(arr));
    printf("%c",*arr[0]);
    return EXIT_SUCCESS;
}

/**
 *     -> '*' dereference operator
 *     -> '&' address-of operator
 */