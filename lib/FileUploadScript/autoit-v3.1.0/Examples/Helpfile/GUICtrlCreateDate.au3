#include <GUIConstants.au3>

; example1
GUICreate ( "My GUI get date", 200,200,800,200)
$date=GUICtrlCreateDate ("1953/04/25", 10,10,185,20 )
GUISetState ()

; Run the GUI until the dialog is closed
Do
	$msg = GUIGetMsg()
Until $msg = $GUI_EVENT_CLOSE

MsgBox(0,"Date",GUICtrlRead($date))
GUIDelete()

; example2
$DTS_TIMEFORMAT = 9
GUICreate("My GUI get time")
$n=GUICtrlCreateDate ( "", 20, 20, 100, 20, $DTS_TIMEFORMAT) 
GUISetState ()

; Run the GUI until the dialog is closed
Do
	$msg = GUIGetMsg()
Until $msg = $GUI_EVENT_CLOSE

MsgBox(0,"Time", GUICtrlRead($n))
