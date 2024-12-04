; =======================================================================
; AutoUpdateIt
;
; Command Line Options:
;  - AutoUpdateIt.au3 [/release | /beta] [/silent]
;    - /release   Download latest release
;    - /beta      Download latest beta
;    - /silent    Silently auto-install (resets all settings)
;
; History:
;  - 1.33 - Added Retry/Cancel msgbox when cannot connect to receive update file
;         - Added Progress bar for non-WinXP users
;  - 1.32 - Changed _CompareVersions again (integer comparison now)
;  - 1.31 - Rewrote _ClipPath again
;  - 1.30 - Rewrote a few UDFs (_CompareVersions, _ClipPath)
;         - Underscored all UDF names
;         - Removed a misplaced 'Then' screwing up command line options
;  - 1.21 - Stupid bug fixed (ignored version check for /beta command)
;         - CompareVersions function works properly now (was seeing 3.0.103.173 as newer than 3.1.0.1)
;  - 1.20 - Command line parameters added
;           - /release to check for latest public release
;           - /beta to check for latest beta
;           - /silent to install silently (you will lose your compiler and file settings)
;  - 1.11 - Starts the download when you press one of the download
;           buttons, resulting in pre-downloading while you choose
;           where to save the file
;         - Default name for Beta download includes full version string
;         - Deletes "au3_update.dat" from temp files after loading data
;  - 1.10 - Displays release date
;         - Changed layout of buttons / groups
;         - Slightly modified error message when server inaccessible
;  - 1.00 - "Release" / given a version number
;
; Forum Thread:
;  - http://www.autoitscript.com/forum/index.php?showtopic=7547&view=getnewpost
;
; =======================================================================

#NoTrayIcon
#Include <GUIConstants.au3>

; ========================================
; Predefine variables
; ========================================
Global Const $s_Title = 'AutoUpdateIt'
Global Const $s_Version = '1.33'
Global Const $s_DatFile = 'http://www.autoitscript.com/autoit3/update.dat'
Global Const $s_DatFile_Local = @TempDir & '\au3_update.dat'
Global Const $s_Au3UpReg = 'HKCU\Software\AutoIt v3\AutoUpdateIt'

Global $i_DownSize, $s_DownPath, $s_DownTemp, $s_DownFolder
Global $i_DatFileLoaded, $i_ValidAu3Path, $i_DnInitiated
Global $s_AutoUpdate, $i_SilentInstall

; ========================================
; Read registry settings
; ========================================
Global $s_DefDownDir = RegRead($s_Au3UpReg, 'DownloadDir')
If @error Then
	$s_DefDownDir = @DesktopDir
EndIf

Global $s_Au3Path = RegRead('HKLM\Software\AutoIt v3\AutoIt', 'InstallDir')
If Not @error And FileExists($s_Au3Path & '\AutoIt3.exe') Then
	$s_CurrVer = FileGetVersion($s_Au3Path & "\AutoIt3.exe")
	$s_CurrDate = _FriendlyDate(FileGetTime($s_Au3Path & "\AutoIt3.exe", 0, 1))
Else
	$s_Au3Path = 'Installation not found'
	$s_CurrVer = 'Unavailable'
EndIf

; ========================================
; Check for command line parameters
; ========================================
If _StringInArray($CmdLine, '/release') Or _StringInArray($CmdLine, '/beta') Then
	Opt('TrayIconHide', 0)
	_Status('Checking for updates')
	InetGet($s_DatFile, $s_DatFile_Local, 1)
	If @InetGetBytesRead = -1 Then
		_Status('Could not connect to site', 'Please check your connection and try again')
		Sleep(4000)
		Exit
	EndIf
	_LoadUpdateData()
	
	If _StringInArray($CmdLine, '/release') And _CompareVersions($s_ReleaseVer, $s_CurrVer) Then
		$s_AutoUpdate = $s_ReleaseFile
		$s_DownTemp = @TempDir & '\autoit-v3-setup.exe'
		$i_DownSize = $i_ReleaseSize
	ElseIf _StringInArray($CmdLine, '/beta') And _CompareVersions($s_BetaVer, $s_CurrVer) Then
		$s_AutoUpdate = $s_BetaFile
		$s_DownTemp = @TempDir & '\autoit-v' & $s_BetaVer & '.exe'
		$i_DownSize = $i_BetaSize
	EndIf

	If $s_AutoUpdate Then
		InetGet($s_AutoUpdate, $s_DownTemp, 1, 1)
		$s_DownSize = Round($i_ReleaseSize / 1024) & ' KB'
		While @InetGetActive
			_Status('Downloading update', '', @InetGetBytesRead, $i_DownSize)
		WEnd
		_Status('Download Complete', 'Launching install')
		Sleep(1000)
		If _StringInArray($CmdLine, '/silent') Then
			_Start('"' & $s_DownTemp & '" /S')
		Else
			_Start('"' & $s_DownTemp & '"')
		EndIf
	Else
		_Status('No new versions available')
		Sleep(1000)
	EndIf
	Exit
