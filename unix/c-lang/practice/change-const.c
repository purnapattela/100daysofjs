#include <stdio.h>
#include <stdlib.h>

int main()
{
    const int a = 10;
    int *p = (int *)&a;
    *p = 20;

    /**
     * Some compiler apply optimization resulting in not to change the value.
     * but in my case const value is changed.
     */
    printf("a = %d\n", a);
    printf("*p = %d\n", *p);
    return EXIT_SUCCESS;
}

/**
 ****** OUTPUT using cc
    practice % cc change-const.c -o output/change-const
    practice % ./output/change-const
    a = 20
    *p = 20

 ****** OUTPUT using gcc
    practice % gcc change-const.c -o output/change-const
    practice % ./output/change-const
    a = 20
    *p = 20
 **/