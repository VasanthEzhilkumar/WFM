#include <GUIConstants.au3>

GUICreate ("My GUI (GetControlState)")
$n=GUICtrlCreateCheckbox ("checkbox",10,10)
GUICtrlSetState (-1,1)			; checked 

GUISetState ()       ; will display an empty dialog box

; Run the GUI until the dialog is closed
While 1
	$msg = GUIGetMsg()
	
	If $msg = $GUI_EVENT_CLOSE Then ExitLoop
Wend

msgbox (0,"state",StringFormat("GUICtrlRead=%d\nGUICtrlGetState=%d",GUICtrlRead($n),GUICtrlGetState($n)))