EndIf

; ========================================
; GUI - Main Application
; ========================================
$gui_Main = GuiCreate($s_Title, 350, 310+20)

$me_Mn_Help = GuiCtrlCreateMenu('&Help')
$me_Mn_VisitSite = GuiCtrlCreateMenuItem('&Visit the AutoIt3 Website', $me_Mn_Help)
$me_Mn_About = GuiCtrlCreateMenuItem('&About', $me_Mn_Help)

GuiCtrlCreateLabel('', 0, 0, 350, 2, $SS_SUNKEN)

GuiCtrlCreateGroup('Current Installation Details', 5, 5, 340, 75)
GuiCtrlCreateLabel('Version: ' & $s_CurrVer, 15, 25, 300, 15)
GuiCtrlCreateLabel('Date: ' & $s_CurrDate, 15, 40, 300, 15)
GuiCtrlCreateLabel('Install Path: ' & $s_Au3Path, 15, 55, 300, 15)

$gr_Mn_Release = GuiCtrlCreateGroup('Latest Public Release', 5, 85, 165, 60)
$lb_Mn_ReleaseVer = GuiCtrlCreateLabel('Version: Loading...', 15, 105, 145, 15)
$lb_Mn_ReleaseDate = GuiCtrlCreateLabel('Date: Loading...', 15, 120, 145, 15)

$gr_Mn_Beta = GuiCtrlCreateGroup('Latest Beta', 180, 85, 165, 60)
$lb_Mn_BetaVer = GuiCtrlCreateLabel('Version: Loading...', 190, 105, 145, 15)
$lb_Mn_BetaDate = GuiCtrlCreateLabel('Date: Loading...', 190, 120, 145, 15)

GUIStartGroup() 
$ra_Mn_DoneNotify = GuiCtrlCreateRadio('&Notify when download complete', 5, 155, 340, 15)
$ra_Mn_DoneRun = GuiCtrlCreateRadio('&Autorun install when download complete', 5, 175, 340, 15)

; Check default done option
If RegRead($s_Au3UpReg, 'DoneOption') = 'Run' Then
	GuiCtrlSetState($ra_Mn_DoneRun, $GUI_CHECKED)
Else
	GuiCtrlSetState($ra_Mn_DoneNotify, $GUI_CHECKED)
EndIf

$bt_Mn_Close = GuiCtrlCreateButton('&Close', 10, 275, 330, 25)

; ========================================
; Control Set - Download Buttons
; ========================================
	
$bt_Mn_ReleaseDl = GuiCtrlCreateButton('Download Public &Release', 5, 195, 165, 30)
GuiCtrlSetState(-1, $GUI_DISABLE)
$lb_Mn_ReleaseSize = GuiCtrlCreateLabel('Size: Loading...', 5, 230, 165, 15, $SS_CENTER)
$lb_Mn_ReleasePage = GuiCtrlCreateLabel('Visit Download Page', 5, 245, 165, 15, $SS_CENTER)
GuiCtrlSetState(-1, $GUI_DISABLE)
GuiCtrlSetFont(-1, 9, 400, 4)
GuiCtrlSetColor(-1, 0x0000ff)
GuiCtrlSetCursor(-1, 0)

$bt_Mn_BetaDl = GuiCtrlCreateButton('Download &Beta', 180, 195, 165, 30)
GuiCtrlSetState(-1, $GUI_DISABLE)
$lb_Mn_BetaSize = GuiCtrlCreateLabel('Size: Loading...', 180, 230, 165, 15, $SS_CENTER)
$lb_Mn_BetaPage = GuiCtrlCreateLabel('Visit Download Page', 180, 245, 165, 15, $SS_CENTER)

