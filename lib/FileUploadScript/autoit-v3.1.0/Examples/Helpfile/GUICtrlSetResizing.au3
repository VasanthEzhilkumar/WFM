#include <GUIConstants.au3>

Opt("GUICoordMode", 2)
GUICreate ("My InputBox",190,114,-1,-1,$WS_SIZEBOX+$WS_SYSMENU)	; start the definition
GUISetIcon ("Eiffel Tower.ico")

GUISetFont (8,-1,"Arial")

GUICtrlCreateLabel ("Prompt", 8,7)		; add prompt info
GUICtrlSetResizing (-1,$GUI_DOCKLEFT+$GUI_DOCKTOP)

$nEdit = GUICtrlCreateInput ("Default", -1,3,175,20,$ES_PASSWORD)	; add the input area
GUICtrlSetState ($nEdit,$GUI_FOCUS)
GUICtrlSetResizing ($nEdit,$GUI_DOCKBOTTOM+$GUI_DOCKHEIGHT)

$nOk = GUICtrlCreateButton ("OK",-1,3,75,24)	; add the button that will close the GUI
GUICtrlSetResizing ($nOk,$GUI_DOCKBOTTOM+$GUI_DOCKSIZE+$GUI_DOCKVCENTER)

$nCancel = GUICtrlCreateButton ("Annuler", 25,-1)	; add the button that will close the GUI
GUICtrlSetResizing ($nCancel,$GUI_DOCKBOTTOM+$GUI_DOCKSIZE+$GUI_DOCKVCENTER)

GUISetState ()					; to display the GUI

; Run the GUI until the dialog is closed
While 1
	$msg = GUIGetMsg()
	
	If $msg = $GUI_EVENT_CLOSE Then ExitLoop
Wend


