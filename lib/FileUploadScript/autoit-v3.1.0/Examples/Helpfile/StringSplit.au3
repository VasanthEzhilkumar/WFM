$days = StringSplit("Sun,Mon,Tue,Wed,Thu,Fri,Sat", ",")
;$days[1] contains "Sun" ... $days[7] contains "Sat"

$text = "This\nline\ncontains\nC-style breaks."
$array = StringSplit(StringReplace($text, "\n", @LF), @LF)
