#include <Date.au3>

$sDate = @MON & "/" & @MDAY & "/" & @YEAR

If _DateIsValid( $sDate ) Then
  MsgBox( 4096, "Valid Date", "The specified date is valid." )
Else
  MsgBox( 4096, "Valid Date", "The specified date is invalid." )
EndIf