GuiCtrlSetState(-1, $GUI_DISABLE)
GuiCtrlSetFont(-1, 9, 400, 4)
GuiCtrlSetColor(-1, 0x0000ff)
GuiCtrlSetCursor(-1, 0)

$a_DownButtons = StringSplit($bt_Mn_ReleaseDl & '.' &_
                             $lb_Mn_ReleaseSize & '.' &_
                             $lb_Mn_ReleasePage & '.' &_
                             $bt_Mn_BetaDl & '.' &_
                             $lb_Mn_BetaSize & '.' &_
                             $lb_Mn_BetaPage, '.')

; ========================================
; Control Set - Download Display
; ========================================
$lb_Mn_DwnToTtl = GuiCtrlCreateLabel('Downloading to:', 5, 195, 290, 15, $SS_LEFTNOWORDWRAP)
$lb_Mn_DwnToTxt = GuiCtrlCreateLabel('', 5, 210, 290, 15, $SS_LEFTNOWORDWRAP)

$pg_Mn_Progress = GuiCtrlCreateProgress(5, 225, 340, 20)
$lb_Mn_Progress = GuiCtrlCreateLabel('', 5, 250, 290, 15)

$bt_Mn_OpenFile = GuiCtrlCreateButton('&Open', 105, 275, 75, 25)
GuiCtrlSetState(-1, $GUI_DISABLE)
$bt_Mn_OpenFolder = GuiCtrlCreateButton('Open &Folder', 185, 275, 75, 25)
GuiCtrlSetState(-1, $GUI_DISABLE)

$a_DownDisplay = StringSplit($lb_Mn_DwnToTtl & '.' &_
                             $lb_Mn_DwnToTxt & '.' &_
                             $pg_Mn_Progress & '.' &_
                             $lb_Mn_Progress & '.' &_
                             $bt_Mn_OpenFile & '.' &_
                             $bt_Mn_OpenFolder, '.')

_GuiCtrlGroupSetState($a_DownDisplay, $GUI_HIDE)

; ========================================
; GUI - About
; ========================================
$gui_About = GuiCreate('About', 300, 120, -1, -1, BitOr($WS_CAPTION, $WS_SYSMENU), -1, $gui_Main)
GuiCtrlCreateLabel($s_Title & ' v' & $s_Version & ' - The AutoIt3 Update Utility' & @LF &_
                   @LF &_
                   'This application is a utility for easily receiving the most ' &_
                   'recent public release or beta version of AutoIt3 available. ' &_
                   'It was written completely in AutoIt3 script by Rob Saunders.', 5, 5, 290, 75)

$lb_Ab_VisitSite = GuiCtrlCreateLabel('Visit the AutoIt Website', 5, 80, 145, 15)
GuiCtrlSetFont(-1, 9, 400, 4)
GuiCtrlSetColor(-1, 0x0000ff)
GuiCtrlSetCursor(-1, 0)
GuiCtrlSetTip(-1, 'http://www.autoitscript.com')

$lb_Ab_ContactAuthor = GuiCtrlCreateLabel('Contact Rob Saunders', 5, 100, 145, 15)
GuiCtrlSetFont(-1, 9, 400, 4)
GuiCtrlSetColor(-1, 0x0000ff)
GuiCtrlSetCursor(-1, 0)
GuiCtrlSetTip(-1, 'rksaunders@gmail.com')

$bt_Ab_Close = GuiCtrlCreateButton('&Close', 220, 90, 75, 25)

; ========================================
; Application start
; ========================================

; Show Main Window
GuiSetState(@SW_SHOW, $gui_Main)

; Download update data file
InetGet($s_DatFile, $s_DatFile_Local, 1, 1)

