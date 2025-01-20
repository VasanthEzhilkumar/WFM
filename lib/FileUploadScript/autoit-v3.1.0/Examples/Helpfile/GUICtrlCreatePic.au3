#include <GUIConstants.au3>
GUICreate("My GUI picture",350,300,-1,-1,$WS_SIZEBOX+$WS_SYSMENU)  ; will create a dialog box that when displayed is centered

GUISetBkColor (0xE0FFFF)
$n=GUICtrlCreatePic(@Systemdir & "\oobe\images\mslogo.jpg",50,50, 200,50)

GUISetState ()

; Run the GUI until the dialog is closed
While 1
	$msg = GUIGetMsg()
	
	If $msg = $GUI_EVENT_CLOSE Then ExitLoop
Wend


GUISetState ()
; resize the control
$n=GUICtrlSetPos($n,50,50,200,100)
; Run the GUI until the dialog is closed
While 1
	$msg = GUIGetMsg()
	
	If $msg = $GUI_EVENT_CLOSE Then ExitLoop
Wend

