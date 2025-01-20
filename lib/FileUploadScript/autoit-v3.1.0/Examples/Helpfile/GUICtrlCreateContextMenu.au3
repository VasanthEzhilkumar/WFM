#include <GUIConstants.au3>

GUICreate("My GUI Context Menu",300,200)

$contextmenu = GUICtrlCreateContextMenu ()

$button = GUICtrlCreateButton("OK",100,100,70,20)
$buttoncontext = GUICtrlCreateContextMenu($button)
$buttonitem = GUICtrlCreateMenuitem("About button",$buttoncontext)

$newsubmenu  = GUICtrlCreateMenu ("new", $contextmenu)
$textitem    = GUICtrlCreateMenuitem ("text",$newsubmenu)

$fileitem = GUICtrlCreateMenuitem ("Open",$contextmenu)
$saveitem = GUICtrlCreateMenuitem ("Save",$contextmenu)
GUICtrlCreateMenuitem ("",$contextmenu)	; separator

$infoitem = GUICtrlCreateMenuitem ("Info",$contextmenu)

GUISetState ()

; Run the GUI until the dialog is closed
While 1
	$msg = GUIGetMsg()
	
	If $msg = $GUI_EVENT_CLOSE Then ExitLoop
Wend

