#include-once

; ------------------------------------------------------------------------------
;
; AutoIt Version: 3.0
; Language:       English
; Description:    Functions that assist with files and directories.
;
; ------------------------------------------------------------------------------


;===============================================================================
;
; Description:      Returns the number of lines in the specified file.
; Syntax:           _FileCountLines( $sFilePath )
; Parameter(s):     $sFilePath - Path and filename of the file to be read
; Requirement(s):   None
; Return Value(s):  On Success - Returns number of lines in the file
;                   On Failure - Returns 0 and sets @error = 1
; Author(s):        Tylo <tylo@start.no>
; Note(s):          It does not count a final @LF as a line.
;
;===============================================================================
Func _FileCountLines($sFilePath)
	Local $N = FileGetSize($sFilePath) - 1
	If @error Or $N = -1 Then Return 0
	Return StringLen(StringAddCR(FileRead($sFilePath, $N))) - $N + 1
EndFunc   ;==>_FileCountLines


;===============================================================================
;
; Description:      Creates or zero's out the length of the file specified.
; Syntax:           _FileCreate( $sFilePath )
; Parameter(s):     $sFilePath - Path and filename of the file to be created
; Requirement(s):   None
; Return Value(s):  On Success - Returns 1
;                   On Failure - Returns 0 and sets:
;                                @error = 1: Error opening specified file
;                                @error = 2: File could not be written to
; Author(s):        Brian Keene <brian_keene@yahoo.com>
; Note(s):          None
;
;===============================================================================
Func _FileCreate($sFilePath)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $hOpenFile
	Local $hWriteFile
	
	$hOpenFile = FileOpen($sFilePath, 2)
	
	If $hOpenFile = -1 Then
		SetError(1)
		Return 0
	EndIf
	
	$hWriteFile = FileWrite($hOpenFile, "")
	
	If $hWriteFile = -1 Then
		SetError(2)
		Return 0
	EndIf
	
	FileClose($hOpenFile)
	Return 1
EndFunc   ;==>_FileCreate


;===============================================================================
;
; Description:      Reads the specified file into an array.
; Syntax:           _FileReadToArray( $sFilePath, $aArray )
; Parameter(s):     $sFilePath - Path and filename of the file to be read
;                   $aArray    - The array to store the contents of the file
; Requirement(s):   None
; Return Value(s):  On Success - Returns 1
;                   On Failure - Returns 0 and sets @error = 1
; Author(s):        Jonathan Bennett <jon at hiddensoft com>
; Note(s):          None
;
;===============================================================================
Func _FileReadToArray($sFilePath, ByRef $aArray)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $hFile
	
	$hFile = FileOpen($sFilePath, 0)
	
	If $hFile = -1 Then
		SetError(1)
		Return 0
	EndIf
	
	$aArray = StringSplit( FileRead($hFile, FileGetSize($sFilePath)), @LF)
	
	FileClose($hFile)
	Return 1
EndFunc   ;==>_FileReadToArray


;===============================================================================
;
; Description:      Writes the specified text to a log file.
; Syntax:           _FileWriteLog( $sLogPath, $sLogMsg )
; Parameter(s):     $sLogPath - Path and filename to the log file
;                   $sLogMsg  - Message to be written to the log file
; Requirement(s):   None
; Return Value(s):  On Success - Returns 1
;                   On Failure - Returns 0 and sets:
;                                @error = 1: Error opening specified file
;                                @error = 2: File could not be written to
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
; Note(s):          If the text to be appended does NOT end in @CR or @LF then
;                   a DOS linefeed (@CRLF) will be automatically added.
;
;===============================================================================
Func _FileWriteLog($sLogPath, $sLogMsg)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $sDateNow
	Local $sTimeNow
	Local $sMsg
	Local $hOpenFile
	Local $hWriteFile
	
	$sDateNow = @YEAR & "-" & @MON & "-" & @MDAY
	$sTimeNow = @HOUR & ":" & @MIN & ":" & @SEC
	$sMsg = $sDateNow & " " & $sTimeNow & " : " & $sLogMsg
	
	$hOpenFile = FileOpen($sLogPath, 1)
	
	If $hOpenFile = -1 Then
		SetError(1)
		Return 0
	EndIf
	
	$hWriteFile = FileWriteLine($hOpenFile, $sMsg)
	
	If $hWriteFile = -1 Then
		SetError(2)
		Return 0
	EndIf
	
	FileClose($hOpenFile)
	Return 1
EndFunc   ;==>_FileWriteLog

;===============================================================================
;
; Function Name:    _TempFile()
; Description:      Generate a name for a temporary file. The file is guaranteed
;                   not to already exist in the user's %TEMP% directory.
; Parameter(s):     None.
; Requirement(s):   None.
; Return Value(s):  Filename of a temporary file which does not exist.
; Author(s):        Dale (Klaatu) Thompson
; Notes:            None.
;
;===============================================================================
Func _TempFile()
   Local $s_TempName
   
   Do
      $s_TempName = "~"
      While StringLen($s_TempName) < 8
         $s_TempName = $s_TempName & Chr(Round(Random(97, 122), 0))
      Wend
      $s_TempName = @TempDir & "\" & $s_TempName & ".tmp"
   Until Not FileExists($s_TempName)
   Return ($s_TempName)
EndFunc

