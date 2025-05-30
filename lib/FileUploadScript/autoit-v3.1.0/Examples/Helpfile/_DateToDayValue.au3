#include <Date.au3>

; Julian date of today.
$sJulDate = _DateToDayValue (@YEAR, @MON, @MDAY)
MsgBox(4096, "", "Todays Julian date is: " & $sJulDate)

; 14 days ago calculation.
Dim $Y, $M, $D
$sJulDate = _DayValueToDate ($sJulDate-14, $Y, $M, $D)
MsgBox(4096, "", "14 days ago:" & $M & "/" & $D & "/" & $Y)
