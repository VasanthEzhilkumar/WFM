#include <GUIConstants.au3>

GUICreate("My GUI")  ; will create a dialog box that when displayed is centered

$nEdit = GUICtrlCreateEdit ("line 0", 10,10)
GUICtrlCreateButton ("Ok", 20,200,50)

GUISetState ()

for $n=1 to 5
GUICtrlSetData ($nEdit, @CRLF & "line "& $n)
next

$EM_GETSEL = 0x00B0

; Run the GUI until the dialog is closed
Do
	$msg = GUIGetMsg()
	if $msg >0 then
		$a=GUICtrlRecvMsg($nEdit, $EM_GETSEL)
		GUICtrlSetState($nEdit,$GUI_FOCUS)	; set focus back on edit control

; will display the wParam and lParam values return by the control
		MsgBox(0,"Current selection",StringFormat("start=%d end=%d", $a[0], $a[1]))
	endif
Until $msg = $GUI_EVENT_CLOSE
