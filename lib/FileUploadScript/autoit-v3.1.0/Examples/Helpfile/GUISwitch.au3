#include <GUIConstants.au3>

$parent1= GUICreate("Parent1")
$parent2= GUICreate("Parent2", -1, -1, 100, 100)

GUISwitch($parent2)
GUISetState()
Do
$msg=GUIGetMsg()
until $msg = $GUI_EVENT_CLOSE

GUISwitch($parent1)
GUISetState()
Do
$msg=GUIGetMsg()
until $msg = $GUI_EVENT_CLOSE
