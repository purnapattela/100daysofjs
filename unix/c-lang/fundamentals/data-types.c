#include <stdio.h>
#include <stdint.h>   // For fixed-width integer types (C99+)
#include <inttypes.h> // For portable printf macros

int main(void) {
    // --- Character types ---
    char a = 'A';
    signed char sa = -65;
    unsigned char ua = 200;

    // --- Integer types ---
    short b = 123;
    unsigned short ub = 65535;
    int c = -1000;
    unsigned int uc = 40000;
    long d = 100000L;
    unsigned long ud = 200000UL;
    long long e = -5000000LL;
    unsigned long long ue = 9000000ULL;

    // --- Fixed-width integer types (stdint.h) ---
    int8_t i8 = -120;
    uint8_t ui8 = 250;
    int16_t i16 = -30000;
    uint16_t ui16 = 60000;
    int32_t i32 = -2000000000;
    uint32_t ui32 = 4000000000U;
    int64_t i64 = -9000000000000000000LL;
    uint64_t ui64 = 18000000000000000000ULL;

    // --- Floating-point types ---
    float f = 3.14f;
    double g = 6.283;
    long double h = 9.869604401L;

    // --- Pointer type ---
    int *ptr = &c;

    // --- Printing all values ---
    printf("---- Character Types ----\n");
    printf("char: %c | ASCII: %d\n", a, a);
    printf("signed char: %hhd\n", sa);
    printf("unsigned char: %hhu\n\n", ua);

    printf("---- Integer Types ----\n");
    printf("short: %hd\n", b);
    printf("unsigned short: %hu\n", ub);
    printf("int: %d\n", c);
    printf("unsigned int: %u\n", uc);
    printf("long: %ld\n", d);
    printf("unsigned long: %lu\n", ud);
    printf("long long: %lld\n", e);
    printf("unsigned long long: %llu\n\n", ue);

    printf("---- Fixed-Width Integer Types ----\n");
    printf("int8_t: %" PRId8 "\n", i8);
    printf("uint8_t: %" PRIu8 "\n", ui8);
    printf("int16_t: %" PRId16 "\n", i16);
    printf("uint16_t: %" PRIu16 "\n", ui16);
    printf("int32_t: %" PRId32 "\n", i32);
    printf("uint32_t: %" PRIu32 "\n", ui32);
    printf("int64_t: %" PRId64 "\n", i64);
    printf("uint64_t: %" PRIu64 "\n\n", ui64);

    printf("---- Floating-Point Types ----\n");
    printf("float: %f\n", f);
    printf("double: %lf\n", g);
    printf("long double: %Lf\n\n", h);

    printf("---- Pointer Type ----\n");
    printf("pointer: %p\n", (void*)ptr);

    return 0;
}
