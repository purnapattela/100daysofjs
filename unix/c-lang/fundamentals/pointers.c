#include "stdio.h"
#include "stdlib.h"
#include "string.h"

#define length(x) (sizeof(x) / sizeof(x[0]))

int main(){
    char *greet = "Hello World";
    char *arr[] = {"a","b" ,"c"};
    puts(greet);
    printf("%lu",length(arr));
    return EXIT_SUCCESS;
}