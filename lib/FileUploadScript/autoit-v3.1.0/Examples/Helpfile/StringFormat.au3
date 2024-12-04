$string = "string"
$float = 12.3
$int = 345
$s =StringFormat ( "var1=%s var2=%.2f, var3=%d" ,$string, $float, $int )
$msgbox(0, "Result", $s)
; will output         "var1=string var2=12.30 var3=345"
; notice the 12.30  done with the %.2f which force 2 digits after the decimal point

