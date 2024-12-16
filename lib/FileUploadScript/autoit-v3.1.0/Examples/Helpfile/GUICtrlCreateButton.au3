#include <GUIConstants.au3>

GUICreate("My GUI Button")  ; will create a dialog box that when displayed is centered

Opt("GUICoordMode",2)
GUICtrlCreateButton ("OK",  10, 30, 50)
GUICtrlCreateButton ( "Cancel",  0, -1)

GUISetState ()       ; will display an  dialog box with 2 button

; Run the GUI until the dialog is closed
While 1
	$msg = GUIGetMsg()
	
	If $msg = $GUI_EVENT_CLOSE Then ExitLoop
Wend




