
1.  [x] Each goal execution should not create shared variables - this can introduce unwanted intent to rely on imperative execution model
2.  [x] prelude runs exactly 1 time
    - goal is to initialize variables
    - use @define to export variable for goals
        - reuse export for MVP
3.  [x] Goals topological sort
4.  [ ] Profiles (?) a-la maven
5.  [ ] Find a way to share functions
6.  [ ] Pre-check? Post-check?
7.  [ ] make @shell configurable
8.  [x] `-p` flag to print generated bash script 
9.  [x] provide goals to run as argument
10. [x] `-h` flag to show all goals
11. [ ] per-goal documentation
12. [ ] Make buildtool to use Buildtoolfile file by default 
13. [ ] Agree on single standard way to run the scenario
14. [x] dependency validation - non-existent dep
15. [x] dependency validation - cycle
16. [ ] @reached_if should run before dependencies
17. [ ] show actual dependency loop path
18. [x] mention each goal executed - now doesn't print if goal has empty body 