#include <GUIConstants.au3>

GUICreate("My GUI")  ; will create a dialog box that when displayed is centered

$nEdit = GUICtrlCreateEdit ("line 0", 10,10)
GUICtrlCreateButton ("Ok", 20,200,50)
GUISetState ()

for $n=1 to 5
GUICtrlSetData ($nEdit,@CRLF & "line "& $n)
next

$EM_LINEINDEX = 0x00BB
$EM_LINEFROMCHAR = 0x00C9

; Run the GUI until the dialog is closed
Do
	$msg = GUIGetMsg()
	if $msg >0 then
		$n=GUICtrlSendMsg ($nEdit, $EM_LINEINDEX,-1,0)
		$nline=GUICtrlSendMsg( $nEdit, $EM_LINEFROMCHAR,$n,0)
		GUICtrlSetState ($nEdit,256)	; set focus

		MsgBox (0,"Currentline",$nLine)
	endif
Until $msg = $GUI_EVENT_CLOSE
