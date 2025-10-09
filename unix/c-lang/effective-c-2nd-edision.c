// ------------------ GETTING STARTED WITH C ------------------------

// hello.c
/*
#include "stdio.h"
#include "stdlib.h"
int main(){
    puts("Hello World"); // if failure puts returns EOF
    return EXIT_SUCCESS;
}
*/

// improved hello.c
/*
#include<stdio.h>
#include<stdlib.h>
int main(){
    if(puts("Hello World") == EOF){ // we should not pass user input to any outputting function without formate string
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
*/

/*
✅ printf("%s", user_input);    // ALWAYS
❌ printf(user_input);          // NEVER
✅ fprintf(log, "%s", msg);     // SAFE
❌ fprintf(log, msg);           // VULNERABLE
✅ syslog(LOG_INFO, "%s", data);  // SAFE
❌ syslog(LOG_INFO, data);        // VULNERABLE


// FORMAT STRING VULNERABILITY DEMONSTRATION
// For educational purposes only - demonstrates the security issue

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Simulated sensitive data
const char *secret_password = "MySecretPass123";
int secret_key = 0xDEADBEEF;

void vulnerable_function(char *user_input) {
    // Local variables on stack
    int local_var = 0x12345678;
    char buffer[64];
    
    printf("\n=== VULNERABLE CODE ===\n");
    printf("Executing: printf(user_input);\n");
    printf("Output: ");
    
    // DANGEROUS: User input directly as format string
    printf(user_input);  // ← THE VULNERABILITY
    
    printf("\n");
}

void safe_function(char *user_input) {
    printf("\n=== SAFE CODE ===\n");
    printf("Executing: printf(\"%%s\", user_input);\n");
    printf("Output: ");
    
    // SAFE: User input as data, not format
    printf("%s", user_input);  // ← CORRECT WAY
    
    printf("\n");
}

void demo_info_leak() {
    printf("\n╔══════════════════════════════════════════════╗\n");
    printf("║   ATTACK 1: INFORMATION DISCLOSURE (LEAK)   ║\n");
    printf("╚══════════════════════════════════════════════╝\n");
    
    printf("\nScenario: Attacker tries to read stack memory\n");
    
    // Attacker input: multiple %x to dump stack
    char attack1[] = "%x %x %x %x %x %x %x %x";
    printf("\nAttacker input: \"%s\"\n", attack1);
    
    vulnerable_function(attack1);
    
    printf("\n⚠️  What happened:\n");
    printf("   - %%x reads 4 bytes from stack as hexadecimal\n");
    printf("   - Each %%x without argument reads next stack value\n");
    printf("   - Attacker can see stack contents (addresses, data)\n");
    printf("   - Could leak: passwords, keys, addresses (ASLR bypass)\n");
}

void demo_read_specific_address() {
    printf("\n╔══════════════════════════════════════════════╗\n");
    printf("║   ATTACK 2: READING SPECIFIC MEMORY         ║\n");
    printf("╚══════════════════════════════════════════════╝\n");
    
    printf("\nScenario: Attacker reads arbitrary memory using %%s\n");
    
    // %s treats stack value as pointer and dereferences it
    char attack2[] = "%s";
    printf("\nAttacker input: \"%s\"\n", attack2);
    
    printf("\n⚠️  What happens:\n");
    printf("   - %%s treats stack value as pointer to string\n");
    printf("   - Dereferences that pointer and prints string\n");
    printf("   - If attacker controls stack, can read any memory\n");
    printf("   - Can leak: credentials, crypto keys, canaries\n");
    
    printf("\nSafe version:\n");
    safe_function(attack2);
}

void demo_write_memory() {
    printf("\n╔══════════════════════════════════════════════╗\n");
    printf("║   ATTACK 3: ARBITRARY MEMORY WRITE (%%n)     ║\n");
    printf("╚══════════════════════════════════════════════╝\n");
    
    printf("\nScenario: Most dangerous - attacker writes to memory!\n");
    
    printf("\n⚠️  The %%n format specifier:\n");
    printf("   - %%n writes number of bytes printed so far\n");
    printf("   - Writes to address taken from stack\n");
    printf("   - Attacker can modify ANY memory location!\n");
    
    int counter = 0;
    printf("\nLegitimate use of %%n:\n");
    printf("Hello%n World\n", &counter);
    printf("Bytes printed before %%n: %d\n", counter);
    
    printf("\n💀 Exploitation:\n");
    printf("   1. Attacker places target address on stack\n");
    printf("   2. Uses %%n to write to that address\n");
    printf("   3. Can overwrite:\n");
    printf("      - Function pointers (hijack execution)\n");
    printf("      - Return addresses (ROP chains)\n");
    printf("      - GOT entries (redirect functions)\n");
    printf("      - Access control variables\n");
}

void demo_direct_parameter_access() {
    printf("\n╔══════════════════════════════════════════════╗\n");
    printf("║   ATTACK 4: DIRECT PARAMETER ACCESS         ║\n");
    printf("╚══════════════════════════════════════════════╝\n");
    
    printf("\nScenario: Using %%N$x to access specific stack positions\n");
    
    printf("\n⚠️  Position specifiers:\n");
    printf("   - %%1$x reads 1st parameter\n");
    printf("   - %%2$x reads 2nd parameter\n");
    printf("   - %%10$x reads 10th parameter\n");
    
    char attack[] = "%%7$x %%8$x %%9$x";
    printf("\nAttacker input: \"%s\"\n", attack);
    
    printf("Interpretation: Read 7th, 8th, 9th stack values\n");
    printf("This allows precise memory reading without trial-and-error\n");
}

void show_real_world_exploit() {
    printf("\n╔══════════════════════════════════════════════╗\n");
    printf("║   REAL-WORLD EXPLOIT CHAIN                   ║\n");
    printf("╚══════════════════════════════════════════════╝\n");
    
    printf("\nTypical exploitation steps:\n\n");
    
    printf("1️⃣  RECONNAISSANCE\n");
    printf("   - Send %%x %%x %%x... to map stack layout\n");
    printf("   - Find offset to user-controlled buffer\n");
    printf("   - Identify stack canary position (if present)\n\n");
    
    printf("2️⃣  LEAK ADDRESSES\n");
    printf("   - Use %%s or %%p to leak memory addresses\n");
    printf("   - Defeat ASLR by leaking library addresses\n");
    printf("   - Leak stack canary to bypass protection\n\n");
    
    printf("3️⃣  WRITE EXPLOIT\n");
    printf("   - Place target address in buffer\n");
    printf("   - Use %%N$n to write at specific offset\n");
    printf("   - Overwrite GOT entry, function pointer, or return address\n\n");
    
    printf("4️⃣  GAIN CONTROL\n");
    printf("   - Redirect execution to shellcode\n");
    printf("   - Or chain ROP gadgets\n");
    printf("   - Achieve code execution\n");
}

void show_protections() {
    printf("\n╔══════════════════════════════════════════════╗\n");
    printf("║   PROTECTIONS & MITIGATIONS                  ║\n");
    printf("╚══════════════════════════════════════════════╝\n");
    
    printf("\n✅ CODE LEVEL:\n");
    printf("   • NEVER use printf(user_input)\n");
    printf("   • ALWAYS use printf(\"%%s\", user_input)\n");
    printf("   • Use -Wformat-security compiler flag\n");
    printf("   • Static analysis tools (scan-build, Coverity)\n");
    
    printf("\n✅ COMPILER LEVEL:\n");
    printf("   • -D_FORTIFY_SOURCE=2 (compile-time checks)\n");
    printf("   • -Wformat -Wformat-security warnings\n");
    printf("   • __attribute__((format)) for custom printf\n");
    
    printf("\n✅ RUNTIME PROTECTIONS:\n");
    printf("   • ASLR (Address Space Layout Randomization)\n");
    printf("   • Stack Canaries (detect stack corruption)\n");
    printf("   • NX/DEP (non-executable stack)\n");
    printf("   • RELRO (Read-Only GOT)\n");
}

void show_secure_alternatives() {
    printf("\n╔══════════════════════════════════════════════╗\n");
    printf("║   SECURE CODING EXAMPLES                     ║\n");
    printf("╚══════════════════════════════════════════════╝\n");
    
    char user_input[] = "%x %x %n %s";
    
    printf("\n❌ VULNERABLE:\n");
    printf("   printf(user_input);\n");
    
    printf("\n✅ SAFE OPTIONS:\n");
    printf("   1. printf(\"%%s\", user_input);\n");
    printf("   2. puts(user_input);\n");
    printf("   3. fputs(user_input, stdout);\n");
    printf("   4. write(STDOUT_FILENO, user_input, strlen(user_input));\n");
    
    printf("\n📝 LOGGING SAFELY:\n");
    printf("   // Bad\n");
    printf("   syslog(LOG_INFO, user_msg);\n");
    printf("   \n");
    printf("   // Good\n");
    printf("   syslog(LOG_INFO, \"%%s\", user_msg);\n");
}

int main() {
    printf("╔════════════════════════════════════════════════════════╗\n");
    printf("║  FORMAT STRING VULNERABILITY - EDUCATIONAL DEMO        ║\n");
    printf("║  Understanding the Attack & Defense                    ║\n");
    printf("╚════════════════════════════════════════════════════════╝\n");
    
    demo_info_leak();
    demo_read_specific_address();
    demo_write_memory();
    demo_direct_parameter_access();
    show_real_world_exploit();
    show_protections();
    show_secure_alternatives();
    
    printf("\n╔════════════════════════════════════════════════════════╗\n");
    printf("║  KEY TAKEAWAY                                          ║\n");
    printf("╚════════════════════════════════════════════════════════╝\n");
    printf("\n⚠️  NEVER pass user input as the format string!\n");
    printf("   Always use: printf(\"%%s\", user_input);\n\n");
    
    printf("📚 Further Reading:\n");
    printf("   • OWASP Format String Vulnerability\n");
    printf("   • CWE-134: Uncontrolled Format String\n");
    printf("   • \"Exploiting Format String Vulnerabilities\" by scut/team teso\n\n");
    
    return 0;
}
*/

// ------------------------ OBJECTS, FUNCTIONS, AND TYPES ----------------------------

// swap.c
/*
#include<stdio.h>
#include<stdlib.h>
void swap(int*,int*);
int main(){
    int a = 1;
    int b = 2;
    swap(&a, &b);
    printf("main : a = %d, b = %d\n",a,b);
    return EXIT_SUCCESS;
}
void swap(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}
*/