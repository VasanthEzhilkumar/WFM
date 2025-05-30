#include <GUIConstants.au3>

GLOBAL $MESSAGE = "The following buttons have been clicked"
GUICreate("My GUI list") ; will create a dialog box that when displayed is centered

$add=GUICtrlCreateButton ("Add", 64,32,75,25)
$clear=GUICtrlCreateButton ("Clear", 64,72,75,25)
$mylist=GUICtrlCreateList ("buttons that have been clicked", 176,32,121,97)
GUICtrlSetLimit(-1,200)	; to limit horizontal scrolling
GUICtrlSetData(-1,$MESSAGE)
$close=GUICtrlCreateButton ("my closing button", 64,160,175,25)

GUISetState ()

$msg = 0
While $msg <> $GUI_EVENT_CLOSE
	$msg = GUIGetMsg()

	Select
		 case $msg = $add
		GUICtrlSetData($mylist,"You clicked button No1|")
		 case $msg = $clear
		GUICtrlSetData($mylist,"")
		 Case $msg = $close
			MsgBox(0,"", "the closing button has been clicked",2)
			Exit
	EndSelect
Wend
