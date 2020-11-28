
BEGIN { print check_condition_reached("echo 123 && [[ -d /tmp ]]") }

function check_condition_reached(condition_str,    script, res) {
    script = "bash -e <<'EOF'"
    script = script "\n" condition_str
    script = script "\nEOF"
    #print script
    #script | getline res
    #close(script)
    #return res == 1
    return system(script)
}
