#include "stdio.h"
#include "stdlib.h"
#include "signal.h"
#include "unistd.h"
#include <sys/types.h>

void signalHandler(int sig)
{
    printf("Caught signal %d\n", sig);
    exit(EXIT_FAILURE);
}

int main()
{
    signal(SIGHUP, signalHandler);
    pid_t pid = getpid();
    kill(pid, SIGHUP);
    printf("Hey! Program ran successfully\n");
    return EXIT_SUCCESS;
}
/**
 * sys/types.h - is required to use pid_t, kill
 * getpid() -> it is coming from unistd.h
 */