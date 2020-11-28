END {
    topological_sort_add_connection("b","c")
    topological_sort_add_connection("c","d")
    topological_sort_add_connection("a","b")
    topological_sort_add_connection("d","a")
    topological_sort_add_connection("d","e")
    topological_sort_add_connection("b","d")

    topological_sort_perform("a", result, loop)

    print "result:"
    for (i=1; i<=result[0]; i++) {
        print result[i]
    }
    print "loop: " loop[0] " " loop[1] " " loop[2]
}

function topological_sort_add_connection(from, to) {
    slist[from, ++scnt[from]] = to # add $2 to successors of $1
}

function topological_sort_perform(node, result, loop,    i, s) {
    #if (loop[0]) return

    visited[node] = 1

    for (i = 1; i <= scnt[node]; i++)
        if (visited[s = slist[node, i]] == 0)
            topological_sort_perform(s, result, loop)
        else if (visited[s] == 1) {
            #printf("error: nodes %s and %s are in a cycle\n",
            #    s, node)
            loop[0] = 1
            loop[1] = s
            loop[2] = node
        }
    visited[node] = 2

    # printf(" %s", node)
    result[++result[0]] = node
}

