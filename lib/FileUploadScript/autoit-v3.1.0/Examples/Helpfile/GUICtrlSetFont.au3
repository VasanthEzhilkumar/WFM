#include <GUIConstants.au3>

GUICreate ("My GUI")  ; will create a dialog box that when displayed is centered

$font="Comic Sans MS"
GUICtrlCreateLabel ("underlined label",10,20)
GUICtrlSetFont (-1,9, 400, 4, $font)	; will display underlined characters

GUICtrlCreateLabel ("italic label", 10,40)
GUICtrlSetFont (-1,9, 400, 2, $font)	; will display underlined characters

GUISetFont (9, 400, 8, $font)	; will display underlined characters
GUICtrlCreateLabel ("strike label",10,60)

GUISetState ()       ; will display an empty dialog box

; Run the GUI until the dialog is closed
While 1
	$msg = GUIGetMsg()
	
	If $msg = $GUI_EVENT_CLOSE Then ExitLoop
Wend
