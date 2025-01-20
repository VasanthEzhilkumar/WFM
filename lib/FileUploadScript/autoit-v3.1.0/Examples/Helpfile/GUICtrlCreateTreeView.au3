#include <GUIConstants.au3>

GUICreate("My GUI with treeview",350,212)

$treeview = GUICtrlCreateTreeView (6,6,100,150,BitOr($TVS_HASBUTTONS,$TVS_HASLINES,$TVS_LINESATROOT,$TVS_DISABLEDRAGDROP,$TVS_SHOWSELALWAYS),$WS_EX_CLIENTEDGE)
$generalitem = GUICtrlCreateTreeViewitem ("General",$treeview)
$displayitem = GUICtrlCreateTreeViewitem ("Display",$treeview)
$aboutitem = GUICtrlCreateTreeViewitem ("About",$generalitem)
$compitem = GUICtrlCreateTreeViewitem ("Computer",$generalitem)
$useritem = GUICtrlCreateTreeViewitem ("User",$generalitem)
$resitem = GUICtrlCreateTreeViewitem ("Resolution",$displayitem)
$otheritem = GUICtrlCreateTreeViewitem ("Other",$displayitem)

$startlabel = GUICtrlCreateLabel ("TreeView Demo",190,90,100,20)
$aboutlabel = GUICtrlCreateLabel ("This little scripts demonstates the using of a treeview-control.",190,70,100,60)
GUICtrlSetState(-1,$GUI_HIDE)
$compinfo = GUICtrlCreateLabel ("Name:" & @TAB & @ComputerName & @LF & "OS:" & @TAB & @OSVersion & @LF & "SP:" & @TAB & @OSServicePack,120,30,200,80)
GUICtrlSetState(-1,$GUI_HIDE)

$okbutton = GUICtrlCreateButton ("OK",100,185,70,20)
$cancelbutton = GUICtrlCreateButton ("Cancel",180,185,70,20)

GUISetState ()
While 1
	$msg = GUIGetMsg()
	Select
		Case $msg = $cancelbutton Or $msg = $GUI_EVENT_CLOSE
			ExitLoop
	
		Case $msg = $generalitem
			GUIChangeItems($aboutlabel,$compinfo,$startlabel,$startlabel)
		
		Case $msg = $aboutitem
			GUICtrlSetState ($compinfo,$GUI_HIDE)
			GUIChangeItems($startlabel,$startlabel,$aboutlabel,$aboutlabel)
			
		Case $msg = $compitem
			GUIChangeItems($startlabel,$aboutlabel,$compinfo,$compinfo)
	EndSelect
WEnd

GUIDelete()
Exit

Func GUIChangeItems($hidestart,$hideend,$showstart,$showend)
	Local $idx,$hidestart,$hideend,$showstart,$showend
	
	For $idx = $hidestart To $hideend
		GUICtrlSetState ($idx,$GUI_HIDE)
	Next
	For $idx = $showstart To $showend
		GUICtrlSetState ($idx,$GUI_SHOW)
	Next	
EndFunc
