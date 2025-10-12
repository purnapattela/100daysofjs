#include "stdio.h"
#include "stdlib.h"
#include "string.h"

// typedef is used to create our own type
typedef struct test
{
    int dummy1;
    char *dummy2;
    float dummy3;
} new_type;

struct test2
{
    int dum1;
} d1, d2, d3;


int main(){
    // if no typedef i need to declare it as
    struct test t1;
    // if we use typedef it can be created as
    new_type t2;


    // init values
    new_type t3 = {11, "Hacker", 12.3f};
    new_type t4 = {.dummy2 = "Happy", .dummy3=43.3f, .dummy1 = 22};

    // we cant do this type of init in t1 because it already defined
    // for t1 we should use dot(.) operator
    t1.dummy2 = "TETSTEST";

    // HEY in test2 struct we declared the variables also in the structure definition only
    struct test2 dd; // we can create new other than defined in the structure

    // array of structure
    new_type arr[] = {{.dummy1 = 1, .dummy2 = "obj1", .dummy3 = 34.34f}, {.dummy1 = 2, .dummy2 = "obj2", .dummy3 = 23.3f}};
    printf("%s %s\n", arr[0].dummy2, arr[1].dummy2);
    
    new_type *ptr = arr;
    printf("%s %s", ptr[0].dummy2,ptr[1].dummy2);

    /**
     * ptr -> x
     * (*ptr).x
     * (*&a).x
     * a.x
     */
}

/**
 * Structure Padding
 *
 * processor does not read data in 1byte at a time format. it reads 1 word
 * in a 32bit processor i word means 4bytes. if 64 bit processor 1 word refers to 8bytes
 *
 * we can either waste the memory or increase the cycles in the processor to access the data.
 * 
 * order of memebers in the structure changes the size of structure
 * ex : Below example is took for 32bit processor
 *      {
 *          char c1;
 *          int i;
 *          char c2;
 *      } // the size is 12. beaucse of padding. 1 + 3(waste) + 4 + 1 + 3(waste)
 *
 *      {
 *          chat c1;
 *          char c2;
 *          int i;
 *      } // the size is 8. because of padding. 1 + 1 + 2(waste) + 4
 * 
 * 
 *  But we decide to not to waste the memory and let us increase the cycles to acess that memory then we can turn off padding feature using pragma
 *  #pragma pack(1) -> we are turning on
 * 
 *  #pragma is a feature used to either turn on or off certain features
 */