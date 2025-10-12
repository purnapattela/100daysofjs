#include "stdio.h"
#include "stdlib.h"
#include "string.h"

/*
enum roles
{
    USER,
    ADMIN,
    ROOT
};

int main()
{
    enum roles role;
    role = USER; // this is valid
    role = 2; // this is valid

    printf("%d", role); 
    
    return EXIT_SUCCESS;
}
*/

enum constants
{
    initial,
    a = 1,
    b = 4, // we can initialize the const's or else it just increments the previos value to next so c = 5, d = 6
    c,
    d
};

int main(){
    enum constants en1 = b;
    enum constants en2 = c;
    enum constants en3 = d;

    // we can directly access those enums
    printf("%d\n",b);
    printf("%d\n",c);
    printf("%d\n",d);

    // we can access using the reference
    printf("%d\n",en1);
    printf("%d\n",en2);
    printf("%d\n",en3);


    // lets see the 'initial' value
    printf("%d", initial); // as expected starts from 0
}

/**
 * Facts in enum
 *
 * 1. two or more can have same value
 * 2. we can assign  values in any order. all unassigned get the values get value as value of previous + 1.
 * 3. only integer values are allowed
 * 3. all enum const must be unique
 */