; Harness GUI Events
While 1
	$a_GMsg = GUIGetMsg(1)

	If Not @InetGetActive And Not $i_DatFileLoaded Then
		If @InetGetBytesRead = -1 Then
			$i_Res = MsgBox(5+16+8192, 'Error', 'Error connecting to server.' & @LF &_
			                                    'Please verify the following:' & @LF &_
			                                    ' - You can connect to the internet' & @LF &_
			                                    ' - You can access the site http://www.AutoItScript.com' & @LF &_
			                                    ' - Your firewall is not blocking internet access to this program')
			If $i_Res = 4 Then
				InetGet($s_DatFile, $s_DatFile_Local, 1, 1)
			Else
				Exit
			EndIf
		Else
			_LoadUpdateData()
			$i_ReleaseSizeKB = Round($i_ReleaseSize / 1024)
			$i_BetaSizeKB = Round($i_BetaSize / 1024)

			If _CompareVersions($s_ReleaseVer, $s_CurrVer) Then
				GuiCtrlSetData($gr_Mn_Release, 'Latest Public Release *New*')
				GuiCtrlSetColor($gr_Mn_Release, 0x0000ff)
			EndIf
			GuiCtrlSetData($lb_Mn_ReleaseVer, 'Version: ' & $s_ReleaseVer)
			
			If _CompareVersions($s_BetaVer, $s_CurrVer) Then
				GuiCtrlSetData($gr_Mn_Beta, 'Latest Beta *New*')
				GuiCtrlSetColor($gr_Mn_Beta, 0x0000ff)
			EndIf
			GuiCtrlSetData($lb_Mn_BetaVer, 'Version: ' & $s_BetaVer)

			GuiCtrlSetData($lb_Mn_ReleaseDate, 'Date: ' & _FriendlyDate($i_ReleaseDate))
			GuiCtrlSetData($lb_Mn_BetaDate, 'Date: ' & _FriendlyDate($i_BetaDate))

			GuiCtrlSetData($lb_Mn_ReleaseSize, 'Size: ' & $i_ReleaseSizeKB & ' KB')
			GuiCtrlSetData($lb_Mn_BetaSize, 'Size: ' & $i_BetaSizeKB & ' KB')

			GuiCtrlSetTip($lb_Mn_ReleasePage, $s_ReleasePage)
			GuiCtrlSetTip($lb_Mn_BetaPage, $s_BetaPage)
			
			GuiCtrlSetState($bt_Mn_ReleaseDl, $GUI_ENABLE)
			GuiCtrlSetState($bt_Mn_BetaDl, $GUI_ENABLE)
			GuiCtrlSetState($lb_Mn_ReleasePage, $GUI_ENABLE)
			GuiCtrlSetState($lb_Mn_BetaPage, $GUI_ENABLE)

			$i_DatFileLoaded = 1
		EndIf
	EndIf

	If $i_DnInitiated Then
		If @InetGetActive Then
			$i_DnPercent = Int(@InetGetBytesRead / $i_DownSize * 100)

			$s_DnBytes = Round(@InetGetBytesRead / 1024) & ' KB'
			$s_DnSize = Round($i_DownSize / 1024) & ' KB'
				
			GuiCtrlSetData($pg_Mn_Progress, $i_DnPercent)
			GuiCtrlSetData($lb_Mn_Progress, 'Download Progress: ' & $i_DnPercent & '% (' & $s_DnBytes & ' of ' & $s_DnSize & ')')
		Else
			GuiCtrlSetData($pg_Mn_Progress, 100)
			If Not FileMove($s_DownTemp, $s_DownPath, 1) Then
				MsgBox(16+8192, 'Error', 'Error moving file.')
				GuiCtrlSetData($lb_Mn_Progress, 'Error')
			Else
				If GuiCtrlRead($ra_Mn_DoneRun) = $GUI_CHECKED Then
					_Start('"' & $s_DownPath & '"')
					Exit
				Else
					GuiCtrlSetData($lb_Mn_Progress, 'Download Complete!')

					GuiCtrlSetData($bt_Mn_Close, '&Close')
					GuiCtrlSetState($bt_Mn_OpenFile, $GUI_ENABLE)
					GuiCtrlSetState($bt_Mn_OpenFolder, $GUI_ENABLE)
					$i_Response = MsgBox(4+64+256+8192, $s_Title, 'Download complete!' & @LF &_
					                                              'Would you like to run the installer now?')
					If $i_Response = 6 Then
						_Start('"' & $s_DownPath & '"')
						Exit
					EndIf
				EndIf
			EndIf
			
			$i_DnInitiated = 0
		EndIf
	EndIf

	If $a_GMsg[1] = $gui_Main Then
		Select
			; Radio buttons
			Case $a_GMsg[0] = $ra_Mn_DoneRun
				RegWrite($s_Au3UpReg, 'DoneOption', 'REG_SZ', 'Run')

			Case $a_GMsg[0] = $ra_Mn_DoneNotify
				RegWrite($s_Au3UpReg, 'DoneOption', 'REG_SZ', 'Notify')
			
			; Download buttons
			Case $a_GMsg[0] = $bt_Mn_ReleaseDl
				$tmp = StringInStr($s_ReleaseFile, '/', 0, -1)
				$s_DefFileName = StringTrimLeft($s_ReleaseFile, $tmp)
				$i_DownSize = $i_ReleaseSize
				_DownloadFile($s_ReleaseFile, 'autoit-v3-setup.exe')

			Case $a_GMsg[0] = $bt_Mn_BetaDl
				$tmp = StringInStr($s_BetaFile, '/', 0, -1)
				$s_DefFileName = StringTrimLeft($s_BetaFile, $tmp)
				$i_DownSize = $i_BetaSize
				_DownloadFile($s_BetaFile, 'autoit-v' & $s_BetaVer & '.exe')

			; Download page "hyperlinks"
			Case $a_GMsg[0] = $lb_Mn_ReleasePage
				_Start($s_ReleasePage)
			
			Case $a_GMsg[0] = $lb_Mn_BetaPage
				_Start($s_BetaPage)

			; Open buttons
			Case $a_GMsg[0] = $bt_Mn_OpenFile
				_Start('"' & $s_DownPath & '"')
				Exit

			Case $a_GMsg[0] = $bt_Mn_OpenFolder
				_Start('"' & EnvGet('windir') & '\explorer.exe" /select,"' & $s_DownPath & '"')
				Exit

			; Menu items
			Case $a_GMsg[0] = $me_Mn_VisitSite
				_Start('http://www.autoitscript.com')

			Case $a_GMsg[0] = $me_Mn_About
				GuiSetState(@SW_SHOW, $gui_About)

			; Close buttons
			Case $a_GMsg[0] = $bt_Mn_Close
				_CancelDownload()
				
			Case $a_GMsg[0] = $GUI_EVENT_CLOSE
				_CancelDownload(1)
		EndSelect
	ElseIf $a_GMsg[1] = $gui_About Then
		Select
			Case $a_GMsg[0] = $lb_Ab_VisitSite
				_Start('http://www.autoitscript.com')

			Case $a_GMsg[0] = $lb_Ab_ContactAuthor
				_Start('"mailto:rksaunders@gmail.com?Subject=AutoIt3 Update Utility"')
				
			Case $a_GMsg[0] = $GUI_EVENT_CLOSE Or $a_GMsg[0] = $bt_Ab_Close
				GuiSetState(@SW_HIDE, $gui_About)
		EndSelect
	EndIf
