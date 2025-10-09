/**
 * Author : PurnaPattela
 * Purpose : Just to test the compiler setup
 * Date : 07-10-2025
 */

#include <stdio.h>
#include "header-file.h"
#define pie 3.16

int main(int argc, char *argv[]) {
    int fav_num;
    printf("Your favourite number: \n");
    scanf("%d", &fav_num);
    printf("Your favourite number is: %d :: %f\n", fav_num,pie);
    printf("%d -> the external function return this number", testHeader());
    return 0;
}