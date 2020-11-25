
1. Each goal execution should not create shared variables - this can introduce unwanted intent to rely on imperative execution model
2. @prelude runs exactly 1 time
    - goal is to initialize variables
    - use @define to export variable for goals
        - reuse export for MVP
3. Goals topological sort
4. Profiles (?) a-la maven
5. Find a way to share functions
6. Pre-check? Post-check?