Wend

; ========================================
; Function Declarations
; ========================================

; App. specific functions

Func _DownloadFile($s_DownUrl, $s_DownName)
	$s_DownTemp = @TempDir & '\' & $s_DownName
	InetGet($s_DownUrl, $s_DownTemp, 1, 1)

	$s_DownPath = FileSaveDialog('Save As', $s_DefDownDir, 'Executables (*.exe)', 16, $s_DownName)
	If Not @error Then
		If Not (StringRight($s_DownPath, 4) = '.exe') Then
			$s_DownPath = $s_DownPath & '.exe'
		EndIf

		$tmp = StringInStr($s_DownPath, '\', 0, -1)
		$s_DownFolder = StringLeft($s_DownPath, $tmp)
		RegWrite($s_Au3UpReg, 'DownloadDir', 'REG_SZ', $s_DownFolder)
		
		GuiCtrlSetData($lb_Mn_DwnToTxt, _ClipPath($s_DownPath, 55))
		GuiCtrlSetData($lb_Mn_Progress, 'Download Progress: Calculating...')
		
		_GuiCtrlGroupSetState($a_DownButtons, $GUI_HIDE)
		_GuiCtrlGroupSetState($a_DownButtons, $GUI_DISABLE)
		_GuiCtrlGroupSetState($a_DownDisplay, $GUI_SHOW)
		GuiCtrlSetPos($bt_Mn_Close, 265, 275, 75, 25)
		GuiCtrlSetData($bt_Mn_Close, 'Cancel')
		
		$i_DnInitiated = 1
	Else
		InetGet('abort')
		FileDelete($s_DownTemp)
	EndIf
EndFunc

Func _CancelDownload($i_Flag = 0)
	If $i_DnInitiated Then
		$i_Response = MsgBox(4+64+256+8192, $s_Title, 'Resuming is not possible.' & @LF &_
		                                              'Your download will be lost.' & @LF &_
		                                              'Continue?')
		If $i_Response = 6 Then
			$i_DnInitiated = 0
			InetGet('abort')
			FileDelete($s_DownTemp)
			If $i_Flag = 1 Then
				Exit
			EndIf
			
			_GuiCtrlGroupSetState($a_DownDisplay, $GUI_HIDE)

			GuiCtrlSetData($bt_Mn_Close, '&Close')
			GuiCtrlSetPos($bt_Mn_Close, 10, 275, 330, 25)
			GuiCtrlSetData($pg_Mn_Progress, 0)

			_GuiCtrlGroupSetState($a_DownButtons, $GUI_SHOW)
			_GuiCtrlGroupSetState($a_DownButtons, $GUI_ENABLE)
		EndIf
	Else
		Exit
	EndIf
EndFunc

Func _LoadUpdateData()
	Global $s_ReleaseVer, $s_ReleaseFile, $s_ReleasePage, $i_ReleaseSize, $i_ReleaseDate
	Global $s_BetaVer, $s_BetaFile, $s_BetaPage, $i_BetaSize, $i_BetaDate

	$s_ReleaseVer = IniRead($s_DatFile_Local, 'AutoIt', 'version', 'Error reading file')
	$s_ReleaseFile = IniRead($s_DatFile_Local, 'AutoIt', 'setup', '')
	$s_ReleasePage = IniRead($s_DatFile_Local, 'AutoIt', 'index', 'http://www.autoitscript.com')
	$i_ReleaseSize = IniRead($s_DatFile_Local, 'AutoIt', 'filesize', 0)
	$i_ReleaseDate = IniRead($s_DatFile_Local, 'AutoIt', 'filetime', 0)

	$s_BetaVer = IniRead($s_DatFile_Local, 'AutoItBeta', 'version', 'Error reading file')
	$s_BetaFile = IniRead($s_DatFile_Local, 'AutoItBeta', 'setup', '')
	$s_BetaPage = IniRead($s_DatFile_Local, 'AutoItBeta', 'index', 'http://www.autoitscript.com')
	$i_BetaSize = IniRead($s_DatFile_Local, 'AutoItBeta', 'filesize', 0)
	$i_BetaDate = IniRead($s_DatFile_Local, 'AutoItBeta', 'filetime', 0)
	
	FileDelete($s_DatFile_Local)
EndFunc

; Utility functions

Func _Start($s_StartPath)
	If @OSType = 'WIN32_NT' Then
		$s_StartStr = @ComSpec & ' /c start "" '
	Else
		$s_StartStr = @ComSpec & ' /c start '
	EndIf
	Run($s_StartStr & $s_StartPath, '', @SW_HIDE)
EndFunc

Func _GuiCtrlGroupSetState(ByRef $a_GroupArray, $i_State)
	For $i = 1 to $a_GroupArray[0]
		GuiCtrlSetState($a_GroupArray[$i], $i_State)
	Next
EndFunc

Func _ClipPath($s_Path, $i_ClipLen)
	Local $i_Half, $s_Left, $s_Right

	If StringLen($s_Path) > $i_ClipLen Then
		$i_Half = Int($i_ClipLen / 2)
		$s_Left = StringLeft($s_Path, $i_Half)
		$s_Right = StringRight($s_Path, $i_Half)
		$s_Path = $s_Left & '...' & $s_Right
	EndIf
	
	Return $s_Path
EndFunc

Func _NumSuffix($i_Num)
	Local $s_Num
	If StringRight($i_Num, 1) = 1 Then
		$s_Num = Int($i_Num) & 'st'
	ElseIf StringRight($i_Num, 1) = 2 Then
		$s_Num = Int($i_Num) & 'nd'
	ElseIf StringRight($i_Num, 1) = 3 Then
		$s_Num = Int($i_Num) & 'rd'
	Else
		$s_Num = Int($i_Num) & 'th'
	EndIf
	
	Return $s_Num
EndFunc

Func _FriendlyDate($s_Date)
	Local $a_Months = StringSplit('January,February,March,April,May,June,July,August,September,October,November,December', ',')
	Local $s_Year, $s_Month, $s_Day
	
	$s_Year = StringLeft($s_Date, 4)
	$s_Month = StringMid($s_Date, 5, 2)
	$s_Month = $a_Months[Int(StringMid($s_Date, 5, 2))]
	$s_Day = StringMid($s_Date, 7, 2)
	$s_Day = _NumSuffix(StringMid($s_Date, 7, 2))

	Return $s_Month & ' ' & $s_Day & ', ' & $s_Year
EndFunc

Func _StringInArray($a_Array, $s_String)
	Local $i_ArrayLen = UBound($a_Array) - 1

	For $i = 0 To $i_ArrayLen
		If $a_Array[$i] = $s_String Then
			Return $i
		EndIf
	Next
	SetError(1)
	Return 0
EndFunc

Func _CompareVersions($s_Vers1, $s_Vers2, $i_ReturnFlag = 0)
	Local $i, $i_Vers1, $i_Vers2, $i_Top
	Local $a_Vers1 = StringSplit($s_Vers1, '.')
	Local $a_Vers2 = StringSplit($s_Vers2, '.')

	$i_Top = $a_Vers1[0]
	If $a_Vers1[0] < $a_Vers2[0] Then
		$i_Top = $a_Vers2[0]
	EndIf
	
	For $i = 1 To $i_Top
		$i_Vers1 = 0
		$i_Vers2 = 0
		If $i <= $a_Vers1[0] Then
			$i_Vers1 = Number($a_Vers1[$i])
		EndIf
		If $i <= $a_Vers2[0] Then
			$i_Vers2 = Number($a_Vers2[$i])
		EndIf
		
		If $i_Vers1 > $i_Vers2 Then
			$v_Return = 1
			ExitLoop
		ElseIf $i_Vers1 < $i_Vers2 Then
			$v_Return = 0
			ExitLoop
		Else
			$v_Return = -1
		EndIf
	Next

	If $i_ReturnFlag Then
		Select
			Case $v_Return = -1
				SetError(1)
				Return 0
			Case $v_Return = 1
				Return $s_Vers1
			Case $v_Return = 0
				Return $s_Vers2
		EndSelect
	ElseIf $v_Return = -1 Then
		SetError(1)
		Return 0
	Else
		Return $v_Return
	EndIf
EndFunc

Func _Status($s_MainText, $s_SubText = '', $i_BytesRead = -1, $i_DownSize = -1)
	Global $i_ProgOn
	Global $i_StatusPercent
	
	If @OSVersion = "WIN_XP" Or @OSVersion = "WIN_2000" Or @OSVersion = "WIN_2003" Then
		If $s_SubText <> '' Then 
			$s_SubText = @LF & $s_SubText
		EndIf
		
		If $i_BytesRead = -1 Then
			TrayTip($s_Title, $s_MainText & $s_SubText, 10, 16)
		Else
			$s_DownStatus = Round($i_BytesRead / 1024) & ' of ' & Round($i_DownSize / 1024) & ' KB'
			TrayTip($s_Title, $s_MainText & $s_SubText & @LF & $s_DownStatus, 10, 16)
		EndIf
	Else
		If Not $i_ProgOn Then
			ProgressOn($s_Title, $s_MainText, $s_SubText, -1, -1, 2+16)
			$i_ProgOn = 1
		Else
			If $i_BytesRead = -1 Then
				ProgressSet($i_StatusPercent, $s_SubText, $s_MainText)
			Else
				$s_DownStatus = 'Downloading ' & Round($i_BytesRead / 1024) & ' of ' & Round($i_DownSize / 1024) & ' KB'
				$i_StatusPercent = Round($i_BytesRead / $i_DownSize * 100)
				ProgressSet($i_StatusPercent, $s_DownStatus, $s_MainText)
			EndIf
		EndIf
	EndIf
EndFunc