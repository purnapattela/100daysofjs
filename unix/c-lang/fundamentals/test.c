/**
 * Author : PurnaPattela
 * Date : 11-10-2025
 * Description : This is just a test file. I want to practice some syntax in this file
 */

#include "stdio.h"
#include "stdlib.h"
#include "../utils/util.h"

int main(){
    // int arr[] = {1,2,3,4,5};
    // int length_arr = (int)sizeof(arr) / sizeof(int);
    // for (int i = 0; i < length_arr;i++){
    //     printf("%d",arr[i]);
    // }
    // printf("\nLength of arr is : %ld", length(arr));

    // char inp[10];
    // scanf("%[^\n]", inp);
    // printf("%s", inp);
    /**
     * Hey if i enter more than 10 no output... i dont know why and no error also.
     // scanf("%9[^\n]", inp); -> this reads only 10chars with null char
     */

    // char a[10];
    // gets(a);
    // puts(a);
    /**
     * Hey if i enter more than 10 i can still see the out more than 10 chars
     */

    // char a[10];
    // fgets(a,10,stdin);
    // puts(a);
    /**
     * Hey if i enter more than 10 i can only store 9 chars and 1 \n char null char at end
     */


    return EXIT_SUCCESS;
}