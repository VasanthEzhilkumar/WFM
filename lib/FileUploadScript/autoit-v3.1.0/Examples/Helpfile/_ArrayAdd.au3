#include <Array.au3>
Dim $avArray[10]
$avArray[0] = "JPM"
$avArray[1] = "Holger"
$avArray[2] = "Jon"
$avArray[3] = "Larry"
$avArray[4] = "Jeremy"
$avArray[5] = "Valik"
$avArray[6] = "Cyberslug"
$avArray[7] = "Nutster"
$avArray[8] = "JdeB"
$avArray[9] = "Tylo"
_ArrayDisplay( $avArray, "Whole array" )
_ArrayAdd( $avArray,"Brian")
_ArrayDisplay( $avArray, "Updated Array" )
