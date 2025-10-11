#include <stdio.h>
#include "stdlib.h"

/**
 * Problem: Sum of Even Numbers Until Limit

Description:
Write a C program that:

Reads an integer N from the user (maximum 100).

Reads N integers from the user.

Calculates the sum of all even numbers among them.

Prints the sum.

Constraints:

1 <= N <= 100

Each integer can be positive, negative, or zero.
 */

/*
int main(){
   int length = 0;
   // taking lenght as input from the user
   scanf("%d",&length);

   // initializing the empyt array
   int arr[length];

   // setting all the values to 0 initially
   for (int i = 0; i < length; i++)
   {
       arr[i] = 0;
   }

   // taking input from the user
   for (int i = 0; i < length; i++){
       scanf("%d", &arr[i]);
   }

   // cal sum of even number entered by the user
   int sum = 0;
   for (int i = 0; i < length; i++)
   {
       if (arr[i] % 2 == 0)
       {
           sum += arr[i];
       }

   }
   printf("Sum of even numbers entered by the user is : %d", sum);

   return EXIT_SUCCESS;
}
*/
/*
Problem: Maximum Even Subarray Sum

Description:
Write a C program that:

Reads an integer N from the user (1 <= N <= 100).

Reads N integers from the user.

Finds the maximum sum of a contiguous subarray that contains only even numbers.

Prints the maximum sum.
*/

/*
int main()
{
    int length = 0;
    printf("Enter the number of elements : ");
    scanf("%d", &length);
    printf("\nEnter the elements: \n");

    int arr[length];

    for (int i = 0; i < length; i++)
    {
        arr[i] = 0;
    }

    for (int i = 0; i < length; i++)
    {
        scanf("%d", &arr[i]);
    }

    // Real solution
    int max_sub_arr_sum = 0;
    for (int i = 0; i < length; i++)
    {
        if (arr[i] % 2 == 0)
        {
            int sum = 0;
            while (i < length && arr[i] % 2 == 0)
            {
                sum += arr[i];
                i++;
            }

            if (sum > max_sub_arr_sum)
            {
                max_sub_arr_sum = sum;
            }
        }
    }

    printf("The highest continues even nums sum : %d", max_sub_arr_sum);
    return EXIT_SUCCESS;
}
*/

/*
swap array in reverse by adderss
// always the len is even - goal is to do it using pointers
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define length(x) ((int)(sizeof(x) / sizeof(x[0])))

void swap(int *arr, int n);

int main() {
    int arr[] = {1, 2, 3, 4, 5, 6, 7, 8};
    int n = length(arr);

    swap(arr, n);

    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }

    return EXIT_SUCCESS;
}

void swap(int *arr, int n) {
    for (int i = 0; i < n / 2; i++) {
        int temp = arr[i];
        arr[i] = arr[n - i - 1];
        arr[n - i - 1] = temp;
    }

    /**
    * int temp = *(arr + i);
    *(arr + i) = *(arr + n - i - 1);
    *(arr + n - i - 1) = temp;
    */
}
