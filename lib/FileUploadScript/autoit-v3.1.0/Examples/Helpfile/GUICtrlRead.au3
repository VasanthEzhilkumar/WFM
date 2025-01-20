#include <GUIConstants.au3>

GUICreate("My GUICtrlRead")  ; will create a dialog box that when displayed is centered

$n1=GUICtrlCreateList ("", 10,10,-1,100 )

GUICtrlSetData(-1,"item1|item2|item3", "item2")

$n2=GUICtrlCreateButton ("button",0,100)
GUICtrlSetState(-1,$GUI_FOCUS)			; the focus is on this button

GUISetState ()       ; will display an empty dialog box
; Run the GUI until the dialog is closed
Do
	$msg = GUIGetMsg()
	if $msg = $n2 then
		msgbox(0,"list=", GUICtrlRead($n1))	; display the value
	endif
Until $msg = $GUI_EVENT_CLOSE 
