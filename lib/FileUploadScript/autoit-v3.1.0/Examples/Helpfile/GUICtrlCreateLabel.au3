#include <GUIConstants.au3>

GUICreate("My GUI")  ; will create a dialog box that when displayed is centered

GUISetHelp("notepad")  ; will run notepad if F1 is typed
Opt("GUICoordMode",2)
GUICtrlCreateLabel ("Done",  10, 30, 50)	; first cell 50 width
GUICtrlCreateLabel ("Done 2",  -1, 0)	; next line
GUICtrlCreateLabel ("Done 3",   0, 0)	; next line and next cell 
GUICtrlCreateLabel ("Done 4",   0, -1)	; next cell same line 

GUISetState ()       ; will display an empty dialog box

; Run the GUI until the dialog is closed
While 1
	$msg = GUIGetMsg()
	
	If $msg = $GUI_EVENT_CLOSE Then ExitLoop
Wend


