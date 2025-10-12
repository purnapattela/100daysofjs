#include <stdio.h>
#include <stdlib.h>

union Student
{
    int roll_number;
    char *name;
    float percentage;
};

int main()
{
    union Student data;

    data.roll_number = 1;
    printf("Roll Number: %d\n", data.roll_number);
    
    data.name = "PurnaPattela";
    printf("Name: %s\n", data.name);
    
    data.percentage = 9.8f;
    printf("Percentage: %.2f\n", data.percentage);
    
    printf("Roll Number: %d\n", data.roll_number); // getting garbage value.
    return EXIT_SUCCESS;
}

/**
 * UNION :
 * A union in C is a special data type that lets you store different types of data — but only one at a time — in the same memory location.
 * so in the above code is compiled sucessfully but wont execute as intended
 * first roll_number gets assigned then in the same memory name will be stored by removing the existing data.
 * in the same way union works
 * 
 * 
 * 
 * we can have an union inside an union
 * union a {
 *      union b {
 *          ...
 *      }
 *      ...
 * }
 * 
 * 
 */